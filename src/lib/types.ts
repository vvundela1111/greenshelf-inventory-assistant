export type InventoryCategory =
    | "ingredients"
    | "perishable"
    | "packaging"
    | "equipment"
    | "cleaning"
    | "other";

export type EndOfLife =
    | "reuse"
    | "recycle"
    | "compost"
    | "landfill"
    | "unknown";

export type ItemAsset =
    | {
        kind: "emoji";
        emoji: string;
    }
    | {
        kind: "upload";
        imageDataUrl: string;
        fileName: string;
        mimeType: string;
    };

export type SustainabilityInfo = {
    suggestedMaterials: string[];
    certifications?: string[];
    endOfLife?: EndOfLife;
    notes?: string;
};

export type InventoryItem = {
    id: string;
    name: string;
    category: InventoryCategory;
    quantityOnHand: number;
    unit: string;
    avgDailyUse: number;
    expirationDate: string | null;
    asset?: ItemAsset;
    sustainability?: SustainabilityInfo;
    createdAt: string;
    updatedAt: string;
};

export type ForecastTag =
    | "LOW_STOCK"
    | "EXPIRING_SOON"
    | "WASTE_RISK"
    | "EXPIRED";

export type ForecastResult = {
    daysToStockout: number | null;
    daysToExpiry: number | null;
    statusTags: ForecastTag[];
    reorderSuggested: boolean;
};

export type InsightResult = {
    mode: "ai" | "fallback";
    text: string;
};