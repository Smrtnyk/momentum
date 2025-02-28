import type { FoodItem, FoodSearchResult, OpenFoodRepoProduct } from "../../types/food";

import { logger } from "../../logger/app-logger";
import { AbstractFoodApi } from "./abstract-food-api";

export class OpenFoodRepoApi extends AbstractFoodApi {
    readonly name = "OpenFoodRepo";
    readonly priority = 1;

    readonly supportsBarcode = true;

    private readonly API_BASE_URL = "https://www.foodrepo.org/api/v3";
    private readonly API_KEY = import.meta.env.VITE_OPEN_FOOD_REPO_API_KEY;

    /**
     * Get a food item by barcode
     */
    async getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
        if (!this.API_KEY) {
            logger.warn("OpenFoodRepo API key not set");
            return null;
        }

        try {
            const url = new URL(`${this.API_BASE_URL}/products`);
            url.searchParams.append("barcodes", barcode);

            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (!data.data || data.data.length === 0) {
                return null;
            }

            return this.mapProductToFoodItem(data.data[0], barcode);
        } catch (error) {
            this.logError(error, "getFoodByBarcode", { barcode });
            return null;
        }
    }

    /**
     * Search for foods matching a query
     */
    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        if (!this.API_KEY) {
            logger.warn("OpenFoodRepo API key not set");
            return {
                currentPage: page,
                foods: [],
                totalCount: 0,
                totalPages: 0,
            };
        }

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
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            const foods: FoodItem[] = data.data.map((product: OpenFoodRepoProduct) =>
                this.mapProductToFoodItem(product),
            );

            return {
                currentPage: page,
                foods,
                totalCount: data.meta.total_count,
                totalPages: Math.ceil(data.meta.total_count / pageSize),
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

    /**
     * Maps an OpenFoodRepo product to our FoodItem interface
     */
    private mapProductToFoodItem(product: OpenFoodRepoProduct, barcode?: string): FoodItem {
        const name =
            product.display_name_translations?.en ||
            product.display_name_translations?.de ||
            product.name;

        const isLiquid = this.isLiquidProduct(
            [name, product.name_translations?.en, product.name_translations?.de]
                .filter(Boolean)
                .join(" "),
        );

        function getNutrientValue(nameVal: string): number {
            return product.nutrients?.find((n) => n.name === nameVal)?.per_hundred_grams || 0;
        }

        return {
            barcode: barcode ?? null,
            brand: product.brands?.[0]?.name || "",
            calories: getNutrientValue("energy"),
            carbs: getNutrientValue("carbohydrates"),
            fat: getNutrientValue("fat"),
            foodType: "product",
            id: `ofr-${product.id}`,
            imageUrl: product.images?.[0]?.medium || null,
            name,
            protein: getNutrientValue("proteins"),
            servingSize: 100,
            servingUnit: isLiquid ? "ml" : "g",
            source: "OpenFoodRepo",
        };
    }
}
