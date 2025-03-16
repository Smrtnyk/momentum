import { beforeEach, describe, expect, it, vi } from "vitest";

import chiefsCoffeeResponse from "../../../testing-data/products/open-food-repo/chiefs-coffee-county.json";
import chiefsMultipleResponse from "../../../testing-data/products/open-food-repo/chiefs-multiple.json";
import { OpenFoodRepoApi } from "./open-food-repo";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

vi.hoisted(() => vi.stubEnv("VITE_OPEN_FOOD_REPO_API_KEY", "test-api-key"));

describe("OpenFoodRepoApi", () => {
    let api: OpenFoodRepoApi;

    beforeEach(() => {
        api = new OpenFoodRepoApi();
        mockFetch.mockClear();
    });

    describe("getFoodByBarcode", () => {
        it("should correctly extract product information from barcode search", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => chiefsCoffeeResponse,
                ok: true,
            });

            const result = await api.getFoodByBarcode("7640151710750");

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringMatching(/products\/_search/),
                expect.objectContaining({
                    body: expect.stringContaining("7640151710750"),
                    headers: expect.objectContaining({
                        Authorization: expect.stringContaining("test-api-key"),
                    }),
                    method: "POST",
                }),
            );

            expect(result).not.toBeNull();
            expect(result?.name).toBe("Chiefs : Coffee County : Milk Protein : Caramel Macchiato");
            expect(result?.barcode).toBe("7640151710750");
            expect(result?.id).toBe("ofr-15678");
            expect(result?.source).toBe("OpenFoodRepo");
            expect(result?.imageUrl).toBe(
                "https://d2v5oodgkvnw88.cloudfront.net/uploads_production/image/data/72014/medium_7640151710750.jpg?v=1482979780",
            );
        });

        it("should correctly extract calories and nutrition information", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => chiefsCoffeeResponse,
                ok: true,
            });

            const result = await api.getFoodByBarcode("7640151710750");

            expect(result).not.toBeNull();
            // response has energy_calories_kcal with per_hundred value of 50
            expect(result?.calories).toBe(50);
            expect(result?.carbs).toBe(2.3);
            expect(result?.fat).toBe(1.1);
            expect(result?.protein).toBe(7.7);
            expect(result?.servingSize).toBe(100);
            expect(result?.servingUnit).toBe("ml");
        });

        it("should return null when product is not found", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => ({
                    hits: {
                        hits: [],
                        total: 0,
                    },
                }),
                ok: true,
            });

            const result = await api.getFoodByBarcode("non-existent-barcode");

            expect(result).toBeNull();
        });

        it("should handle fetch errors gracefully", async () => {
            mockFetch.mockRejectedValueOnce(new Error("Network error"));

            const result = await api.getFoodByBarcode("7640151710750");

            expect(result).toBeNull();
        });
    });

    describe("searchFoods", () => {
        it("should correctly return a list of products from search", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => chiefsMultipleResponse,
                ok: true,
            });

            const result = await api.searchFoods("chiefs", 1, 10);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringMatching(/products\/_search/),
                expect.objectContaining({
                    body: expect.stringContaining("chiefs"),
                    headers: expect.objectContaining({
                        Authorization: expect.stringContaining("test-api-key"),
                    }),
                    method: "POST",
                }),
            );

            expect(result).not.toBeNull();
            expect(result.foods).toHaveLength(10);
            expect(result.totalCount).toBe(21);
            expect(result.currentPage).toBe(1);

            expect(result.foods[0].name).toBe("Chiefs - Protein Müesli (Classic)");
            expect(result.foods[0].barcode).toBe("7640151713027");
            expect(result.foods[0].id).toBe("ofr-379305");
            expect(result.foods[0].calories).toBe(73);
            expect(result.foods[0].carbs).toBe(7.6);
            expect(result.foods[0].fat).toBe(1.3);
            expect(result.foods[0].protein).toBe(8.1);
        });

        it("should handle pagination correctly", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => chiefsMultipleResponse,
                ok: true,
            });

            const page1Result = await api.searchFoods("chiefs", 1, 5);

            expect(page1Result.currentPage).toBe(1);
            expect(page1Result.totalPages).toBe(Math.ceil(21 / 5));

            expect(mockFetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: expect.stringContaining('"from":0'),
                }),
            );

            mockFetch.mockClear();

            mockFetch.mockResolvedValueOnce({
                json: () => chiefsMultipleResponse,
                ok: true,
            });

            const page2Result = await api.searchFoods("chiefs", 2, 5);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: expect.stringContaining('"from":5'),
                }),
            );

            expect(page2Result.currentPage).toBe(2);
        });

        it("should return empty result when no products found", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => ({
                    hits: {
                        hits: [],
                        total: 0,
                    },
                }),
                ok: true,
            });

            const result = await api.searchFoods("nonexistent-product");

            expect(result.foods).toHaveLength(0);
            expect(result.totalCount).toBe(0);
            expect(result.totalPages).toBe(0);
        });

        it("should handle fetch errors gracefully", async () => {
            mockFetch.mockRejectedValueOnce(new Error("Network error"));

            const result = await api.searchFoods("chiefs");

            expect(result.foods).toHaveLength(0);
            expect(result.totalCount).toBe(0);
            expect(result.totalPages).toBe(0);
        });
    });

    describe("Nutrient extraction logic", () => {
        it("should extract calories from energy_calories_kcal field when available", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => chiefsCoffeeResponse,
                ok: true,
            });

            const result = await api.getFoodByBarcode("7640151710750");

            // response has both energy and energy_calories_kcal
            // It should prefer energy_calories_kcal
            expect(result?.calories).toBe(50);
        });

        it("should convert energy from kJ to kcal when no calories field is available", async () => {
            // response with only energy (no energy_calories_kcal)
            const modifiedResponse = JSON.parse(JSON.stringify(chiefsCoffeeResponse));
            const source = modifiedResponse.hits.hits[0]._source;

            // keep only energy in kJ
            // 211 kJ ≈ 50 kcal
            delete source.nutrients.energy_calories_kcal;
            source.nutrients.energy.per_hundred = 211;

            mockFetch.mockResolvedValueOnce({
                json: () => modifiedResponse,
                ok: true,
            });

            const result = await api.getFoodByBarcode("7640151710750");

            // Should be 211 kJ ≈ 50 kcal
            expect(result?.calories).toBeCloseTo(50, 0);
        });

        it("should detect liquid products correctly", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => chiefsCoffeeResponse,
                ok: true,
            });

            const liquidResult = await api.getFoodByBarcode("7640151710750");
            expect(liquidResult?.servingUnit).toBe("ml");

            const muesliResponse = {
                hits: {
                    hits: [
                        {
                            _source: chiefsMultipleResponse.hits.hits[0]._source,
                        },
                    ],
                },
            };

            mockFetch.mockResolvedValueOnce({
                json: () => muesliResponse,
                ok: true,
            });

            const solidResult = await api.getFoodByBarcode("7640151713027");
            expect(solidResult?.servingUnit).toBe("g");
        });
    });
});
