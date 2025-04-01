<template>
    <v-card-title class="d-flex align-center">
        <v-avatar rounded size="36" class="mr-3" color="primary">
            <v-icon color="white">mdi-brain</v-icon>
        </v-avatar>
        <div>AI Food Analysis</div>
    </v-card-title>

    <v-card-text>
        <div class="text-h6 mb-3">{{ food.name }}</div>

        <v-alert
            v-if="food.aiMetadata?.confidence"
            type="info"
            variant="tonal"
            density="comfortable"
            class="mb-4"
        >
            <div class="d-flex flex-column align-center">
                <span class="text-body-1">AI Confidence:</span>
                <v-progress-linear
                    :model-value="food.aiMetadata.confidence * 100"
                    color="primary"
                    class="mx-2"
                    height="8"
                    rounded
                ></v-progress-linear>
                <span class="text-body-2">{{ food.aiMetadata.confidence * 100 }}%</span>
            </div>
        </v-alert>

        <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model="editableFood.name"
                    label="Food Name"
                    variant="outlined"
                    density="comfortable"
                ></v-text-field>
            </v-col>

            <v-col cols="6" sm="3">
                <v-text-field
                    v-model.number="editableFood.servingSize"
                    type="number"
                    label="Serving Size"
                    variant="outlined"
                    density="comfortable"
                ></v-text-field>
            </v-col>

            <v-col cols="6" sm="3">
                <v-text-field
                    v-model="editableFood.servingUnit"
                    label="Unit"
                    variant="outlined"
                    density="comfortable"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <!-- Nutritional Information -->
        <div class="text-h6 mb-3">Nutritional Information</div>

        <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model.number="editableFood.calories"
                    type="number"
                    label="Calories"
                    variant="outlined"
                    density="comfortable"
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <v-row>
                    <v-col cols="4">
                        <v-text-field
                            v-model.number="editableFood.protein"
                            type="number"
                            label="Protein (g)"
                            variant="outlined"
                            density="comfortable"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <div>
                            <v-text-field
                                v-model.number="editableFood.carbs"
                                type="number"
                                label="Carbs (g)"
                                variant="outlined"
                                density="comfortable"
                            ></v-text-field>

                            <v-text-field
                                v-if="hasSugars"
                                v-model.number="editableFood.sugars"
                                type="number"
                                label="Sugars (g)"
                                variant="outlined"
                                density="comfortable"
                                hint="Part of total carbs"
                                persistent-hint
                                class="mt-2"
                                hide-details="auto"
                            ></v-text-field>
                        </div>
                    </v-col>

                    <v-col cols="4">
                        <v-text-field
                            v-model.number="editableFood.fat"
                            type="number"
                            label="Fat (g)"
                            variant="outlined"
                            density="comfortable"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- Nutri-Score if available -->
        <template v-if="food.aiMetadata?.nutriScore">
            <v-divider class="my-3"></v-divider>
            <div class="text-h6 mb-3">Nutri-Score</div>

            <div class="d-flex align-center justify-center mb-4">
                <v-chip
                    v-for="grade in ['A', 'B', 'C', 'D', 'E']"
                    :key="grade"
                    :color="getNutriScoreColor(grade)"
                    size="large"
                    class="nutri-score-chip mx-1"
                    :class="{ selected: food.aiMetadata.nutriScore.grade === grade }"
                >
                    {{ grade }}
                </v-chip>
            </div>
        </template>

        <!-- Fitness Information if available -->
        <template v-if="food.aiMetadata?.fitnessInfo">
            <v-divider class="my-3"></v-divider>
            <div class="text-h6 mb-3">Fitness Information</div>

            <v-row>
                <v-col cols="12" sm="6">
                    <div class="text-subtitle-2 mb-1">Workout Suitability</div>
                    <div class="d-flex align-center mb-2">
                        <div class="text-body-2 min-width-100">Pre-workout:</div>
                        <v-progress-linear
                            :model-value="
                                food.aiMetadata.fitnessInfo.workoutSuitability.preWorkout * 100
                            "
                            color="blue"
                            class="mx-2"
                            height="8"
                            rounded
                        ></v-progress-linear>
                    </div>
                    <div class="d-flex align-center">
                        <div class="text-body-2 min-width-100">Post-workout:</div>
                        <v-progress-linear
                            :model-value="
                                food.aiMetadata.fitnessInfo.workoutSuitability.postWorkout * 100
                            "
                            color="green"
                            class="mx-2"
                            height="8"
                            rounded
                        ></v-progress-linear>
                    </div>
                </v-col>

                <v-col cols="12" sm="6">
                    <div class="text-subtitle-2 mb-1">Diet Compatibility</div>
                    <div class="d-flex flex-wrap gap-2">
                        <v-chip
                            v-for="(value, diet) in food.aiMetadata.fitnessInfo.dietCompatibility"
                            :key="diet"
                            :color="value ? 'success' : 'error'"
                            :variant="value ? 'flat' : 'outlined'"
                            size="small"
                            class="text-capitalize"
                        >
                            {{ diet }}
                        </v-chip>
                    </div>

                    <div class="text-subtitle-2 mt-3 mb-1">Glycemic Impact</div>
                    <div class="text-body-2">
                        {{ food.aiMetadata.fitnessInfo.glycemicImpact }}
                    </div>
                </v-col>
            </v-row>
        </template>
    </v-card-text>

    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="default" variant="text" @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="addToMeal">Add to {{ mealType }}</v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { isNil, isNotNil } from "es-toolkit";
import { computed, ref } from "vue";

import type { FoodItem } from "../../types/food";
import type { Meal } from "../../types/health-metrics";

const { food, mealType } = defineProps<{
    food: FoodItem;
    mealType: Meal["mealType"];
}>();

interface Emits {
    (e: "add", adjustedFood: FoodItem, originalFood: FoodItem): void;
    (e: "close"): void;
}

const emit = defineEmits<Emits>();

const editableFood = ref<FoodItem>({
    ...food,
    calories: Number(food.calories),
    carbs: Number(food.carbs),
    fat: Number(food.fat),
    protein: Number(food.protein),
    servingSize: Number(food.servingSize),
    sugars: isNil(food.sugars) ? 0 : Number(food.sugars),
});

const hasSugars = computed(() => isNotNil(food.sugars));

function addToMeal(): void {
    const adjustedFood = {
        ...editableFood.value,
        calories: Math.round(Number(editableFood.value.calories)),
        carbs: Number(Number(editableFood.value.carbs).toFixed(1)),
        fat: Number(Number(editableFood.value.fat).toFixed(1)),
        protein: Number(Number(editableFood.value.protein).toFixed(1)),
        sugars: Number(Number(editableFood.value.sugars ?? 0).toFixed(1)),
    };
    emit("add", adjustedFood, food);
    emit("close");
}

function getNutriScoreColor(grade: string): string {
    const colors: Record<string, string> = {
        A: "success",
        B: "light-green",
        C: "warning",
        D: "orange",
        E: "error",
    };
    return colors[grade] ?? "grey";
}
</script>

<style scoped>
.min-width-100 {
    min-width: 100px;
}

.nutri-score-chip {
    font-weight: bold;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
}

.nutri-score-chip.selected {
    transform: scale(1.2);
    font-weight: bold;
    border: 2px solid black;
}

.gap-1 {
    gap: 0.25rem;
}

.gap-2 {
    gap: 0.5rem;
}
</style>
