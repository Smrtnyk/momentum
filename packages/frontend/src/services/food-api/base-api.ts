import type { FoodItem } from "../../types/health-metrics";

export interface FoodApiProvider {
    getFoodByBarcode?(barcode: string): Promise<FoodItem | null>;
    name: string;
    searchFoods(query: string, page: number, pageSize: number): Promise<FoodSearchResult>;
}

export interface FoodSearchResult {
    currentPage: number;
    foods: FoodItem[];
    totalCount: number;
    totalPages: number;
}
