import type { FoodItem } from "../../types/health-metrics";
import type { FoodApiProvider, FoodSearchResult } from "./base-api";

import { logger } from "../../logger/app-logger";
import { NutritionixApi } from "./nutritionix-api";
import { OpenFoodFactsApi } from "./open-food-facts";

class CombinedFoodApi implements FoodApiProvider {
    name = "CombinedFoodApi";
    private readonly cache = new Map<string, { results: FoodSearchResult; timestamp: number }>();
    // 24 hours
    private readonly CACHE_TTL = 24 * 60 * 60 * 1000;
    private readonly providers: FoodApiProvider[];

    constructor() {
        this.providers = [new OpenFoodFactsApi(), new NutritionixApi()];
    }

    async getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
        for (const provider of this.providers) {
            if (provider.getFoodByBarcode) {
                try {
                    // eslint-disable-next-line no-await-in-loop -- we want to try provider by provider
                    const food = await provider.getFoodByBarcode(barcode);
                    if (food) {
                        return {
                            ...food,
                            provider: provider.name,
                        };
                    }
                } catch (error) {
                    logger.error(error, "CombinedFoodAPI", {
                        barcode,
                        provider: provider.name,
                    });
                }
            }
        }
        return null;
    }

    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        const cacheKey = `${query}|${page}|${pageSize}`;
        const now = Date.now();

        // Check cache first
        const cachedResult = this.cache.get(cacheKey);
        if (cachedResult && now - cachedResult.timestamp < this.CACHE_TTL) {
            return cachedResult.results;
        }

        try {
            const results = await Promise.allSettled(
                this.providers.map((provider) => provider.searchFoods(query, page, pageSize)),
            );

            const allFoods: FoodItem[] = [];
            let totalCount = 0;

            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    allFoods.push(
                        ...result.value.foods.map((food) => ({
                            ...food,
                            provider: this.providers[index].name,
                        })),
                    );
                    totalCount += result.value.totalCount;
                } else {
                    logger.error(result.reason, "CombinedFoodAPI", {
                        provider: this.providers[index].name,
                        query,
                    });
                }
            });

            const enhancedFoods = this.enhanceAndSortResults(allFoods, query);
            const paginatedFoods = enhancedFoods.slice(0, pageSize);

            const combinedResult: FoodSearchResult = {
                currentPage: page,
                foods: paginatedFoods,
                totalCount,
                totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
            };

            this.cache.set(cacheKey, {
                results: combinedResult,
                timestamp: now,
            });

            return combinedResult;
        } catch (error) {
            logger.error(error, "CombinedFoodAPI", { query });
            throw new Error("Failed to search for foods across providers");
        }
    }

    private enhanceAndSortResults(foods: FoodItem[], query: string): FoodItem[] {
        const uniqueFoods = this.removeDuplicates(foods);

        return uniqueFoods
            .map((food) => {
                const nameMatch = food.name.toLowerCase().includes(query.toLowerCase());
                const exactNameMatch = food.name.toLowerCase() === query.toLowerCase();
                const brandMatch = food.brand?.toLowerCase().includes(query.toLowerCase());
                const hasCompleteNutrition = food.calories > 0 && food.protein > 0;
                const hasImage = Boolean(food.imageUrl);

                // Calculate relevance score
                let relevance = 0;
                if (exactNameMatch) relevance += 20;
                if (nameMatch) relevance += 10;
                if (brandMatch) relevance += 5;
                if (hasCompleteNutrition) relevance += 3;
                if (hasImage) relevance += 2;

                return {
                    ...food,
                    relevance,
                };
            })
            .sort((a, b) => (b as any).relevance - (a as any).relevance);
    }

    private removeDuplicates(foods: FoodItem[]): FoodItem[] {
        const seen = new Set<string>();
        return foods.filter((food) => {
            const key = `${food.name}|${food.brand || ""}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
}

export const combinedFoodApi = new CombinedFoodApi();
