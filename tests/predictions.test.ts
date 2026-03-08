import { describe, expect, test } from "vitest";
import { forecastItem } from "../src/lib/predictions";
import { InventoryItem } from "../src/lib/types";

function makeItem(overrides: Partial<InventoryItem> = {}): InventoryItem {
    return {
        id: "test-item",
        name: "Coffee Beans",
        category: "ingredients",
        quantityOnHand: 10,
        unit: "bags",
        avgDailyUse: 2,
        expirationDate: null,
        sustainability: {
            suggestedMaterials: [],
            certifications: [],
            endOfLife: "unknown",
            notes: "",
        },
        createdAt: "2026-03-08T12:00:00.000Z",
        updatedAt: "2026-03-08T12:00:00.000Z",
        ...overrides,
    };
}

describe("forecastItem", () => {
    test("computes stockout days in a normal case", () => {
        const item = makeItem({
            quantityOnHand: 10,
            avgDailyUse: 2,
        });

        const result = forecastItem(item);

        expect(result.daysToStockout).toBe(5);
        expect(result.reorderSuggested).toBe(false);
    });

    test("handles zero daily usage without dividing by zero", () => {
        const item = makeItem({
            avgDailyUse: 0,
        });

        const result = forecastItem(item);

        expect(result.daysToStockout).toBeNull();
    });

    test("flags low stock when stockout is soon", () => {
        const item = makeItem({
            quantityOnHand: 4,
            avgDailyUse: 2,
        });

        const result = forecastItem(item);

        expect(result.statusTags).toContain("LOW_STOCK");
        expect(result.reorderSuggested).toBe(true);
    });

    test("flags waste risk when expiry happens before stockout", () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const item = makeItem({
            quantityOnHand: 20,
            avgDailyUse: 2,
            expirationDate: tomorrow.toISOString(),
        });

        const result = forecastItem(item);

        expect(result.statusTags).toContain("WASTE_RISK");
    });
});