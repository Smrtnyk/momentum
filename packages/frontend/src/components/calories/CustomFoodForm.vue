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
                            :rules="[(v) => !!v || 'Name is required']"
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

                    <!-- Serving Size -->
                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.servingSize"
                            type="number"
                            label="Serving"
                            variant="outlined"
                            :rules="[(v) => !!v || 'Required', (v) => v > 0 || 'Must be positive']"
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
                            :rules="[(v) => !!v || 'Required']"
                        ></v-select>
                    </v-col>

                    <v-col cols="12">
                        <v-divider class="my-2"></v-divider>
                        <div class="text-subtitle-1 mb-2">Nutrition Information</div>
                    </v-col>

                    <!-- Macros -->
                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.calories"
                            type="number"
                            label="Calories"
                            variant="outlined"
                            :rules="[(v) => v >= 0 || 'Must be positive']"
                            hint="Will auto-calculate from macros"
                            persistent-hint
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.protein"
                            type="number"
                            label="Protein (g)"
                            variant="outlined"
                            :rules="[(v) => v >= 0 || 'Must be positive']"
                            @update:model-value="updateCalories"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.carbs"
                            type="number"
                            label="Carbs (g)"
                            variant="outlined"
                            :rules="[(v) => v >= 0 || 'Must be positive']"
                            @update:model-value="updateCalories"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" sm="3">
                        <v-text-field
                            v-model.number="foodData.fat"
                            type="number"
                            label="Fat (g)"
                            variant="outlined"
                            :rules="[(v) => v >= 0 || 'Must be positive']"
                            @update:model-value="updateCalories"
                        ></v-text-field>
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

const props = defineProps<{
    initialFood?: Partial<FoodItem>;
    title?: string;
}>();

const emit = defineEmits<{
    close: [];
    save: [food: Omit<FoodItem, "id">];
}>();

const form = ref<any>(null);
const servingUnits = ["g", "ml", "oz", "cup", "tbsp", "tsp", "piece", "serving"];

const foodData = ref<Omit<FoodItem, "id">>({
    barcode: null,
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

function updateCalories(): void {
    // Calculate calories using the standard 4-4-9 formula
    const proteinCalories = (foodData.value.protein || 0) * 4;
    const carbCalories = (foodData.value.carbs || 0) * 4;
    const fatCalories = (foodData.value.fat || 0) * 9;

    foodData.value.calories = Math.round(proteinCalories + carbCalories + fatCalories);
}

// Watch for macro changes to update calories
watch(
    () => [foodData.value.protein, foodData.value.carbs, foodData.value.fat],
    () => updateCalories(),
    { immediate: true },
);

const isValid = computed(() => {
    return (
        foodData.value.name &&
        foodData.value.servingSize > 0 &&
        foodData.value.servingUnit &&
        foodData.value.calories >= 0 &&
        foodData.value.protein >= 0 &&
        foodData.value.carbs >= 0 &&
        foodData.value.fat >= 0
    );
});

function saveFood(): void {
    if (!isValid.value) return;

    emit("save", { ...foodData.value });
    emit("close");
}
</script>
