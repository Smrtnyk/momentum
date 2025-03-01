<template>
    <v-container class="pa-2 mx-auto">
        <v-card class="px-4 py-4 rounded-lg mb-4">
            <div class="d-flex align-center">
                <h1 class="text-h5 text-white font-weight-bold">Recent Foods</h1>
            </div>
        </v-card>
        <!-- Loading State -->
        <div v-if="isLoading" class="d-flex justify-center my-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <!-- Empty State -->
        <v-card
            v-else-if="recentFoods.length === 0"
            class="pa-8 d-flex flex-column align-center text-center"
            flat
        >
            <v-icon icon="mdi-history" size="64" class="mb-4" color="primary"></v-icon>
            <div class="text-h6 mb-2">No Recent Foods</div>
            <div class="text-body-2 text-medium-emphasis mb-6">
                Foods you add to your meals will appear here for quick access
            </div>
            <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-food-apple"
                to="/calories"
                rounded="pill"
            >
                Log Food
            </v-btn>
        </v-card>

        <!-- Foods List -->
        <template v-else>
            <!-- Search Input -->
            <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search recent foods"
                variant="outlined"
                density="comfortable"
                hide-details
                class="mb-4"
                clearable
            ></v-text-field>

            <v-row>
                <v-col v-for="food in filteredFoods" :key="food.id" cols="12" sm="6" md="4" lg="3">
                    <FoodCard
                        :food="food"
                        :color="getColorFromId(food.id)"
                        :icon="getFoodIcon(food)"
                    >
                        <template #additional-info>
                            <div
                                v-if="food.source || food.provider"
                                class="mt-4 text-caption text-medium-emphasis"
                            >
                                <v-chip size="x-small" color="grey-lighten-3" class="mr-1">
                                    {{ food.source || food.provider }}
                                </v-chip>
                                <span v-if="getLastUsedDate(food)" class="ml-2">
                                    Last used: {{ getLastUsedDate(food) }}
                                </span>
                                <v-chip
                                    v-if="food.barcode"
                                    size="x-small"
                                    color="blue-grey-lighten-4"
                                    class="ml-1"
                                    prepend-icon="mdi-barcode"
                                >
                                    {{ formatBarcode(food.barcode) }}
                                </v-chip>
                            </div>
                        </template>

                        <template #actions>
                            <v-btn
                                variant="text"
                                color="error"
                                @click="confirmRemoveFood(food)"
                                size="small"
                            >
                                Remove
                            </v-btn>
                        </template>
                    </FoodCard>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import type { FoodItem } from "../types/food";

import FoodCard from "../components/calories/FoodCard.vue";
import { globalDialog } from "../composables/useDialog";
import { getColorFromId } from "../helpers/colors";
import { logger } from "../logger/app-logger";
import { getRecentFoods, removeRecentFood } from "../services/recent-food-db";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const authStore = useAuthStore();
const globalStore = useGlobalStore();

const recentFoods = ref<FoodItem[]>([]);
const isLoading = ref(false);
const searchQuery = ref("");
const hasBarcodeItems = ref(false);

const filteredFoods = computed(function () {
    if (!searchQuery.value) return recentFoods.value;

    const query = searchQuery.value.toLowerCase();
    return recentFoods.value.filter(function (food) {
        return (
            food.name.toLowerCase().includes(query) ||
            food.brand?.toLowerCase().includes(query) ||
            food.source?.toLowerCase().includes(query) ||
            food.provider?.toLowerCase().includes(query) ||
            food.barcode?.includes(query)
        );
    });
});

onMounted(async function () {
    await loadRecentFoods();
});

async function confirmRemoveFood(food: FoodItem): Promise<void> {
    const confirmed = await globalDialog.confirm({
        message: `Are you sure you want to remove "${food.name}" from recent foods?`,
        title: "Remove Recent Food",
    });

    if (!confirmed) return;

    try {
        globalStore.setLoading(true);
        await removeRecentFood(authStore.nonNullableUser.uid, food.id);
        await loadRecentFoods();
        globalStore.notify("Food removed from recent foods");
    } catch (error) {
        logger.error(error, "PageRecentFoods", { foodId: food.id });
        globalStore.notifyError("Failed to remove from recent foods");
    } finally {
        globalStore.setLoading(false);
    }
}

function formatBarcode(barcode: null | string): string {
    if (!barcode) return "";

    // Format long barcodes for display (e.g. 123456789012 -> 1234...9012)
    if (barcode.length > 10) {
        return `${barcode.slice(0, 4)}...${barcode.slice(Math.max(0, barcode.length - 4))}`;
    }

    return barcode;
}

function getFoodIcon(food: FoodItem): string {
    if (food.barcode) return "mdi-barcode";
    if (food.foodType === "product") return "mdi-package-variant-closed";
    if (food.source === "custom") return "mdi-food-fork-drink";
    return "mdi-food-apple";
}

function getLastUsedDate(food: FoodItem): string {
    const extendedFood = food as FoodItem & { lastUsed?: number };
    if (!extendedFood.lastUsed) return "";

    const date = new Date(extendedFood.lastUsed);
    return date.toLocaleDateString();
}

async function loadRecentFoods(): Promise<void> {
    try {
        isLoading.value = true;
        const userId = authStore.nonNullableUser.uid;
        recentFoods.value = await getRecentFoods(userId, 50);

        hasBarcodeItems.value = recentFoods.value.some((food) => Boolean(food.barcode));
    } catch (error) {
        logger.error(error, "PageRecentFoods");
        globalStore.notifyError("Failed to load recent foods");
    } finally {
        isLoading.value = false;
    }
}
</script>
