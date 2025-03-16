import type { AbstractFoodApi } from "./abstract-food-api";

import { OpenFoodFactsApi } from "./open-food-facts";
import { OpenFoodRepoApi } from "./open-food-repo";

class ApiRegistry {
    private readonly providers: Map<string, AbstractFoodApi> = new Map();

    constructor() {
        this.registerProvider(new OpenFoodRepoApi());
        this.registerProvider(new OpenFoodFactsApi());
    }

    getBarcodeProviders(): AbstractFoodApi[] {
        return Array.from(this.providers.values()).filter((provider) => provider.supportsBarcode);
    }

    getProvider(name: string): AbstractFoodApi | undefined {
        return this.providers.get(name);
    }

    getSearchProviders(): AbstractFoodApi[] {
        return Array.from(this.providers.values()).filter((provider) => provider.supportsSearch);
    }

    registerProvider(provider: AbstractFoodApi): void {
        this.providers.set(provider.name, provider);
    }
}

export const apiRegistry = new ApiRegistry();
