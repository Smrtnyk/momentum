import type { FoodItem, FoodSearchResult, NutritionixFood } from "../../types/food";

import { logger } from "../../logger/app-logger";

export class NutritionixApi {
    readonly name = "Nutritionix";

    private readonly API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;
    private readonly APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;

    async searchIngredients(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        try {
            if (!this.API_KEY || !this.APP_ID) {
                return {
                    currentPage: page,
                    foods: [],
                    totalCount: 0,
                    totalPages: 0,
                };
            }

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
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const foods: FoodItem[] = (data.foods ?? []).map((food: NutritionixFood) =>
                this.mapNutritionixFoodToFoodItem(food),
            );

            const startIndex = (page - 1) * pageSize;
            const paginatedFoods = foods.slice(startIndex, startIndex + pageSize);

            return {
                currentPage: page,
                foods: paginatedFoods,
                totalCount: foods.length,
                totalPages: Math.ceil(foods.length / pageSize),
            };
        } catch (error) {
            logger.error(error, "searchIngredients", { page, pageSize, query });
            return {
                currentPage: page,
                foods: [],
                totalCount: 0,
                totalPages: 0,
            };
        }
    }

    private mapNutritionixFoodToFoodItem(food: NutritionixFood): FoodItem {
        return {
            altMeasures: food.alt_measures ?? null,
            barcode: null,
            brand: food.brand_name ?? null,
            calories: food.nf_calories ?? 0,
            carbs: food.nf_total_carbohydrate ?? 0,
            fat: food.nf_total_fat ?? 0,
            foodType: "ingredient",
            fullNutrients: food.full_nutrients ?? null,
            id: `nx-${food.ndb_no ?? food.food_name}`,
            imageUrl: food.photo?.thumb ?? null,
            name: food.food_name,
            protein: food.nf_protein ?? 0,
            servingSize: food.serving_weight_grams ?? 100,
            // Standardized to grams
            servingUnit: "g",
            source: "Nutritionix",
        };
    }
}
