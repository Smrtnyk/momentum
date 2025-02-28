interface BarcodeDetectorOptions {
    formats: string[];
}

interface BarcodeDetectorResult {
    boundingBox: DOMRectReadOnly;
    cornerPoints: Array<{ x: number; y: number }>;
    format: string;
    rawValue: string;
}

interface Window {
    BarcodeDetector: typeof BarcodeDetector;
}

declare class BarcodeDetector {
    constructor(options?: BarcodeDetectorOptions);
    static getSupportedFormats(): Promise<string[]>;
    detect(image: ImageBitmapSource): Promise<BarcodeDetectorResult[]>;
}
