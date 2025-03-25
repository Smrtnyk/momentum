<template>
    <v-card-title class="d-flex align-center">
        <v-avatar rounded size="36" class="mr-3">
            <v-img
                :src="food.imageUrl || 'https://placehold.co/36x36?text=Food'"
                :alt="food.name"
            />
        </v-avatar>
    </v-card-title>

    <v-card-text>
        <div class="text-subtitle-2 mb-4" v-if="food.brand">{{ food.brand }}</div>
        <div v-if="food.source" class="text-caption mb-4">Source: {{ food.source }}</div>
        <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model.number="quantity"
                    type="number"
                    label="Quantity"
                    density="comfortable"
                    variant="outlined"
                    :rules="[positiveRequired]"
                    step="0.5"
                    min="0.5"
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <v-select
                    v-model="unit"
                    :items="availableUnits"
                    label="Unit"
                    density="comfortable"
                    variant="outlined"
                    :disabled="!isStandardUnitValue"
                ></v-select>

                <v-alert
                    v-if="!isStandardUnitValue"
                    type="info"
                    variant="tonal"
                    density="compact"
                    class="mt-2"
                >
                    This food uses a custom unit ({{ food.servingUnit }}) which cannot be converted.
                </v-alert>
            </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <!-- Nutritional Preview -->
        <div class="text-h6 mb-2 text-center">Nutritional Information</div>

        <div class="d-flex justify-space-between mb-1">
            <div class="text-body-1">Calories:</div>
            <div class="text-body-1 font-weight-bold">{{ calculatedNutrition.calories }} kcal</div>
        </div>

        <div class="d-flex justify-space-between mb-1">
            <div class="text-body-1">Protein:</div>
            <div class="text-body-1">{{ calculatedNutrition.protein.toFixed(1) }}g</div>
        </div>

        <div class="d-flex justify-space-between mb-1">
            <div class="text-body-1">Carbs:</div>
            <div class="text-body-1">{{ calculatedNutrition.carbs.toFixed(1) }}g</div>
        </div>

        <div class="d-flex justify-space-between mb-1" v-if="calculatedNutrition.sugars">
            <div class="text-caption">Of which sugars:</div>
            <div class="text-caption">{{ calculatedNutrition.sugars.toFixed(1) }}g</div>
        </div>

        <div class="d-flex justify-space-between mb-1">
            <div class="text-body-1">Fat:</div>
            <div class="text-body-1">{{ calculatedNutrition.fat.toFixed(1) }}g</div>
        </div>

        <v-alert type="info" variant="tonal" class="mt-4" density="compact">
            {{ isEditing ? "This will update the food in your" : "This will be added to your" }}
            {{ mealType }}.
        </v-alert>
    </v-card-text>

    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="default" variant="text" @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="saveFood" :disabled="!isValid">
            {{ isEditing ? "Update Food" : "Add Food" }}
        </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import type { FoodItem } from "../../types/food";
import type { Meal } from "../../types/health-metrics";

import { calculateNutrition } from "../../helpers/food-utils";
import { positiveRequired } from "../../helpers/form-validators";
import {
    convertQuantity,
    getAvailableUnits,
    isLiquidUnit,
    isStandardUnit,
} from "../../helpers/units-utils";

const {
    food,
    isEditing = false,
    mealType,
} = defineProps<{
    food: FoodItem;
    isEditing?: boolean;
    mealType: Meal["mealType"];
}>();

interface Emits {
    (e: "add", adjustedFood: FoodItem, originalFood: FoodItem): void;
    (e: "close"): void;
}

const emit = defineEmits<Emits>();

const quantity = ref<number>(1);
const unit = ref<string>("g");

watch(unit, function (newUnit, oldUnit) {
    if (newUnit === oldUnit) return;
    quantity.value = convertQuantity(quantity.value, oldUnit, newUnit);
});

const isLiquidValue = computed(function () {
    return isLiquidUnit(food.servingUnit);
});

const isStandardUnitValue = computed(function () {
    return isStandardUnit(food.servingUnit);
});

const availableUnits = computed(function () {
    return getAvailableUnits(food.servingUnit);
});

const calculatedNutrition = computed(function () {
    return calculateNutrition(food, quantity.value, unit.value);
});

const isValid = computed(function () {
    return quantity.value && quantity.value > 0;
});

onMounted(function () {
    quantity.value = food.servingSize;
    unit.value = food.servingUnit;

    // For standard units, normalize if needed
    if (isStandardUnitValue.value) {
        if (isLiquidValue.value) {
            // For liquids with standard units
            if (food.servingUnit === "L") {
                unit.value = "ml";
                quantity.value = quantity.value * 1000;
            } else if (!["fl_oz", "ml"].includes(food.servingUnit)) {
                unit.value = "ml";
            }
        } else if (!["g", "oz"].includes(food.servingUnit)) {
            // For solids with standard units
            unit.value = "g";
        }
    }
});

function saveFood(): void {
    if (!isValid.value) return;

    const adjustedFood: FoodItem = {
        ...food,
        calories: calculatedNutrition.value.calories,
        carbs: calculatedNutrition.value.carbs,
        fat: calculatedNutrition.value.fat,
        protein: calculatedNutrition.value.protein,
        servingSize: quantity.value,
        servingUnit: unit.value,
        sugars: calculatedNutrition.value.sugars,
    };

    emit("add", adjustedFood, food);
    emit("close");
}
</script>
