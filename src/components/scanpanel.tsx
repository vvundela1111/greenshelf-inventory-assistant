"use client";

import { useState } from "react";
import { InventoryItem } from "@/lib/types";

type ScanPanelProps = {
    onCreateFromScan: (
        draft: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
    ) => Promise<void>;
};

export default function ScanPanel({ onCreateFromScan }: ScanPanelProps) {
    const [code, setCode] = useState("");
    const [preview, setPreview] = useState<{
        name: string;
        category: InventoryItem["category"];
        asset: InventoryItem["asset"];
    } | null>(null);

    function simulateScan() {
        const raw = code.trim().toLowerCase();

        if (!raw) return;

        let name = "New Scanned Item";
        let category: InventoryItem["category"] = "other";
        let emoji = "📦";

        if (raw.includes("milk")) {
            name = "Scanned Oat Milk";
            category = "perishable";
            emoji = "🥛";
        } else if (raw.includes("cup")) {
            name = "Scanned Cup Pack";
            category = "packaging";
            emoji = "🥤";
        } else if (raw.includes("coffee")) {
            name = "Scanned Coffee Beans";
            category = "ingredients";
            emoji = "☕";
        }

        setPreview({
            name,
            category,
            asset: { kind: "emoji", emoji },
        });
    }

    async function confirmCreate() {
        if (!preview) return;

        await onCreateFromScan({
            name: preview.name,
            category: preview.category,
            quantityOnHand: 1,
            unit: "unit",
            avgDailyUse: 0,
            expirationDate: null,
            asset: preview.asset,
            sustainability: {
                suggestedMaterials: [],
                certifications: [],
                endOfLife: "unknown",
                notes: "",
            },
        });

        setCode("");
        setPreview(null);
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
                Simulate a barcode or QR scan by typing a code or item keyword.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Type a code like milk-001 or cup-pack"
                    style={{
                        padding: "11px 12px",
                        borderRadius: 12,
                        border: "1px solid #d1d5db",
                        minWidth: 260,
                    }}
                />
                <button
                    onClick={simulateScan}
                    style={{
                        borderRadius: 12,
                        border: "none",
                        background: "#111827",
                        color: "white",
                        padding: "11px 16px",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    Simulate Scan
                </button>
            </div>

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
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Scan Result</div>
                    <div>Name: {preview.name}</div>
                    <div>Category: {preview.category}</div>
                    <div>Asset: {preview.asset?.kind === "emoji" ? preview.asset.emoji : "Image"}</div>

                    <button
                        onClick={confirmCreate}
                        style={{
                            marginTop: 12,
                            borderRadius: 12,
                            border: "none",
                            background: "#1f6feb",
                            color: "white",
                            padding: "10px 14px",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Add Scanned Item
                    </button>
                </div>
            )}
        </section>
    );
}