<template>
    <v-container class="pa-2 mx-auto">
        <v-row>
            <v-col cols="12">
                <div class="d-flex flex-column">
                    <!-- Page Header -->
                    <v-card class="px-4 py-6 rounded-lg mb-4">
                        <h1 class="text-h4 text-white font-weight-bold mb-2">Fitness Recipes</h1>
                        <p class="text-body-1 text-white mb-0">
                            Nutritious and delicious meals to support your fitness goals
                        </p>
                    </v-card>

                    <!-- Filters -->
                    <v-card class="mb-4 rounded-lg">
                        <v-card-text>
                            <v-row dense>
                                <v-col cols="12" class="pa-0 pb-2">
                                    <v-tabs
                                        v-model="activeCategory"
                                        color="primary"
                                        class="recipe-tabs rounded-lg overflow-hidden"
                                        density="compact"
                                    >
                                        <v-tab
                                            v-for="category in categoryOptions"
                                            :key="category.value"
                                            :value="category.value"
                                            class="text-body-1 font-weight-medium"
                                            :ripple="false"
                                        >
                                            <v-icon
                                                :icon="category.icon"
                                                class="mr-2"
                                                size="small"
                                            />
                                            {{ category.title }}
                                        </v-tab>
                                    </v-tabs>
                                </v-col>
                            </v-row>

                            <v-row class="mt-2">
                                <v-col cols="12" sm="4">
                                    <v-select
                                        v-model="selectedTags"
                                        label="Tags"
                                        :items="tagOptions"
                                        item-title="title"
                                        item-value="value"
                                        variant="outlined"
                                        density="comfortable"
                                        chips
                                        multiple
                                        hide-details
                                        class="text-body-2"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-select
                                        v-model="selectedDifficulty"
                                        label="Difficulty"
                                        :items="difficultyOptions"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                        class="text-body-2"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-text-field
                                        v-model="searchQuery"
                                        label="Search"
                                        prepend-inner-icon="mdi-magnify"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                        class="text-body-2"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <!-- Recipes Grid -->
                    <div v-if="filteredRecipes.length === 0" class="text-center pa-8">
                        <v-icon icon="mdi-food-off" size="64" color="grey-lighten-1"></v-icon>
                        <p class="text-body-1 mt-4 text-grey-darken-1">
                            No recipes match your current filters.
                        </p>
                        <v-btn color="primary" variant="text" @click="resetFilters" class="mt-2">
                            Reset Filters
                        </v-btn>
                    </div>

                    <v-row v-else>
                        <v-col
                            v-for="recipe in filteredRecipes"
                            :key="recipe.id"
                            cols="12"
                            sm="6"
                            md="4"
                        >
                            <v-card
                                @click="viewRecipe(recipe.id)"
                                class="recipe-card h-100 rounded-lg"
                                elevation="2"
                            >
                                <div class="position-relative">
                                    <v-img
                                        :src="recipe.imageUrl || '/placeholder-recipe.jpg'"
                                        height="180"
                                        cover
                                        class="recipe-image rounded-t-lg"
                                    >
                                        <template #placeholder>
                                            <div
                                                class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
                                            >
                                                <v-icon
                                                    icon="mdi-food"
                                                    size="48"
                                                    color="grey-lighten-1"
                                                ></v-icon>
                                            </div>
                                        </template>
                                    </v-img>
                                    <v-chip
                                        :color="getCategoryColor(recipe.category)"
                                        size="small"
                                        class="category-chip ma-2 font-weight-medium"
                                        :prepend-icon="getCategoryIcon(recipe.category)"
                                    >
                                        {{ recipe.category }}
                                    </v-chip>
                                </div>

                                <v-card-text>
                                    <h3 class="text-h6 font-weight-bold mb-1 line-clamp-1">
                                        {{ recipe.name }}
                                    </h3>
                                    <p class="text-body-2 text-grey-darken-1 mb-3 line-clamp-2">
                                        {{ recipe.description }}
                                    </p>

                                    <div class="d-flex align-center mb-3">
                                        <div class="d-flex align-center mr-4">
                                            <v-icon
                                                icon="mdi-clock-outline"
                                                size="small"
                                                class="mr-1"
                                            ></v-icon>
                                            <span class="text-caption"
                                                >{{ recipe.prepTime + recipe.cookTime }} min</span
                                            >
                                        </div>
                                        <div class="d-flex align-center">
                                            <v-icon
                                                icon="mdi-fire"
                                                size="small"
                                                class="mr-1"
                                            ></v-icon>
                                            <span class="text-caption"
                                                >{{ recipe.calories }} kcal</span
                                            >
                                        </div>
                                        <v-spacer></v-spacer>
                                        <v-chip
                                            density="compact"
                                            size="x-small"
                                            :color="getDifficultyColor(recipe.difficulty)"
                                            variant="outlined"
                                        >
                                            {{ recipe.difficulty }}
                                        </v-chip>
                                    </div>

                                    <div class="macros d-flex justify-space-between mb-2">
                                        <div class="text-center">
                                            <div class="text-subtitle-2 font-weight-bold">
                                                {{ recipe.macros.protein }}g
                                            </div>
                                            <div class="text-caption text-grey-darken-1">
                                                Protein
                                            </div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-subtitle-2 font-weight-bold">
                                                {{ recipe.macros.carbs }}g
                                            </div>
                                            <div class="text-caption text-grey-darken-1">Carbs</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-subtitle-2 font-weight-bold">
                                                {{ recipe.macros.fat }}g
                                            </div>
                                            <div class="text-caption text-grey-darken-1">Fat</div>
                                        </div>
                                    </div>

                                    <div class="d-flex flex-wrap mt-2">
                                        <v-chip
                                            v-for="tag in recipe.tags.slice(0, 2)"
                                            :key="tag"
                                            :color="getTagColor(tag)"
                                            size="x-small"
                                            variant="tonal"
                                            class="mr-1 mb-1"
                                        >
                                            {{ tag }}
                                        </v-chip>
                                        <v-chip
                                            v-if="recipe.tags.length > 2"
                                            size="x-small"
                                            color="grey-lighten-2"
                                            class="mb-1"
                                        >
                                            +{{ recipe.tags.length - 2 }}
                                        </v-chip>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import type { Recipe } from "../types/recipe";

import { getCategoryColor, getCategoryIcon, getTagColor, recipes } from "../data/recipes";

const router = useRouter();

const activeCategory = ref("all");
const searchQuery = ref("");
const selectedTags = ref<string[]>([]);
const selectedDifficulty = ref("all");

const categoryOptions = [
    { icon: "mdi-food-variant", title: "All Recipes", value: "all" },
    { icon: "mdi-weight-lifter", title: "Bulking", value: "bulking" },
    { icon: "mdi-scissors-cutting", title: "Cutting", value: "cutting" },
    { icon: "mdi-scale-balance", title: "Maintenance", value: "maintenance" },
];

const tagOptions = [
    { title: "High Protein", value: "high-protein" },
    { title: "Low Carb", value: "low-carb" },
    { title: "Quick", value: "quick" },
    { title: "Budget-Friendly", value: "budget-friendly" },
    { title: "Calorie-Friendly", value: "calorie-friendly" },
    { title: "Vegetarian", value: "vegetarian" },
    { title: "Vegan", value: "vegan" },
    { title: "Gluten-Free", value: "gluten-free" },
    { title: "Dairy-Free", value: "dairy-free" },
    { title: "Meal Prep", value: "meal-prep" },
];

const difficultyOptions = [
    { title: "All Difficulties", value: "all" },
    { title: "Easy", value: "easy" },
    { title: "Medium", value: "medium" },
    { title: "Hard", value: "hard" },
];

const filteredRecipes = computed(function (): Recipe[] {
    let result = [...recipes];

    if (activeCategory.value !== "all") {
        result = result.filter((recipe) => recipe.category === activeCategory.value);
    }

    if (selectedTags.value.length > 0) {
        result = result.filter((recipe) =>
            selectedTags.value.some((tag) => recipe.tags.includes(tag as any)),
        );
    }

    if (selectedDifficulty.value !== "all") {
        result = result.filter((recipe) => recipe.difficulty === selectedDifficulty.value);
    }

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
            (recipe) =>
                recipe.name.toLowerCase().includes(query) ||
                recipe.description.toLowerCase().includes(query) ||
                recipe.ingredients.some((ingredient) =>
                    ingredient.name.toLowerCase().includes(query),
                ),
        );
    }

    return result;
});

function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
        case "easy":
            return "green";
        case "hard":
            return "red";
        case "medium":
            return "amber";
        default:
            return "grey";
    }
}

function resetFilters(): void {
    activeCategory.value = "all";
    selectedTags.value = [];
    selectedDifficulty.value = "all";
    searchQuery.value = "";
}

function viewRecipe(id: string): void {
    router.push(`/recipes/${id}`);
}
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.recipe-card {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    cursor: pointer;
}

.recipe-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

.category-chip {
    position: absolute;
    top: 0;
    right: 0;
    text-transform: capitalize;
}

.recipe-tabs :deep(.v-tab) {
    border-radius: 12px 12px 0 0;
    opacity: 0.75;
    transition: all 0.2s ease;
    margin: 0 4px;
}

.recipe-tabs :deep(.v-tab--selected) {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    opacity: 1;
    font-weight: bold;
}

.recipe-tabs :deep(.v-tabs-slider) {
    height: 3px;
    border-radius: 3px;
}
</style>
