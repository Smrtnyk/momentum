import type { FoodItem } from "../../types/health-metrics";
import type { FoodApiProvider, FoodSearchResult } from "./base-api";

import { logger } from "../../logger/app-logger";

export class NutritionixApi implements FoodApiProvider {
    name = "Nutritionix";
    private readonly API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;
    private readonly APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;

    /**
     * Get detailed nutrition for an ingredient using natural language
     */
    async getIngredientDetails(query: string): Promise<FoodItem | null> {
        try {
            const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
                body: JSON.stringify({ query }),
                headers: {
                    "Content-Type": "application/json",
                    "x-app-id": this.APP_ID,
                    "x-app-key": this.API_KEY,
                },
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`Nutritionix API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (!data.foods || data.foods.length === 0) {
                return null;
            }

            const food = data.foods[0];

            return {
                brand: food.brand_name,
                calories: food.nf_calories || 0,
                carbs: food.nf_total_carbohydrate || 0,
                fat: food.nf_total_fat || 0,
                foodType: "ingredient",
                id: `nx-${food.ndb_no || food.food_name}`,
                imageUrl: food.photo?.thumb || null,
                name: food.food_name,
                protein: food.nf_protein || 0,
                // Convert everything to grams
                servingSize: food.serving_weight_grams || 100,
                servingUnit: "g",
                source: "Nutritionix",
            };
        } catch (error) {
            logger.error(error, "NutritionixAPI.getIngredientDetails", { query });
            return null;
        }
    }

    /**
     * Search for foods with category filtering
     */
    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        try {
            const searchResponse = await fetch(
                `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`,
                {
                    headers: {
                        "x-app-id": this.APP_ID,
                        "x-app-key": this.API_KEY,
                    },
                },
            );

            if (!searchResponse.ok) {
                throw new Error(
                    `Nutritionix API request failed with status ${searchResponse.status}`,
                );
            }

            const searchData = await searchResponse.json();

            const allItems = [
                ...(searchData.branded || []).map((item: any) => ({
                    ...item,
                    foodType: "product",
                })),
                ...(searchData.common || []).map((item: any) => ({
                    ...item,
                    foodType: "ingredient",
                })),
            ];

            const startIndex = (page - 1) * pageSize;
            const paginatedItems = allItems.slice(startIndex, startIndex + pageSize);

            const foods: FoodItem[] = paginatedItems.map((food: any) => ({
                brand: food.brand_name,
                calories: food.nf_calories || 0,
                carbs: food.nf_total_carbohydrate || 0,
                fat: food.nf_total_fat || 0,
                foodType: "ingredient",
                id: `nx-${food.ndb_no || food.food_name}`,
                imageUrl: food.photo?.thumb || null,
                name: food.food_name,
                protein: food.nf_protein || 0,
                // Convert everything to grams
                servingSize: food.serving_weight_grams || 100,
                servingUnit: "g",
                source: "Nutritionix",
            }));

            return {
                currentPage: page,
                foods,
                totalCount: allItems.length,
                totalPages: Math.ceil(allItems.length / pageSize),
            };
        } catch (error) {
            logger.error(error, "NutritionixAPI", { page, pageSize, query });
            return { currentPage: page, foods: [], totalCount: 0, totalPages: 0 };
        }
    }

    /**
     * Search for ingredients only - uses the natural endpoint which is better for this
     * This endpoint directly gives detailed nutrition information
     */
    async searchIngredients(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        try {
            const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
                body: JSON.stringify({ query }),
                headers: {
                    "Content-Type": "application/json",
                    "x-app-id": this.APP_ID,
                    "x-app-key": this.API_KEY,
                },
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`Nutritionix API request failed with status ${response.status}`);
            }

            const data = await response.json();

            const foods: FoodItem[] = (data.foods || []).map((food: any) => {
                // Always convert to grams for consistency
                return {
                    brand: food.brand_name,
                    calories: food.nf_calories || 0,
                    carbs: food.nf_total_carbohydrate || 0,
                    fat: food.nf_total_fat || 0,
                    foodType: "ingredient",
                    id: `nx-${food.ndb_no || food.food_name}`,
                    imageUrl: food.photo?.thumb || null,
                    name: food.food_name,
                    protein: food.nf_protein || 0,
                    // Convert everything to grams
                    servingSize: food.serving_weight_grams || 100,
                    servingUnit: "g",
                    source: "Nutritionix",
                };
            });

            const startIndex = (page - 1) * pageSize;
            const paginatedFoods = foods.slice(startIndex, startIndex + pageSize);

            return {
                currentPage: page,
                foods: paginatedFoods,
                totalCount: foods.length,
                totalPages: Math.ceil(foods.length / pageSize),
            };
        } catch (error) {
            logger.error(error, "NutritionixAPI.searchIngredients", { page, pageSize, query });
            return { currentPage: page, foods: [], totalCount: 0, totalPages: 0 };
        }
    }
}
