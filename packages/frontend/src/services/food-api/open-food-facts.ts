import type { FoodItem } from "../../types/health-metrics";
import type { FoodApiProvider, FoodSearchResult } from "./base-api";

import { logger } from "../../logger/app-logger";

const API_BASE_URL = "https://world.openfoodfacts.org/api/v2";
const SEARCH_URL = `${API_BASE_URL}/search`;

type FoodItemWithRelevance = FoodItem & { relevance: number };

interface OpenFoodFactsProduct {
    brands?: string;
    code: string;
    id: string;
    image_url?: string;
    nutriments: {
        carbohydrates_100g?: number;
        "energy-kcal_100g"?: number;
        fat_100g?: number;
        proteins_100g?: number;
    };
    product_name: string;
    quantity?: string;
    serving_size?: string;
}

interface OpenFoodFactsResponse {
    count: number;
    page: number;
    page_count: number;
    page_size: number;
    products: OpenFoodFactsProduct[];
}

export class OpenFoodFactsApi implements FoodApiProvider {
    name = "OpenFoodFacts";

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

            return mapProductToFoodItem(data.product);
        } catch (error) {
            logger.error(error, "OpenFoodFactsAPI", { barcode });
            throw new Error("Failed to get food information by barcode");
        }
    }

    async searchFoods(query: string, page = 1, pageSize = 10): Promise<FoodSearchResult> {
        try {
            // Build search URL with improved query params
            const url = new URL(SEARCH_URL);

            // Use more specific search parameters for better results
            url.searchParams.append("search_terms", query);

            // Add brand search to help with branded products like Coca-Cola
            url.searchParams.append("brands_tags", query);

            // Sort by popularity to get recognizable brands first
            url.searchParams.append("sort_by", "popularity_key");

            // Use OR operator to widen search but keep relevance
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

            const data = (await response.json()) as OpenFoodFactsResponse;

            // Map OpenFoodFacts products to our FoodItem interface
            const foods: FoodItemWithRelevance[] = data.products.map((product) =>
                mapProductToFoodItem(product),
            );

            return {
                currentPage: data.page,
                foods,
                totalCount: data.count,
                totalPages: data.page_count,
            };
        } catch (error) {
            logger.error(error, "OpenFoodFactsAPI", { page, pageSize, query });
            throw new Error("Failed to search for foods");
        }
    }
}

/**
 * Maps an OpenFoodFacts product to our FoodItem interface
 */
// eslint-disable-next-line complexity -- a bit complex
function mapProductToFoodItem(product: OpenFoodFactsProduct): FoodItemWithRelevance {
    const isLiquid =
        product.quantity?.toLowerCase().includes("l") ??
        product.product_name?.toLowerCase().includes("drink") ??
        product.product_name?.toLowerCase().includes("juice") ??
        product.product_name?.toLowerCase().includes("cola");

    let servingSize = 100;
    let servingUnit = isLiquid ? "ml" : "g";

    // Try to extract from serving_size field
    if (product.serving_size) {
        const match = /(\d+(\.\d+)?)\s*([A-Za-z]+)/.exec(product.serving_size);
        if (match) {
            servingSize = Number.parseFloat(match[1]);
            servingUnit = match[3];
        }
    }

    // Nutrition values (already per 100g/ml in OpenFoodFacts)
    const calories = product.nutriments["energy-kcal_100g"] ?? 0;
    const protein = product.nutriments.proteins_100g ?? 0;
    const carbs = product.nutriments.carbohydrates_100g ?? 0;
    const fat = product.nutriments.fat_100g ?? 0;

    // Add a relevance score (higher = more relevant)
    let relevance = 0;

    // Brand-name products get higher relevance
    if (product.brands && product.brands.length > 0) {
        relevance += 5;
    }

    // Products with images are likely to be more established
    if (product.image_url) {
        relevance += 3;
    }

    // Complete nutritional info suggests higher quality data
    if (
        product.nutriments.proteins_100g !== undefined &&
        product.nutriments.carbohydrates_100g !== undefined &&
        product.nutriments.fat_100g !== undefined
    ) {
        relevance += 2;
    }

    return {
        barcode: product.code,
        brand: product.brands,
        calories,
        carbs,
        fat,
        foodType: "product",
        id: product.code,
        imageUrl: product.image_url ?? null,
        name: product.product_name || "Unknown Product",
        protein,
        relevance,
        servingSize,
        servingUnit,
    };
}
