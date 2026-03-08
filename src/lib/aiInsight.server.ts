import OpenAI from "openai";
import { ForecastResult, InsightResult, InventoryItem } from "./types";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function buildFallback(item: InventoryItem, forecast: ForecastResult): string {
    const parts: string[] = [];

    if (forecast.daysToStockout !== null) {
        parts.push(`Stockout in about ${forecast.daysToStockout.toFixed(1)} days.`);
    } else {
        parts.push("Stockout timing is unknown because daily use is 0.");
    }

    if (forecast.daysToExpiry !== null) {
        parts.push(`Expires in ${forecast.daysToExpiry} days.`);
    }

    if (forecast.reorderSuggested) {
        parts.push("Reorder is recommended soon.");
    }

    if (forecast.statusTags.includes("WASTE_RISK")) {
        parts.push("This item may expire before it is fully used.");
    }

    return `${item.name}: ${parts.join(" ")}`;
}

export async function generateInsight(
    item: InventoryItem,
    forecast: ForecastResult
): Promise<InsightResult> {
    const fallback = buildFallback(item, forecast);

    if (!process.env.OPENAI_API_KEY) {
        return { mode: "fallback", text: fallback };
    }

    try {
        const prompt = `
You are helping a small cafe avoid stockouts and reduce waste.

Use only the provided data.
Do not invent facts or numbers.
Write 2 short practical sentences.

Item: ${item.name}
Category: ${item.category}
Quantity: ${item.quantityOnHand} ${item.unit}
Average daily use: ${item.avgDailyUse}
Days to stockout: ${forecast.daysToStockout ?? "unknown"}
Days to expiry: ${forecast.daysToExpiry ?? "none"}
Status tags: ${forecast.statusTags.join(", ") || "none"}
Reorder suggested: ${forecast.reorderSuggested ? "yes" : "no"}
    `.trim();

        const response = await client.responses.create({
            model: "gpt-5",
            input: prompt,
        });

        const text = response.output_text?.trim();

        if (!text) {
            return { mode: "fallback", text: fallback };
        }

        return {
            mode: "ai",
            text,
        };
    } catch {
        return {
            mode: "fallback",
            text: fallback,
        };
    }
}