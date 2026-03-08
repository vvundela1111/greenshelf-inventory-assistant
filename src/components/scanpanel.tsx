"use client";

import { useState } from "react";
import { InventoryItem } from "@/lib/types";

type ScanDraft = Omit<InventoryItem, "id" | "createdAt" | "updatedAt">;

type ScanPanelProps = {
    onCreateFromScan: (draft: ScanDraft) => Promise<void>;
    onUseDraft?: (draft: ScanDraft) => void;
};

type ScanResult = {
    name: string;
    category: InventoryItem["category"];
    unit: string;
    avgDailyUse: number;
    suggestedMaterials: string[];
    notes: string;
    asset?: InventoryItem["asset"];
};

export default function ScanPanel({
    onCreateFromScan,
    onUseDraft,
}: ScanPanelProps) {
    const [code, setCode] = useState("");
    const [preview, setPreview] = useState<ScanResult | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    function simulateTextScan() {
        const raw = code.trim().toLowerCase();
        if (!raw) return;

        let result: ScanResult = {
            name: "New Scanned Item",
            category: "other",
            unit: "unit",
            avgDailyUse: 0,
            suggestedMaterials: [],
            notes: "",
            asset: { kind: "emoji", emoji: "📦" },
        };

        if (raw.includes("milk")) {
            result = {
                name: "Scanned Oat Milk",
                category: "perishable",
                unit: "carton",
                avgDailyUse: 2,
                suggestedMaterials: ["Order smaller batches to reduce spoilage"],
                notes: "Likely refrigerated item.",
                asset: { kind: "emoji", emoji: "🥛" },
            };
        } else if (raw.includes("cup")) {
            result = {
                name: "Scanned Cup Pack",
                category: "packaging",
                unit: "cup",
                avgDailyUse: 40,
                suggestedMaterials: ["Compostable cups", "FSC-certified paper cups"],
                notes: "Packaging item with material substitution potential.",
                asset: { kind: "emoji", emoji: "🥤" },
            };
        } else if (raw.includes("coffee")) {
            result = {
                name: "Scanned Coffee Beans",
                category: "ingredients",
                unit: "bag",
                avgDailyUse: 2,
                suggestedMaterials: ["Bulk delivery sacks"],
                notes: "Ingredient item with moderate daily usage.",
                asset: { kind: "emoji", emoji: "☕" },
            };
        }

        setError("");
        setPreview(result);
    }

    async function analyzeUploadedImage() {
        if (!file) return;

        setBusy(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/scan", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Image analysis failed");
            }

            setPreview({
                name: data.name,
                category: data.category,
                unit: data.unit,
                avgDailyUse: data.avgDailyUse,
                suggestedMaterials: data.suggestedMaterials ?? [],
                notes: data.notes ?? "",
                asset: data.asset,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image analysis failed");
        } finally {
            setBusy(false);
        }
    }

    async function confirmCreate() {
        if (!preview) return;

        await onCreateFromScan({
            name: preview.name,
            category: preview.category,
            quantityOnHand: 1,
            unit: preview.unit,
            avgDailyUse: preview.avgDailyUse,
            expirationDate: null,
            asset: preview.asset,
            sustainability: {
                suggestedMaterials: preview.suggestedMaterials,
                certifications: [],
                endOfLife: "unknown",
                notes: preview.notes,
            },
        });

        setCode("");
        setFile(null);
        setPreview(null);
    }

    function sendToDraftForm() {
        if (!preview || !onUseDraft) return;

        onUseDraft({
            name: preview.name,
            category: preview.category,
            quantityOnHand: 1,
            unit: preview.unit,
            avgDailyUse: preview.avgDailyUse,
            expirationDate: null,
            asset: preview.asset,
            sustainability: {
                suggestedMaterials: preview.suggestedMaterials,
                certifications: [],
                endOfLife: "unknown",
                notes: preview.notes,
            },
        });
    }

    return (
        <section
            style={{
                background: "white",
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
            }}
        >
            <h2 style={{ marginTop: 0 }}>Virtual Asset Scanning</h2>
            <p style={{ color: "#64748b" }}>
                Simulate a scan using text, or upload an item image and let AI analyze it.
            </p>

            <div
                style={{
                    display: "grid",
                    gap: 18,
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                }}
            >
                <div
                    style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 16,
                        background: "#fafafa",
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Text Scan</div>
                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Type a code like milk-001 or cup-pack"
                        style={{
                            padding: "11px 12px",
                            borderRadius: 12,
                            border: "1px solid #d1d5db",
                            width: "100%",
                            marginBottom: 10,
                        }}
                    />
                    <button
                        onClick={simulateTextScan}
                        style={primaryBtn}
                    >
                        Simulate Scan
                    </button>
                </div>

                <div
                    style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 16,
                        background: "#fafafa",
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Image Scan</div>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        style={{ marginBottom: 10 }}
                    />
                    <div style={{ color: "#64748b", fontSize: 13, marginBottom: 10 }}>
                        Upload a product or supply image. The AI will infer the item type and suggest fields.
                    </div>
                    <button
                        onClick={analyzeUploadedImage}
                        disabled={!file || busy}
                        style={{
                            ...primaryBtn,
                            opacity: !file || busy ? 0.6 : 1,
                            cursor: !file || busy ? "not-allowed" : "pointer",
                        }}
                    >
                        {busy ? "Analyzing..." : "Analyze Image"}
                    </button>
                </div>
            </div>

            {error && (
                <div
                    style={{
                        marginTop: 14,
                        background: "#fff1f2",
                        border: "1px solid #fecdd3",
                        color: "#be123c",
                        borderRadius: 12,
                        padding: 12,
                    }}
                >
                    {error}
                </div>
            )}

            {preview && (
                <div
                    style={{
                        marginTop: 18,
                        borderRadius: 14,
                        border: "1px solid #e5e7eb",
                        background: "#fafafa",
                        padding: 16,
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>Scan Result</div>

                    <div style={{ display: "grid", gap: 6 }}>
                        <div><strong>Name:</strong> {preview.name}</div>
                        <div><strong>Category:</strong> {preview.category}</div>
                        <div><strong>Unit:</strong> {preview.unit}</div>
                        <div><strong>Suggested daily use:</strong> {preview.avgDailyUse}</div>
                        <div><strong>Sustainability suggestions:</strong> {preview.suggestedMaterials.join(", ") || "None"}</div>
                        <div><strong>Notes:</strong> {preview.notes || "None"}</div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                        <button onClick={confirmCreate} style={primaryBtn}>
                            Add Scanned Item
                        </button>

                        {onUseDraft && (
                            <button onClick={sendToDraftForm} style={secondaryBtn}>
                                Use as Draft in Add Form
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

const primaryBtn: React.CSSProperties = {
    borderRadius: 12,
    border: "none",
    background: "#111827",
    color: "white",
    padding: "11px 16px",
    fontWeight: 700,
};

const secondaryBtn: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid #d1d5db",
    background: "white",
    color: "#111827",
    padding: "11px 16px",
    fontWeight: 700,
};