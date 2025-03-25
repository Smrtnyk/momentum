import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FoodItem, FoodSearchResult } from "../../types/food";

import { logger } from "../../logger/app-logger";
import { AbstractFoodApi } from "./abstract-food-api";
import { apiRegistry } from "./api-registry";
import { CombinedFoodApi } from "./combined-api";

vi.mock("./api-registry", () => ({
    apiRegistry: {
        getBarcodeProviders: vi.fn(),
        getSearchProviders: vi.fn(),
    },
}));

vi.mock("../../logger/app-logger", () => ({
    logger: {
        error: vi.fn(),
    },
}));

class MockApi extends AbstractFoodApi {
    supportsBarcode = true;
    supportsSearch = true;

    constructor(
        public readonly name: string,
        public mockGetFoodByBarcode = (args0: string) => Promise.resolve(null),
        public mockSearchFoods = (args0, args1, args2) =>
            Promise.resolve({
                currentPage: 1,
                foods: [],
                totalCount: 0,
                totalPages: 0,
            }),
    ) {
        super();
    }

    getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
        return this.mockGetFoodByBarcode(barcode);
    }

    searchFoods(query: string, page: number, pageSize: number): Promise<FoodSearchResult> {
        return this.mockSearchFoods(query, page, pageSize);
    }
}

describe("CombinedFoodApi", function () {
    let combinedApi: CombinedFoodApi;
    let mockApi1: MockApi;
    let mockApi2: MockApi;
    let mockApi3: MockApi;

    beforeEach(function () {
        combinedApi = new CombinedFoodApi();
        mockApi1 = new MockApi("MockApi1");
        mockApi2 = new MockApi("MockApi2");
        mockApi3 = new MockApi("MockApi3");
        // Exclude the combined API to avoid recursion
        vi.mocked(apiRegistry.getSearchProviders).mockReturnValue([mockApi1, mockApi2, mockApi3]);
        vi.mocked(apiRegistry.getBarcodeProviders).mockReturnValue([mockApi1, mockApi2, mockApi3]);
    });

    describe("getFoodByBarcode", function () {
        it("should make parallel requests to all providers", async function () {
            const mockFood1: FoodItem = {
                barcode: "12345",
                calories: 100,
                carbs: 10,
                fat: 5,
                foodType: "product",
                id: "test1",
                name: "Test Food 1",
                protein: 10,
                servingSize: 100,
                servingUnit: "g",
                sugars: 5,
            };

            const mockFood2: FoodItem = {
                barcode: "12345",
                calories: 150,
                carbs: 15,
                fat: 7,
                foodType: "product",
                id: "test2",
                name: "Test Food 2",
                protein: 12,
                servingSize: 100,
                servingUnit: "g",
                sugars: 8,
            };

            mockApi1.mockGetFoodByBarcode = vi.fn().mockResolvedValue(mockFood1);
            mockApi2.mockGetFoodByBarcode = vi.fn().mockResolvedValue(mockFood2);
            mockApi3.mockGetFoodByBarcode = vi.fn().mockResolvedValue(null);

            const result = await combinedApi.getFoodByBarcode("12345");
            expect(mockApi1.mockGetFoodByBarcode).toHaveBeenCalledWith("12345");
            expect(mockApi2.mockGetFoodByBarcode).toHaveBeenCalledWith("12345");
            expect(mockApi3.mockGetFoodByBarcode).toHaveBeenCalledWith("12345");
            expect(result).not.toBeNull();
        });

        it("should filter out food items with zero calories", async function () {
            const zeroCalorieFood: FoodItem = {
                barcode: "12345",
                calories: 0,
                carbs: 10,
                fat: 5,
                foodType: "product",
                id: "test1",
                name: "Zero Calorie Food",
                protein: 10,
                servingSize: 100,
                servingUnit: "g",
                sugars: 0,
            };

            const validFood: FoodItem = {
                barcode: "12345",
                calories: 150,
                carbs: 15,
                fat: 7,
                foodType: "product",
                id: "test2",
                name: "Valid Food",
                protein: 12,
                servingSize: 100,
                servingUnit: "g",
                sugars: 10,
            };

            mockApi1.mockGetFoodByBarcode = vi.fn().mockResolvedValue(zeroCalorieFood);
            mockApi2.mockGetFoodByBarcode = vi.fn().mockResolvedValue(validFood);
            mockApi3.mockGetFoodByBarcode = vi.fn().mockResolvedValue(null);

            const result = await combinedApi.getFoodByBarcode("12345");

            expect(result).not.toBeNull();
            expect(result?.name).toBe("Valid Food");
            expect(result?.calories).toBe(150);
        });

        it("should select the best food item based on quality criteria", async function () {
            const basicFood: FoodItem = {
                barcode: null,
                calories: 100,
                carbs: 0,
                fat: 0,
                foodType: "product",
                id: "basic",
                name: "Basic Food",
                protein: 0,
                servingSize: 100,
                servingUnit: "g",
                sugars: 0,
            };

            const mediumFood: FoodItem = {
                barcode: "12345",
                brand: "Test Brand",
                calories: 150,
                carbs: 15,
                fat: 0,
                foodType: "product",
                id: "medium",
                name: "Medium Food",
                protein: 0,
                servingSize: 100,
                servingUnit: "g",
                sugars: 12,
            };

            const completeFood: FoodItem = {
                barcode: "12345",
                brand: "Premium Brand",
                calories: 120,
                carbs: 12,
                fat: 5,
                foodType: "product",
                id: "complete",
                imageUrl: "https://example.com/image.jpg",
                name: "Complete Food",
                protein: 8,
                servingSize: 100,
                servingUnit: "g",
                sugars: 7,
            };

            mockApi1.mockGetFoodByBarcode = vi.fn().mockResolvedValue(basicFood);
            mockApi2.mockGetFoodByBarcode = vi.fn().mockResolvedValue(mediumFood);
            mockApi3.mockGetFoodByBarcode = vi.fn().mockResolvedValue(completeFood);

            const result = await combinedApi.getFoodByBarcode("12345");

            expect(result).not.toBeNull();
            expect(result?.id).toBe("complete");
            expect(result?.provider).toBe("MockApi3");
        });

        it("should handle the case when all providers return null or zero calories", async function () {
            mockApi1.mockGetFoodByBarcode = vi.fn().mockResolvedValue(null);
            mockApi2.mockGetFoodByBarcode = vi.fn().mockResolvedValue({
                barcode: "12345",
                calories: 0,
                carbs: 0,
                fat: 0,
                foodType: "product",
                id: "test",
                name: "Zero Calorie Food",
                protein: 0,
                servingSize: 100,
                servingUnit: "g",
            });
            mockApi3.mockGetFoodByBarcode = vi.fn().mockResolvedValue(null);

            const result = await combinedApi.getFoodByBarcode("12345");

            // Should return null as no valid food items were found
            expect(result).toBeNull();
        });

        it("should handle provider errors gracefully", async function () {
            const mockFood: FoodItem = {
                barcode: "12345",
                calories: 100,
                carbs: 10,
                fat: 5,
                foodType: "product",
                id: "test",
                name: "Test Food",
                protein: 10,
                servingSize: 100,
                servingUnit: "g",
                sugars: 4,
            };

            mockApi1.mockGetFoodByBarcode = vi.fn().mockRejectedValue(new Error("API error"));
            mockApi2.mockGetFoodByBarcode = vi.fn().mockResolvedValue(mockFood);
            mockApi3.mockGetFoodByBarcode = vi.fn().mockResolvedValue(null);

            const result = await combinedApi.getFoodByBarcode("12345");

            expect(logger.error).toHaveBeenCalled();

            expect(result).not.toBeNull();
            expect(result?.id).toBe("test");
            expect(result?.provider).toBe("MockApi2");
        });
    });

    describe("searchFoods", function () {
        it("should combine results from all providers", async function () {
            const mockResult1: FoodSearchResult = {
                currentPage: 1,
                foods: [
                    {
                        barcode: null,
                        calories: 100,
                        carbs: 10,
                        fat: 5,
                        foodType: "product",
                        id: "food1",
                        name: "Food 1",
                        protein: 10,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                ],
                totalCount: 1,
                totalPages: 1,
            };

            const mockResult2: FoodSearchResult = {
                currentPage: 1,
                foods: [
                    {
                        barcode: null,
                        calories: 200,
                        carbs: 20,
                        fat: 10,
                        foodType: "product",
                        id: "food2",
                        name: "Food 2",
                        protein: 20,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                ],
                totalCount: 1,
                totalPages: 1,
            };

            mockApi1.mockSearchFoods = vi.fn().mockResolvedValue(mockResult1);
            mockApi2.mockSearchFoods = vi.fn().mockResolvedValue(mockResult2);

            const result = await combinedApi.searchFoods("test query", 1, 10);

            // Should call search on both providers
            expect(mockApi1.mockSearchFoods).toHaveBeenCalledWith("test query", 1, 10);
            expect(mockApi2.mockSearchFoods).toHaveBeenCalledWith("test query", 1, 10);

            expect(result.foods).toHaveLength(2);
            expect(result.foods[0]).toHaveProperty("provider", "MockApi1");
            expect(result.foods[1]).toHaveProperty("provider", "MockApi2");
        });

        it("should use cache for repeated queries within TTL", async function () {
            const mockResult: FoodSearchResult = {
                currentPage: 1,
                foods: [
                    {
                        barcode: null,
                        calories: 100,
                        carbs: 10,
                        fat: 5,
                        foodType: "product",
                        id: "food1",
                        name: "Food 1",
                        protein: 10,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                ],
                totalCount: 1,
                totalPages: 1,
            };

            mockApi1.mockSearchFoods = vi.fn().mockResolvedValue(mockResult);
            mockApi2.mockSearchFoods = vi.fn().mockResolvedValue({ ...mockResult, foods: [] });

            // First call should hit the APIs
            await combinedApi.searchFoods("test query", 1, 10);
            expect(mockApi1.mockSearchFoods).toHaveBeenCalledTimes(1);
            expect(mockApi2.mockSearchFoods).toHaveBeenCalledTimes(1);

            // Reset mocks to verify if they're called again
            vi.clearAllMocks();

            // Second call with same parameters should use cache
            await combinedApi.searchFoods("test query", 1, 10);
            expect(mockApi1.mockSearchFoods).not.toHaveBeenCalled();
            expect(mockApi2.mockSearchFoods).not.toHaveBeenCalled();
            // Different parameters should hit APIs again
            await combinedApi.searchFoods("different query", 1, 10);
            expect(mockApi1.mockSearchFoods).toHaveBeenCalledTimes(1);
            expect(mockApi2.mockSearchFoods).toHaveBeenCalledTimes(1);
        });

        it("should remove duplicate foods based on name and brand", async function () {
            // Setup mock results with duplicates
            const mockResult: FoodSearchResult = {
                currentPage: 1,
                foods: [
                    {
                        barcode: null,
                        brand: "Brand X",
                        calories: 100,
                        carbs: 10,
                        fat: 5,
                        foodType: "product",
                        id: "food1",
                        name: "Duplicate Food",
                        protein: 10,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                    {
                        barcode: null,
                        brand: "Brand X",
                        calories: 200,
                        carbs: 20,
                        fat: 10,
                        foodType: "product",
                        id: "food2",
                        name: "Duplicate Food",
                        protein: 20,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                    {
                        barcode: null,
                        brand: "Brand Y",
                        calories: 100,
                        carbs: 10,
                        fat: 5,
                        foodType: "product",
                        id: "food3",
                        name: "Unique Food",
                        protein: 10,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                ],
                totalCount: 3,
                totalPages: 1,
            };

            mockApi1.mockSearchFoods = vi.fn().mockResolvedValue(mockResult);
            mockApi2.mockSearchFoods = vi
                .fn()
                .mockResolvedValue({ currentPage: 1, foods: [], totalCount: 0, totalPages: 0 });

            const result = await combinedApi.searchFoods("food", 1, 10);

            // Should have removed duplicates
            expect(result.foods).toHaveLength(2);

            // Check that we have one 'Duplicate Food' and one 'Unique Food'
            const names = result.foods.map(({ name }) => name);
            expect(names).toContain("Duplicate Food");
            expect(names).toContain("Unique Food");
            expect(names.filter((n) => n === "Duplicate Food")).toHaveLength(1);
        });

        it("should prioritize results by relevance to query", async function () {
            const mockResult: FoodSearchResult = {
                currentPage: 1,
                foods: [
                    {
                        barcode: null,
                        brand: "Brand X",
                        calories: 100,
                        carbs: 10,
                        fat: 5,
                        foodType: "product",
                        id: "food1",
                        name: "Some Food",
                        protein: 10,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                    {
                        barcode: null,
                        brand: "Brand Y",
                        calories: 100,
                        carbs: 10,
                        fat: 5,
                        foodType: "product",
                        id: "food2",
                        name: "Exact Match",
                        protein: 10,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                    {
                        barcode: null,
                        brand: "Match Brand",
                        calories: 100,
                        carbs: 10,
                        fat: 5,
                        foodType: "product",
                        id: "food3",
                        imageUrl: "http://example.com/image.jpg",
                        name: "Another Food with Match",
                        protein: 10,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                ],
                totalCount: 3,
                totalPages: 1,
            };

            mockApi1.mockSearchFoods = vi.fn().mockResolvedValue(mockResult);
            mockApi2.mockSearchFoods = vi
                .fn()
                .mockResolvedValue({ currentPage: 1, foods: [], totalCount: 0, totalPages: 0 });
            // Search for 'match' - 'Exact Match' should be ranked higher
            const result = await combinedApi.searchFoods("match", 1, 10);
            // Check order of results (most relevant first)
            expect(result.foods[0].name).toBe("Exact Match");
        });

        it("should handle API errors gracefully", async function () {
            // First API throws an error
            mockApi1.mockSearchFoods = vi.fn().mockRejectedValue(new Error("API error"));
            // Second API returns results
            const mockResult: FoodSearchResult = {
                currentPage: 1,
                foods: [
                    {
                        barcode: null,
                        calories: 100,
                        carbs: 10,
                        fat: 5,
                        foodType: "product",
                        id: "food1",
                        name: "Food 1",
                        protein: 10,
                        servingSize: 100,
                        servingUnit: "g",
                        sugars: 4,
                    },
                ],
                totalCount: 1,
                totalPages: 1,
            };
            mockApi2.mockSearchFoods = vi.fn().mockResolvedValue(mockResult);
            // Should not throw but return results from successful API
            const result = await combinedApi.searchFoods("test", 1, 10);
            // Should log error
            expect(logger.error).toHaveBeenCalled();
            // Should still have results from the successful API
            expect(result.foods).toHaveLength(1);
            expect(result.foods[0].provider).toBe("MockApi2");
        });

        it("should handle all APIs failing gracefully", async function () {
            mockApi1.mockSearchFoods = vi.fn().mockRejectedValue(new Error("API 1 error"));
            mockApi2.mockSearchFoods = vi.fn().mockRejectedValue(new Error("API 2 error"));
            const result = await combinedApi.searchFoods("test", 1, 10);

            expect(result.foods).toHaveLength(0);
            expect(result.totalCount).toBe(0);
        });
    });
});
