<template>
    <v-card class="food-card h-100">
        <v-card-item>
            <template #prepend>
                <v-avatar size="42" rounded :color="color" class="mr-3">
                    <v-icon color="white" size="24">{{ icon }}</v-icon>
                </v-avatar>
            </template>

            <v-card-title>{{ food.name }}</v-card-title>
            <v-card-subtitle v-if="food.brand">{{ food.brand }}</v-card-subtitle>
        </v-card-item>

        <v-card-text>
            <div class="d-flex align-center mb-1">
                <v-icon size="small" color="primary" class="mr-1">mdi-fire</v-icon>
                <span class="text-body-2">{{ food.calories }} kcal</span>
                <span class="text-caption text-medium-emphasis ml-1">
                    per {{ food.servingSize }}{{ food.servingUnit }}
                </span>
            </div>

            <div class="d-flex justify-space-between mt-4">
                <div class="text-center">
                    <div class="text-body-2 font-weight-bold">{{ food.protein }}g</div>
                    <div class="text-caption">Protein</div>
                </div>
                <div class="text-center">
                    <div class="text-body-2 font-weight-bold">{{ food.carbs }}g</div>
                    <div class="text-caption">Carbs</div>
                </div>
                <div class="text-center">
                    <div class="text-body-2 font-weight-bold">{{ food.fat }}g</div>
                    <div class="text-caption">Fat</div>
                </div>
            </div>

            <slot name="additional-info"></slot>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <slot name="actions"></slot>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type { FoodItem } from "../../types/food";

interface Props {
    color?: string;
    food: FoodItem;
    icon?: string;
}

const { color = "primary", icon = "mdi-food-apple" } = defineProps<Props>();
</script>

<style scoped>
.food-card {
    position: relative;
    transition: all 0.2s ease;
}

.food-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}
</style>
