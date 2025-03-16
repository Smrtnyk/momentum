import { beforeEach, describe, expect, it, vi } from "vitest";

import oatMilkData from "../../../testing-data/products/open-food-facts/oat-milk.json";
import { OpenFoodFactsApi } from "./open-food-facts";

vi.mock("../../src/logger/app-logger", () => ({
    logger: {
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("OpenFoodFactsApi", () => {
    let api: OpenFoodFactsApi;

    beforeEach(() => {
        api = new OpenFoodFactsApi();
        mockFetch.mockClear();
    });

    describe("getFoodByBarcode", () => {
        it("should correctly extract calories and nutrition information", async () => {
            const mockProductResponse = {
                product: {
                    brands: "Dr.Oetker",
                    code: "4023600014181",
                    nutriments: {
                        carbohydrates_100g: 8.6,
                        "energy-kcal_100g": 81,
                        fat_100g: 1.6,
                        proteins_100g: 7.5,
                        salt_100g: 0.1875,
                        "saturated-fat_100g": 1,
                        sugars_100g: 4.4,
                    },
                    product_name: "High Protein Pudding",
                },
                status: 1,
            };

            mockFetch.mockResolvedValueOnce({
                json: () => mockProductResponse,
                ok: true,
            });

            const result = await api.getFoodByBarcode("4023600014181");
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("4023600014181"));

            expect(result).not.toBeNull();
            expect(result?.calories).toBe(81);
            expect(result?.carbs).toBe(8.6);
            expect(result?.fat).toBe(1.6);
            expect(result?.protein).toBe(7.5);

            expect(result?.name).toBe("High Protein Pudding");
            expect(result?.brand).toBe("Dr.Oetker");
            expect(result?.barcode).toBe("4023600014181");
        });

        it("should return null if product has no nutriments", async () => {
            const mockProductResponse = {
                product: {
                    brands: "Dr.Oetker",
                    code: "4023600014181",
                    product_name: "High Protein Pudding",
                },
                status: 1,
            };

            mockFetch.mockResolvedValueOnce({
                json: () => mockProductResponse,
                ok: true,
            });

            const result = await api.getFoodByBarcode("4023600014181");
            expect(result).not.toBeNull();
            expect(result?.calories).toBe(0);
            expect(result?.carbs).toBe(0);
            expect(result?.fat).toBe(0);
            expect(result?.protein).toBe(0);
        });

        it("should handle energy field in kJ instead of kcal", async () => {
            const mockProductResponse = {
                product: {
                    brands: "Dr.Oetker",
                    code: "4023600014181",
                    nutriments: {
                        carbohydrates_100g: 8.6,
                        energy_100g: 339,
                        fat_100g: 1.6,
                        proteins_100g: 7.5,
                    },
                    product_name: "High Protein Pudding",
                },
                status: 1,
            };

            mockFetch.mockResolvedValueOnce({
                json: () => mockProductResponse,
                ok: true,
            });

            const result = await api.getFoodByBarcode("4023600014181");
            // Should convert kJ to kcal properly (339 kJ ≈ 81 kcal)
            expect(result).not.toBeNull();
            expect(result?.calories).toBe(81);
        });

        it("should correctly handle oat milk product with serving size of 250ml", async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => oatMilkData,
                ok: true,
            });

            const result = await api.getFoodByBarcode("4099200240268");

            expect(result).not.toBeNull();
            expect(result?.name).toBe("Hafer-Drink Natur");
            expect(result?.brand).toBe("Zurück zum Ursprung");

            expect(result?.servingSize).toBe(250);
            expect(result?.servingUnit).toBe("ml");

            // For 250ml (original serving size from product data)
            // The nutrition values should be properly scaled from 100ml values
            // Per 100ml: 41.6 kcal, 0.8g protein, 7.6g carbs, 0.8g fat
            // Expected for 250ml: 104 kcal, 2g protein, 19g carbs, 2g fat
            expect(result?.calories).toBe(104);
            expect(result?.protein).toBe(2);
            expect(result?.carbs).toBe(19);
            expect(result?.fat).toBe(2);
        });
    });
});
