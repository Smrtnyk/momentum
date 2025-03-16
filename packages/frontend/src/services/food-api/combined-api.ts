import type { FoodItem, FoodSearchResult } from "../../types/food";

import { ONE_DAY } from "../../helpers/date-utils";
import { logger } from "../../logger/app-logger";
import { apiRegistry } from "./api-registry";

export class CombinedFoodApi {
    readonly name = "CombinedFoodApi";

    private readonly cache = new Map<
        string,
        {
            results: FoodSearchResult;
            timestamp: number;
        }
    >();
    private readonly CACHE_TTL = ONE_DAY;

    async getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
        const barcodeProviders = apiRegistry.getBarcodeProviders();

        for (const provider of barcodeProviders) {
            try {
                /* eslint-disable-next-line no-await-in-loop -- we want to do 1 by 1 until we have it
                 so we have to do it sequentially here */
                const food = await provider.getFoodByBarcode(barcode);
                if (food && food.calories > 0) {
                    return {
                        ...food,
                        provider: provider.name,
                    };
                }
            } catch (error) {
                logger.error(error, "CombinedFoodAPI.barcode", {
                    barcode,
                    provider: provider.name,
                });
            }
        }

        return null;
    }

    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        const cacheKey = `${query}|${page}|${pageSize}`;
        const now = Date.now();

        const cachedResult = this.cache.get(cacheKey);
        if (cachedResult && now - cachedResult.timestamp < this.CACHE_TTL) {
            return cachedResult.results;
        }

        try {
            const providers = apiRegistry
                .getSearchProviders()
                .filter(({ name }) => name !== this.name);
            const results = await Promise.allSettled(
                providers.map((provider) => provider.searchFoods(query, page, pageSize)),
            );

            const allFoods: FoodItem[] = [];
            let totalCount = 0;

            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    const provider = providers[index];
                    allFoods.push(
                        ...result.value.foods.map((food) => ({
                            ...food,
                            provider: provider.name,
                        })),
                    );
                    totalCount += result.value.totalCount;
                } else {
                    logger.error(result.reason, "CombinedFoodAPI", {
                        provider: providers[index].name,
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
            logger.error(error, "searchFoods", { query });
            return {
                currentPage: page,
                foods: [],
                totalCount: 0,
                totalPages: 0,
            };
        }
    }

    private enhanceAndSortResults(foods: FoodItem[], query: string): FoodItem[] {
        const uniqueFoods = this.removeDuplicates(foods);
        const lowerQuery = query.toLowerCase();
        const queryWordCount = lowerQuery.split(/\s+/).length;

        return uniqueFoods
            .map(function (food) {
                const lowerName = food.name.toLowerCase();
                const nameMatch = lowerName.includes(lowerQuery);
                const brandMatch = food.brand?.toLowerCase().includes(lowerQuery);
                const hasCompleteNutrition = food.calories > 0 && food.protein > 0;
                const hasImage = Boolean(food.imageUrl);
                // Start with a base relevance if the name contains the query
                let relevance = nameMatch ? 10 : 0;
                // If the name exactly equals the query, add a strong bonus.
                if (lowerName === lowerQuery) {
                    relevance += 20;
                }
                // Add additional bonuses for brand, nutrition, and image.
                if (brandMatch) relevance += 5;
                if (hasCompleteNutrition) relevance += 3;
                if (hasImage) relevance += 2;
                // Penalize for extra words in the name.
                const nameWordCount = lowerName.split(/\s+/).length;
                const wordCountDiff = nameWordCount - queryWordCount;
                if (wordCountDiff > 0) {
                    relevance -= wordCountDiff * 5;
                }

                return {
                    ...food,
                    relevance,
                };
            })
            .sort((a, b) => b.relevance - a.relevance);
    }

    private removeDuplicates(foods: FoodItem[]): FoodItem[] {
        const seen = new Set<string>();
        return foods.filter(function (food) {
            const nameKey = food.name.trim().toLowerCase();
            const brandKey = (food.brand ?? "").trim().toLowerCase();
            const key = `${nameKey}|${brandKey}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
}

export const combinedFoodApi = new CombinedFoodApi();
