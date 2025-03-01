<template>
    <div>
        <v-card-title v-if="title">{{ title }}</v-card-title>

        <v-card-text>
            <v-form ref="form" @submit.prevent="saveFood">
                <v-row dense>
                    <!-- Food Name -->
                    <v-col cols="12">
                        <v-text-field
                            v-model="foodData.name"
                            label="Food Name"
                            variant="outlined"
                            :rules="[required]"
                            required
                        ></v-text-field>
                    </v-col>

                    <!-- Brand (Optional) -->
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="foodData.brand"
                            label="Brand (Optional)"
                            variant="outlined"
                            placeholder="e.g. Homemade, Store Brand"
                        ></v-text-field>
                    </v-col>

                    <!-- Barcode (Optional) -->
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="foodData.barcode"
                            label="Barcode (Optional)"
                            variant="outlined"
                            placeholder="e.g. 123456789012"
                            hint="Add the barcode for packaged foods"
                            persistent-hint
                        >
                            <template #append-inner>
                                <v-icon
                                    icon="mdi-barcode-scan"
                                    class="cursor-pointer"
                                    @click="handleBarcodeScanning"
                                    :disabled="isScanning"
                                ></v-icon>
                            </template>
                        </v-text-field>
                    </v-col>

                    <!-- Serving Size -->
                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.servingSize"
                            type="number"
                            label="Serving"
                            variant="outlined"
                            :rules="[positiveRequired]"
                            required
                        ></v-text-field>
                    </v-col>

                    <!-- Serving Unit -->
                    <v-col cols="6" sm="3">
                        <v-select
                            v-model="foodData.servingUnit"
                            :items="servingUnits"
                            label="Unit"
                            variant="outlined"
                            required
                            :rules="[required]"
                        ></v-select>
                    </v-col>

                    <v-col cols="12">
                        <v-divider class="my-2"></v-divider>
                        <div class="text-subtitle-1 mb-2">Nutrition Information</div>
                    </v-col>

                    <!-- Macros -->
                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="displayCalories"
                            type="number"
                            label="Calories (kcal)"
                            variant="outlined"
                            readonly
                            hint="Auto-calculated from macros"
                            persistent-hint
                        >
                            <template #append-inner>
                                <v-tooltip
                                    location="top"
                                    text="Calories are calculated using the 4-4-9 formula"
                                >
                                    <template #activator="{ props }">
                                        <v-icon
                                            v-bind="props"
                                            icon="mdi-information-outline"
                                            size="small"
                                        ></v-icon>
                                    </template>
                                </v-tooltip>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.protein"
                            type="number"
                            label="Protein (g)"
                            variant="outlined"
                            :rules="[positiveNumber]"
                            @update:model-value="updateCalories"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.carbs"
                            type="number"
                            label="Carbs (g)"
                            variant="outlined"
                            :rules="[positiveNumber]"
                            @update:model-value="updateCalories"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.fat"
                            type="number"
                            label="Fat (g)"
                            variant="outlined"
                            :rules="[positiveNumber]"
                            @update:model-value="updateCalories"
                        ></v-text-field>
                    </v-col>

                    <!-- Macro Ratio Display -->
                    <v-col cols="12">
                        <v-card variant="flat" density="compact" border class="mb-2">
                            <v-card-text>
                                <div class="d-flex justify-space-between align-center mb-1">
                                    <div class="text-caption">Macro Ratio</div>
                                    <div class="d-flex align-center">
                                        <span
                                            class="text-caption font-weight-medium mr-2"
                                            :style="`color: ${proteinColor}`"
                                        >
                                            P: {{ macroRatios.protein }}%
                                        </span>
                                        <span
                                            class="text-caption font-weight-medium mr-2"
                                            :style="`color: ${carbsColor}`"
                                        >
                                            C: {{ macroRatios.carbs }}%
                                        </span>
                                        <span
                                            class="text-caption font-weight-medium"
                                            :style="`color: ${fatColor}`"
                                        >
                                            F: {{ macroRatios.fat }}%
                                        </span>
                                    </div>
                                </div>
                                <v-progress-linear height="8" rounded>
                                    <template #default>
                                        <div class="d-flex" style="width: 100%">
                                            <div
                                                :style="`width: ${macroRatios.protein}%; background-color: ${proteinColor}`"
                                                class="rounded-l-xl"
                                                style="height: 8px"
                                            ></div>
                                            <div
                                                :style="`width: ${macroRatios.carbs}%; background-color: ${carbsColor}`"
                                                style="height: 8px"
                                            ></div>
                                            <div
                                                :style="`width: ${macroRatios.fat}%; background-color: ${fatColor}`"
                                                class="rounded-r-xl"
                                                style="height: 8px"
                                            ></div>
                                        </div>
                                    </template>
                                </v-progress-linear>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="$emit('close')">Cancel</v-btn>
            <v-btn color="primary" @click="saveFood" :disabled="!isValid"> Save Food </v-btn>
        </v-card-actions>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { FoodItem } from "../../types/food";

import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
import { positiveNumber, positiveRequired, required } from "../../helpers/form-validators";
import { useGlobalStore } from "../../stores/global";

interface Props {
    initialFood?: Partial<FoodItem>;
    title?: string;
}

const props = defineProps<Props>();

interface Emits {
    close: [];
    save: [food: Omit<FoodItem, "id">];
}

const emit = defineEmits<Emits>();

const form = ref<any>(null);
const servingUnits = ["g", "ml", "oz", "cup", "tbsp", "tsp", "piece", "serving"];
const globalStore = useGlobalStore();
const { isScanning, scanBarcodeOnly } = useBarcodeScanner();

const proteinColor = "#4CAF50";
const carbsColor = "#2196F3";
const fatColor = "#FFC107";

const foodData = ref<Omit<FoodItem, "id">>({
    barcode: props.initialFood?.barcode || null,
    brand: props.initialFood?.brand || "",
    calories: props.initialFood?.calories || 0,
    carbs: props.initialFood?.carbs || 0,
    fat: props.initialFood?.fat || 0,
    imageUrl: props.initialFood?.imageUrl ?? null,
    name: props.initialFood?.name || "",
    protein: props.initialFood?.protein || 0,
    servingSize: props.initialFood?.servingSize || 100,
    servingUnit: props.initialFood?.servingUnit || "g",
    source: "Custom Food",
});

const displayCalories = computed(function (): number {
    return foodData.value.calories;
});

const macroRatios = computed(function (): { carbs: number; fat: number; protein: number } {
    const protein = foodData.value.protein || 0;
    const carbs = foodData.value.carbs || 0;
    const fat = foodData.value.fat || 0;

    const totalGrams = protein + carbs + fat;

    if (totalGrams === 0) {
        return { carbs: 0, fat: 0, protein: 0 };
    }

    return {
        carbs: Math.round((carbs / totalGrams) * 100),
        fat: Math.round((fat / totalGrams) * 100),
        protein: Math.round((protein / totalGrams) * 100),
    };
});

function handleBarcodeScanning(): void {
    scanBarcodeOnly({
        onBarcodeScanned(barcode: string): void {
            foodData.value.barcode = barcode;
            globalStore.notify(`Barcode scanned: ${barcode}`);
        },
        onError(message: string): void {
            globalStore.notifyError(message);
        },
    });
}

function updateCalories(): void {
    // Calculate calories using the standard 4-4-9 formula
    const proteinCalories = (foodData.value.protein || 0) * 4;
    const carbCalories = (foodData.value.carbs || 0) * 4;
    const fatCalories = (foodData.value.fat || 0) * 9;

    foodData.value.calories = Math.round(proteinCalories + carbCalories + fatCalories);
}

const isValid = computed(function (): boolean {
    return (
        required(foodData.value.name) === true &&
        positiveRequired(foodData.value.servingSize) === true &&
        required(foodData.value.servingUnit) === true &&
        positiveNumber(foodData.value.calories) === true &&
        positiveNumber(foodData.value.protein) === true &&
        positiveNumber(foodData.value.carbs) === true &&
        positiveNumber(foodData.value.fat) === true
    );
});

function saveFood(): void {
    if (!isValid.value) return;

    emit("save", { ...foodData.value });
    emit("close");
}

watch(
    () => [foodData.value.protein, foodData.value.carbs, foodData.value.fat],
    () => updateCalories(),
    { immediate: true },
);
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>
