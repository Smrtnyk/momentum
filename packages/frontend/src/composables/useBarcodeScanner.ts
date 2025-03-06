import { BrowserMultiFormatReader } from "@zxing/browser";
import { matchesProperty } from "es-toolkit/compat";
import { ref } from "vue";

import type { FoodItem } from "../types/food";

import { logger } from "../logger/app-logger";
import { combinedFoodApi } from "../services/food-api/combined-api";
import { findRecentFoodByBarcode } from "../services/recent-food-db";

type BarcodeDetectedCallback = (barcode: string) => Promise<void> | void;

interface BarcodeScannerOptions {
    onError: (message: string) => void;
    onFoodFound: (food: FoodItem) => void;
    onNotFound: (barcode: string) => void;
}

interface BarcodeScanOnlyOptions {
    onBarcodeScanned: (barcode: string) => void;
    onError: (message: string) => void;
}

export function useBarcodeScanner() {
    const isScanning = ref(false);
    const isSearching = ref(false);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const scannerOverlayRef = ref<HTMLDivElement | null>(null);
    const codeReader = new BrowserMultiFormatReader();
    let scannerCleanup: (() => void) | null = null;

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

        const tipElement = document.createElement("div");
        tipElement.textContent = "Try holding the device at different distances for best results";
        tipElement.style.color = "white";
        tipElement.style.marginTop = "8px";
        tipElement.style.fontSize = "14px";
        tipElement.style.opacity = "0.8";

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
        overlay.appendChild(tipElement);
        overlay.appendChild(closeBtn);

        document.body.appendChild(overlay);
        scannerOverlayRef.value = overlay;
    }

    async function searchByBarcode(
        barcode: string,
        options: BarcodeScannerOptions & { userId: string },
    ): Promise<void> {
        try {
            isSearching.value = true;
            logger.info(`Searching for barcode: ${barcode}`, "BarcodeScanner");

            const food =
                (await findRecentFoodByBarcode(options.userId, barcode)) ??
                (await combinedFoodApi.getFoodByBarcode(barcode));

            if (food) {
                logger.info(`Food found with ${food.calories} calories`, "BarcodeScanner", {
                    barcode,
                    calories: food.calories,
                    foodName: food.name,
                });
                options.onFoodFound(food);
            } else {
                options.onNotFound(barcode);
            }
        } finally {
            isSearching.value = false;
        }
    }

    async function initializeScanner(
        onBarcodeDetected: BarcodeDetectedCallback,
        onError: (message: string) => void,
    ): Promise<void> {
        try {
            isScanning.value = true;
            createScannerOverlay();

            if (!videoRef.value) {
                throw new Error("Video reference not available");
            }

            const preferredDeviceId = await selectHighestResolutionCamera();

            const constraints: MediaStreamConstraints = {
                video: preferredDeviceId
                    ? {
                          deviceId: { exact: preferredDeviceId },
                          height: { ideal: 1080, min: 720 },
                          width: { ideal: 1920, min: 1280 },
                      }
                    : {
                          facingMode: "environment",
                          height: { ideal: 1080, min: 720 },
                          width: { ideal: 1920, min: 1280 },
                      },
            };

            const result = await codeReader.decodeFromConstraints(
                constraints,
                videoRef.value,
                async (res, error) => {
                    if (res) {
                        const barcode = res.getText();
                        logger.info(`Barcode detected: ${barcode}`, "BarcodeScanner");
                        stopBarcodeScanner();
                        await onBarcodeDetected(barcode);
                    }

                    if (error && error.name !== "NotFoundException") {
                        logger.error(error, "BarcodeScanner.scan");
                    }
                },
            );

            scannerCleanup = () => {
                result.stop();
            };
        } catch (error) {
            logger.error(error, "BarcodeScanner.scanBarcode");
            onError("Unable to access camera. Please check camera permissions and try again.");
            stopBarcodeScanner();
        }
    }

    async function scanBarcodeOnly(options: BarcodeScanOnlyOptions): Promise<void> {
        await initializeScanner(function (barcode: string): void {
            options.onBarcodeScanned(barcode);
        }, options.onError);
    }

    async function scanBarcode(options: BarcodeScannerOptions & { userId: string }): Promise<void> {
        await initializeScanner(async function (barcode: string): Promise<void> {
            await searchByBarcode(barcode, options);
        }, options.onError);
    }

    function stopBarcodeScanner(): void {
        isScanning.value = false;

        if (scannerCleanup) {
            scannerCleanup();
            scannerCleanup = null;
        }

        if (scannerOverlayRef.value?.parentNode) {
            document.body.removeChild(scannerOverlayRef.value);
            scannerOverlayRef.value = null;
        }
    }

    return {
        isScanning,
        isSearching,
        scanBarcode,
        scanBarcodeOnly,
    };
}

async function getVideoInputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(matchesProperty("kind", "videoinput"));
}

async function selectHighestResolutionCamera(): Promise<string | undefined> {
    const videoDevices = await getVideoInputDevices();
    let selectedDeviceId: string | undefined;
    let highestResolution = 0;
    const backCameras = videoDevices.filter(function (device) {
        return device.label.toLowerCase().includes("back");
    });

    for (const device of backCameras) {
        const tempConstraints = {
            video: {
                deviceId: device.deviceId,
                height: { ideal: 9999 },
                width: { ideal: 9999 },
            },
        };

        try {
            /* eslint-disable-next-line no-await-in-loop --
              Sequential camera testing is required - we need to test one camera at a time,
              check its resolution, and properly release resources before moving to the next */
            const stream = await navigator.mediaDevices.getUserMedia(tempConstraints);
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            const resolution = (settings.width ?? 0) * (settings.height ?? 0);

            if (resolution > highestResolution) {
                highestResolution = resolution;
                selectedDeviceId = device.deviceId;
            }

            track.stop();
        } catch (error) {
            logger.error("Error accessing camera:", "", error);
        }
    }

    return selectedDeviceId;
}
