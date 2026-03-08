import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function toBase64(buffer: ArrayBuffer) {
    return Buffer.from(buffer).toString("base64");
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "Missing OPENAI_API_KEY" },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
            return NextResponse.json(
                { error: "Unsupported file type" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64 = toBase64(arrayBuffer);
        const dataUrl = `data:${file.type};base64,${base64}`;

        const prompt = `
You are analyzing an inventory item image for a small cafe inventory app.

Look at the image and infer the most likely inventory item shown.

Return ONLY valid JSON with this exact shape:
{
  "name": "string",
  "category": "ingredients | perishable | packaging | equipment | cleaning | other",
  "unit": "string",
  "avgDailyUse": number,
  "suggestedMaterials": ["string"],
  "notes": "string",
  "emoji": "string"
}

Rules:
- Be conservative and practical.
- If uncertain, choose the closest reasonable category.
- Keep avgDailyUse small and realistic.
- suggestedMaterials should be useful greener alternatives when relevant.
- If the item is not clearly a packaging/material item, suggestedMaterials can be [].
- Do not include markdown.
    `.trim();

        const input: any = [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: prompt,
                    },
                    {
                        type: "input_image",
                        image_url: dataUrl,
                    },
                ],
            },
        ];

        const response = await client.responses.create({
            model: "gpt-5",
            input,
        });

        const text = response.output_text?.trim();

        if (!text) {
            throw new Error("Empty model response");
        }

        const parsed = JSON.parse(text);

        return NextResponse.json({
            name: parsed.name ?? "Scanned Item",
            category: parsed.category ?? "other",
            unit: parsed.unit ?? "unit",
            avgDailyUse:
                typeof parsed.avgDailyUse === "number" ? parsed.avgDailyUse : 0,
            suggestedMaterials: Array.isArray(parsed.suggestedMaterials)
                ? parsed.suggestedMaterials
                : [],
            notes: parsed.notes ?? "",
            asset: {
                kind: "upload",
                imageDataUrl: dataUrl,
                fileName: file.name,
                mimeType: file.type,
            },
            emoji: parsed.emoji ?? "📦",
        });
    } catch (error) {
        console.error("scan route error:", error);
        return NextResponse.json(
            { error: "Image analysis failed" },
            { status: 500 }
        );
    }
}