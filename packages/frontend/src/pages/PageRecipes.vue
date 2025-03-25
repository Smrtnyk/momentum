<template>
    <div class="recipes">
        <!-- Main content area -->
        <v-container fluid class="pa-0">
            <!-- Header with title and filter/sort buttons -->
            <v-app-bar flat density="comfortable" color="background" class="sticky-header">
                <v-app-bar-title class="text-h6">Fitness Recipes</v-app-bar-title>

                <v-btn icon variant="text" @click="showSortMenu = true">
                    <v-icon>mdi-sort</v-icon>
                </v-btn>

                <v-btn icon variant="text" @click="showFilterDrawer = true" class="ml-2">
                    <v-badge
                        :content="activeFiltersCount"
                        :model-value="activeFiltersCount > 0"
                        color="primary"
                        location="top end"
                    >
                        <v-icon>mdi-filter</v-icon>
                    </v-badge>
                </v-btn>
            </v-app-bar>

            <!-- Search bar -->
            <v-container class="pa-2">
                <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    label="Search recipes"
                    density="comfortable"
                    variant="outlined"
                    hide-details
                    clearable
                ></v-text-field>
            </v-container>

            <!-- Page Header -->
            <v-container class="pa-2 mx-auto">
                <v-card class="px-4 py-6 rounded-lg mb-4">
                    <h1 class="text-h4 text-white font-weight-bold mb-2">Fitness Recipes</h1>
                    <p class="text-body-1 text-white mb-0">
                        Nutritious and delicious meals to support your fitness goals
                    </p>
                </v-card>

                <!-- Empty state -->
                <v-fade-transition>
                    <div v-if="filteredRecipes.length === 0" class="text-center pa-8">
                        <v-icon icon="mdi-food-off" size="56" color="grey"></v-icon>
                        <div class="mt-4 text-h6">No recipes found</div>
                        <div class="text-body-2 text-grey mb-4">
                            Try adjusting your filters or search query
                        </div>
                        <v-btn color="primary" variant="tonal" @click="resetFilters">
                            Reset filters
                        </v-btn>
                    </div>
                </v-fade-transition>

                <!-- Recipes Grid -->
                <div v-if="filteredRecipes.length > 0">
                    <!-- Results count -->
                    <div class="text-body-2 text-grey mb-2">
                        {{ filteredRecipes.length }} recipes found
                    </div>

                    <v-row>
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
            </v-container>
        </v-container>

        <!-- Filters drawer -->
        <v-bottom-sheet v-model="showFilterDrawer" class="filter-sheet">
            <v-card height="90vh">
                <v-card-title class="d-flex align-center py-4 px-4">
                    <span>Filters</span>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="primary" @click="resetFilters"> Reset </v-btn>
                    <v-btn variant="text" icon @click="showFilterDrawer = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="filter-content">
                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Category</div>
                        <v-chip-group
                            v-model="selectedCategories"
                            class="d-flex flex-wrap"
                            multiple
                            column
                        >
                            <v-chip
                                v-for="category in categoryOptions.filter((c) => c.value !== 'all')"
                                :key="category.value"
                                :value="category.value"
                                filter
                                variant="outlined"
                                class="text-capitalize ma-1"
                            >
                                <v-icon start :icon="category.icon" size="small"></v-icon>
                                {{ category.title }}
                            </v-chip>
                        </v-chip-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Tags</div>
                        <v-chip-group
                            v-model="selectedTags"
                            class="d-flex flex-wrap"
                            multiple
                            column
                        >
                            <v-chip
                                v-for="tag in tagOptions"
                                :key="tag.value"
                                :value="tag.value"
                                filter
                                variant="outlined"
                                class="text-capitalize ma-1"
                            >
                                {{ tag.title }}
                            </v-chip>
                        </v-chip-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Difficulty</div>
                        <v-radio-group v-model="selectedDifficulty" class="filter-radio-group">
                            <v-radio
                                v-for="difficulty in difficultyOptions"
                                :key="difficulty.value"
                                :label="difficulty.title"
                                :value="difficulty.value"
                                class="text-capitalize"
                            ></v-radio>
                        </v-radio-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Calories</div>
                        <v-radio-group v-model="selectedCalories" class="filter-radio-group">
                            <v-radio label="Any calories" value="all"></v-radio>
                            <v-radio label="Under 300 kcal" value="low"></v-radio>
                            <v-radio label="300-600 kcal" value="medium"></v-radio>
                            <v-radio label="Over 600 kcal" value="high"></v-radio>
                        </v-radio-group>
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-btn block color="primary" size="large" @click="applyFilters">
                        Apply Filters
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>

        <!-- Sort menu -->
        <v-dialog v-model="showSortMenu" max-width="300">
            <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold"> Sort Recipes </v-card-title>
                <v-divider></v-divider>
                <v-list density="comfortable" nav>
                    <v-list-item
                        v-for="option in sortOptions"
                        :key="option.value"
                        :value="option.value"
                        @click="selectSortOption(option.value)"
                    >
                        <template v-slot:prepend>
                            <v-icon color="primary" v-if="sortBy === option.value">
                                mdi-check
                            </v-icon>
                        </template>
                        <v-list-item-title>{{ option.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import type { Recipe, RecipeTag } from "../types/recipe";

import { getCategoryColor, getCategoryIcon, getTagColor, recipes } from "../data/recipes";

const router = useRouter();

const showFilterDrawer = ref<boolean>(false);
const showSortMenu = ref<boolean>(false);
const searchQuery = ref<string>("");
const selectedCategories = ref<string[]>([]);
const selectedTags = ref<RecipeTag[]>([]);
const selectedDifficulty = ref<string>("all");
const selectedCalories = ref<string>("all");
const sortBy = ref<string>("name");

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

const sortOptions = [
    { title: "Name (A-Z)", value: "name" },
    { title: "Name (Z-A)", value: "-name" },
    { title: "Calories (Low to High)", value: "calories" },
    { title: "Calories (High to Low)", value: "-calories" },
    { title: "Prep Time (Quickest First)", value: "time" },
    { title: "Prep Time (Longest First)", value: "-time" },
    { title: "Protein (Highest First)", value: "-protein" },
];

const activeFiltersCount = computed<number>(function () {
    let count = 0;

    if (selectedCategories.value.length > 0) count++;
    if (selectedTags.value.length > 0) count++;
    if (selectedDifficulty.value !== "all") count++;
    if (selectedCalories.value !== "all") count++;

    return count;
});

const filteredRecipes = computed<Recipe[]>(function () {
    let result = [...recipes];

    if (selectedCategories.value.length > 0) {
        result = result.filter((recipe) => selectedCategories.value.includes(recipe.category));
    }

    if (selectedTags.value.length > 0) {
        result = result.filter((recipe) =>
            selectedTags.value.some((tag) => recipe.tags.includes(tag)),
        );
    }

    if (selectedDifficulty.value !== "all") {
        result = result.filter((recipe) => recipe.difficulty === selectedDifficulty.value);
    }

    if (selectedCalories.value !== "all") {
        switch (selectedCalories.value) {
            case "high":
                result = result.filter((recipe) => recipe.calories > 600);
                break;
            case "low":
                result = result.filter((recipe) => recipe.calories < 300);
                break;
            case "medium":
                result = result.filter(
                    (recipe) => recipe.calories >= 300 && recipe.calories <= 600,
                );
                break;
        }
    }

    if (searchQuery.value?.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
            (recipe) =>
                recipe.name.toLowerCase().includes(query) ??
                recipe.description.toLowerCase().includes(query) ??
                recipe.ingredients.some((ingredient) =>
                    ingredient.name.toLowerCase().includes(query),
                ),
        );
    }

    return sortRecipes(result);
});

function applyFilters(): void {
    showFilterDrawer.value = false;
}

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
    selectedCategories.value = [];
    selectedTags.value = [];
    selectedDifficulty.value = "all";
    selectedCalories.value = "all";
    searchQuery.value = "";
    showFilterDrawer.value = false;
}

function selectSortOption(option: string): void {
    sortBy.value = option;
    showSortMenu.value = false;
}

function sortRecipes(recipesVal: Recipe[]): Recipe[] {
    const result = [...recipesVal];

    switch (sortBy.value) {
        case "-calories":
            return result.sort((a, b) => b.calories - a.calories);
        case "-name":
            return result.sort((a, b) => b.name.localeCompare(a.name));
        case "-protein":
            return result.sort((a, b) => b.macros.protein - a.macros.protein);
        case "-time":
            return result.sort((a, b) => b.prepTime + b.cookTime - (a.prepTime + a.cookTime));
        case "calories":
            return result.sort((a, b) => a.calories - b.calories);
        case "name":
            return result.sort((a, b) => a.name.localeCompare(b.name));
        case "time":
            return result.sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime));
        default:
            return result;
    }
}

function viewRecipe(id: string): void {
    router.push(`/recipes/${id}`);
}
</script>

<style scoped>
.recipes {
    position: relative;
    min-height: 100vh;
}

.sticky-header {
    position: sticky;
    top: 0;
    z-index: 3;
}

.filter-sheet {
    display: flex;
    flex-direction: column;
}

.filter-content {
    overflow-y: auto;
    flex-grow: 1;
    padding-bottom: 72px;
}

.filter-radio-group {
    display: flex;
    flex-wrap: wrap;
}

.filter-radio-group .v-radio {
    margin-right: 16px;
}

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
</style>
