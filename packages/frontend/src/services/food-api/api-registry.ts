import type { AbstractFoodApi } from "./abstract-food-api";

import { NutritionixApi } from "./nutritionix-api";
import { OpenFoodFactsApi } from "./open-food-facts";
import { OpenFoodRepoApi } from "./open-food-repo";

/**
 * Registry for API providers
 */
class ApiRegistry {
    private readonly providers: Map<string, AbstractFoodApi> = new Map();

    constructor() {
        this.registerProvider(new OpenFoodRepoApi());
        this.registerProvider(new OpenFoodFactsApi());
        this.registerProvider(new NutritionixApi());
    }

    /**
     * Get all providers
     */
    getAllProviders(): AbstractFoodApi[] {
        return Array.from(this.providers.values());
    }

    /**
     * Get all providers that support barcode lookup in priority order
     */
    getBarcodeProviders(): AbstractFoodApi[] {
        return Array.from(this.providers.values())
            .filter((provider) => provider.supportsBarcode)
            .sort((a, b) => a.priority - b.priority);
    }

    /**
     * Get a provider by name
     */
    getProvider(name: string): AbstractFoodApi | undefined {
        return this.providers.get(name);
    }

    /**
     * Register a new API provider
     */
    registerProvider(provider: AbstractFoodApi): void {
        this.providers.set(provider.name, provider);
    }
}

export const apiRegistry = new ApiRegistry();
