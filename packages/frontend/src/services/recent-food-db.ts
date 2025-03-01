import type { Table } from "dexie";

import { Dexie } from "dexie";

import type { FoodItem } from "../types/food";

import { logger } from "../logger/app-logger";

type RecentFood = FoodItem & {
    lastUsed: number;
    useCount: number;
    userId: string;
};

const MAX_RECENT_FOODS = 50;
const MAX_AGE_DAYS = 30;

class RecentFoodsDatabase extends Dexie {
    declare recentFoods: Table<RecentFood>;

    constructor() {
        super("RecentFoodsDatabase");

        // schema with indexes
        this.version(1).stores({
            recentFoods: "&id, userId, barcode, lastUsed, useCount",
        });
    }
}

const db = new RecentFoodsDatabase();

export async function addRecentFood(userId: string, food: FoodItem): Promise<void> {
    try {
        const existingFood = await db.recentFoods.where({ id: food.id, userId }).first();

        if (existingFood) {
            await db.recentFoods.update(food.id, {
                ...structuredClone(food),
                lastUsed: Date.now(),
                useCount: (existingFood.useCount || 0) + 1,
                userId,
            });
        } else {
            await db.recentFoods.add({
                ...structuredClone(food),
                lastUsed: Date.now(),
                useCount: 1,
                userId,
            });
        }

        await cleanupRecentFoods(userId);
    } catch (error) {
        logger.error(error, "RecentFoodsService", { food, userId });
    }
}

export async function findRecentFoodByBarcode(
    userId: string,
    barcode: string,
): Promise<FoodItem | undefined> {
    try {
        return await db.recentFoods.where({ barcode, userId }).first();
    } catch (error) {
        logger.error(error, "RecentFoodsService", { barcode, userId });
        return undefined;
    }
}

export async function getRecentFoods(userId: string, limitVal = 10): Promise<FoodItem[]> {
    try {
        await removeExpiredFoods(userId);

        const foods = await db.recentFoods.where("userId").equals(userId).sortBy("lastUsed");

        return foods.reverse().slice(0, limitVal);
    } catch (error) {
        logger.error(error, "RecentFoodsService", { userId });
        return [];
    }
}

export async function removeRecentFood(userId: string, foodId: string): Promise<void> {
    try {
        await db.recentFoods.where({ id: foodId, userId }).delete();
    } catch (error) {
        logger.error(error, "RecentFoodsService", { foodId, userId });
        throw new Error("Failed to remove food from recent foods");
    }
}

async function cleanupRecentFoods(userId: string): Promise<void> {
    try {
        const count = await db.recentFoods.where("userId").equals(userId).count();

        if (count <= MAX_RECENT_FOODS) {
            return;
        }

        const allFoods = await db.recentFoods.where("userId").equals(userId).toArray();

        // Sort by use count first (keep most used), then by last used (keep most recent)
        allFoods.sort((a, b) => {
            if (b.useCount !== a.useCount) {
                return b.useCount - a.useCount;
            }
            return b.lastUsed - a.lastUsed;
        });

        // items beyond the max limit
        const foodsToRemove = allFoods.slice(MAX_RECENT_FOODS);
        const idsToRemove = foodsToRemove.map((food) => food.id);

        if (idsToRemove.length > 0) {
            await db.recentFoods
                .where("id")
                .anyOf(idsToRemove)
                .and((item) => item.userId === userId)
                .delete();
        }
    } catch (error) {
        logger.error(error, "RecentFoodsService", { userId });
    }
}

async function removeExpiredFoods(userId: string): Promise<void> {
    try {
        const now = Date.now();
        // days to milliseconds
        const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
        const cutoffTime = now - maxAge;

        await db.recentFoods
            .where("userId")
            .equals(userId)
            .and((item) => item.lastUsed < cutoffTime)
            .delete();
    } catch (error) {
        logger.error(error, "RecentFoodsService", { userId });
    }
}
