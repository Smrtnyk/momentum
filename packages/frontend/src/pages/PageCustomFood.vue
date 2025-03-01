<template>
    <v-container class="pa-2 mx-auto">
        <v-card class="px-4 py-4 rounded-lg mb-4">
            <div class="d-flex align-center">
                <h1 class="text-h5 text-white font-weight-bold">My Custom Foods</h1>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    icon="mdi-plus"
                    @click="openCustomFoodForm()"
                    size="default"
                />
            </div>
        </v-card>

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
                    <FoodCard :food="food" :color="getColorFromId(food.id)" icon="mdi-food-apple">
                        <template #actions>
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
                        </template>
                    </FoodCard>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import type { CustomFood } from "../services/custom-foods";

import CustomFoodForm from "../components/calories/CustomFoodForm.vue";
import FoodCard from "../components/calories/FoodCard.vue";
import { globalDialog } from "../composables/useDialog";
import { getColorFromId } from "../helpers/colors";
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
    const confirmed = await globalDialog.confirm({
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
    globalDialog.openDialog(
        CustomFoodForm,
        {
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
        {
            title: food ? "Edit Custom Food" : "Create Custom Food",
        },
    );
}
</script>
