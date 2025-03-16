<template>
    <div>
        <v-card-text>
            <p class="text-body-2 mb-4">
                Add nutrition information directly to your {{ mealType }} without selecting a
                specific food item.
            </p>

            <v-row dense>
                <v-col cols="12">
                    <v-text-field
                        v-model="description"
                        label="Description (Optional)"
                        variant="outlined"
                        placeholder="e.g. Protein Shake, Homemade Meal"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field
                        v-model.number="calories"
                        type="number"
                        label="Calories"
                        variant="outlined"
                        :rules="[positiveNumber]"
                        hint="Will auto-calculate from macros"
                        persistent-hint
                    ></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field
                        v-model.number="protein"
                        type="number"
                        label="Protein (g)"
                        variant="outlined"
                        :rules="[positiveNumber]"
                        @update:model-value="updateCalories"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field
                        v-model.number="carbs"
                        type="number"
                        label="Carbs (g)"
                        variant="outlined"
                        :rules="[positiveNumber]"
                        @update:model-value="updateCalories"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field
                        v-model.number="fat"
                        type="number"
                        label="Fat (g)"
                        variant="outlined"
                        :rules="[positiveNumber]"
                        @update:model-value="updateCalories"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-card rounded="lg" variant="outlined" class="mt-2 pa-2">
                <div class="text-subtitle-2">Preview</div>
                <div class="d-flex justify-space-between mt-2">
                    <div class="text-body-1">{{ description || "Manual Entry" }}</div>
                    <div class="text-body-1">{{ calories }} kcal</div>
                </div>
                <div class="d-flex justify-space-between mt-1 text-medium-emphasis text-caption">
                    <div>P: {{ protein }}g</div>
                    <div>C: {{ carbs }}g</div>
                    <div>F: {{ fat }}g</div>
                </div>
            </v-card>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="$emit('close')">Cancel</v-btn>
            <v-btn color="primary" @click="addMacros" :disabled="!isValid">
                Add to {{ mealType }}
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { FoodItem } from "../../types/food";
import type { Meal } from "../../types/health-metrics";

import { positiveNumber } from "../../helpers/form-validators";

const { mealType } = defineProps<{
    mealType: Meal["mealType"];
}>();

const emit = defineEmits<{
    close: [];
    save: [food: FoodItem];
}>();

const description = ref("");
const calories = ref(0);
const protein = ref(0);
const carbs = ref(0);
const fat = ref(0);

function updateCalories(): void {
    const proteinCalories = (protein.value || 0) * 4;
    const carbCalories = (carbs.value || 0) * 4;
    const fatCalories = (fat.value || 0) * 9;

    calories.value = Math.round(proteinCalories + carbCalories + fatCalories);
}

watch(
    () => [protein.value, carbs.value, fat.value],
    () => updateCalories(),
    { immediate: true },
);

const isValid = computed(() => {
    return calories.value >= 0 && protein.value >= 0 && carbs.value >= 0 && fat.value >= 0;
});

function addMacros(): void {
    if (!isValid.value) return;

    const manualFood: FoodItem = {
        barcode: null,
        calories: calories.value,
        carbs: Number(carbs.value) || 0,
        fat: Number(fat.value) || 0,
        id: `manual-${Date.now()}`,
        imageUrl: null,
        name: description.value || "Manual Entry",
        protein: Number(protein.value) || 0,
        servingSize: 1,
        servingUnit: "serving",
        source: "Manual",
    };

    emit("save", manualFood);
    emit("close");
}
</script>
