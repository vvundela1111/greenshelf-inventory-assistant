import { NextResponse } from "next/server";
import { readInventory } from "@/lib/storage.server";
import { forecastItem } from "@/lib/predictions";
import { generateInsight } from "@/lib/aiInsight.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { id } = (await req.json()) as { id: string };

    const items = await readInventory();
    const item = items.find((entry) => entry.id === id);

    if (!item) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const forecast = forecastItem(item);
    const insight = await generateInsight(item, forecast);

    return NextResponse.json({
        forecast,
        insight,
    });
}