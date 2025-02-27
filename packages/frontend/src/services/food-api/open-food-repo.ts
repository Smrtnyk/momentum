import type { FoodItem } from "../../types/health-metrics";
import type { FoodApiProvider, FoodSearchResult } from "./base-api";

import { logger } from "../../logger/app-logger";

export class OpenFoodRepoApi implements FoodApiProvider {
    name = "OpenFoodRepo";
    private readonly API_BASE_URL = "https://www.foodrepo.org/api/v3";
    private readonly API_KEY = import.meta.env.VITE_OPEN_FOOD_REPO_API_KEY;
    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        try {
            const url = `${this.API_BASE_URL}/products/search_advanced`;
            const response = await fetch(url, {
                body: JSON.stringify({
                    page,
                    page_size: pageSize,
                    query: {
                        name: query,
                    },
                }),
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`OpenFoodRepo API request failed with status ${response.status}`);
            }

            const data = await response.json();

            // eslint-disable-next-line complexity -- FIXME: a bit complex
            const foods: FoodItem[] = data.data.map(function (product: any) {
                return {
                    brand: product.brands?.[0]?.name || null,
                    calories:
                        product.nutrients?.find((n: any) => n.name === "energy")
                            ?.per_hundred_grams || 0,
                    carbs:
                        product.nutrients?.find((n: any) => n.name === "carbohydrates")
                            ?.per_hundred_grams || 0,
                    fat:
                        product.nutrients?.find((n: any) => n.name === "fat")?.per_hundred_grams ||
                        0,
                    id: `ofr-${product.id}`,
                    imageUrl: product.images?.[0]?.medium || null,
                    name:
                        product.display_name_translations.de ||
                        product.display_name_translations.en ||
                        product.name,
                    protein:
                        product.nutrients?.find((n: any) => n.name === "proteins")
                            ?.per_hundred_grams || 0,
                    servingSize: 100,
                    servingUnit: "g",
                    source: "OpenFoodRepo",
                };
            });

            return {
                currentPage: page,
                foods,
                totalCount: data.meta.total_count,
                totalPages: Math.ceil(data.meta.total_count / pageSize),
            };
        } catch (error) {
            logger.error(error, "OpenFoodRepoAPI", { page, pageSize, query });

            return {
                currentPage: page,
                foods: [],
                totalCount: 0,
                totalPages: 0,
            };
        }
    }
}
