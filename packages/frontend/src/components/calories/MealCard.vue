<template>
    <v-card class="meal-card" elevation="1">
        <v-card-item>
            <template #prepend>
                <v-avatar :icon="getMealIcon()" :color="getMealColor()" class="mr-3"></v-avatar>
            </template>
            <v-card-title>{{ mealTitle }}</v-card-title>
            <v-card-subtitle>{{ meal?.totalCalories ?? 0 }} calories</v-card-subtitle>

            <template #append>
                <v-menu location="bottom end">
                    <template #activator="{ props }">
                        <v-btn icon variant="text" v-bind="props">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item @click="$emit('add-macros')">
                            <template #prepend>
                                <v-icon color="primary">mdi-calculator</v-icon>
                            </template>
                            <v-list-item-title>Log Macros Directly</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="$emit('scan-label')">
                            <template #prepend>
                                <v-icon color="primary">mdi-barcode-scan</v-icon>
                            </template>
                            <v-list-item-title>Scan nutrition label</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="$emit('describe-food')">
                            <template #prepend>
                                <v-icon color="primary">mdi-food-variant</v-icon>
                            </template>
                            <v-list-item-title>Describe food with AI</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="$emit('search-food')">
                            <template #prepend>
                                <v-icon color="primary">mdi-magnify</v-icon>
                            </template>
                            <v-list-item-title>Search food in database</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-card-item>

        <v-divider></v-divider>

        <!-- Food Items -->
        <template v-if="meal">
            <v-list density="compact" class="pa-0" v-if="meal">
                <v-list-item
                    v-for="(food, index) in meal.foods"
                    :key="index"
                    :class="{ 'food-item-even': index % 2 === 0 }"
                >
                    <template #prepend>
                        <v-avatar size="32" class="mr-2">
                            <v-img v-if="food.imageUrl" :src="food.imageUrl" :alt="food.name" />
                            <template v-else>
                                <v-icon v-if="isCustomFood(food)" color="white"
                                    >mdi-food-apple</v-icon
                                >
                                <v-icon v-else-if="isManualEntry(food)" color="white"
                                    >mdi-calculator</v-icon
                                >
                                <v-icon v-else color="white">mdi-food</v-icon>
                            </template>
                        </v-avatar>
                    </template>

                    <div>
                        <div class="d-flex justify-space-between align-center">
                            <div class="font-weight-medium">{{ food.name }}</div>
                            <div class="text-subtitle-2">{{ food.calories }} kcal</div>
                        </div>
                        <div class="text-caption text-medium-emphasis d-flex flex-wrap gap-1">
                            <span class="font-weight-medium"
                                >{{ food.servingSize }} {{ food.servingUnit }}</span
                            >
                            <template v-if="food.brand"> • {{ food.brand }}</template>
                            <div class="d-flex gap-2 ms-auto">
                                <span class="mr-2"
                                    ><span class="font-weight-bold">P:</span>
                                    {{ food.protein.toFixed(1) }}g</span
                                >
                                <span class="mr-2"
                                    ><span class="font-weight-bold">C:</span>
                                    {{ food.carbs.toFixed(1) }}g</span
                                >
                                <span
                                    ><span class="font-weight-bold">F:</span>
                                    {{ food.fat.toFixed(1) }}g</span
                                >
                            </div>
                        </div>
                    </div>

                    <template #append>
                        <v-btn
                            icon
                            size="small"
                            variant="text"
                            color="error"
                            @click="removeFood(index)"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                </v-list-item>

                <v-list-item v-if="meal.foods.length === 0" class="text-center pa-4">
                    <div class="text-caption text-medium-emphasis">No foods added yet</div>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <!-- Macros Footer -->
            <v-card-text class="d-flex justify-space-between pt-2 pb-2">
                <div class="text-caption">
                    <span class="font-weight-bold">P:</span> {{ meal.macros.protein.toFixed(1) }}g
                </div>
                <div class="text-caption">
                    <span class="font-weight-bold">C:</span> {{ meal.macros.carbs.toFixed(1) }}g
                </div>
                <div class="text-caption">
                    <span class="font-weight-bold">F:</span> {{ meal.macros.fat.toFixed(1) }}g
                </div>
            </v-card-text>
        </template>

        <template v-else>
            <v-card-text class="d-flex flex-column align-center justify-center text-center py-8">
                <div class="text-body-2 text-medium-emphasis mb-4">No foods logged yet</div>
            </v-card-text>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { CustomFood, FoodItem } from "../../types/food";
import type { Meal } from "../../types/health-metrics";

const { meal, mealType } = defineProps<{
    meal: Meal | undefined;
    mealType: Meal["mealType"];
}>();

const emit = defineEmits<{
    "add-macros": [];
    "describe-food": [];
    "remove-food": [index: number];
    "scan-label": [];
    "search-food": [];
}>();

const mealTitle = computed(() => {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
});

function getMealColor(): string {
    switch (mealType) {
        case "breakfast":
            return "amber-lighten-1";
        case "dinner":
            return "deep-purple-lighten-1";
        case "lunch":
            return "light-green-lighten-1";
        case "snack":
            return "light-blue-lighten-1";
        default:
            return "grey-lighten-1";
    }
}

function getMealIcon(): string {
    switch (mealType) {
        case "breakfast":
            return "mdi-coffee";
        case "dinner":
            return "mdi-food-turkey";
        case "lunch":
            return "mdi-food";
        case "snack":
            return "mdi-food-apple";
        default:
            return "mdi-food";
    }
}

function isCustomFood(food: CustomFood | FoodItem): food is CustomFood {
    return "isCustom" in food && food.isCustom;
}

function isManualEntry(food: FoodItem): boolean {
    return food.id.startsWith("manual-");
}

function removeFood(index: number): void {
    emit("remove-food", index);
}
</script>

<style scoped>
.meal-card {
    transition: all 0.2s ease;
    border-radius: 8px;
    overflow: hidden;
}

.meal-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.food-item-even {
    background-color: rgba(0, 0, 0, 0.02);
}
</style>
