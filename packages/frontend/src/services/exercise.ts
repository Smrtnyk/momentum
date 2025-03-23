import type { Exercise } from "../types/exercise";

import { logger } from "../logger/app-logger";

const EXERCISES_API_URL = "/exercises/exercises.json";

/**
 * Fetches all exercises from the API
 */
export async function fetchExercisesFromAPI(): Promise<Exercise[]> {
    try {
        const response = await fetch(EXERCISES_API_URL, {
            cache: "no-cache",
            headers: {
                "Cache-Control": "no-cache",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch exercises: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        logger.error("API error fetching exercises:", "ExerciseService", error);
        throw error;
    }
}
