import type { FoodItem, FoodSearchResult, OpenFoodFactsProduct } from "../../types/food";

import { logger } from "../../logger/app-logger";
import { AbstractFoodApi } from "./abstract-food-api";

const API_BASE_URL = "https://world.openfoodfacts.org/api/v2";
const SEARCH_URL = `${API_BASE_URL}/search`;

export class OpenFoodFactsApi extends AbstractFoodApi {
    readonly name = "OpenFoodFacts";
    readonly priority = 2;

    readonly supportsBarcode = true;

    /**
     * Get a food item by barcode
     */
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

    /**
     * Search for foods matching a query
     */
    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        try {
            const url = new URL(SEARCH_URL);
            url.searchParams.append("search_terms", query);
            url.searchParams.append("brands_tags", query);
            url.searchParams.append("sort_by", "popularity_key");
            url.searchParams.append("tagtype_0", "brands");
            url.searchParams.append("tag_contains_0", "contains");
            url.searchParams.append("tag_0", query);
            url.searchParams.append("page", page.toString());
            url.searchParams.append("page_size", pageSize.toString());
            url.searchParams.append(
                "fields",
                "code,product_name,brands,image_url,nutriments,quantity,serving_size,popularity_key",
            );

            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            const foods = data.products.map((product: OpenFoodFactsProduct) =>
                this.mapProductToFoodItem(product),
            );

            return {
                currentPage: data.page,
                foods,
                totalCount: data.count,
                totalPages: data.page_count,
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
     * Maps an OpenFoodFacts product to our FoodItem interface
     */
    // eslint-disable-next-line complexity -- FIXME
    private mapProductToFoodItem(product: OpenFoodFactsProduct): FoodItem {
        const isLiquid = this.isLiquidProduct(product.product_name);

        let servingSize = 100;
        let servingUnit = isLiquid ? "ml" : "g";

        if (product.serving_size) {
            const match = /(\d+(\.\d+)?)\s*([A-Za-z]+)/.exec(product.serving_size);
            if (match) {
                servingSize = Number.parseFloat(match[1]);
                servingUnit = match[3];
            }
        }

        let calories = 0;
        if (product.nutriments) {
            // Try all possible field names for calories
            calories =
                product.nutriments["energy-kcal_100g"] ??
                product.nutriments["energy_kcal_100g"] ??
                product.nutriments["energy-kcal"] ??
                product.nutriments["energy_kcal"] ??
                // If only energy in kJ is available, convert to kcal (divide by 4.184)
                (product.nutriments["energy_100g"]
                    ? Math.round(product.nutriments["energy_100g"] / 4.184)
                    : 0) ??
                (product.nutriments["energy"]
                    ? Math.round(product.nutriments["energy"] / 4.184)
                    : 0) ??
                0;

            calories = !Number.isNaN(calories) && calories >= 0 ? calories : 0;
        }

        const protein =
            product.nutriments?.proteins_100g ??
            product.nutriments?.protein_100g ??
            product.nutriments?.proteins ??
            0;

        const carbs =
            product.nutriments?.carbohydrates_100g ??
            product.nutriments?.carbohydrate_100g ??
            product.nutriments?.carbohydrates ??
            0;

        const fat =
            product.nutriments?.fat_100g ??
            product.nutriments?.fats_100g ??
            product.nutriments?.fat ??
            0;

        return {
            barcode: product.code,
            brand: product.brands ?? null,
            calories,
            carbs,
            fat,
            foodType: "product",
            id: product.code,
            imageUrl: product.image_url ?? null,
            name: product.product_name || "Unknown Product",
            protein,
            servingSize,
            servingUnit,
            source: "OpenFoodFacts",
        };
    }
}
