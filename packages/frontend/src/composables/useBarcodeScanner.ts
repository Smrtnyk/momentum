import { useTimeoutFn } from "@vueuse/core";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { ref } from "vue";

import { createCameraConstraints, selectHighestResolutionCamera } from "../helpers/camera-utils";
import { logger } from "../logger/app-logger";

enum ScannerState {
    ERROR = "error",
    IDLE = "idle",
    INITIALIZING_CAMERA = "initializing_camera",
    REQUESTING_PERMISSION = "requesting_permission",
    SCANNING = "scanning",
}

type BarcodeDetectedCallback = (barcode: string) => Promise<void> | void;

interface BarcodeScanOnlyOptions {
    onBarcodeScanned: (barcode: string) => void;
    onError: (message: string) => void;
}

export function useBarcodeScanner() {
    const scannerState = ref<ScannerState>(ScannerState.IDLE);
    const isScanning = ref(false);
    const isSearching = ref(false);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const scannerOverlayRef = ref<HTMLDivElement | null>(null);
    const loadingOverlayRef = ref<HTMLDivElement | null>(null);
    const codeReader = new BrowserMultiFormatReader();
    let scannerCleanup: (() => void) | null = null;

    const STATE_MESSAGES = {
        [ScannerState.ERROR]: "Camera error",
        [ScannerState.INITIALIZING_CAMERA]: "Initializing camera...",
        [ScannerState.REQUESTING_PERMISSION]: "Requesting camera permission...",
        [ScannerState.SCANNING]: "Ready to scan",
    } as const;

    const LOADING_TIMEOUT_MS = 10_000;

    function createLoadingOverlay(message: string): void {
        if (loadingOverlayRef.value?.parentNode) {
            document.body.removeChild(loadingOverlayRef.value);
        }

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0,0,0,0.9)";
        overlay.style.zIndex = "10000";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";

        const spinner = document.createElement("div");
        spinner.style.width = "48px";
        spinner.style.height = "48px";
        spinner.style.border = "4px solid rgba(255, 255, 255, 0.3)";
        spinner.style.borderRadius = "50%";
        spinner.style.borderTop = "4px solid #4CAF50";
        spinner.style.animation = "spin 1s linear infinite";

        const style = document.createElement("style");
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        const loadingMessage = document.createElement("div");
        loadingMessage.textContent = message;
        loadingMessage.style.color = "white";
        loadingMessage.style.marginTop = "20px";
        loadingMessage.style.fontSize = "16px";
        loadingMessage.style.fontWeight = "bold";

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

        overlay.appendChild(spinner);
        overlay.appendChild(loadingMessage);
        overlay.appendChild(closeBtn);

        document.body.appendChild(overlay);
        loadingOverlayRef.value = overlay;
    }

    function updateLoadingMessage(message: string): void {
        if (loadingOverlayRef.value) {
            const messageElem = loadingOverlayRef.value.querySelector("div:nth-child(2)");
            if (messageElem) {
                messageElem.textContent = message;
            }
        }
    }

    function removeLoadingOverlay(): void {
        if (loadingOverlayRef.value?.parentNode) {
            document.body.removeChild(loadingOverlayRef.value);
            loadingOverlayRef.value = null;
        }
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

        const scanLine = document.createElement("div");
        scanLine.style.position = "absolute";
        scanLine.style.top = "0";
        scanLine.style.left = "5px";
        scanLine.style.right = "5px";
        scanLine.style.height = "2px";
        scanLine.style.backgroundColor = "#4CAF50";
        scanLine.style.animation = "scanLine 2s ease-in-out infinite";

        const style = document.createElement("style");
        style.textContent = `
            @keyframes scanLine {
                0% { top: 0; }
                50% { top: calc(100% - 2px); }
                100% { top: 0; }
            }
        `;
        document.head.appendChild(style);
        scanTarget.appendChild(scanLine);

        const message = document.createElement("div");
        message.textContent = STATE_MESSAGES[ScannerState.SCANNING];
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

        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.3s ease";

        document.body.appendChild(overlay);
        scannerOverlayRef.value = overlay;

        setTimeout(() => {
            if (scannerOverlayRef.value) {
                scannerOverlayRef.value.style.opacity = "1";
            }
        }, 10);
    }

    async function initializeScanner(
        onBarcodeDetected: BarcodeDetectedCallback,
        onError: (message: string) => void,
    ): Promise<void> {
        try {
            isScanning.value = true;
            scannerState.value = ScannerState.REQUESTING_PERMISSION;
            createLoadingOverlay(STATE_MESSAGES[scannerState.value]);

            const { start: startTimeout, stop: stopTimeout } = useTimeoutFn(() => {
                if (scannerState.value !== ScannerState.SCANNING) {
                    onError("Camera initialization timed out. Please try again.");
                    stopBarcodeScanner();
                }
            }, LOADING_TIMEOUT_MS);

            startTimeout();
            createScannerOverlay();

            if (!videoRef.value) {
                throw new Error("Video reference not available");
            }

            scannerState.value = ScannerState.INITIALIZING_CAMERA;
            updateLoadingMessage(STATE_MESSAGES[scannerState.value]);

            const preferredDeviceId = await selectHighestResolutionCamera();
            const constraints = createCameraConstraints(preferredDeviceId);

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

            scannerState.value = ScannerState.SCANNING;
            removeLoadingOverlay();
            stopTimeout();

            scannerCleanup = () => {
                result.stop();
            };
        } catch (error) {
            logger.error(error, "BarcodeScanner.scanBarcode");
            scannerState.value = ScannerState.ERROR;
            onError("Unable to access camera. Please check camera permissions and try again.");
            stopBarcodeScanner();
        }
    }

    async function scanBarcode(options: BarcodeScanOnlyOptions): Promise<void> {
        await initializeScanner(function (barcode: string): void {
            options.onBarcodeScanned(barcode);
        }, options.onError);
    }

    function stopBarcodeScanner(): void {
        isScanning.value = false;
        scannerState.value = ScannerState.IDLE;

        if (scannerCleanup) {
            scannerCleanup();
            scannerCleanup = null;
        }

        removeLoadingOverlay();

        if (scannerOverlayRef.value?.parentNode) {
            scannerOverlayRef.value.style.opacity = "0";
            setTimeout(() => {
                if (scannerOverlayRef.value?.parentNode) {
                    document.body.removeChild(scannerOverlayRef.value);
                    scannerOverlayRef.value = null;
                }
            }, 300);
        }
    }

    return {
        isScanning,
        isSearching,
        scanBarcode,
    };
}
