import { ForecastResult, InventoryItem } from "./types";

export function forecastItem(item: InventoryItem): ForecastResult {
    const today = new Date();
    const statusTags: ForecastResult["statusTags"] = [];

    const daysToStockout =
        item.avgDailyUse > 0 ? item.quantityOnHand / item.avgDailyUse : null;

    let daysToExpiry: number | null = null;

    if (item.expirationDate) {
        const expiry = new Date(item.expirationDate);
        daysToExpiry = Math.ceil(
            (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
    }

    if (daysToExpiry !== null && daysToExpiry < 0) {
        statusTags.push("EXPIRED");
    }

    if (daysToStockout !== null && daysToStockout <= 3) {
        statusTags.push("LOW_STOCK");
    }

    if (daysToExpiry !== null && daysToExpiry <= 5 && daysToExpiry >= 0) {
        statusTags.push("EXPIRING_SOON");
    }

    if (
        daysToStockout !== null &&
        daysToExpiry !== null &&
        daysToExpiry >= 0 &&
        daysToExpiry < daysToStockout
    ) {
        statusTags.push("WASTE_RISK");
    }

    return {
        daysToStockout,
        daysToExpiry,
        statusTags,
        reorderSuggested: daysToStockout !== null ? daysToStockout <= 3 : false,
    };
}