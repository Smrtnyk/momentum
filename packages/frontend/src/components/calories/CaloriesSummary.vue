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

            <!-- Macronutrient Breakdown -->
            <div class="d-flex justify-space-around mb-2">
                <div class="text-center">
                    <div class="text-caption">PROTEIN</div>
                    <div class="text-h6">{{ summary.protein.toFixed(0) }}g</div>
                    <div class="text-caption">{{ proteinCalories }} cal</div>
                </div>

                <div class="text-center">
                    <div class="text-caption">CARBS</div>
                    <div class="text-h6">{{ summary.carbs.toFixed(0) }}g</div>
                    <div class="text-caption">{{ carbCalories }} cal</div>
                </div>

                <div class="text-center">
                    <div class="text-caption">FAT</div>
                    <div class="text-h6">{{ summary.fat.toFixed(0) }}g</div>
                    <div class="text-caption">{{ fatCalories }} cal</div>
                </div>
            </div>

            <!-- Macronutrient Progress Bars -->
            <div class="macro-bars">
                <div
                    class="macro-bar protein"
                    :style="{ width: `${macroPercentages.protein}%` }"
                ></div>
                <div class="macro-bar carbs" :style="{ width: `${macroPercentages.carbs}%` }"></div>
                <div class="macro-bar fat" :style="{ width: `${macroPercentages.fat}%` }"></div>
            </div>

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
        goal: number;
        protein: number;
        remaining: number;
        total: number;
    };
}>();

const emit = defineEmits<{
    "update:goal": [goal: number, setAsDefault: boolean];
}>();

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

const proteinCalories = computed(() => Math.round(props.summary.protein * 4));
const carbCalories = computed(() => Math.round(props.summary.carbs * 4));
const fatCalories = computed(() => Math.round(props.summary.fat * 9));

const macroPercentages = computed(() => {
    const totalCalories = proteinCalories.value + carbCalories.value + fatCalories.value;

    if (totalCalories === 0) {
        return { carbs: 0, fat: 0, protein: 0 };
    }

    return {
        carbs: Math.round((carbCalories.value / totalCalories) * 100),
        fat: Math.round((fatCalories.value / totalCalories) * 100),
        protein: Math.round((proteinCalories.value / totalCalories) * 100),
    };
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

<style scoped>
.macro-bars {
    display: flex;
    height: 8px;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
}

.macro-bar {
    height: 100%;
}

.macro-bar.protein {
    background-color: #7986cb;
}

.macro-bar.carbs {
    background-color: #4fc3f7;
}

.macro-bar.fat {
    background-color: #ffb74d;
}
</style>
