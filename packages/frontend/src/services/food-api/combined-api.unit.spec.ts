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
        public readonly priority: number,
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

    beforeEach(function () {
        combinedApi = new CombinedFoodApi();
        mockApi1 = new MockApi("MockApi1", 1);
        mockApi2 = new MockApi("MockApi2", 2);
        // Exclude the combined API itself to avoid recursion
        vi.mocked(apiRegistry.getSearchProviders).mockReturnValue([mockApi1, mockApi2]);
        vi.mocked(apiRegistry.getBarcodeProviders).mockReturnValue([mockApi1, mockApi2]);
    });

    describe("getFoodByBarcode", function () {
        it("should try providers in priority order and return the first result", async function () {
            const mockFood: FoodItem = {
                barcode: null,
                calories: 100,
                carbs: 10,
                fat: 5,
                foodType: "product",
                id: "test",
                name: "Test Food",
                protein: 10,
                servingSize: 100,
                servingUnit: "g",
            };

            // First provider returns null, second provider returns a result
            mockApi1.mockGetFoodByBarcode = vi.fn().mockResolvedValue(null);
            mockApi2.mockGetFoodByBarcode = vi.fn().mockResolvedValue(mockFood);

            const result = await combinedApi.getFoodByBarcode("12345");

            expect(mockApi1.mockGetFoodByBarcode).toHaveBeenCalledWith("12345");
            expect(mockApi2.mockGetFoodByBarcode).toHaveBeenCalledWith("12345");
            expect(mockApi1.mockGetFoodByBarcode).toHaveBeenCalledBefore(
                vi.mocked(mockApi2.mockGetFoodByBarcode),
            );

            expect(result).toEqual({
                ...mockFood,
                provider: "MockApi2",
            });
        });

        it("should return null if no provider returns a result", async function () {
            mockApi1.mockGetFoodByBarcode = vi.fn().mockResolvedValue(null);
            mockApi2.mockGetFoodByBarcode = vi.fn().mockResolvedValue(null);

            const result = await combinedApi.getFoodByBarcode("12345");

            expect(result).toBeNull();
        });

        it("should continue to next provider if one throws an error", async function () {
            // First provider throws, second provider returns a result
            mockApi1.mockGetFoodByBarcode = vi.fn().mockRejectedValue(new Error("API error"));

            const mockFood: FoodItem = {
                barcode: null,
                calories: 100,
                carbs: 10,
                fat: 5,
                foodType: "product",
                id: "test",
                name: "Test Food",
                protein: 10,
                servingSize: 100,
                servingUnit: "g",
            };

            mockApi2.mockGetFoodByBarcode = vi.fn().mockResolvedValue(mockFood);

            const result = await combinedApi.getFoodByBarcode("12345");

            // Should log error from first provider
            expect(logger.error).toHaveBeenCalled();
            // Should return result from second provider
            expect(result).toEqual({
                ...mockFood,
                provider: "MockApi2",
            });
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
