<template>
    <div class="exercise-library">
        <!-- Main content area -->
        <v-container fluid class="pa-0">
            <!-- Header with title and filter/sort buttons -->
            <v-app-bar flat density="comfortable" color="background" class="sticky-header">
                <v-app-bar-title class="text-h6">Exercise Library</v-app-bar-title>

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
                    label="Search exercises"
                    density="comfortable"
                    variant="outlined"
                    hide-details
                    clearable
                ></v-text-field>
            </v-container>

            <!-- Loading state -->
            <v-fade-transition>
                <div v-if="isLoading" class="text-center pa-8">
                    <v-progress-circular
                        indeterminate
                        color="primary"
                        size="56"
                    ></v-progress-circular>
                    <div class="mt-4 text-body-1">Loading exercises...</div>
                </div>
            </v-fade-transition>

            <!-- Empty state -->
            <v-fade-transition>
                <div v-if="!isLoading && filteredExercises.length === 0" class="text-center pa-8">
                    <v-icon icon="mdi-dumbbell-off" size="56" color="grey"></v-icon>
                    <div class="mt-4 text-h6">No exercises found</div>
                    <div class="text-body-2 text-grey mb-4">
                        Try adjusting your filters or search query
                    </div>
                    <v-btn color="primary" variant="tonal" @click="resetFilters">
                        Reset filters
                    </v-btn>
                </div>
            </v-fade-transition>

            <!-- Exercise list -->
            <div v-if="!isLoading && filteredExercises.length > 0" class="exercise-list">
                <v-container class="pa-2">
                    <!-- Results count -->
                    <div class="text-body-2 text-grey mb-2">
                        {{ filteredExercises.length }} exercises found
                    </div>

                    <!-- Exercise cards -->
                    <div class="exercise-grid">
                        <v-card
                            v-for="exercise in paginatedExercises"
                            :key="exercise.id"
                            @click="showExerciseDetails(exercise)"
                            class="exercise-card mb-3"
                            elevation="1"
                            variant="elevated"
                        >
                            <div class="d-flex">
                                <!-- Exercise details -->
                                <div class="d-flex flex-column flex-grow-1 pa-3">
                                    <div class="d-flex align-center mb-1">
                                        <div class="exercise-title">{{ exercise.name }}</div>
                                    </div>

                                    <div class="d-flex flex-wrap">
                                        <v-chip
                                            size="x-small"
                                            :color="getLevelColor(exercise.level)"
                                            class="mr-1 mb-1 text-capitalize"
                                            variant="tonal"
                                            density="comfortable"
                                        >
                                            {{ exercise.level }}
                                        </v-chip>

                                        <v-chip
                                            size="x-small"
                                            color="primary"
                                            class="mr-1 mb-1 text-capitalize"
                                            variant="tonal"
                                            density="comfortable"
                                        >
                                            {{ exercise.category }}
                                        </v-chip>
                                    </div>

                                    <div class="d-flex text-caption text-grey mt-auto">
                                        <div class="d-flex align-center">
                                            <v-icon
                                                size="14"
                                                icon="mdi-dumbbell"
                                                class="mr-1"
                                            ></v-icon>
                                            <span class="text-capitalize">{{
                                                exercise.equipment || "No Equipment"
                                            }}</span>
                                        </div>

                                        <v-divider vertical class="mx-2"></v-divider>

                                        <div class="d-flex align-center">
                                            <v-icon
                                                size="14"
                                                icon="mdi-target"
                                                class="mr-1"
                                            ></v-icon>
                                            <span class="text-capitalize">
                                                {{
                                                    exercise.primaryMuscles.length > 0
                                                        ? exercise.primaryMuscles[0]
                                                        : "Various"
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <v-icon class="align-self-center mr-2 text-grey"
                                    >mdi-chevron-right</v-icon
                                >
                            </div>
                        </v-card>
                    </div>

                    <!-- Load more button -->
                    <div v-if="page < totalPages" class="text-center my-4">
                        <v-btn
                            color="primary"
                            variant="tonal"
                            block
                            @click="loadMoreItems"
                            :loading="loadingMore"
                        >
                            Load More
                        </v-btn>
                    </div>
                </v-container>
            </div>
        </v-container>

        <!-- Filters drawer (slides up from bottom on mobile) -->
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
                        <div class="text-subtitle-1 font-weight-bold mb-3">Muscle Groups</div>
                        <v-chip-group
                            v-model="selectedMuscles"
                            class="d-flex flex-wrap"
                            multiple
                            column
                        >
                            <v-chip
                                v-for="muscle in muscleGroups"
                                :key="muscle"
                                :value="muscle"
                                filter
                                variant="outlined"
                                class="text-capitalize ma-1"
                            >
                                {{ muscle }}
                            </v-chip>
                        </v-chip-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Equipment</div>
                        <v-chip-group
                            v-model="selectedEquipment"
                            class="d-flex flex-wrap"
                            multiple
                            column
                        >
                            <v-chip
                                v-for="item in equipmentTypes"
                                :key="item"
                                :value="item"
                                filter
                                variant="outlined"
                                class="text-capitalize ma-1"
                            >
                                {{ item === null ? "None" : item }}
                            </v-chip>
                        </v-chip-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Level</div>
                        <v-radio-group v-model="selectedLevel" class="filter-radio-group">
                            <v-radio label="All Levels" value=""></v-radio>
                            <v-radio
                                v-for="level in levels"
                                :key="level"
                                :label="level"
                                :value="level"
                                class="text-capitalize"
                            ></v-radio>
                        </v-radio-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Category</div>
                        <v-chip-group
                            v-model="selectedCategories"
                            class="d-flex flex-wrap"
                            multiple
                            column
                        >
                            <v-chip
                                v-for="category in categories"
                                :key="category"
                                :value="category"
                                filter
                                variant="outlined"
                                class="text-capitalize ma-1"
                            >
                                {{ category }}
                            </v-chip>
                        </v-chip-group>
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
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Sort Exercises
                </v-card-title>
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

        <!-- Exercise Detail Bottom Sheet -->
        <v-bottom-sheet v-model="showDialog" fullscreen scrollable>
            <v-card v-if="selectedExercise">
                <v-toolbar color="surface">
                    <v-btn icon variant="text" @click="showDialog = false">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ selectedExercise.name }}</v-toolbar-title>
                </v-toolbar>

                <v-card-text class="pa-0">
                    <div class="pa-4">
                        <!-- Exercise meta information -->
                        <div class="d-flex flex-wrap">
                            <v-chip
                                :color="getLevelColor(selectedExercise.level)"
                                class="ma-1 text-capitalize"
                                variant="tonal"
                            >
                                {{ selectedExercise.level }}
                            </v-chip>

                            <v-chip color="primary" class="ma-1 text-capitalize" variant="tonal">
                                {{ selectedExercise.category }}
                            </v-chip>

                            <v-chip
                                v-if="selectedExercise.mechanic"
                                color="secondary"
                                class="ma-1 text-capitalize"
                                variant="tonal"
                            >
                                {{ selectedExercise.mechanic }}
                            </v-chip>

                            <v-chip
                                v-if="selectedExercise.force"
                                color="info"
                                class="ma-1 text-capitalize"
                                variant="tonal"
                            >
                                {{ selectedExercise.force }} force
                            </v-chip>

                            <v-chip
                                v-if="selectedExercise.equipment"
                                color="grey-lighten-1"
                                class="ma-1 text-capitalize"
                                variant="tonal"
                            >
                                {{ selectedExercise.equipment }}
                            </v-chip>
                        </div>

                        <!-- Muscle groups -->
                        <v-row class="mt-4">
                            <v-col cols="12">
                                <h3 class="text-subtitle-1 font-weight-bold mb-2">
                                    Primary Muscles
                                </h3>
                                <div class="d-flex flex-wrap">
                                    <v-chip
                                        v-for="muscle in selectedExercise.primaryMuscles"
                                        :key="`primary-${muscle}`"
                                        color="red-lighten-3"
                                        size="small"
                                        class="ma-1 text-capitalize"
                                        variant="tonal"
                                    >
                                        {{ muscle }}
                                    </v-chip>
                                </div>
                            </v-col>

                            <v-col cols="12" v-if="selectedExercise.secondaryMuscles.length > 0">
                                <h3 class="text-subtitle-1 font-weight-bold mb-2">
                                    Secondary Muscles
                                </h3>
                                <div class="d-flex flex-wrap">
                                    <v-chip
                                        v-for="muscle in selectedExercise.secondaryMuscles"
                                        :key="`secondary-${muscle}`"
                                        color="blue-lighten-3"
                                        size="small"
                                        class="ma-1 text-capitalize"
                                        variant="tonal"
                                    >
                                        {{ muscle }}
                                    </v-chip>
                                </div>
                            </v-col>
                        </v-row>

                        <h3 class="text-subtitle-1 font-weight-bold mt-4">Instructions</h3>
                        <v-list>
                            <v-list-item
                                v-for="(instruction, index) in selectedExercise.instructions"
                                :key="index"
                                class="pl-0"
                            >
                                <template v-slot:prepend>
                                    <v-avatar color="primary" size="24" class="mr-3">
                                        <span class="text-caption">{{ index + 1 }}</span>
                                    </v-avatar>
                                </template>
                                <v-list-item class="text-body-2">
                                    {{ instruction }}
                                </v-list-item>
                            </v-list-item>
                        </v-list>
                    </div>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>

        <v-btn
            v-show="showBackToTop"
            icon
            color="primary"
            size="large"
            class="back-to-top-btn"
            @click="scrollToTop"
        >
            <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref } from "vue";

import type { Exercise } from "../types/exercise";

import { useExerciseStore } from "../stores/exercises";

const SCROLL_THRESHOLD = 300;

const exerciseStore = useExerciseStore();

const {
    activeFiltersCount,
    categories,
    equipmentTypes,
    filteredExercises,
    isLoading,
    levels,
    muscleGroups,
    page,
    paginatedExercises,
    searchQuery,
    selectedCategories,
    selectedEquipment,
    selectedLevel,
    selectedMuscles,
    sortBy,
    totalPages,
} = storeToRefs(exerciseStore);

const { filterExercises, getLevelColor, loadAllExercises, loadMore, resetFilters } = exerciseStore;

const showFilterDrawer = ref(false);
const showSortMenu = ref(false);
const showDialog = ref(false);
const showBackToTop = ref(false);
const loadingMore = ref(false);
const selectedExercise = ref<Exercise | null>(null);

const sortOptions = [
    { title: "Name (A-Z)", value: "name" },
    { title: "Name (Z-A)", value: "-name" },
    { title: "Level (Beginner first)", value: "level" },
    { title: "Level (Advanced first)", value: "-level" },
];

function applyFilters(): void {
    showFilterDrawer.value = false;
    filterExercises();
}

function handleScroll(): void {
    showBackToTop.value = window.scrollY > SCROLL_THRESHOLD;
}

function loadMoreItems(): void {
    if (page.value < totalPages.value) {
        loadingMore.value = true;
        setTimeout(() => {
            loadMore();
            loadingMore.value = false;
        }, 300);
    }
}

function scrollToTop(): void {
    window.scrollTo({ behavior: "smooth", top: 0 });
}

function selectSortOption(option: string): void {
    sortBy.value = option;
    showSortMenu.value = false;
    filterExercises();
}

function showExerciseDetails(exercise: Exercise): void {
    selectedExercise.value = exercise;
    showDialog.value = true;
}

onMounted(() => {
    loadAllExercises();
    window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.exercise-library {
    position: relative;
    min-height: 100vh;
}

.sticky-header {
    position: sticky;
    top: 0;
    z-index: 3;
}

.exercise-card {
    border-radius: 8px;
    overflow: hidden;
}

.exercise-title {
    font-weight: 500;
    font-size: 0.95rem;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 2;
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

.back-to-top-btn {
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 2;
}

.v-chip {
    height: 32px;
}
</style>
