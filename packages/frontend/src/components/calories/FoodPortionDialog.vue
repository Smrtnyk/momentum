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
                    :rules="[
                        (v) => !!v || 'Quantity is required',
                        (v) => v > 0 || 'Must be positive',
                    ]"
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
                    :disabled="!isStandardUnit"
                ></v-select>

                <v-alert
                    v-if="!isStandardUnit"
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
        <div class="text-h6 mb-2">Nutritional Information</div>

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

        <div class="d-flex justify-space-between mb-1">
            <div class="text-body-1">Fat:</div>
            <div class="text-body-1">{{ calculatedNutrition.fat.toFixed(1) }}g</div>
        </div>

        <v-alert
            v-if="mealType === 'snack'"
            type="info"
            variant="tonal"
            class="mt-4"
            density="compact"
        >
            This will be added to your {{ mealType }}.
        </v-alert>
    </v-card-text>

    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="default" variant="text" @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="addFood" :disabled="!isValid"> Add Food </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import type { FoodItem } from "../../types/food";

const { food, mealType } = defineProps<{
    food: FoodItem;
    mealType: "breakfast" | "dinner" | "lunch" | "snack";
}>();

const emit = defineEmits<{
    add: [adjustedFood: FoodItem];
    close: [];
}>();

const quantity = ref<number>(1);
const unit = ref<string>("g");

watch(unit, (newUnit, oldUnit) => {
    if (newUnit === oldUnit) return;

    // Weight unit conversions
    if (oldUnit === "g" && newUnit === "oz") {
        quantity.value = Number((quantity.value / 28.35).toFixed(1));
    } else if (oldUnit === "oz" && newUnit === "g") {
        quantity.value = Math.round(quantity.value * 28.35);
    }

    // Volume unit conversions
    else if (oldUnit === "ml" && newUnit === "fl_oz") {
        quantity.value = Number((quantity.value / 29.57).toFixed(1));
    } else if (oldUnit === "fl_oz" && newUnit === "ml") {
        quantity.value = Math.round(quantity.value * 29.57);
    }
});

const isLiquid = computed(() => {
    return food.servingUnit === "ml" || food.servingUnit === "L" || food.servingUnit === "fl_oz";
});

const isStandardUnit = computed(() => {
    const standardUnits = ["g", "oz", "ml", "fl_oz", "L"];
    return standardUnits.includes(food.servingUnit);
});

const availableUnits = computed(() => {
    // If not a standard unit, only allow the original unit
    if (!isStandardUnit.value) {
        return [food.servingUnit];
    }

    // For standard units, offer appropriate conversions
    if (isLiquid.value) {
        return ["ml", "fl_oz"];
    }
    return ["g", "oz"];
});

const calculatedNutrition = computed(() => {
    if (!quantity.value) return { calories: 0, carbs: 0, fat: 0, protein: 0 };

    // Convert to base unit for calculation
    let baseAmount;

    if (isLiquid.value) {
        // For liquids, convert to ml
        if (unit.value === "ml") {
            baseAmount = quantity.value;
        } else if (unit.value === "fl_oz") {
            baseAmount = quantity.value * 29.57;
        } else {
            baseAmount = quantity.value;
        }
    } else {
        // For solids, convert to g
        if (unit.value === "g") {
            baseAmount = quantity.value;
        }
        if (unit.value === "oz") {
            // 1 oz = 28.35g
            baseAmount = quantity.value * 28.35;
        } else {
            baseAmount = quantity.value;
        }
    }

    // Calculate ratio to original serving
    const factor = baseAmount / food.servingSize;

    return {
        calories: Math.round(food.calories * factor),
        carbs: food.carbs * factor,
        fat: food.fat * factor,
        protein: food.protein * factor,
    };
});

const isValid = computed(() => {
    return quantity.value && quantity.value > 0;
});

onMounted(() => {
    // Always initialize with food's original serving information
    quantity.value = food.servingSize;
    unit.value = food.servingUnit;

    // For standard units, normalize if needed
    if (isStandardUnit.value) {
        if (isLiquid.value) {
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
function addFood(): void {
    if (!isValid.value) return;

    const adjustedFood: FoodItem = {
        ...food,
        calories: calculatedNutrition.value.calories,
        carbs: calculatedNutrition.value.carbs,
        fat: calculatedNutrition.value.fat,
        protein: calculatedNutrition.value.protein,
        servingSize: quantity.value,
        servingUnit: unit.value,
    };

    emit("add", adjustedFood);
    emit("close");
}
</script>
