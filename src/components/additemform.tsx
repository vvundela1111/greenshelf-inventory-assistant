"use client";

import { useState } from "react";
import { InventoryItem } from "@/lib/types";
import { validateItemDraft } from "@/lib/validate";

type AddItemFormProps = {
    onAdd: (
        item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
    ) => Promise<InventoryItem>;
};

type AddItemFormState = {
    name: string;
    category: InventoryItem["category"];
    quantityOnHand: number;
    unit: string;
    avgDailyUse: number;
    expirationDate: string;
    asset?: InventoryItem["asset"];
    sustainability: {
        suggestedMaterials: string[];
        certifications: string[];
        endOfLife: "reuse" | "recycle" | "compost" | "landfill" | "unknown";
        notes: string;
    };
};

const initialForm: AddItemFormState = {
    name: "",
    category: "other",
    quantityOnHand: 0,
    unit: "",
    avgDailyUse: 0,
    expirationDate: "",
    asset: { kind: "emoji", emoji: "🌿" },
    sustainability: {
        suggestedMaterials: [],
        certifications: [],
        endOfLife: "unknown",
        notes: "",
    },
};

export default function AddItemForm({ onAdd }: AddItemFormProps) {
    const [form, setForm] = useState<AddItemFormState>(initialForm);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState("");

    function updateField<K extends keyof AddItemFormState>(
        name: K,
        value: AddItemFormState[K]
    ) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const draft: Omit<InventoryItem, "id" | "createdAt" | "updatedAt"> = {
            ...form,
            expirationDate: form.expirationDate || null,
        };

        const validationErrors = validateItemDraft(draft);
        if (validationErrors.length) {
            setErrors(validationErrors);
            setSuccess("");
            return;
        }

        const created = await onAdd(draft);
        setErrors([]);
        setSuccess(`${created.name} added to inventory.`);
        setForm(initialForm);
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
            <h2 style={{ marginTop: 0 }}>Add Item</h2>
            <p style={{ color: "#64748b" }}>
                Add a new inventory item with usage and sustainability details.
            </p>

            {errors.length > 0 && (
                <div
                    style={{
                        background: "#fff1f2",
                        border: "1px solid #fecdd3",
                        color: "#be123c",
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 14,
                    }}
                >
                    {errors.map((error) => (
                        <div key={error}>{error}</div>
                    ))}
                </div>
            )}

            {success && (
                <div
                    style={{
                        background: "#ecfdf5",
                        border: "1px solid #bbf7d0",
                        color: "#166534",
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 14,
                    }}
                >
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={grid}>
                    <input
                        style={input}
                        placeholder="Item name"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                    />

                    <select
                        style={input}
                        value={form.category}
                        onChange={(e) =>
                            updateField("category", e.target.value as InventoryItem["category"])
                        }
                    >
                        <option value="ingredients">Ingredients</option>
                        <option value="perishable">Perishable</option>
                        <option value="packaging">Packaging</option>
                        <option value="equipment">Equipment</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="other">Other</option>
                    </select>

                    <input
                        style={input}
                        type="number"
                        placeholder="Quantity"
                        value={form.quantityOnHand}
                        onChange={(e) => updateField("quantityOnHand", Number(e.target.value))}
                    />

                    <input
                        style={input}
                        placeholder="Unit"
                        value={form.unit}
                        onChange={(e) => updateField("unit", e.target.value)}
                    />

                    <input
                        style={input}
                        type="number"
                        placeholder="Average daily use"
                        value={form.avgDailyUse}
                        onChange={(e) => updateField("avgDailyUse", Number(e.target.value))}
                    />

                    <input
                        style={input}
                        type="date"
                        value={form.expirationDate}
                        onChange={(e) => updateField("expirationDate", e.target.value)}
                    />

                    <input
                        style={input}
                        placeholder="Emoji icon"
                        value={form.asset?.kind === "emoji" ? form.asset.emoji ?? "" : ""}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                asset: { kind: "emoji", emoji: e.target.value || "🌿" },
                            }))
                        }
                    />

                    <input
                        style={input}
                        placeholder="Sustainable material suggestions (comma separated)"
                        value={form.sustainability.suggestedMaterials.join(", ")}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                sustainability: {
                                    ...prev.sustainability,
                                    suggestedMaterials: e.target.value
                                        .split(",")
                                        .map((x) => x.trim())
                                        .filter((x) => x.length > 0),
                                },
                            }))
                        }
                    />
                </div>

                <div style={{ marginTop: 16 }}>
                    <button
                        type="submit"
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
                        Save Item
                    </button>
                </div>
            </form>
        </section>
    );
}

const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
};

const input: React.CSSProperties = {
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    width: "100%",
};