// src/lib/sustainability.ts
import { InventoryItem, SustainabilityInfo } from "./types";

export function suggestSustainability(item: InventoryItem): SustainabilityInfo {
    const name = item.name.toLowerCase();
    const cat = item.category;

    // Default suggestions: conservative, practical.
    if (cat === "packaging") {
        const suggestedMaterials = [
            "FSC-certified paper/cardboard where applicable",
            "Reuse program (customer cup discount) where feasible",
        ];
        const certifications = ["FSC"];

        if (name.includes("cup") || name.includes("lid")) {
            suggestedMaterials.push("Verify compostable claims and local acceptance");
            certifications.push("BPI"); // as a familiar compostable-logo signal
            return {
                suggestedMaterials,
                certifications,
                endOfLife: "compost",
                notes:
                    "If using compostables, confirm your local hauler/facility accepts them. Prefer reuse when feasible.",
            };
        }

        return { suggestedMaterials, certifications, endOfLife: "recycle" };
    }

    if (cat === "ingredients" || cat === "perishable") {
        return {
            suggestedMaterials: [
                "Bulk purchasing to reduce packaging",
                "Local supplier option (reduce transport) when feasible",
                "Right-size orders to reduce spoilage",
            ],
            endOfLife: "unknown",
            notes: "Focus on waste prevention: buy what you can use before expiry.",
        };
    }

    return {
        suggestedMaterials: ["Choose durable, repairable options where feasible"],
        endOfLife: "unknown",
    };
}
