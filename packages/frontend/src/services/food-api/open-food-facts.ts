import { Timestamp } from "firebase/firestore";

import type { FoodItem, FoodSearchResult, OpenFoodFactsProduct } from "../../types/food";

import { logger } from "../../logger/app-logger";
import { AbstractFoodApi } from "./abstract-food-api";

const API_BASE_URL = "https://world.openfoodfacts.org/api/v2";
const SEARCH_URL = `${API_BASE_URL}/search`;

export class OpenFoodFactsApi extends AbstractFoodApi {
    readonly name = "OpenFoodFacts";

    readonly supportsBarcode = true;
    readonly supportsSearch = true;

    async getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
        try {
            const url = `${API_BASE_URL}/product/${barcode}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.status !== 1 || !data.product) {
                return null;
            }

            logger.debug(
                `Received nutrition data for barcode ${barcode}`,
                "OpenFoodFactsAPI.debug",
                { nutriments: data.product.nutriments },
            );

            return this.mapProductToFoodItem(data.product);
        } catch (error) {
            this.logError(error, "getFoodByBarcode", { barcode });
            return null;
        }
    }

    searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        try {
            const cleanQuery = query.trim();
            const words = cleanQuery.split(/\s+/);
            const isMultiWord = words.length > 1;

            // For single word use the API v2 directly
            if (!isMultiWord) {
                return this.searchWithV2(cleanQuery, page, pageSize);
            }

            // For multi-word queries use v1
            // v2 doesn't support full text search well
            return this.searchMultiWordWithV1(cleanQuery, page, pageSize);
        } catch (error) {
            this.logError(error, "searchFoods", { page, pageSize, query });
            return Promise.resolve({
                currentPage: page,
                foods: [],
                totalCount: 0,
                totalPages: 0,
            });
        }
    }

    private extractCalories(nutriments: any): number {
        if (!nutriments) return 0;

        // all possible field names for calories
        const caloriesValue =
            nutriments["energy-kcal_100g"] ??
            nutriments["energy_kcal_100g"] ??
            nutriments["energy-kcal"] ??
            nutriments["energy_kcal"] ??
            // If only energy in kJ is available, convert to kcal (divide by 4.184)
            (nutriments["energy_100g"] ? Math.round(nutriments["energy_100g"] / 4.184) : 0) ??
            (nutriments["energy"] ? Math.round(nutriments["energy"] / 4.184) : 0) ??
            0;

        return !Number.isNaN(caloriesValue) && caloriesValue >= 0 ? caloriesValue : 0;
    }

    private extractNutrient(nutriments: any, primaryKey: string, alternateKeys: string[]): number {
        if (!nutriments) return 0;

        if (nutriments[primaryKey] !== undefined) {
            return nutriments[primaryKey];
        }

        for (const key of alternateKeys) {
            if (nutriments[key] !== undefined) {
                return nutriments[key];
            }
        }

        return 0;
    }

    private async fetchAndProcessResults(url: URL, page: number): Promise<FoodSearchResult> {
        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        const foods = data.products.map((product: OpenFoodFactsProduct) =>
            this.mapProductToFoodItem(product),
        );

        return {
            currentPage: data.page ?? page,
            foods,
            totalCount: data.count ?? foods.length,
            totalPages: data.page_count ?? 1,
        };
    }

    private mapProductToFoodItem(product: OpenFoodFactsProduct): FoodItem {
        const isLiquid = this.isLiquidProduct(product.product_name);
        const { servingSize, servingUnit } = this.parseServingSize(product.serving_size, isLiquid);

        const caloriesPer100 = this.extractCalories(product.nutriments);
        const proteinPer100 = this.extractNutrient(product.nutriments, "proteins_100g", [
            "protein_100g",
            "proteins",
        ]);
        const carbsPer100 = this.extractNutrient(product.nutriments, "carbohydrates_100g", [
            "carbohydrate_100g",
            "carbohydrates",
        ]);
        const fatPer100 = this.extractNutrient(product.nutriments, "fat_100g", [
            "fats_100g",
            "fat",
        ]);
        const sugarsPer100 = this.extractNutrient(product.nutriments, "sugars_100g", [
            "sugar_100g",
            "sugars",
        ]);

        const fiberPer100 = this.extractNutrient(product.nutriments, "fiber_100g", [
            "fibers_100g",
            "fiber",
            "fibers",
        ]);

        const saturatedFatPer100 = this.extractNutrient(product.nutriments, "saturated-fat_100g", [
            "saturated_fat_100g",
            "saturated-fat",
            "saturated_fat",
        ]);

        const scaleFactor = servingSize / 100;

        return {
            barcode: product.code,
            brand: product.brands ?? null,
            calories: Math.round(caloriesPer100 * scaleFactor),
            carbs: carbsPer100 * scaleFactor,
            fat: fatPer100 * scaleFactor,
            fiber: fiberPer100 * scaleFactor,
            foodType: "product",
            id: product.code,
            imageUrl: product.image_url ?? null,
            loggedTimestamp: Timestamp.now(),
            name: product.product_name ?? "Unknown Product",
            protein: proteinPer100 * scaleFactor,
            saturatedFat: saturatedFatPer100 * scaleFactor,
            servingSize,
            servingUnit,
            source: "OpenFoodFacts",
            sugars: sugarsPer100 * scaleFactor,
        };
    }

    private parseServingSize(
        servingSizeStr: string | undefined,
        isLiquid: boolean,
    ): {
        servingSize: number;
        servingUnit: string;
    } {
        const defaultSize = 100;
        const defaultUnit = isLiquid ? "ml" : "g";

        if (!servingSizeStr) {
            return { servingSize: defaultSize, servingUnit: defaultUnit };
        }

        const match = /(\d+(\.\d+)?)\s*([A-Za-z]+)/.exec(servingSizeStr);
        if (match) {
            return {
                servingSize: Number.parseFloat(match[1]),
                servingUnit: match[3],
            };
        }

        return { servingSize: defaultSize, servingUnit: defaultUnit };
    }

    private searchMultiWordWithV1(
        query: string,
        page: number,
        pageSize: number,
    ): Promise<FoodSearchResult> {
        const url = new URL(`https://world.openfoodfacts.org/cgi/search.pl`);

        url.searchParams.append("search_terms", query);
        url.searchParams.append("search_simple", "1");
        url.searchParams.append("action", "process");
        url.searchParams.append("json", "1");
        url.searchParams.append("sort_by", "popularity_key");
        url.searchParams.append("page", page.toString());
        url.searchParams.append("page_size", pageSize.toString());
        url.searchParams.append(
            "fields",
            "code,product_name,brands,image_url,nutriments,quantity,serving_size,popularity_key",
        );

        return this.fetchAndProcessResults(url, page);
    }

    private searchWithV2(query: string, page: number, pageSize: number): Promise<FoodSearchResult> {
        const url = new URL(SEARCH_URL);

        url.searchParams.append("tagtype_0", "product_name");
        url.searchParams.append("tag_contains_0", "contains");
        url.searchParams.append("tag_0", query);
        url.searchParams.append("tagtype_1", "brands");
        url.searchParams.append("tag_contains_1", "contains");
        url.searchParams.append("tag_1", query);
        url.searchParams.append("sort_by", "popularity_key");
        url.searchParams.append("page", page.toString());
        url.searchParams.append("page_size", pageSize.toString());
        url.searchParams.append(
            "fields",
            "code,product_name,brands,image_url,nutriments,quantity,serving_size,popularity_key",
        );

        return this.fetchAndProcessResults(url, page);
    }
}
