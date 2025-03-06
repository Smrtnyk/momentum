import type { FoodItem, FoodSearchResult, NutritionixFood } from "../../types/food";

import { AbstractFoodApi } from "./abstract-food-api";

export class NutritionixApi extends AbstractFoodApi {
    readonly name = "Nutritionix";
    readonly priority = 3;
    readonly supportsBarcode = false;

    private readonly API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;
    private readonly APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;

    async getIngredientDetails(query: string): Promise<FoodItem | null> {
        try {
            if (!this.API_KEY || !this.APP_ID) {
                return null;
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

            if (!data.foods || data.foods.length === 0) {
                return null;
            }

            return this.mapNutritionixFoodToFoodItem(data.foods[0]);
        } catch (error) {
            this.logError(error, "getIngredientDetails", { query });
            return null;
        }
    }

    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        try {
            if (!this.API_KEY || !this.APP_ID) {
                return {
                    currentPage: page,
                    foods: [],
                    totalCount: 0,
                    totalPages: 0,
                };
            }

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
                throw new Error(`API request failed with status ${searchResponse.status}`);
            }

            const searchData = await searchResponse.json();

            const allItems = [
                ...(searchData.branded ?? []).map((item: any) => ({
                    ...item,
                    foodType: "product",
                })),
                ...(searchData.common ?? []).map((item: any) => ({
                    ...item,
                    foodType: "ingredient",
                })),
            ];

            const startIndex = (page - 1) * pageSize;
            const paginatedItems = allItems.slice(startIndex, startIndex + pageSize);

            const foods: FoodItem[] = paginatedItems.map(function (item: any) {
                return {
                    barcode: null,
                    brand: item.brand_name ?? null,
                    calories: item.nf_calories ?? 0,
                    // Not available in search results -- FIXME recheck
                    carbs: 0,
                    // Not available in search results
                    fat: 0,
                    foodType: item.foodType,
                    id: `nx-${item.nix_item_id ?? item.food_name}`,
                    imageUrl: item.photo?.thumb ?? null,
                    name: item.food_name,
                    // Not available in search results
                    protein: 0,
                    servingSize: item.serving_qty ?? 100,
                    // Default to grams
                    servingUnit: "g",
                    source: "Nutritionix",
                };
            });

            return {
                currentPage: page,
                foods,
                totalCount: allItems.length,
                totalPages: Math.ceil(allItems.length / pageSize),
            };
        } catch (error) {
            this.logError(error, "searchFoods", { page, pageSize, query });
            return {
                currentPage: page,
                foods: [],
                totalCount: 0,
                totalPages: 0,
            };
        }
    }

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
            this.logError(error, "searchIngredients", { page, pageSize, query });
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
