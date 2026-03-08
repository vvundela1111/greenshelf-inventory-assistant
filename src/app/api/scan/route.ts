import { NextResponse } from "next/server";
import { inferCategoryFromText, titleizeFileName } from "@/lib/scanmock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 350000;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function toBase64(buffer: ArrayBuffer) {
    return Buffer.from(buffer).toString("base64");
}

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const inferredName = titleizeFileName(file.name);
    const inferredCategory = inferCategoryFromText(inferredName);

    const buffer = await file.arrayBuffer();
    const base64 = toBase64(buffer);

    const asset = {
        kind: "upload" as const,
        imageDataUrl: `data:${file.type};base64,${base64}`,
        fileName: file.name,
        mimeType: file.type,
    };

    return NextResponse.json({
        inferredName,
        inferredCategory,
        asset,
    });
}