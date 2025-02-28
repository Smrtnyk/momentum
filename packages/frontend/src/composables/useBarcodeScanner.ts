import { ref } from "vue";

import type { FoodItem } from "../types/food";

import { logger } from "../logger/app-logger";
import { OpenFoodFactsApi } from "../services/food-api/open-food-facts";
import { OpenFoodRepoApi } from "../services/food-api/open-food-repo";

export interface BarcodeScannerOptions {
    onError: (message: string) => void;
    onFoodFound: (food: FoodItem) => void;
    onNotFound: (barcode: string) => void;
}

export function useBarcodeScanner() {
    const isScanning = ref(false);
    const isBarcodeSupported = ref(false);
    const isSearching = ref(false);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const scannerOverlayRef = ref<HTMLDivElement | null>(null);

    async function checkBarcodeSupport(): Promise<boolean> {
        if ("BarcodeDetector" in globalThis) {
            try {
                const formats = await (globalThis as any).BarcodeDetector.getSupportedFormats();
                isBarcodeSupported.value = formats.includes("ean_13") || formats.includes("upc_a");
                return isBarcodeSupported.value;
            } catch (error) {
                logger.error(error, "BarcodeScanner");
                isBarcodeSupported.value = false;
                return false;
            }
        }
        isBarcodeSupported.value = false;
        return false;
    }

    function createScannerOverlay(): void {
        if (scannerOverlayRef.value?.parentNode) {
            document.body.removeChild(scannerOverlayRef.value);
        }

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
        overlay.style.zIndex = "9999";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";

        const video = document.createElement("video");
        video.style.width = "100%";
        video.style.maxWidth = "400px";
        video.style.height = "auto";
        video.style.maxHeight = "60%";
        video.style.borderRadius = "8px";
        video.style.objectFit = "cover";
        video.playsInline = true;
        video.autoplay = true;
        videoRef.value = video;

        const scanTarget = document.createElement("div");
        scanTarget.style.position = "absolute";
        scanTarget.style.top = "50%";
        scanTarget.style.left = "50%";
        scanTarget.style.width = "250px";
        scanTarget.style.height = "150px";
        scanTarget.style.transform = "translate(-50%, -50%)";
        scanTarget.style.border = "2px solid #4CAF50";
        scanTarget.style.borderRadius = "8px";
        scanTarget.style.boxShadow = "0 0 0 2000px rgba(0, 0, 0, 0.3)";

        const message = document.createElement("div");
        message.textContent = "Position barcode within the green box";
        message.style.color = "white";
        message.style.marginTop = "20px";
        message.style.fontSize = "16px";
        message.style.fontWeight = "bold";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Cancel";
        closeBtn.style.padding = "10px 20px";
        closeBtn.style.backgroundColor = "#333";
        closeBtn.style.color = "white";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "4px";
        closeBtn.style.marginTop = "20px";
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener("click", stopBarcodeScanner);

        overlay.appendChild(video);
        overlay.appendChild(scanTarget);
        overlay.appendChild(message);
        overlay.appendChild(closeBtn);

        document.body.appendChild(overlay);
        scannerOverlayRef.value = overlay;
    }

    async function searchByBarcode(barcode: string, options: BarcodeScannerOptions): Promise<void> {
        try {
            isSearching.value = true;

            // First try OpenFoodRepo (better European product coverage)
            const openFoodRepoApi = new OpenFoodRepoApi();
            let food = await openFoodRepoApi.getFoodByBarcode(barcode);

            // If not found, try OpenFoodFacts
            if (!food) {
                logger.info("Product not found in OpenFoodRepo, trying OpenFoodFacts");
                const openFoodFactsApi = new OpenFoodFactsApi();
                food = await openFoodFactsApi.getFoodByBarcode(barcode);
            }

            if (food) {
                options.onFoodFound(food);
            } else {
                options.onNotFound(barcode);
            }
        } catch (error) {
            logger.error(error, "BarcodeScanner", { barcode });
            options.onError("Error searching for barcode. Please try again or search manually.");
        } finally {
            isSearching.value = false;
        }
    }

    async function detectBarcode(options: BarcodeScannerOptions): Promise<void> {
        if (!isScanning.value || !videoRef.value) return;

        try {
            const barcodeDetector = new BarcodeDetector({
                formats: ["ean_13", "ean_8", "upc_a", "upc_e"],
            });

            const barcodes = await barcodeDetector.detect(videoRef.value);

            if (barcodes.length > 0) {
                const barcode = barcodes[0].rawValue;
                stopBarcodeScanner();
                await searchByBarcode(barcode, options);
            } else {
                requestAnimationFrame(() => detectBarcode(options));
            }
        } catch (error) {
            logger.error(error, "BarcodeScanner");
            requestAnimationFrame(() => detectBarcode(options));
        }
    }

    async function scanBarcode(options: BarcodeScannerOptions): Promise<void> {
        if (!isBarcodeSupported.value) {
            options.onError(
                "Barcode scanning is not supported in your browser. Please search manually.",
            );
            return;
        }

        try {
            isScanning.value = true;
            createScannerOverlay();
            const constraints = await getBestCamera();

            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                setupVideoStream(stream, options);
            } catch (advancedError) {
                logger.error(advancedError);
                const fallbackStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                setupVideoStream(fallbackStream, options);
            }
        } catch (error) {
            logger.error(error, "BarcodeScanner");
            options.onError(
                "Unable to access camera. Please check camera permissions and try again.",
            );
            stopBarcodeScanner();
        }
    }

    function setupVideoStream(stream: MediaStream, options: BarcodeScannerOptions): void {
        if (!videoRef.value) {
            return;
        }
        videoRef.value.srcObject = stream;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            logger.info(
                "Camera settings",
                JSON.stringify({
                    constraints: videoTrack.getConstraints(),
                    settings: videoTrack.getSettings(),
                }),
            );
        }

        videoRef.value
            .play()
            .then(() => detectBarcode(options))
            .catch((error) => {
                logger.error(error, "BarcodeScanner");
                options.onError("Error starting camera stream");
                stopBarcodeScanner();
            });
    }

    function stopBarcodeScanner(): void {
        isScanning.value = false;

        if (videoRef.value?.srcObject) {
            const stream = videoRef.value.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
        }

        if (scannerOverlayRef.value?.parentNode) {
            document.body.removeChild(scannerOverlayRef.value);
            scannerOverlayRef.value = null;
        }
    }

    return {
        checkBarcodeSupport,
        isBarcodeSupported,
        isScanning,
        isSearching,
        scanBarcode,
    };
}

async function getBestCamera(): Promise<MediaStreamConstraints> {
    const defaultConstraints: MediaStreamConstraints = {
        video: {
            facingMode: "environment",
            height: { ideal: 1080, min: 720 },
            width: { ideal: 1920, min: 1280 },
        },
    };

    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");

        if (videoDevices.length === 0) {
            return defaultConstraints;
        }

        // On Android often the higher-resolution camera has "back" in its label
        const backCamera = videoDevices.find(
            (device) =>
                device.label.toLowerCase().includes("back") ||
                device.label.toLowerCase().includes("rear"),
        );

        if (backCamera) {
            return {
                video: {
                    deviceId: { exact: backCamera.deviceId },
                    height: { ideal: 1080, min: 720 },
                    width: { ideal: 1920, min: 1280 },
                },
            };
        }

        // If no camera with "back" in the label use the last device
        // (often the back camera on Android devices)
        if (videoDevices.length > 1) {
            return {
                video: {
                    deviceId: { exact: videoDevices[videoDevices.length - 1].deviceId },
                    height: { ideal: 1080, min: 720 },
                    width: { ideal: 1920, min: 1280 },
                },
            };
        }

        return defaultConstraints;
    } catch (error) {
        logger.error(error);
        return defaultConstraints;
    }
}
