<template>
    <div class="food-search">
        <v-card-text>
            <!-- Search & Create Options -->
            <div class="d-flex align-center mb-4">
                <v-text-field
                    v-model="searchQuery"
                    label="Search for foods"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    @update:model-value="debounceSearch"
                    :loading="isLoading"
                    class="flex-grow-1"
                >
                    <template #append-inner>
                        <v-btn
                            icon
                            variant="text"
                            @click="handleBarcodeScanner"
                            :disabled="isScanning || isSearching || isLoading"
                        >
                            <v-icon>mdi-barcode-scan</v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
            </div>

            <!-- Simple pill filter that works correctly -->
            <div class="d-flex justify-center mb-4">
                <v-btn-toggle
                    v-model="foodTypeFilter"
                    color="primary"
                    rounded="pill"
                    mandatory
                    density="comfortable"
                >
                    <v-btn
                        value="ingredients"
                        :variant="foodTypeFilter === 'ingredients' ? 'elevated' : 'text'"
                        prepend-icon="mdi-food-apple"
                    >
                        Ingredients
                    </v-btn>
                    <v-btn
                        value="products"
                        :variant="foodTypeFilter === 'products' ? 'elevated' : 'text'"
                        prepend-icon="mdi-package-variant"
                    >
                        Products
                    </v-btn>
                </v-btn-toggle>
            </div>

            <!-- Tabs for different food sources -->
            <v-tabs v-model="activeTab" density="comfortable" color="primary" grow class="mb-3">
                <v-tab value="search">Database</v-tab>
                <v-tab value="custom">My Foods</v-tab>
                <v-tab value="recent">Recent</v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
                <!-- Database Foods Tab -->
                <v-window-item value="search">
                    <div v-if="searchQuery && !isLoading" class="search-results">
                        <div v-if="searchResults.foods.length > 0">
                            <v-list lines="two">
                                <v-list-item
                                    v-for="food in searchResults.foods"
                                    :key="food.id"
                                    @click="selectFood(food)"
                                    class="food-item"
                                >
                                    <template #prepend>
                                        <v-avatar
                                            rounded
                                            size="48"
                                            class="mr-3"
                                            :color="
                                                food.foodType === 'ingredient'
                                                    ? 'success'
                                                    : 'primary'
                                            "
                                        >
                                            <v-img
                                                v-if="food.imageUrl"
                                                :src="food.imageUrl"
                                                :alt="food.name"
                                            />
                                            <v-icon
                                                v-else
                                                :color="
                                                    food.foodType === 'ingredient'
                                                        ? 'white'
                                                        : '#FFD700'
                                                "
                                            >
                                                {{
                                                    food.foodType === "ingredient"
                                                        ? "mdi-food-apple"
                                                        : "mdi-package-variant-closed"
                                                }}
                                            </v-icon>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-title>{{ food.name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ food.brand ? food.brand + " • " : ""
                                        }}{{ food.calories }} kcal per {{ food.servingSize
                                        }}{{ food.servingUnit }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </v-list>

                            <!-- Pagination -->
                            <div
                                class="d-flex justify-center my-4"
                                v-if="searchResults.totalPages > 1"
                            >
                                <v-pagination
                                    v-model="currentPage"
                                    :length="searchResults.totalPages"
                                    @update:model-value="changePage"
                                    :total-visible="$vuetify.display.xs ? 3 : 5"
                                    density="comfortable"
                                ></v-pagination>
                            </div>
                        </div>

                        <div v-else-if="hasSearched" class="text-center pa-4 text-medium-emphasis">
                            <v-icon icon="mdi-food-off" size="48" class="mb-2"></v-icon>
                            <div>No foods found matching "{{ searchQuery }}"</div>
                            <div class="text-caption mt-1 mb-4">Try a different search term</div>
                        </div>
                    </div>

                    <div v-else-if="!searchQuery" class="text-center pa-4 text-medium-emphasis">
                        <v-icon icon="mdi-magnify" size="48" class="mb-2"></v-icon>
                        <div>Search for foods in the database</div>
                        <div class="text-caption">Enter a food name to search</div>
                    </div>

                    <v-progress-circular
                        v-if="isLoading"
                        indeterminate
                        color="primary"
                        class="ma-4"
                        size="32"
                    ></v-progress-circular>
                </v-window-item>

                <!-- Custom Foods Tab -->
                <v-window-item value="custom">
                    <div v-if="customFoods.length > 0">
                        <v-list lines="two">
                            <v-list-item
                                v-for="food in filteredCustomFoods"
                                :key="food.id"
                                @click="selectFood(food)"
                                class="food-item"
                            >
                                <template #prepend>
                                    <v-avatar color="primary" rounded size="48" class="mr-3">
                                        <v-icon color="white">mdi-food-apple</v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title>{{ food.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ food.brand ? food.brand + " • " : ""
                                    }}{{ food.calories }} kcal per {{ food.servingSize
                                    }}{{ food.servingUnit }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </div>

                    <div v-else class="text-center pa-4 text-medium-emphasis">
                        <v-icon icon="mdi-food-apple-outline" size="48" class="mb-2"></v-icon>
                        <div>No custom foods yet</div>
                        <div class="text-caption mb-4">
                            Create your own foods to quickly add them to meals
                        </div>

                        <v-btn
                            variant="tonal"
                            color="primary"
                            prepend-icon="mdi-plus"
                            @click="goToCustomFood"
                        >
                            Create Custom Food
                        </v-btn>
                    </div>
                </v-window-item>

                <!-- Recent Foods Tab -->
                <v-window-item value="recent">
                    <div v-if="recentFoods.length > 0">
                        <v-list lines="two">
                            <v-list-item
                                v-for="food in recentFoods"
                                :key="food.id"
                                @click="selectFood(food)"
                                class="food-item"
                            >
                                <template #prepend>
                                    <v-avatar rounded size="40" class="mr-3">
                                        <v-img
                                            :src="
                                                food.imageUrl ||
                                                'https://placehold.co/40x40?text=Food'
                                            "
                                            :alt="food.name"
                                        />
                                    </v-avatar>
                                </template>

                                <v-list-item-title>{{ food.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ food.brand ? food.brand + " • " : ""
                                    }}{{ food.calories }} kcal per {{ food.servingSize
                                    }}{{ food.servingUnit }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </div>

                    <div v-else class="text-center pa-4 text-medium-emphasis">
                        <v-icon icon="mdi-history" size="48" class="mb-2"></v-icon>
                        <div>No recent foods</div>
                        <div class="text-caption">Foods you've added recently will appear here</div>
                    </div>
                </v-window-item>
            </v-window>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="$emit('close')">Cancel</v-btn>
        </v-card-actions>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import type { CustomFood } from "../../services/custom-foods";
import type { FoodItem } from "../../types/food";

import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
import { logger } from "../../logger/app-logger";
import { getUserCustomFoods } from "../../services/custom-foods";
import { combinedFoodApi } from "../../services/food-api/combined-api";
import { NutritionixApi } from "../../services/food-api/nutritionix-api";
import { getRecentFoods } from "../../services/recent-food-db";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores/global";

const { limitRecent = 30 } = defineProps<{
    limitRecent?: number;
    mealType: "breakfast" | "dinner" | "lunch" | "snack";
}>();

const emit = defineEmits<{
    close: [];
    select: [food: FoodItem];
}>();

const router = useRouter();
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const { isScanning, isSearching, scanBarcode } = useBarcodeScanner();

const activeTab = ref("search");
const searchQuery = ref("");
const isLoading = ref(false);
const hasSearched = ref(false);
const currentPage = ref(1);
const recentFoods = ref<FoodItem[]>([]);
const customFoods = ref<CustomFood[]>([]);

const searchResults = ref<{
    currentPage: number;
    foods: FoodItem[];
    totalCount: number;
    totalPages: number;
}>({
    currentPage: 1,
    foods: [],
    totalCount: 0,
    totalPages: 0,
});

const filteredCustomFoods = computed(() => {
    if (!searchQuery.value) {
        return customFoods.value;
    }

    const normalizedQuery = searchQuery.value.toLowerCase();
    return customFoods.value.filter(
        (food) =>
            food.name.toLowerCase().includes(normalizedQuery) ||
            food.brand?.toLowerCase().includes(normalizedQuery),
    );
});

onMounted(async () => {
    await Promise.all([loadRecentFoods(), loadCustomFoods()]);
});

function handleBarcodeScanner(): void {
    scanBarcode({
        onError(message) {
            globalStore.notifyError(message);
        },
        onFoodFound(food) {
            selectFood(food);
        },
        onNotFound(barcode) {
            globalStore.notifyError(`No food found with barcode: ${barcode}`);
        },
        userId: authStore.nonNullableUser.uid,
    });
}

async function loadCustomFoods(): Promise<void> {
    try {
        isLoading.value = true;
        customFoods.value = await getUserCustomFoods(authStore.nonNullableUser.uid);
    } catch (error) {
        logger.error(error, "FoodSearch");
    } finally {
        isLoading.value = false;
    }
}

async function loadRecentFoods(): Promise<void> {
    try {
        recentFoods.value = await getRecentFoods(authStore.nonNullableUser.uid, limitRecent);
    } catch (error) {
        logger.error(error, "FoodSearch");
    }
}

let searchTimeout: number | undefined;
function changePage(page: number): void {
    currentPage.value = page;
    performSearch();
}

function debounceSearch(): void {
    clearTimeout(searchTimeout);

    if (!searchQuery.value || searchQuery.value.length < 2) {
        searchResults.value.foods = [];
        return;
    }

    searchTimeout = globalThis.setTimeout(() => {
        performSearch();
    }, 500);
}

const foodTypeFilter = ref<"ingredients" | "products">("ingredients");

watch(foodTypeFilter, () => {
    currentPage.value = 1;
    searchResults.value = {
        currentPage: 1,
        foods: [],
        totalCount: 0,
        totalPages: 0,
    };
    if (searchQuery.value.length >= 2) {
        performSearch();
    }
});

function goToCustomFood(): void {
    router.push({ name: "CustomFood" });
    emit("close");
}

async function performSearch(): Promise<void> {
    if (!searchQuery.value || searchQuery.value.length < 2) return;

    try {
        isLoading.value = true;
        hasSearched.value = true;

        const nutritionixApi = new NutritionixApi();

        if (foodTypeFilter.value === "ingredients") {
            // For ingredients, use Nutritionix's natural language endpoint
            searchResults.value = await nutritionixApi.searchIngredients(
                searchQuery.value,
                currentPage.value,
                10,
            );
        } else {
            // For products, use the combined API (which includes OpenFoodFacts and others)
            searchResults.value = await combinedFoodApi.searchFoods(
                searchQuery.value,
                currentPage.value,
                10,
            );
        }
    } catch (error) {
        logger.error(error, "FoodSearch", { query: searchQuery.value });
    } finally {
        isLoading.value = false;
    }
}

function selectFood(food: FoodItem): void {
    emit("select", food);
}
</script>

<style scoped>
.food-item {
    transition: background-color 0.2s ease;
}

.food-item:hover {
    background-color: rgba(var(--v-theme-primary), 0.05);
    cursor: pointer;
}
</style>
