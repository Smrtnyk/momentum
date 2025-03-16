import type { FoodItem, FoodSearchResult } from "../../types/food";

import { logger } from "../../logger/app-logger";

export abstract class AbstractFoodApi {
    abstract readonly name: string;

    abstract readonly supportsBarcode: boolean;
    abstract readonly supportsSearch: boolean;

    abstract getFoodByBarcode(args0: string): Promise<FoodItem | null>;
    abstract searchFoods(query: string, page: number, pageSize: number): Promise<FoodSearchResult>;

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

    protected logError(error: unknown, operation: string, metadata?: Record<string, any>): void {
        logger.error(
            error instanceof Error ? error : new Error(String(error)),
            `${this.name}API.${operation}`,
            metadata,
        );
    }
}

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
