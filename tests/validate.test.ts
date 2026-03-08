import { describe, expect, test } from "vitest";
import { validateItemDraft } from "../src/lib/validate";
import { InventoryItem } from "../src/lib/types";

type DraftItem = Omit<InventoryItem, "id" | "createdAt" | "updatedAt">;

function makeDraft(overrides: Partial<DraftItem> = {}): DraftItem {
    return {
        name: "Oat Milk",
        category: "perishable",
        quantityOnHand: 8,
        unit: "cartons",
        avgDailyUse: 3,
        expirationDate: "2026-03-12",
        sustainability: {
            suggestedMaterials: [],
            certifications: [],
            endOfLife: "unknown",
            notes: "",
        },
        ...overrides,
    };
}

describe("validateItemDraft", () => {
    test("returns no errors for a valid draft", () => {
        const draft = makeDraft();
        const errors = validateItemDraft(draft);

        expect(errors).toEqual([]);
    });

    test("rejects negative quantity", () => {
        const draft = makeDraft({
            quantityOnHand: -1,
        });

        const errors = validateItemDraft(draft);

        expect(errors).toContain("Quantity must be 0 or greater.");
    });

    test("rejects missing name", () => {
        const draft = makeDraft({
            name: "",
        });

        const errors = validateItemDraft(draft);

        expect(errors).toContain("Name is required.");
    });

    test("rejects missing unit", () => {
        const draft = makeDraft({
            unit: "",
        });

        const errors = validateItemDraft(draft);

        expect(errors).toContain("Unit is required.");
    });
});