import { NextResponse } from "next/server";
import { addInventoryItem, readInventory } from "@/lib/storage.server";
import { validateItemDraft } from "@/lib/validate";
import { InventoryItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const items = await readInventory();
    return NextResponse.json({ items });
}

export async function POST(req: Request) {
    const draft = (await req.json()) as Omit<
        InventoryItem,
        "id" | "createdAt" | "updatedAt"
    >;

    const errors = validateItemDraft(draft);

    if (errors.length > 0) {
        return NextResponse.json({ errors }, { status: 400 });
    }

    const item = await addInventoryItem(draft);
    return NextResponse.json({ item }, { status: 201 });
}