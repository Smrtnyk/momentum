<template>
    <v-container class="pa-2 mx-auto">
        <!-- Loading state -->
        <div v-if="isLoading" class="d-flex flex-column align-center justify-center pa-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="text-body-1 mt-4">Loading recipe...</p>
        </div>

        <!-- Recipe not found -->
        <div v-else-if="!recipe" class="d-flex flex-column align-center justify-center pa-8">
            <v-icon icon="mdi-food-off" size="64" color="grey-lighten-1"></v-icon>
            <h2 class="text-h5 mt-4">Recipe Not Found</h2>
            <p class="text-body-1 mt-2 text-grey-lighten-1">
                The recipe you're looking for doesn't exist or has been removed.
            </p>
            <v-btn color="primary" variant="outlined" to="/recipes" class="mt-4">
                Back to Recipes
            </v-btn>
        </div>

        <!-- Recipe content -->
        <template v-else>
            <!-- Recipe header -->
            <v-card class="mb-4 rounded-lg overflow-hidden">
                <div class="recipe-header position-relative">
                    <v-img
                        :src="recipe.imageUrl || '/placeholder-recipe.jpg'"
                        height="250"
                        cover
                        class="recipe-image"
                        gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)"
                    >
                        <div class="d-flex flex-column justify-end fill-height pa-4">
                            <div class="d-flex align-center">
                                <v-chip
                                    :color="getCategoryColor(recipe.category)"
                                    size="small"
                                    class="text-capitalize font-weight-medium mb-2"
                                    :prepend-icon="getCategoryIcon(recipe.category)"
                                >
                                    {{ recipe.category }}
                                </v-chip>
                            </div>
                            <h1 class="text-h4 text-white font-weight-bold mb-2">
                                {{ recipe.name }}
                            </h1>
                            <p class="text-body-1 text-white mb-0">{{ recipe.description }}</p>
                        </div>
                    </v-img>
                </div>
            </v-card>

            <!-- Recipe info section -->
            <v-row>
                <v-col cols="12" md="8">
                    <!-- Recipe details -->
                    <v-card class="mb-4 rounded-lg">
                        <v-card-text>
                            <v-row class="mb-4">
                                <!-- Prep Time -->
                                <v-col
                                    cols="4"
                                    sm="4"
                                    md="2"
                                    class="d-flex flex-column align-center"
                                >
                                    <v-icon
                                        icon="mdi-clock-outline"
                                        color="blue"
                                        size="24"
                                    ></v-icon>
                                    <div class="text-caption text-grey-lighten-1 mt-1">
                                        Prep Time
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ recipe.prepTime }} min
                                    </div>
                                </v-col>

                                <!-- Cook Time -->
                                <v-col
                                    cols="4"
                                    sm="4"
                                    md="2"
                                    class="d-flex flex-column align-center"
                                >
                                    <v-icon
                                        icon="mdi-pot-steam"
                                        color="deep-orange"
                                        size="24"
                                    ></v-icon>
                                    <div class="text-caption text-grey-lighten-1 mt-1">
                                        Cook Time
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ recipe.cookTime }} min
                                    </div>
                                </v-col>

                                <!-- Total Time -->
                                <v-col
                                    cols="4"
                                    sm="4"
                                    md="2"
                                    class="d-flex flex-column align-center"
                                >
                                    <v-icon
                                        icon="mdi-clock-time-five"
                                        color="purple"
                                        size="24"
                                    ></v-icon>
                                    <div class="text-caption text-grey-lighten-1 mt-1">
                                        Total Time
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ recipe.prepTime + recipe.cookTime }} min
                                    </div>
                                </v-col>

                                <!-- Servings -->
                                <v-col
                                    cols="4"
                                    sm="4"
                                    md="2"
                                    class="d-flex flex-column align-center"
                                >
                                    <v-icon
                                        icon="mdi-food-variant"
                                        color="light-green"
                                        size="24"
                                    ></v-icon>
                                    <div class="text-caption text-grey-lighten-1 mt-1">
                                        Servings
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ recipe.servings }}
                                    </div>
                                </v-col>

                                <!-- Calories -->
                                <v-col
                                    cols="4"
                                    sm="4"
                                    md="2"
                                    class="d-flex flex-column align-center"
                                >
                                    <v-icon
                                        icon="mdi-fire"
                                        color="amber-darken-2"
                                        size="24"
                                    ></v-icon>
                                    <div class="text-caption text-grey-lighten-1 mt-1">
                                        Calories
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ recipe.calories }} kcal
                                    </div>
                                </v-col>

                                <!-- Difficulty -->
                                <v-col
                                    cols="4"
                                    sm="4"
                                    md="2"
                                    class="d-flex flex-column align-center"
                                >
                                    <v-icon icon="mdi-chef-hat" color="red" size="24"></v-icon>
                                    <div class="text-caption text-grey-lighten-1 mt-1">
                                        Difficulty
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold text-capitalize">
                                        {{ recipe.difficulty }}
                                    </div>
                                </v-col>
                            </v-row>

                            <div class="d-flex mb-3">
                                <div v-for="tag in recipe.tags" :key="tag" class="mr-2">
                                    <v-chip
                                        :color="getTagColor(tag)"
                                        size="small"
                                        class="text-capitalize"
                                    >
                                        {{ tag }}
                                    </v-chip>
                                </div>
                            </div>

                            <!-- Ingredients -->
                            <div class="mt-6">
                                <div class="d-flex align-center justify-space-between mb-4">
                                    <h2 class="text-h5 font-weight-bold">
                                        <v-icon icon="mdi-food-variant" class="mr-2"></v-icon>
                                        Ingredients
                                    </h2>

                                    <v-btn
                                        v-if="checkedIngredients.size > 0"
                                        size="small"
                                        color="primary"
                                        variant="text"
                                        density="comfortable"
                                        prepend-icon="mdi-refresh"
                                        @click="clearCheckedIngredients"
                                    >
                                        Clear All
                                    </v-btn>
                                </div>

                                <v-divider class="mb-3"></v-divider>

                                <v-list density="compact" class="bg-transparent">
                                    <v-list-item
                                        v-for="(ingredient, index) in adjustedIngredients"
                                        :key="index"
                                        class="px-0"
                                        :class="{ 'text-grey': checkedIngredients.has(index) }"
                                    >
                                        <template #prepend>
                                            <v-checkbox-btn
                                                color="primary"
                                                density="compact"
                                                :model-value="checkedIngredients.has(index)"
                                                @update:model-value="toggleIngredient(index)"
                                            ></v-checkbox-btn>
                                        </template>
                                        <v-list-item-title
                                            class="text-body-1"
                                            :class="{
                                                'text-decoration-line-through':
                                                    checkedIngredients.has(index),
                                            }"
                                        >
                                            <span class="font-weight-medium">
                                                {{ ingredient.amount }}
                                                {{ ingredient.unit ? ingredient.unit : "" }}
                                            </span>
                                            {{ ingredient.name }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>

                                <div class="d-flex justify-end mt-3">
                                    <v-chip
                                        v-if="checkedIngredients.size > 0"
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    >
                                        {{ checkedIngredients.size }}/{{
                                            adjustedIngredients.length
                                        }}
                                        checked
                                    </v-chip>
                                </div>
                            </div>

                            <!-- Instructions -->
                            <div class="mt-6">
                                <h2 class="text-h5 font-weight-bold mb-4">
                                    <v-icon icon="mdi-list-box-outline" class="mr-2"></v-icon>
                                    Instructions
                                </h2>
                                <v-divider class="mb-3"></v-divider>
                                <v-timeline density="compact" side="end">
                                    <v-timeline-item
                                        v-for="(instruction, index) in recipe.instructions"
                                        :key="index"
                                        dot-color="primary"
                                        size="small"
                                    >
                                        <div class="text-body-1 mb-3">{{ instruction }}</div>
                                    </v-timeline-item>
                                </v-timeline>
                            </div>

                            <!-- Notes (if any) -->
                            <div v-if="recipe.notes" class="mt-6">
                                <h2 class="text-h5 font-weight-bold mb-4">
                                    <v-icon icon="mdi-note-text" class="mr-2"></v-icon>
                                    Notes
                                </h2>
                                <v-divider class="mb-3"></v-divider>
                                <v-alert type="info" variant="tonal" class="bg-blue-lighten-5">
                                    <p class="text-body-1">{{ recipe.notes }}</p>
                                </v-alert>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4">
                    <!-- Nutritional information card -->
                    <v-card class="rounded-lg mb-4 nutrition-card">
                        <v-card-text class="pt-2">
                            <div class="d-flex align-center pb-2">
                                <v-icon icon="mdi-nutrition" color="primary" class="mr-2"></v-icon>
                                <span class="text-h6 font-weight-medium">Nutrition Facts</span>
                            </div>
                            <v-divider
                                class="mb-4 divider-colored"
                                color="primary"
                                thickness="2"
                            ></v-divider>

                            <div class="text-caption text-grey-lighten-1 mb-1">Per Serving</div>
                            <div class="text-h6 font-weight-bold mb-1">
                                {{ adjustedCalories }} kcal
                            </div>
                            <div class="text-caption text-grey-lighten-1 mb-4">
                                Total: {{ totalCalories }} kcal for {{ desiredServings }} servings
                            </div>

                            <!-- Macronutrient Display with Progress Bar -->
                            <div class="mb-4">
                                <MacroProgress
                                    :protein="adjustedMacros.protein"
                                    :carbs="adjustedMacros.carbs"
                                    :fat="adjustedMacros.fat"
                                />
                            </div>

                            <!-- Macro percentages -->
                            <div class="d-flex justify-space-between text-center">
                                <div>
                                    <div class="text-caption">Protein</div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ calculateMacroPercentage("protein") }}%
                                    </div>
                                </div>
                                <div>
                                    <div class="text-caption">Carbs</div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ calculateMacroPercentage("carbs") }}%
                                    </div>
                                </div>
                                <div>
                                    <div class="text-caption">Fat</div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ calculateMacroPercentage("fat") }}%
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>

                    <!-- Tools card -->
                    <v-card class="rounded-lg mb-4">
                        <v-card-text class="pa-4">
                            <div class="d-flex align-center pb-2">
                                <v-icon icon="mdi-tools" class="mr-2"></v-icon>
                                <span class="text-h6 font-weight-medium"> Recipe Tools</span>
                            </div>
                            <v-divider
                                class="mb-4 divider-colored"
                                color="primary"
                                thickness="2"
                            ></v-divider>
                            <v-row>
                                <v-col cols="6">
                                    <v-btn
                                        prepend-icon="mdi-printer"
                                        color="primary"
                                        variant="outlined"
                                        block
                                        @click="printRecipe"
                                    >
                                        Print
                                    </v-btn>
                                </v-col>
                                <v-col cols="6">
                                    <v-btn
                                        prepend-icon="mdi-share-variant"
                                        color="primary"
                                        variant="outlined"
                                        block
                                        @click="shareRecipe"
                                    >
                                        Share
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" class="mt-2">
                                    <v-btn
                                        prepend-icon="mdi-bookmark"
                                        color="primary"
                                        variant="tonal"
                                        block
                                        @click="saveRecipe"
                                    >
                                        Save to Favorites
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" class="mt-2">
                                    <v-btn
                                        prepend-icon="mdi-food-apple"
                                        color="success"
                                        block
                                        @click="logMeal"
                                    >
                                        Log as Meal
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <!-- Servings adjuster -->
                    <v-card class="rounded-lg mb-4">
                        <v-card-text class="pt-2">
                            <div class="d-flex align-center pb-2">
                                <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
                                <span class="text-h6 font-weight-medium">Adjust Servings</span>
                            </div>
                            <v-divider
                                class="mb-4 divider-colored"
                                color="primary"
                                thickness="2"
                            ></v-divider>

                            <div class="text-center text-body-2 mb-3">
                                <span class="font-weight-medium">Original recipe: </span
                                >{{ recipe.servings }} servings
                            </div>

                            <div class="d-flex align-center mb-2">
                                <v-slider
                                    v-model="desiredServings"
                                    :min="1"
                                    :max="maxServings"
                                    :step="1"
                                    show-ticks
                                    thumb-label
                                    :ticks="getTicksForServings()"
                                    class="flex-grow-1 w-100"
                                    hide-details
                                >
                                    <template #append>
                                        <v-text-field
                                            v-model="desiredServings"
                                            type="number"
                                            style="width: 70px"
                                            density="compact"
                                            variant="outlined"
                                            min="1"
                                            :max="maxServings"
                                            hide-details
                                        ></v-text-field>
                                    </template>
                                </v-slider>
                            </div>

                            <div class="text-center text-body-2 mt-2 mb-2">
                                <span class="font-weight-medium">You selected: </span
                                >{{ desiredServings }} servings
                            </div>

                            <div
                                class="alert-container"
                                style="min-height: 52px; transition: opacity 0.2s ease"
                            >
                                <v-alert
                                    v-if="desiredServings !== recipe.servings"
                                    type="info"
                                    density="compact"
                                    variant="tonal"
                                    icon="mdi-information-outline"
                                    class="text-caption mt-3 mb-0"
                                >
                                    All ingredients, calories, and nutrition facts have been
                                    adjusted.
                                </v-alert>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Related Recipes Carousel -->
            <v-card v-if="relatedRecipes.length > 0" class="rounded-lg">
                <v-card-text class="pt-2">
                    <div class="d-flex align-center pb-2">
                        <v-icon icon="mdi-silverware-fork-knife" class="mr-2"></v-icon>
                        <span class="text-h6 font-weight-medium"> You Might Also Like</span>
                    </div>
                    <v-divider
                        class="mb-4 divider-colored"
                        color="primary"
                        thickness="2"
                    ></v-divider>

                    <v-carousel
                        hide-delimiters
                        :show-arrows="false"
                        height="auto"
                        cycle
                        interval="5000"
                    >
                        <v-carousel-item
                            v-for="(relatedRecipe, i) in relatedRecipes"
                            :key="i"
                            class="pa-0"
                        >
                            <div
                                @click.stop.prevent="viewRelatedRecipe(relatedRecipe.id)"
                                class="related-recipe-card h-100 cursor-pointer"
                            >
                                <div class="position-relative">
                                    <v-img
                                        :src="relatedRecipe.imageUrl || '/placeholder-recipe.jpg'"
                                        height="140"
                                        cover
                                        class="rounded-t-lg"
                                        gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7)"
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
                                        :color="getCategoryColor(relatedRecipe.category)"
                                        size="x-small"
                                        class="category-chip ma-2 text-capitalize"
                                    >
                                        {{ relatedRecipe.category }}
                                    </v-chip>
                                </div>

                                <v-card-text class="px-6">
                                    <h3 class="text-subtitle-1 font-weight-bold mb-1 line-clamp-2">
                                        {{ relatedRecipe.name }}
                                    </h3>

                                    <div class="d-flex align-center mb-2 pa-3">
                                        <div class="d-flex align-center mr-3">
                                            <v-icon
                                                icon="mdi-clock-outline"
                                                size="x-small"
                                                class="mr-1"
                                            ></v-icon>
                                            <span class="text-caption"
                                                >{{
                                                    relatedRecipe.prepTime + relatedRecipe.cookTime
                                                }}
                                                min</span
                                            >
                                        </div>
                                        <div class="d-flex align-center">
                                            <v-icon
                                                icon="mdi-fire"
                                                size="x-small"
                                                class="mr-1"
                                            ></v-icon>
                                            <span class="text-caption"
                                                >{{ relatedRecipe.calories }} kcal</span
                                            >
                                        </div>
                                    </div>

                                    <div class="d-flex flex-wrap">
                                        <v-chip
                                            v-for="tag in relatedRecipe.tags.slice(0, 2)"
                                            :key="tag"
                                            :color="getTagColor(tag)"
                                            size="x-small"
                                            variant="tonal"
                                            class="mr-1 mb-1"
                                        >
                                            {{ tag }}
                                        </v-chip>
                                    </div>
                                </v-card-text>
                            </div>
                        </v-carousel-item>
                    </v-carousel>
                </v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { Ingredient, Recipe } from "../types/recipe";

import MacroProgress from "../components/calories/MacroProgress.vue";
import {
    getCategoryColor,
    getCategoryIcon,
    getRecipeById,
    getRelatedRecipes,
    getTagColor,
} from "../data/recipes";
import {
    adjustIngredients,
    calculateMacroPercentage as calcMacroPercentage,
    getTotalCalories,
} from "../helpers/recipe-utils";
import { logger } from "../logger/app-logger";
import { useGlobalStore } from "../stores/global";

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();

const isLoading = ref(true);
const recipe = ref<Recipe | undefined>(undefined);
const desiredServings = ref(0);
const maxServings = 20;
const checkedIngredients = ref<Set<number>>(new Set());

const adjustedIngredients = computed(function (): Ingredient[] {
    if (!recipe.value) return [];
    return adjustIngredients(
        recipe.value.ingredients,
        recipe.value.servings,
        desiredServings.value,
    );
});

const adjustedCalories = computed(function (): number {
    if (!recipe.value) return 0;
    return recipe.value.calories;
});

const totalCalories = computed(function (): number {
    if (!recipe.value) return 0;
    return getTotalCalories(recipe.value.calories, desiredServings.value);
});

const adjustedMacros = computed(function () {
    if (!recipe.value) return { carbs: 0, fat: 0, protein: 0 };
    return recipe.value.macros;
});

watch(() => desiredServings.value, saveIngredientState);

function loadRecipe(recipeId: string): void {
    isLoading.value = true;
    recipe.value = undefined;
    checkedIngredients.value = new Set();

    setTimeout(() => {
        recipe.value = getRecipeById(recipeId);
        isLoading.value = false;

        if (recipe.value) {
            desiredServings.value = recipe.value.servings;
            loadSavedIngredientState();
        }

        if (!recipe.value) {
            globalStore.notifyError("Recipe not found");
        }
    }, 500);
}

onMounted(function (): void {
    const recipeId = route.params.id as string;
    loadRecipe(recipeId);
});

watch(
    () => route.params.id,
    function (newId, oldId) {
        if (newId && newId !== oldId) {
            loadRecipe(newId as string);
            window.scrollTo(0, 0);
        }
    },
);

function viewRelatedRecipe(id: string): void {
    router.push(`/recipes/${id}`);
}

const relatedRecipes = computed(function (): Recipe[] {
    if (!recipe.value) return [];
    return getRelatedRecipes(recipe.value, 6);
});

function calculateMacroPercentage(macroType: "carbs" | "fat" | "protein"): number {
    if (!recipe.value) return 0;
    return calcMacroPercentage(adjustedMacros.value, macroType);
}

function clearCheckedIngredients(): void {
    checkedIngredients.value.clear();
    saveIngredientState();
}

function getTicksForServings(): Record<number, string> {
    if (!recipe.value) return { 1: "1" };

    const ticks: Record<number, string> = {
        1: "1",
    };

    if (recipe.value.servings > 1) {
        ticks[recipe.value.servings] = recipe.value.servings.toString();
    }

    if (recipe.value.servings > 5) {
        const middleValue = Math.floor(recipe.value.servings / 2);
        ticks[middleValue] = middleValue.toString();
    }

    const doubleServings = recipe.value.servings * 2;
    if (doubleServings <= maxServings) {
        ticks[doubleServings] = doubleServings.toString();
    }

    ticks[maxServings] = maxServings.toString();

    return ticks;
}

function loadSavedIngredientState(): void {
    if (!recipe.value) return;

    const savedState = localStorage.getItem(`recipe-${recipe.value.id}-ingredients`);
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            checkedIngredients.value = new Set(parsedState);
        } catch (error) {
            logger.error("Error parsing saved ingredient state", "PageRecipe", error);
        }
    }
}

function logMeal(): void {
    if (!recipe.value) return;

    globalStore.notify(`Functionality coming soon :)`);
}

function printRecipe(): void {
    globalThis.print();
}

function saveIngredientState(): void {
    if (!recipe.value) return;

    localStorage.setItem(
        `recipe-${recipe.value.id}-ingredients`,
        JSON.stringify(Array.from(checkedIngredients.value)),
    );
}

function saveRecipe(): void {
    globalStore.notify("Recipe saved to favorites!");
}

function shareRecipe(): void {
    globalStore.notify("Sharing functionality coming soon!");
}

function toggleIngredient(index: number): void {
    if (checkedIngredients.value.has(index)) {
        checkedIngredients.value.delete(index);
    } else {
        checkedIngredients.value.add(index);
    }

    saveIngredientState();
}
</script>

<style scoped>
.related-recipe-card {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    cursor: pointer;
}

.related-recipe-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

.category-chip {
    position: absolute;
    top: 0;
    right: 0;
}
</style>
