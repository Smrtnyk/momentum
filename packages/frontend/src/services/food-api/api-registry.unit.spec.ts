import { beforeEach, describe, expect, it } from "vitest";

import type { FoodItem, FoodSearchResult } from "../../types/food";

import { AbstractFoodApi } from "./abstract-food-api";
import { apiRegistry } from "./api-registry";

type AnyConstructor<T = any> = new (...args: any[]) => T;

class MockApi extends AbstractFoodApi {
    supportsBarcode = false;
    supportsSearch = true;

    constructor(
        public readonly name: string,
        public readonly priority: number,
        private readonly supportBarcode = false,
    ) {
        super();
        this.supportsBarcode = supportBarcode;
    }

    getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
        if (this.supportBarcode) {
            return Promise.resolve({
                calories: 100,
                carbs: 10,
                fat: 5,
                foodType: "product",
                id: `${this.name}-${barcode}`,
                name: `Test Food from ${this.name}`,
                protein: 10,
                servingSize: 100,
                servingUnit: "g",
            } as unknown as FoodItem);
        }
        return super.getFoodByBarcode(barcode);
    }

    searchFoods(): Promise<FoodSearchResult> {
        return Promise.resolve({
            currentPage: 1,
            foods: [],
            totalCount: 0,
            totalPages: 0,
        });
    }
}

class TestApiRegistry extends (apiRegistry.constructor as AnyConstructor) {
    constructor() {
        // eslint-disable-next-line constructor-super -- test constructor
        super();
        (this as any).providers = new Map();
    }
}

describe("ApiRegistry", () => {
    describe("Singleton Instance", () => {
        it("should provide a singleton instance with pre-registered providers", () => {
            const providers = apiRegistry.getSearchProviders();
            expect(providers.length).toBeGreaterThan(0);

            const providerNames = providers.map(({ name }) => name);
            expect(providerNames).toContain("OpenFoodRepo");
            expect(providerNames).toContain("OpenFoodFacts");
        });

        it("should return specific provider by name", function () {
            const openFoodFactsApi = apiRegistry.getProvider("OpenFoodFacts");
            expect(openFoodFactsApi).toBeDefined();
            expect(openFoodFactsApi?.name).toBe("OpenFoodFacts");

            const nonExistentApi = apiRegistry.getProvider("NonExistentApi");
            expect(nonExistentApi).toBeUndefined();
        });
    });

    describe("Barcode Providers", function () {
        let testRegistry: any;

        beforeEach(function () {
            testRegistry = new TestApiRegistry();
        });

        it("should return barcode providers in priority order", function () {
            const highPriorityApi = new MockApi("HighPriority", 1, true);
            const mediumPriorityApi = new MockApi("MediumPriority", 2, true);
            const lowPriorityApi = new MockApi("LowPriority", 3, true);

            testRegistry.registerProvider(mediumPriorityApi);
            testRegistry.registerProvider(lowPriorityApi);
            testRegistry.registerProvider(highPriorityApi);

            const barcodeProviders = testRegistry.getBarcodeProviders();

            // sorted by priority (lowest number = highest priority)
            expect(barcodeProviders.length).toBe(3);
            expect(barcodeProviders[0]).toBe(highPriorityApi);
            expect(barcodeProviders[1]).toBe(mediumPriorityApi);
            expect(barcodeProviders[2]).toBe(lowPriorityApi);
        });

        it("should filter out providers that do not support barcode lookup", function () {
            const barcodeProvider1 = new MockApi("BarcodeApi1", 1, true);
            const barcodeProvider2 = new MockApi("BarcodeApi2", 2, true);
            const nonBarcodeProvider = new MockApi("NonBarcodeApi", 3, false);

            testRegistry.registerProvider(barcodeProvider1);
            testRegistry.registerProvider(nonBarcodeProvider);
            testRegistry.registerProvider(barcodeProvider2);

            const barcodeProviders = testRegistry.getBarcodeProviders();

            expect(barcodeProviders.length).toBe(2);
            expect(barcodeProviders.map(({ name }) => name)).toContain("BarcodeApi1");
            expect(barcodeProviders.map(({ name }) => name)).toContain("BarcodeApi2");
            expect(barcodeProviders.map(({ name }) => name)).not.toContain("NonBarcodeApi");
        });
    });

    describe("Provider Registration", function () {
        let testRegistry: any;

        beforeEach(function () {
            testRegistry = new TestApiRegistry();
        });

        it("should register and retrieve providers correctly", function () {
            const api1 = new MockApi("TestApi1", 1);
            const api2 = new MockApi("TestApi2", 2);

            testRegistry.registerProvider(api1);
            testRegistry.registerProvider(api2);

            expect(testRegistry.getSearchProviders().length).toBe(2);
            expect(testRegistry.getProvider("TestApi1")).toBe(api1);
            expect(testRegistry.getProvider("TestApi2")).toBe(api2);
        });

        it("should replace provider with same name", function () {
            const api1 = new MockApi("SameNameApi", 1);
            const api2 = new MockApi("SameNameApi", 2);

            testRegistry.registerProvider(api1);
            testRegistry.registerProvider(api2);

            expect(testRegistry.getSearchProviders().length).toBe(1);
            expect(testRegistry.getProvider("SameNameApi")).toBe(api2);
        });
    });
});
