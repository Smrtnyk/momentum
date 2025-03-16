import { describe, expect, it, vi } from "vitest";

import { logger } from "../../logger/app-logger";
import { AbstractFoodApi, FoodApiError } from "./abstract-food-api";

vi.mock("../../logger/app-logger", () => ({
    logger: {
        error: vi.fn(),
    },
}));

class TestFoodApi extends AbstractFoodApi {
    readonly name = "TestApi";
    readonly priority = 1;
    supportsBarcode = false;

    // eslint-disable-next-line require-await -- api compatibility
    async searchFoods(query: string, page: number): Promise<any> {
        return {
            currentPage: page,
            foods: [],
            totalCount: 0,
            totalPages: 0,
        };
    }
}

describe("AbstractFoodApi", () => {
    describe("isLiquidProduct", () => {
        it("should correctly identify liquid products", () => {
            const api = new TestFoodApi();

            const isLiquid = (api as any).isLiquidProduct.bind(api);

            expect(isLiquid("Orange Juice")).toBe(true);
            expect(isLiquid("Milk 3.5%")).toBe(true);
            expect(isLiquid("Coca Cola Drink")).toBe(true);
            expect(isLiquid("Apple Water")).toBe(true);

            expect(isLiquid("Bread")).toBe(false);
            expect(isLiquid("Chicken")).toBe(false);
            expect(isLiquid("Rice")).toBe(false);
        });

        it("should handle empty or null product names", () => {
            const api = new TestFoodApi();
            const isLiquid = (api as any).isLiquidProduct.bind(api);

            expect(isLiquid("")).toBe(false);
            expect(isLiquid(null)).toBe(false);
            expect(isLiquid(undefined)).toBe(false);
        });
    });

    describe("logError", function () {
        it("should log errors with api name and operation", function () {
            const api = new TestFoodApi();
            const logError = (api as any).logError.bind(api);

            const error = new Error("Test error");
            logError(error, "testOperation");

            expect(logger.error).toHaveBeenCalledWith(error, "TestApiAPI.testOperation", undefined);
        });

        it("should convert non-Error objects to Error instances", function () {
            const api = new TestFoodApi();
            const logError = (api as any).logError.bind(api);

            logError("string error", "testOperation");

            expect(logger.error).toHaveBeenCalled();
            const args = vi.mocked(logger.error).mock.calls[0];
            expect(args[0]).toBeInstanceOf(Error);

            expect(args[0]).toBeInstanceOf(Error);
            expect(args[1]).toBe("TestApiAPI.testOperation");
        });

        it("should include metadata when provided", function () {
            const api = new TestFoodApi();
            const logError = (api as any).logError.bind(api);

            const metadata = { key: "value" };
            logError(new Error("Test error"), "testOperation", metadata);

            expect(logger.error).toHaveBeenCalledWith(
                expect.any(Error),
                "TestApiAPI.testOperation",
                metadata,
            );
        });
    });

    describe("getFoodByBarcode", () => {
        it("should return null by default", async () => {
            const api = new TestFoodApi();
            const result = await api.getFoodByBarcode("12345");

            expect(result).toBeNull();
        });
    });

    describe("FoodApiError", () => {
        it("should create correct error instance", () => {
            const error = new FoodApiError("Test error message", "TestApi", "testOperation", {
                data: "test",
            });

            expect(error.message).toBe("Test error message");
            expect(error.apiName).toBe("TestApi");
            expect(error.operation).toBe("testOperation");
            expect(error.metadata).toEqual({ data: "test" });
            expect(error.name).toBe("FoodApiError");
        });
    });
});
