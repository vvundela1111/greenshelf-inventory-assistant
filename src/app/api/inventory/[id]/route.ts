import { NextResponse } from "next/server";
import { patchInventoryItem } from "@/lib/storage.server";
import { InventoryItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const updates = (await req.json()) as Partial<InventoryItem>;

    const item = await patchInventoryItem(id, updates);

    if (!item) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
}