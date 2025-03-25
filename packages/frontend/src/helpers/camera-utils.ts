import { matchesProperty } from "es-toolkit/compat";

import { logger } from "../logger/app-logger";

type VideoConstraints = {
    deviceId?: { exact: string };
    facingMode?: string;
    height: { ideal: number; min: number };
    width: { ideal: number; min: number };
};

export async function selectHighestResolutionCamera(): Promise<string | undefined> {
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

async function getVideoInputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(matchesProperty("kind", "videoinput"));
}

const HIGH_RESOLUTION_HEIGHT = 1080;
const HIGH_RESOLUTION_MIN_HEIGHT = 720;
const HIGH_RESOLUTION_WIDTH = 1920;
const HIGH_RESOLUTION_MIN_WIDTH = 1280;

export function attachStreamToVideo(
    videoElement: HTMLVideoElement | null,
    stream: MediaStream | null,
): void {
    if (videoElement) {
        videoElement.srcObject = stream;
    }
}

export function createCameraConstraints(preferredDeviceId?: string): MediaStreamConstraints {
    const videoConstraints: VideoConstraints = preferredDeviceId
        ? {
              deviceId: { exact: preferredDeviceId },
              height: { ideal: HIGH_RESOLUTION_HEIGHT, min: HIGH_RESOLUTION_MIN_HEIGHT },
              width: { ideal: HIGH_RESOLUTION_WIDTH, min: HIGH_RESOLUTION_MIN_WIDTH },
          }
        : {
              facingMode: "environment",
              height: { ideal: HIGH_RESOLUTION_HEIGHT, min: HIGH_RESOLUTION_MIN_HEIGHT },
              width: { ideal: HIGH_RESOLUTION_WIDTH, min: HIGH_RESOLUTION_MIN_WIDTH },
          };

    return { video: videoConstraints };
}

export function detachStreamFromVideo(videoElement: HTMLVideoElement | null): void {
    if (videoElement) {
        videoElement.srcObject = null;
    }
}

export function initializeCamera(preferredDeviceId?: string): Promise<MediaStream> {
    const constraints = createCameraConstraints(preferredDeviceId);
    return navigator.mediaDevices.getUserMedia(constraints);
}

export function stopCameraStream(stream: MediaStream | null): void {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
}
