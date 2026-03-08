import { ForecastResult } from "../src/lib/types";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";


describe("generateInsight fallback behavior", () => {
    const OLD_ENV = process.env.OPENAI_API_KEY;

    beforeEach(() => {
        vi.resetModules();
        delete process.env.OPENAI_API_KEY;
    });

    afterEach(() => {
        process.env.OPENAI_API_KEY = OLD_ENV;
    });

    test("returns fallback mode when OPENAI_API_KEY is missing", async () => {
        const { generateInsight } = await import("../src/lib/aiInsight.server");

        const item = {
            id: "milk-1",
            name: "Oat Milk",
            category: "perishable" as const,
            quantityOnHand: 2,
            unit: "cartons",
            avgDailyUse: 2,
            expirationDate: "2026-03-10",
            sustainability: {
                suggestedMaterials: [],
                certifications: [],
                endOfLife: "unknown" as const,
                notes: "",
            },
            createdAt: "2026-03-08T12:00:00.000Z",
            updatedAt: "2026-03-08T12:00:00.000Z",
        };

        const forecast: ForecastResult = {
            daysToStockout: 1,
            daysToExpiry: 2,
            statusTags: ["LOW_STOCK", "EXPIRING_SOON"],
            reorderSuggested: true,
        };

        const result = await generateInsight(item, forecast);

        expect(result.mode).toBe("fallback");
        expect(result.text.toLowerCase()).toContain("oat milk");
    });
});