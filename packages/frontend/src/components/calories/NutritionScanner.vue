<template>
    <div class="nutrition-scanner">
        <!-- Camera View (when scanning) -->
        <div v-if="isScanning" class="camera-container">
            <video ref="videoRef" autoplay playsinline muted class="camera-feed"></video>

            <div class="scan-overlay">
                <div class="scan-target"></div>
                <div class="scan-instruction">Position nutrition label in the center</div>
            </div>

            <v-btn color="error" icon class="camera-control" @click="stopScanning">
                <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-btn color="primary" icon class="camera-capture" @click="captureImage">
                <v-icon>mdi-camera</v-icon>
            </v-btn>
        </div>

        <!-- Processing View -->
        <div v-else-if="isProcessing" class="processing-container">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div class="mt-4">Analyzing nutrition label...</div>
        </div>

        <!-- Results View -->
        <div v-else-if="scannedFood" class="results-container">
            <v-list>
                <v-list-item>
                    <v-list-item-title>Name</v-list-item-title>
                    <v-text-field
                        v-model="scannedFood.name"
                        variant="outlined"
                        density="compact"
                        :rules="[required]"
                    ></v-text-field>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Serving Size</v-list-item-title>
                    <div class="d-flex">
                        <v-text-field
                            v-model.number="scannedFood.servingSize"
                            type="number"
                            variant="outlined"
                            density="compact"
                            class="me-2"
                        ></v-text-field>
                        <v-text-field
                            v-model="scannedFood.servingUnit"
                            variant="outlined"
                            density="compact"
                        ></v-text-field>
                    </div>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Calories</v-list-item-title>
                    <v-text-field
                        v-model.number="scannedFood.calories"
                        type="number"
                        variant="outlined"
                        density="compact"
                    ></v-text-field>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Macros (g)</v-list-item-title>
                    <div class="d-flex flex-wrap">
                        <v-text-field
                            v-model.number="scannedFood.protein"
                            type="number"
                            label="Protein"
                            variant="outlined"
                            density="compact"
                            class="me-2 macros-field"
                        ></v-text-field>
                        <v-text-field
                            v-model.number="scannedFood.carbs"
                            type="number"
                            label="Carbs"
                            variant="outlined"
                            density="compact"
                            class="me-2 macros-field"
                        ></v-text-field>
                        <v-text-field
                            v-model.number="scannedFood.fat"
                            type="number"
                            label="Fat"
                            variant="outlined"
                            density="compact"
                            class="macros-field"
                        ></v-text-field>
                    </div>
                </v-list-item>

                <v-list-item>
                    <v-checkbox
                        v-model="saveAsCustomFood"
                        label="Save as custom food entry"
                        color="primary"
                    ></v-checkbox>
                </v-list-item>
            </v-list>
        </div>

        <!-- Initial View -->
        <div v-else class="initial-container pa-6 text-center">
            <v-icon size="64" color="primary">mdi-barcode-scan</v-icon>
            <p class="mt-4">Tap the button below to scan a nutrition label</p>
        </div>

        <v-card-actions>
            <v-btn
                v-if="!isScanning && !isProcessing && !scannedFood"
                color="primary"
                block
                @click="startScanning"
            >
                Start Scanning
            </v-btn>

            <template v-if="scannedFood">
                <v-btn color="primary" block @click="confirmFood"> Add to {{ mealType }} </v-btn>
                <v-btn color="secondary" variant="text" block @click="resetScanner">
                    Scan Again
                </v-btn>
            </template>
        </v-card-actions>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";

import type { FoodItem } from "../../types/food";
import type { Meal } from "../../types/health-metrics";

import { selectHighestResolutionCamera } from "../../helpers/camera-utils";
import { required } from "../../helpers/form-validators";
import { logger } from "../../logger/app-logger";
import { scanNutritionLabel } from "../../services/nutrition-scanner";
import { useGlobalStore } from "../../stores/global";

const globalStore = useGlobalStore();

const { mealType } = defineProps<{
    mealType: Meal["mealType"];
}>();

const emit = defineEmits<{
    cancel: [];
    "custom-food-saved": [food: FoodItem];
    "food-added": [food: FoodItem];
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const isScanning = ref(false);
const isProcessing = ref(false);
const scannedFood = ref<FoodItem | null>(null);
const stream = ref<MediaStream | null>(null);
const saveAsCustomFood = ref(false);

function captureImage(): void {
    if (!videoRef.value || !isScanning.value) return;

    try {
        const video = videoRef.value;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg").split(",")[1];

        stopScanning();
        processImage(imageData);
    } catch (err) {
        globalStore.notifyError("Failed to capture image");
        logger.error(err);
    }
}

function confirmFood(): void {
    if (!scannedFood.value?.name.trim()) {
        globalStore.notifyError("Please provide a name for the food item");
        return;
    }

    emit("food-added", scannedFood.value);

    if (saveAsCustomFood.value) {
        emit("custom-food-saved", scannedFood.value);
    }
}

async function processImage(imageData: string): Promise<void> {
    isProcessing.value = true;

    try {
        const food = await scanNutritionLabel(imageData);

        if (food) {
            scannedFood.value = food;
        } else {
            globalStore.notifyError("Could not extract nutrition information");
        }
    } catch (err) {
        globalStore.notifyError("Error processing nutrition label");
        logger.error(err);
    } finally {
        isProcessing.value = false;
    }
}

function resetScanner(): void {
    scannedFood.value = null;
}

async function startScanning(): Promise<void> {
    isScanning.value = true;

    try {
        const preferredDeviceId = await selectHighestResolutionCamera();

        const constraints = {
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

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.value = mediaStream;

        if (videoRef.value) {
            videoRef.value.srcObject = mediaStream;
        }
    } catch (err) {
        globalStore.notifyError(`Camera access error: ${(err as Error).message}`);
        isScanning.value = false;
    }
}

function stopScanning(): void {
    if (stream.value) {
        stream.value.getTracks().forEach((track) => track.stop());
        stream.value = null;
    }

    if (videoRef.value) {
        videoRef.value.srcObject = null;
    }

    isScanning.value = false;
}

onUnmounted(function () {
    stopScanning();
});
</script>

<style scoped>
.camera-container {
    position: relative;
    aspect-ratio: 3/4;
    background: #000;
    overflow: hidden;
}

.camera-feed {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.scan-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
}

.scan-target {
    width: 80%;
    height: 50%;
    border: 2px solid #4caf50;
    border-radius: 8px;
    box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.5);
}

.scan-instruction {
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 8px 16px;
    border-radius: 24px;
    margin-top: 24px;
    font-size: 14px;
}

.camera-control {
    position: absolute;
    top: 16px;
    right: 16px;
}

.camera-capture {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
}

.processing-container,
.initial-container {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.macros-field {
    flex: 1;
    min-width: 80px;
}
</style>
