import { useLocalStorage } from "@vueuse/core";
import { Dexie } from "dexie";
import { intersection } from "es-toolkit";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Exercise } from "../types/exercise";

import { ONE_DAY } from "../helpers/date-utils";
import { logger } from "../logger/app-logger";
import { fetchExercisesFromAPI } from "../services/exercise";

class ExerciseDatabase extends Dexie {
    exercises: Dexie.Table<Exercise, string>;

    constructor() {
        super("ExerciseDatabase");
        this.version(1).stores({
            exercises: "id, name, level, category, equipment, *primaryMuscles, *secondaryMuscles",
        });
        this.exercises = this.table("exercises");
    }
}

const MATCH_THRESHOLD_PERCENTAGE = 0.7;

const LEVEL_COLORS = {
    advanced: "red",
    beginner: "green",
    default: "grey",
    intermediate: "orange",
} as const;

const LEVEL_ORDER = {
    advanced: 2,
    beginner: 0,
    intermediate: 1,
} as const;

const db = new ExerciseDatabase();
const STORAGE_KEY_PREFIX = "exercise-filters-";

export const useExerciseStore = defineStore("exercises", () => {
    const exercises = ref<Exercise[]>([]);
    const isLoading = ref(false);
    const error = ref<null | string>(null);
    const lastUpdated = ref<null | number>(null);

    const searchQuery = useLocalStorage(`${STORAGE_KEY_PREFIX}search`, "");
    const selectedMuscles = useLocalStorage<string[]>(`${STORAGE_KEY_PREFIX}muscles`, []);
    const selectedEquipment = useLocalStorage<string[]>(`${STORAGE_KEY_PREFIX}equipment`, []);
    const selectedLevel = useLocalStorage(`${STORAGE_KEY_PREFIX}level`, "");
    const selectedCategories = useLocalStorage<string[]>(`${STORAGE_KEY_PREFIX}categories`, []);
    const sortBy = useLocalStorage(`${STORAGE_KEY_PREFIX}sort`, "name");
    const page = useLocalStorage(`${STORAGE_KEY_PREFIX}page`, 1);
    const itemsPerPage = ref(20);

    const exerciseCache = ref<Record<string, Exercise | null>>({});
    const pendingLookups = ref<Set<string>>(new Set());
    const exerciseLookupError = ref<Error | null>(null);

    const muscleGroups = computed(function (): string[] {
        if (!exercises.value || exercises.value.length === 0) return [];

        const muscles = new Set<string>();

        for (const exercise of exercises.value) {
            for (const muscle of exercise.primaryMuscles) {
                muscles.add(muscle);
            }

            for (const muscle of exercise.secondaryMuscles) {
                muscles.add(muscle);
            }
        }

        return Array.from(muscles).sort();
    });

    const equipmentTypes = computed(function (): string[] {
        if (!exercises.value || exercises.value.length === 0) return [];

        const equipment = new Set<string>();

        for (const exercise of exercises.value) {
            if (exercise.equipment) {
                equipment.add(exercise.equipment);
            }
        }

        return Array.from(equipment).sort();
    });

    const levels = computed(function (): string[] {
        if (!exercises.value || exercises.value.length === 0) return [];

        const levelsSet = new Set<string>();

        for (const exercise of exercises.value) {
            if (exercise.level) {
                levelsSet.add(exercise.level);
            }
        }

        return Array.from(levelsSet).sort();
    });

    const categories = computed(function (): string[] {
        if (!exercises.value || exercises.value.length === 0) return [];

        const categoriesSet = new Set<string>();

        for (const exercise of exercises.value) {
            if (exercise.category) {
                categoriesSet.add(exercise.category);
            }
        }

        return Array.from(categoriesSet).sort();
    });

    function matchesSearchQuery(exercise: Exercise, query: string): boolean {
        if (!query) return true;

        const queryLower = query.toLowerCase();
        const nameLower = exercise.name.toLowerCase();

        if (isDirectMatch(nameLower, queryLower)) {
            return true;
        }

        const queryTerms = queryLower.split(/\s+/).filter(Boolean);
        if (queryTerms.length === 0) return true;

        if (isSequentialTermsMatch(nameLower, queryTerms)) {
            return true;
        }

        if (isOrderedTermsMatch(nameLower, queryTerms)) {
            return true;
        }

        if (isAllTermsMatch(nameLower, queryTerms)) {
            return true;
        }

        if (isMuscleMatch(exercise.primaryMuscles, queryLower)) {
            return true;
        }

        return isPartialMatch(nameLower, queryTerms, exercise.primaryMuscles);
    }

    function includesAnyMuscle(exercise: Exercise, muscleList: string[]): boolean {
        const allMuscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles];
        return intersection(allMuscles, muscleList).length > 0;
    }

    const filteredExercises = computed(function (): Exercise[] {
        if (!exercises.value || exercises.value.length === 0) return [];

        let result = [...exercises.value];

        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            result = result.filter((exercise) => matchesSearchQuery(exercise, query));
        }

        if (selectedMuscles.value.length > 0) {
            result = result.filter((exercise) =>
                includesAnyMuscle(exercise, selectedMuscles.value),
            );
        }

        if (selectedEquipment.value.length > 0) {
            result = result.filter(function (exercise) {
                return selectedEquipment.value.includes(exercise.equipment ?? "");
            });
        }

        if (selectedLevel.value) {
            result = result.filter(function (exercise) {
                return exercise.level === selectedLevel.value;
            });
        }

        if (selectedCategories.value.length > 0) {
            result = result.filter(function (exercise) {
                return selectedCategories.value.includes(exercise.category);
            });
        }

        const sortOrder = sortBy.value.startsWith("-") ? -1 : 1;
        const sortField = sortBy.value.replace(/^-/, "");

        result.sort(function (a, b) {
            if (sortField === "name") {
                return a.name.localeCompare(b.name) * sortOrder;
            } else if (sortField === "level") {
                const levelA = LEVEL_ORDER[a.level as keyof typeof LEVEL_ORDER] || 0;
                const levelB = LEVEL_ORDER[b.level as keyof typeof LEVEL_ORDER] || 0;
                return (levelA - levelB) * sortOrder;
            }
            return a.name.localeCompare(b.name) * sortOrder;
        });

        return result;
    });

    const totalPages = computed(function (): number {
        return Math.ceil(filteredExercises.value.length / itemsPerPage.value);
    });

    const paginatedExercises = computed(function (): Exercise[] {
        const end = page.value * itemsPerPage.value;
        return filteredExercises.value.slice(0, end);
    });

    const activeFiltersCount = computed(function (): number {
        let count = 0;
        if (selectedMuscles.value.length > 0) count++;
        if (selectedEquipment.value.length > 0) count++;
        if (selectedLevel.value) count++;
        if (selectedCategories.value.length > 0) count++;
        return count;
    });

    function isCacheValid(): boolean {
        const lastUpdatedTime = localStorage.getItem("exercises-last-updated");
        if (!lastUpdatedTime) return false;

        const elapsed = Date.now() - Number.parseInt(lastUpdatedTime);
        lastUpdated.value = Number.parseInt(lastUpdatedTime);
        return elapsed < ONE_DAY;
    }

    async function storeExercisesInDB(exercisesData: Exercise[]): Promise<void> {
        await db.transaction("rw", db.exercises, async () => {
            await db.exercises.clear();
            await db.exercises.bulkAdd(exercisesData);
            const now = Date.now();
            localStorage.setItem("exercises-last-updated", now.toString());
            lastUpdated.value = now;
        });
    }

    async function loadAllExercises(): Promise<void> {
        isLoading.value = true;
        error.value = null;

        try {
            if (isCacheValid()) {
                const count = await db.exercises.count();
                if (count > 0) {
                    exercises.value = await db.exercises.toArray();
                    isLoading.value = false;
                    return;
                }
            }

            const fetchedExercises = await fetchExercisesFromAPI();
            exercises.value = fetchedExercises;
            await storeExercisesInDB(fetchedExercises);
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Failed to load exercises";

            try {
                const cachedExercises = await db.exercises.toArray();
                if (cachedExercises.length > 0) {
                    exercises.value = cachedExercises;
                }
            } catch (cacheErr) {
                logger.error("Error loading from cache:", "ExerciseStore", cacheErr);
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function refreshExercises(): Promise<void> {
        isLoading.value = true;
        error.value = null;

        try {
            const fetchedExercises = await fetchExercisesFromAPI();
            exercises.value = fetchedExercises;
            await storeExercisesInDB(fetchedExercises);
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Failed to refresh exercises";
        } finally {
            isLoading.value = false;
        }
    }

    async function getExerciseById(id: string): Promise<Exercise> {
        if (exerciseCache.value[id]) {
            return exerciseCache.value[id] as Exercise;
        }

        const exerciseMemory = exercises.value.find((ex) => ex.id === id);
        if (exerciseMemory) {
            exerciseCache.value[id] = exerciseMemory;
            return exerciseMemory;
        }

        try {
            const exerciseFromDb = await db.exercises.get(id);
            if (exerciseFromDb) {
                exerciseCache.value[id] = exerciseFromDb;
                return exerciseFromDb;
            }
        } catch (err) {
            logger.error(`Error fetching exercise ${id} from DB:`, "ExerciseStore", err);
        }

        pendingLookups.value.add(id);

        try {
            await refreshExercises();

            const finalExercise = exercises.value.find((ex) => ex.id === id);

            if (!finalExercise) {
                throw new Error(`Failed to get exercise with id ${id}`);
            }

            exerciseCache.value[id] = finalExercise;
            pendingLookups.value.delete(id);
            return finalExercise;
        } catch (err) {
            pendingLookups.value.delete(id);
            exerciseLookupError.value = err instanceof Error ? err : new Error(String(err));
            throw err;
        }
    }

    async function getExerciseName(id: string): Promise<string> {
        const exercise = await getExerciseById(id);
        return exercise.name;
    }

    async function getExercisesByIds(ids: string[]): Promise<Record<string, Exercise>> {
        const uniqueIds = [...new Set(ids)];
        const result: Record<string, Exercise> = {};

        await Promise.all(
            uniqueIds.map(async (id) => {
                result[id] = await getExerciseById(id);
            }),
        );

        return result;
    }

    function resetFilters(): void {
        searchQuery.value = "";
        selectedMuscles.value = [];
        selectedEquipment.value = [];
        selectedLevel.value = "";
        selectedCategories.value = [];
        sortBy.value = "name";
        page.value = 1;
    }

    function filterExercises(): void {
        page.value = 1;
    }

    function loadMore(): void {
        if (page.value < totalPages.value) {
            page.value++;
        }
    }

    function searchExercises(query: string): Exercise[] {
        if (!query) return exercises.value;

        const queryLower = query.toLowerCase();
        return exercises.value.filter((exercise) => matchesSearchQuery(exercise, queryLower));
    }

    return {
        activeFiltersCount,
        categories,
        equipmentTypes,
        error,
        exerciseCache,
        exerciseLookupError,
        exercises,
        filteredExercises,
        filterExercises,
        getExerciseById,
        getExerciseName,
        getExercisesByIds,
        getLevelColor,
        isLoading,
        itemsPerPage,
        lastUpdated,
        levels,
        loadAllExercises,
        loadMore,
        muscleGroups,
        page,
        paginatedExercises,
        pendingLookups,
        resetFilters,
        searchExercises,
        searchQuery,
        selectedCategories,
        selectedEquipment,
        selectedLevel,
        selectedMuscles,
        sortBy,
        totalPages,
    };
});

function getLevelColor(level: string): string {
    return LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.default;
}

function isAllTermsMatch(name: string, terms: string[]): boolean {
    return terms.every((term) => name.includes(term));
}

function isDirectMatch(name: string, query: string): boolean {
    return name.includes(query);
}

function isMuscleMatch(muscles: string[], query: string): boolean {
    return muscles.some((muscle) => muscle.toLowerCase().includes(query));
}

function isOrderedTermsMatch(name: string, terms: string[]): boolean {
    if (terms.length <= 1) return false;

    const words = name.split(/\s+/);
    let termIndex = 0;

    for (const word of words) {
        if (word.includes(terms[termIndex])) {
            termIndex++;
            if (termIndex >= terms.length) {
                return true;
            }
        }
    }

    return false;
}

function isPartialMatch(name: string, terms: string[], muscles: string[]): boolean {
    if (terms.length <= 1) return false;

    const matchThreshold = Math.ceil(terms.length * MATCH_THRESHOLD_PERCENTAGE);
    let matchCount = 0;

    for (const term of terms) {
        if (name.includes(term)) {
            matchCount++;
            continue;
        }

        if (isMuscleMatch(muscles, term)) {
            matchCount++;
        }
    }

    return matchCount >= matchThreshold;
}

function isSequentialTermsMatch(name: string, terms: string[]): boolean {
    if (terms.length <= 1) return false;

    let position = 0;

    for (const term of terms) {
        const foundPos = name.indexOf(term, position);
        if (foundPos === -1) return false;
        position = foundPos + term.length;
    }

    return true;
}
