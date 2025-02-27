<template>
    <v-container fluid class="pa-4">
        <div class="d-flex align-center mb-4">
            <h1 class="text-h5">My Custom Foods</h1>
            <v-spacer></v-spacer>
            <v-btn color="primary" icon="mdi-plus" @click="openCustomFoodForm()" size="default" />
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="d-flex justify-center my-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <!-- Empty State -->
        <v-card
            v-else-if="customFoods.length === 0"
            class="pa-8 d-flex flex-column align-center text-center"
            flat
        >
            <v-icon icon="mdi-food-apple-outline" size="64" class="mb-4" color="primary"></v-icon>
            <div class="text-h6 mb-2">No Custom Foods Yet</div>
            <div class="text-body-2 text-medium-emphasis mb-6">
                Create your own custom foods to quickly add them to your meals
            </div>
            <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-plus"
                @click="openCustomFoodForm()"
                rounded="pill"
            >
                Create First Custom Food
            </v-btn>
        </v-card>

        <!-- Foods List -->
        <template v-else>
            <!-- Search Input -->
            <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search custom foods"
                variant="outlined"
                density="comfortable"
                hide-details
                class="mb-4"
                clearable
            ></v-text-field>

            <v-row>
                <v-col v-for="food in filteredFoods" :key="food.id" cols="12" sm="6" md="4" lg="3">
                    <v-card class="food-card h-100">
                        <v-card-item>
                            <template #prepend>
                                <v-avatar
                                    size="42"
                                    rounded
                                    :color="getRandomColor(food.id)"
                                    class="mr-3"
                                >
                                    <v-icon color="white" size="24">mdi-food-apple</v-icon>
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
                                    <div class="text-body-2 font-weight-bold">
                                        {{ food.protein }}g
                                    </div>
                                    <div class="text-caption">Protein</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-body-2 font-weight-bold">
                                        {{ food.carbs }}g
                                    </div>
                                    <div class="text-caption">Carbs</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-body-2 font-weight-bold">{{ food.fat }}g</div>
                                    <div class="text-caption">Fat</div>
                                </div>
                            </div>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                variant="text"
                                color="primary"
                                @click="editCustomFood(food)"
                                size="small"
                            >
                                Edit
                            </v-btn>
                            <v-btn
                                variant="text"
                                color="error"
                                @click="confirmDeleteFood(food)"
                                size="small"
                            >
                                Delete
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import type { CustomFood } from "../services/custom-foods";

import CustomFoodForm from "../components/calories/CustomFoodForm.vue";
import { useGlobalConfirm } from "../composables/useConfirmDialog";
import { useDialog } from "../composables/useDialog";
import { logger } from "../logger/app-logger";
import {
    createCustomFood,
    deleteCustomFood,
    getUserCustomFoods,
    updateCustomFood,
} from "../services/custom-foods";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const { openDialog } = useDialog();
const { openConfirm } = useGlobalConfirm();

const customFoods = ref<CustomFood[]>([]);
const isLoading = ref(false);
const searchQuery = ref("");

const filteredFoods = computed(function () {
    if (!searchQuery.value) return customFoods.value;

    const query = searchQuery.value.toLowerCase();
    return customFoods.value.filter(function (food) {
        return food.name.toLowerCase().includes(query) || food.brand?.toLowerCase().includes(query);
    });
});

onMounted(function () {
    void loadCustomFoods();
});

async function confirmDeleteFood(food: CustomFood): Promise<void> {
    const confirmed = await openConfirm({
        message: `Are you sure you want to delete "${food.name}"?`,
        title: "Delete Custom Food",
    });

    if (!confirmed) return;

    try {
        await deleteCustomFood(authStore.nonNullableUser.uid, food.id);
        await loadCustomFoods();
        globalStore.notify("Custom food deleted successfully");
    } catch (error) {
        logger.error(error, "PageCustomFoods", { foodId: food.id });
        globalStore.notifyError("Failed to delete custom food");
    }
}

function editCustomFood(food: CustomFood): void {
    openCustomFoodForm(food);
}

function getRandomColor(id: string): string {
    const colors = [
        "deep-purple",
        "indigo",
        "light-blue",
        "teal",
        "light-green",
        "amber",
        "deep-orange",
    ];
    const hash = id.split("").reduce(function (acc, char) {
        // eslint-disable-next-line no-bitwise
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % colors.length;
    return `${colors[index]}-lighten-1`;
}

async function loadCustomFoods(): Promise<void> {
    try {
        isLoading.value = true;
        customFoods.value = await getUserCustomFoods(authStore.nonNullableUser.uid);
    } catch (error) {
        logger.error(error, "PageCustomFoods");
        globalStore.notifyError("Failed to load custom foods");
    } finally {
        isLoading.value = false;
    }
}

function openCustomFoodForm(food?: CustomFood): void {
    openDialog(CustomFoodForm, {
        componentProps: {
            initialFood: food,
            async onSave(newFood: Omit<CustomFood, "id">) {
                const userId = authStore.nonNullableUser.uid;

                try {
                    if (food?.id) {
                        await updateCustomFood(userId, food.id, newFood);
                        globalStore.notify("Custom food updated successfully");
                    } else {
                        await createCustomFood(userId, newFood);
                        globalStore.notify("Custom food created successfully");
                    }

                    await loadCustomFoods();
                } catch (error) {
                    logger.error(error, "PageCustomFoods", { food: newFood });
                    globalStore.notifyError(
                        food?.id ? "Failed to update custom food" : "Failed to create custom food",
                    );
                }
            },
        },
        title: food ? "Edit Custom Food" : "Create Custom Food",
    });
}
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
