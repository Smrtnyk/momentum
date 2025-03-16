import { isNotNil } from "es-toolkit";

import type { FoodItem, FoodSearchResult, OpenFoodRepoProduct } from "../../types/food";

import { logger } from "../../logger/app-logger";
import { AbstractFoodApi } from "./abstract-food-api";

export class OpenFoodRepoApi extends AbstractFoodApi {
    readonly name = "OpenFoodRepo";
    readonly priority = 1;
    readonly supportsBarcode = true;
    readonly supportsSearch = true;

    private readonly API_BASE_URL = "https://www.foodrepo.org/api/v3";
    private readonly API_KEY = import.meta.env.VITE_OPEN_FOOD_REPO_API_KEY;
    private readonly AUTH_HEADER = `Token token="${import.meta.env.VITE_OPEN_FOOD_REPO_API_KEY}"`;

    async getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
        if (!this.API_KEY) {
            logger.warn("OpenFoodRepo API key not set");
            return null;
        }

        try {
            const searchQuery = {
                query: {
                    terms: {
                        barcode: [barcode],
                    },
                },
                size: 1,
                track_total_hits: true,
            };

            const result = await this.searchWithElasticSearch(searchQuery, 1);

            if (result.foods.length === 0) {
                return null;
            }

            return result.foods[0];
        } catch (error) {
            this.logError(error, "getFoodByBarcode", { barcode });
            return null;
        }
    }

    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        if (!this.API_KEY) {
            logger.warn("OpenFoodRepo API key not set");
            return this.createEmptyResult(page);
        }

        try {
            const searchQuery = {
                from: (page - 1) * pageSize,
                query: {
                    wildcard: {
                        _all_names: `*${query}*`,
                    },
                },
                size: pageSize,
                track_total_hits: true,
            };

            return await this.searchWithElasticSearch(searchQuery, page);
        } catch (error) {
            this.logError(error, "searchFoods", { page, pageSize, query });
            return this.createEmptyResult(page);
        }
    }

    private createEmptyResult(page: number): FoodSearchResult {
        return {
            currentPage: page,
            foods: [],
            totalCount: 0,
            totalPages: 0,
        };
    }

    private determineIfLiquid(product: OpenFoodRepoProduct, name: string): boolean {
        const textToCheck = [name, product.name_translations?.en, product.name_translations?.de]
            .filter(isNotNil)
            .join(" ");

        return this.isLiquidProduct(textToCheck);
    }

    private extractBarcode(product: OpenFoodRepoProduct, providedBarcode?: string): null | string {
        if (providedBarcode) {
            return providedBarcode;
        }

        if (typeof product.barcode === "string") {
            return product.barcode;
        }

        if (Array.isArray(product.barcode) && product.barcode.length > 0) {
            return product.barcode[0];
        }

        return null;
    }

    private extractCalories(product: OpenFoodRepoProduct): number {
        if (Array.isArray(product.nutrients)) {
            return this.extractNutrientFromArray(product.nutrients, "energy");
        }

        if (!product.nutrients || typeof product.nutrients !== "object") {
            return 0;
        }

        if (product.nutrients.energy_calories_kcal?.per_hundred) {
            return product.nutrients.energy_calories_kcal.per_hundred;
        }

        if (product.nutrients.energy?.per_hundred) {
            return product.nutrients.energy.per_hundred / 4.184;
        }

        return 0;
    }

    private extractNutrientFromArray(
        nutrients: Array<{ name: string; per_hundred_grams: number }>,
        name: string,
    ): number {
        return nutrients.find((n) => n.name === name)?.per_hundred_grams ?? 0;
    }

    private extractNutrientFromObject(nutrients: Record<string, any>, name: string): number {
        const nutrient = nutrients[name];
        if (nutrient && "per_hundred" in nutrient) {
            return nutrient.per_hundred;
        }
        return 0;
    }

    private extractNutrientValue(product: OpenFoodRepoProduct, nutrientName: string): number {
        if (Array.isArray(product.nutrients)) {
            return this.extractNutrientFromArray(product.nutrients, nutrientName);
        }

        if (product.nutrients && typeof product.nutrients === "object") {
            return this.extractNutrientFromObject(product.nutrients, nutrientName);
        }

        return 0;
    }

    private extractProductName(product: OpenFoodRepoProduct): string {
        return (
            product.display_name_translations?.en ??
            product.display_name_translations?.de ??
            product.name ??
            "Unknown Product"
        );
    }

    private extractProtein(product: OpenFoodRepoProduct): number {
        const proteinValue = this.extractNutrientValue(product, "protein");
        if (proteinValue > 0) {
            return proteinValue;
        }

        if (
            product.nutrients &&
            typeof product.nutrients === "object" &&
            "proteins" in product.nutrients &&
            product.nutrients.proteins?.per_hundred
        ) {
            return product.nutrients.proteins.per_hundred;
        }

        return 0;
    }

    private mapProductToFoodItem(product: OpenFoodRepoProduct, barcode?: string): FoodItem {
        try {
            const name = this.extractProductName(product);
            const isLiquid = this.determineIfLiquid(product, name);
            const itemBarcode = this.extractBarcode(product, barcode);

            return {
                barcode: itemBarcode,
                brand: product.brands?.[0]?.name ?? "",
                calories: this.extractCalories(product),
                carbs: this.extractNutrientValue(product, "carbohydrates"),
                fat: this.extractNutrientValue(product, "fat"),
                foodType: "product",
                id: `ofr-${product.id}`,
                imageUrl: product.images?.[0]?.medium ?? null,
                name,
                protein: this.extractProtein(product),
                servingSize: 100,
                servingUnit: isLiquid ? "ml" : "g",
                source: "OpenFoodRepo",
            };
        } catch (error) {
            logger.error("Error mapping product to food item", "OpenFoodRepoAPI", {
                error,
                productId: product.id,
            });
            throw error;
        }
    }

    private async searchWithElasticSearch(
        query: Record<string, any>,
        page: number,
    ): Promise<FoodSearchResult> {
        try {
            const url = `${this.API_BASE_URL}/products/_search`;

            const response = await fetch(url, {
                body: JSON.stringify(query),
                headers: {
                    "Accept-Encoding": "gzip",
                    Authorization: this.AUTH_HEADER,
                    "Content-Type": "application/json",
                },
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const foods: FoodItem[] = [];

            if (data.hits?.hits?.length > 0) {
                for (const hit of data.hits.hits) {
                    try {
                        // eslint-disable-next-line no-underscore-dangle -- that is how it is in the response
                        const product = hit._source as OpenFoodRepoProduct;
                        foods.push(this.mapProductToFoodItem(product));
                    } catch (error) {
                        logger.error("Failed to map product", "OpenFoodRepoAPI", { error });
                    }
                }
            }

            const totalHits =
                typeof data.hits?.total === "object"
                    ? data.hits.total.value
                    : (data.hits?.total ?? 0);

            const size = query.size ?? 10;

            return {
                currentPage: page,
                foods,
                totalCount: totalHits,
                totalPages: Math.ceil(totalHits / size),
            };
        } catch (error) {
            this.logError(error, "searchWithElasticSearch", { query });
            return this.createEmptyResult(page);
        }
    }
}
