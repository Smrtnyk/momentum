<template>
    <v-card class="mb-4" elevation="2">
        <v-card-item>
            <v-card-title>Daily Nutrition Summary</v-card-title>

            <template #append>
                <v-btn icon variant="text" @click="openCalorieGoalDialog">
                    <v-icon>mdi-cog</v-icon>
                </v-btn>
            </template>
        </v-card-item>

        <v-card-text>
            <!-- Calories Progress -->
            <div class="text-center mb-4">
                <div class="text-caption mb-1">CALORIES REMAINING</div>
                <div class="text-h4 font-weight-bold">
                    {{ summary.remaining }}
                </div>
                <div class="text-body-2 text-medium-emphasis">
                    {{ summary.goal }} Goal - {{ summary.total }} Food = {{ summary.remaining }}
                </div>
            </div>

            <v-progress-linear
                :model-value="caloriePercentage"
                :color="progressColor"
                height="12"
                rounded
                class="mb-4"
            ></v-progress-linear>

            <!-- Macronutrient Display with Progress Bar -->
            <MacroProgress
                :protein="summary.protein"
                :carbs="summary.carbs"
                :fiber="summary.fiber"
                :saturated-fat="summary.saturatedFat"
                :fat="summary.fat"
                :sugars="summary.sugars"
                :show-calories="true"
            />

            <!-- Meal Breakdown -->
            <div class="text-subtitle-2 mt-4 mb-2">Meals</div>

            <div
                v-for="(calories, mealType) in summary.byMeal"
                :key="mealType"
                class="d-flex justify-space-between align-center mb-1"
            >
                <div class="text-body-2 text-capitalize">{{ mealType }}</div>
                <div class="text-body-2">{{ calories }} cal</div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { globalDialog } from "../../composables/useDialog";
import { useGlobalStore } from "../../stores/global";
import CalorieGoalDialog from "./CalorieGoalDialog.vue";
import MacroProgress from "./MacroProgress.vue";

const props = defineProps<{
    summary: {
        byMeal: {
            breakfast: number;
            dinner: number;
            lunch: number;
            snack: number;
        };
        carbs: number;
        fat: number;
        fiber?: number;
        goal: number;
        protein: number;
        remaining: number;
        saturatedFat?: number;
        sugars?: number;
        total: number;
    };
}>();

type Emits = (e: "update:goal", goal: number, setAsDefault: boolean) => void;

const emit = defineEmits<Emits>();

const globalStore = useGlobalStore();

const caloriePercentage = computed(() => {
    return Math.min(100, (props.summary.total / props.summary.goal) * 100);
});

const progressColor = computed(() => {
    const percentage = caloriePercentage.value;
    if (percentage > 100) return "error";
    if (percentage > 85) return "warning";
    return "success";
});

function openCalorieGoalDialog(): void {
    globalDialog.openDialog(
        CalorieGoalDialog,
        {
            currentGoal: props.summary.goal,
            onSave(newGoal: number, setAsDefault: boolean) {
                emit("update:goal", newGoal, setAsDefault);

                if (setAsDefault) {
                    globalStore.notify("Default calorie goal updated");
                }
            },
        },
        {
            title: "Set Daily Calorie Goal",
        },
    );
}
</script>
