import { InventoryCategory, InventoryItem } from "./types";

const VALID_CATEGORIES: InventoryCategory[] = [
    "ingredients",
    "perishable",
    "packaging",
    "equipment",
    "cleaning",
    "other",
];

export function validateItemDraft(
    draft: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
): string[] {
    const errors: string[] = [];

    if (!draft.name || draft.name.trim().length < 2) {
        errors.push("Name is required.");
    }

    if (!VALID_CATEGORIES.includes(draft.category)) {
        errors.push("Invalid category.");
    }

    if (Number.isNaN(draft.quantityOnHand) || draft.quantityOnHand < 0) {
        errors.push("Quantity must be 0 or greater.");
    }

    if (Number.isNaN(draft.avgDailyUse) || draft.avgDailyUse < 0) {
        errors.push("Average daily use must be 0 or greater.");
    }

    if (!draft.unit || draft.unit.trim().length < 1) {
        errors.push("Unit is required.");
    }

    if (
        draft.asset?.kind === "upload" &&
        draft.asset.imageDataUrl.length > 600000
    ) {
        errors.push("Uploaded image is too large.");
    }

    return errors;
}