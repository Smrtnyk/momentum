import type { FoodItem, FoodSearchResult } from "../../types/food";

import { logger } from "../../logger/app-logger";

/**
 * Abstract base class for food data APIs
 */
export abstract class AbstractFoodApi {
    /**
     * The name of the API provider
     */
    abstract readonly name: string;

    /**
     * Priority for operations like barcode lookup (lower number = higher priority)
     */
    abstract readonly priority: number;

    /**
     * Defines if provider supports searching by barcode
     */
    abstract readonly supportsBarcode: boolean;

    /**
     * Optional method to get food by barcode
     * Defaults to returning null if not implemented by the derived class
     */
    getFoodByBarcode(args0: string): Promise<FoodItem | null> {
        return Promise.resolve(null);
    }

    /**
     * Search for foods matching a query
     */
    abstract searchFoods(query: string, page: number, pageSize: number): Promise<FoodSearchResult>;

    /**
     * Determines if a product is likely a liquid based on its name
     */
    protected isLiquidProduct(productName: string): boolean {
        if (!productName) return false;

        const liquidKeywords = [
            "drink",
            "juice",
            "water",
            "milk",
            "beverage",
            "cola",
            "soda",
            "getränk",
            "saft",
            "wasser",
            "milch",
        ];

        return liquidKeywords.some((keyword) => productName.toLowerCase().includes(keyword));
    }

    /**
     * Standardized error logging for API operations
     */
    protected logError(error: unknown, operation: string, metadata?: Record<string, any>): void {
        logger.error(
            error instanceof Error ? error : new Error(String(error)),
            `${this.name}API.${operation}`,
            metadata,
        );
    }
}

/**
 * Custom error class for food API errors
 */
export class FoodApiError extends Error {
    constructor(
        message: string,
        public readonly apiName: string,
        public readonly operation: string,
        public readonly metadata?: Record<string, any>,
        options?: ErrorOptions,
    ) {
        super(message, options);
        this.name = "FoodApiError";
    }
}
