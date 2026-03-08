"use client";

import { useEffect, useState } from "react";
import { InventoryItem } from "@/lib/types";
import { validateItemDraft } from "@/lib/validate";

type DraftItem = Omit<InventoryItem, "id" | "createdAt" | "updatedAt">;

type AddItemFormProps = {
    onAdd: (item: DraftItem) => Promise<InventoryItem>;
    onEdit?: (id: string, updates: Partial<InventoryItem>) => Promise<InventoryItem>;
    editingItem?: InventoryItem | null;
    draftItem?: DraftItem | null;
    onCancelEdit?: () => void;
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

function itemToForm(item: InventoryItem): AddItemFormState {
    return {
        name: item.name,
        category: item.category,
        quantityOnHand: item.quantityOnHand,
        unit: item.unit,
        avgDailyUse: item.avgDailyUse,
        expirationDate: item.expirationDate ?? "",
        asset: item.asset,
        sustainability: {
            suggestedMaterials: item.sustainability?.suggestedMaterials ?? [],
            certifications: item.sustainability?.certifications ?? [],
            endOfLife: item.sustainability?.endOfLife ?? "unknown",
            notes: item.sustainability?.notes ?? "",
        },
    };
}

function draftToForm(item: DraftItem): AddItemFormState {
    return {
        name: item.name,
        category: item.category,
        quantityOnHand: item.quantityOnHand,
        unit: item.unit,
        avgDailyUse: item.avgDailyUse,
        expirationDate: item.expirationDate ?? "",
        asset: item.asset,
        sustainability: {
            suggestedMaterials: item.sustainability?.suggestedMaterials ?? [],
            certifications: item.sustainability?.certifications ?? [],
            endOfLife: item.sustainability?.endOfLife ?? "unknown",
            notes: item.sustainability?.notes ?? "",
        },
    };
}

function FieldLabel({
    label,
    tooltip,
}: {
    label: string;
    tooltip: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ marginBottom: 8 }}>
            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#243241",
                    letterSpacing: "0.01em",
                    position: "relative",
                }}
            >
                <span>{label}</span>

                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 18,
                        height: 18,
                        borderRadius: "999px",
                        background: "#e8edf2",
                        color: "#4a5d70",
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: 700,
                        border: "1px solid #d3dce5",
                        padding: 0,
                        lineHeight: 1,
                    }}
                    aria-label={`More info about ${label}`}
                >
                    ?
                </button>

                {open && (
                    <div
                        style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            left: 0,
                            zIndex: 20,
                            width: 280,
                            background: "#243847",
                            color: "white",
                            padding: "10px 12px",
                            borderRadius: 10,
                            fontSize: 13,
                            lineHeight: 1.5,
                            fontWeight: 400,
                            boxShadow: "0 8px 22px rgba(0,0,0,0.16)",
                        }}
                    >
                        {tooltip}
                    </div>
                )}
            </label>
        </div>
    );
}

export default function AddItemForm({
    onAdd,
    onEdit,
    editingItem = null,
    draftItem = null,
    onCancelEdit,
}: AddItemFormProps) {
    const [form, setForm] = useState<AddItemFormState>(initialForm);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState("");

    const isEditing = !!editingItem;

    useEffect(() => {
        if (editingItem) {
            setForm(itemToForm(editingItem));
            setErrors([]);
            setSuccess("");
            return;
        }

        if (draftItem) {
            setForm(draftToForm(draftItem));
            setErrors([]);
            setSuccess("");
            return;
        }

        setForm(initialForm);
    }, [editingItem, draftItem]);

    function updateField<K extends keyof AddItemFormState>(
        name: K,
        value: AddItemFormState[K]
    ) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const draft: DraftItem = {
            ...form,
            expirationDate: form.expirationDate || null,
        };

        const validationErrors = validateItemDraft(draft);

        if (validationErrors.length) {
            setErrors(validationErrors);
            setSuccess("");
            return;
        }

        if (isEditing && editingItem && onEdit) {
            const updated = await onEdit(editingItem.id, draft);
            setErrors([]);
            setSuccess(`${updated.name} was updated successfully.`);
            if (onCancelEdit) onCancelEdit();
            setForm(initialForm);
            return;
        }

        const created = await onAdd(draft);
        setErrors([]);
        setSuccess(`${created.name} was added to inventory.`);
        setForm(initialForm);
    }

    return (
        <section style={styles.card}>
            <div style={{ marginBottom: 18 }}>
                <h2 style={styles.title}>{isEditing ? "Edit Item" : "Add Item"}</h2>
                <p style={styles.subtitle}>
                    {isEditing
                        ? "Update the item details below and save your changes."
                        : "Create a new inventory item with stock, usage, and sustainability information."}
                </p>
            </div>

            {errors.length > 0 && (
                <div style={styles.errorBox}>
                    {errors.map((error) => (
                        <div key={error}>{error}</div>
                    ))}
                </div>
            )}

            {success && <div style={styles.successBox}>{success}</div>}

            <form onSubmit={handleSubmit}>
                <div style={styles.grid}>
                    <div>
                        <FieldLabel
                            label="Item Name"
                            tooltip="Enter the exact inventory item name, such as Coffee Beans, Oat Milk, or Paper Cups."
                        />
                        <input
                            style={styles.input}
                            placeholder="Coffee Beans"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                        />
                    </div>

                    <div>
                        <FieldLabel
                            label="Category"
                            tooltip="Choose the category that best fits this item so the dashboard can group it correctly."
                        />
                        <select
                            style={styles.input}
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
                    </div>

                    <div>
                        <FieldLabel
                            label="Quantity on Hand"
                            tooltip="Enter the current stock amount as a number only."
                        />
                        <input
                            style={styles.input}
                            type="number"
                            placeholder="12"
                            value={form.quantityOnHand}
                            onChange={(e) => updateField("quantityOnHand", Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <FieldLabel
                            label="Unit"
                            tooltip="Enter the matching unit, such as bags, cartons, cups, bottles, or pounds."
                        />
                        <input
                            style={styles.input}
                            placeholder="bags"
                            value={form.unit}
                            onChange={(e) => updateField("unit", e.target.value)}
                        />
                    </div>

                    <div>
                        <FieldLabel
                            label="Average Daily Use"
                            tooltip="Estimate how much of this item is typically used each day. This powers the stockout forecast."
                        />
                        <input
                            style={styles.input}
                            type="number"
                            placeholder="2"
                            value={form.avgDailyUse}
                            onChange={(e) => updateField("avgDailyUse", Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <FieldLabel
                            label="Expiration Date"
                            tooltip="Choose an expiration date if the item is perishable. Leave blank if the item does not expire."
                        />
                        <input
                            style={styles.input}
                            type="date"
                            value={form.expirationDate}
                            onChange={(e) => updateField("expirationDate", e.target.value)}
                        />
                    </div>

                    <div>
                        <div>
                            <FieldLabel
                                label="Icon / Emoji"
                                tooltip="Optional. Add a simple icon or emoji to make the item easier to identify visually in the inventory table. If left blank, a default colored square will be shown."
                            />
                            <input
                                style={styles.input}
                                placeholder="Optional, e.g. ☕"
                                value={form.asset?.kind === "emoji" ? form.asset.emoji ?? "" : ""}
                                onChange={(e) => {
                                    const value = e.target.value.trim();

                                    setForm((prev) => ({
                                        ...prev,
                                        asset: value ? { kind: "emoji", emoji: value } : undefined,
                                    }));
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <FieldLabel
                            label="Sustainable Material Suggestions"
                            tooltip="Add greener alternatives separated by commas, such as compostable cups, reusable containers, or FSC paper."
                        />
                        <input
                            style={styles.input}
                            placeholder="compostable cups, FSC paper"
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

                    <div style={{ gridColumn: "1 / -1" }}>
                        <FieldLabel
                            label="Sustainability Notes"
                            tooltip="Add sourcing, disposal, reuse, or lower-waste notes that may help with decision-making."
                        />
                        <textarea
                            style={styles.textarea}
                            placeholder="Order from a local supplier to reduce transport waste and excess packaging."
                            value={form.sustainability.notes}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    sustainability: {
                                        ...prev.sustainability,
                                        notes: e.target.value,
                                    },
                                }))
                            }
                        />
                    </div>
                </div>

                <div style={styles.buttonRow}>
                    <button type="submit" style={styles.primaryButton}>
                        {isEditing ? "Save Changes" : "Save Item"}
                    </button>

                    {isEditing && (
                        <button type="button" onClick={onCancelEdit} style={styles.secondaryButton}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

const styles: Record<string, React.CSSProperties> = {
    card: {
        background: "#ffffff",
        borderRadius: 18,
        padding: 24,
        boxShadow: "0 10px 26px rgba(20, 33, 46, 0.08)",
        border: "1px solid #e6ebf0",
    },
    title: {
        margin: 0,
        fontSize: 28,
        fontWeight: 600,
        color: "#1f2e3b",
        fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 0,
        color: "#5f7285",
        fontSize: 15,
        lineHeight: 1.6,
    },
    errorBox: {
        background: "#fff5f5",
        border: "1px solid #f0caca",
        color: "#9f2f2f",
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        lineHeight: 1.5,
    },
    successBox: {
        background: "#f3faf6",
        border: "1px solid #cfe7d7",
        color: "#2f6b48",
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        lineHeight: 1.5,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
    },
    input: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid #cfd8e2",
        width: "100%",
        background: "#fbfcfd",
        color: "#23313f",
        fontSize: 14,
        outline: "none",
    },
    textarea: {
        minHeight: 100,
        resize: "vertical",
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid #cfd8e2",
        width: "100%",
        background: "#fbfcfd",
        color: "#23313f",
        fontSize: 14,
        outline: "none",
        fontFamily: "inherit",
    },
    buttonRow: {
        marginTop: 18,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
    },
    primaryButton: {
        borderRadius: 12,
        border: "none",
        background: "#243847",
        color: "white",
        padding: "11px 18px",
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.01em",
    },
    secondaryButton: {
        borderRadius: 12,
        border: "1px solid #cfd8e2",
        background: "#ffffff",
        color: "#243847",
        padding: "11px 18px",
        fontWeight: 600,
        cursor: "pointer",
    },
};