"use client";

import { useMemo, useState } from "react";
import { InventoryItem } from "@/lib/types";
import { forecastItem } from "@/lib/predictions";
import Badge from "./badge";
import ItemAvatar from "./itemavatar";

type InventoryTableProps = {
    items: InventoryItem[];
    onPatch: (id: string, updates: Partial<InventoryItem>) => Promise<InventoryItem>;
    onShowAdd: () => void;
    onGenerateInsight?: (id: string) => void;
    onEdit?: (item: InventoryItem) => void;
    showFilters?: boolean;
};

export default function InventoryTable({
    items,
    onPatch,
    onShowAdd,
    onGenerateInsight,
    onEdit,
    showFilters = false,
}: InventoryTableProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const forecast = forecastItem(item);

            const matchesFilter =
                filter === "all" ||
                (filter === "low-stock" && forecast.statusTags.includes("LOW_STOCK")) ||
                (filter === "expiring-soon" && forecast.statusTags.includes("EXPIRING_SOON")) ||
                (filter === "waste-risk" && forecast.statusTags.includes("WASTE_RISK"));

            return matchesSearch && matchesFilter;
        });
    }, [items, search, filter]);

    return (
        <section
            style={{
                background: "white",
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Inventory</h2>
                    <p style={{ color: "#64748b", marginTop: 6 }}>
                        Track quantities, usage, expiry, and quick updates.
                    </p>
                </div>

                <button
                    onClick={onShowAdd}
                    style={{
                        borderRadius: 12,
                        border: "none",
                        background: "#111827",
                        color: "white",
                        padding: "10px 14px",
                        fontWeight: 700,
                        cursor: "pointer",
                        height: "fit-content",
                    }}
                >
                    + Add Item
                </button>
            </div>

            {showFilters && (
                <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 16, flexWrap: "wrap" }}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search items..."
                        style={{
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #d1d5db",
                            minWidth: 220,
                        }}
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #d1d5db",
                        }}
                    >
                        <option value="all">All Items</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="expiring-soon">Expiring Soon</option>
                        <option value="waste-risk">Waste Risk</option>
                    </select>
                </div>
            )}

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={th}>Item</th>
                            <th style={th}>Qty</th>
                            <th style={th}>Daily Use</th>
                            <th style={th}>Expiration</th>
                            <th style={th}>Status</th>
                            <th style={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item) => {
                            const forecast = forecastItem(item);

                            return (
                                <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                                    <td style={td}>
                                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                            <ItemAvatar name={item.name} category={item.category} asset={item.asset} />
                                            <div>
                                                <div style={{ fontWeight: 700 }}>{item.name}</div>
                                                <div style={{ color: "#64748b", fontSize: 13 }}>{item.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={td}>
                                        {item.quantityOnHand} {item.unit}
                                    </td>
                                    <td style={td}>{item.avgDailyUse}</td>
                                    <td style={td}>{item.expirationDate ?? "N/A"}</td>
                                    <td style={td}>
                                        {forecast.statusTags.length ? (
                                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                {forecast.statusTags.map((tag) => (
                                                    <Badge key={tag} label={tag} />
                                                ))}
                                            </div>
                                        ) : (
                                            <Badge label="OK" />
                                        )}
                                    </td>
                                    <td style={td}>
                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            <button style={smallBtn} onClick={() => onPatch(item.id, { quantityOnHand: Math.max(0, item.quantityOnHand - 1) })}>
                                                Use 1
                                            </button>
                                            <button style={smallBtn} onClick={() => onPatch(item.id, { quantityOnHand: item.quantityOnHand + 5 })}>
                                                Restock +5
                                            </button>
                                            {onEdit && (
                                                <button style={smallBtn} onClick={() => onEdit(item)}>
                                                    Edit
                                                </button>
                                            )}
                                            {onGenerateInsight && (
                                                <button style={primaryBtn} onClick={() => onGenerateInsight(item.id)}>
                                                    Insight
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

const th: React.CSSProperties = {
    textAlign: "left",
    padding: "12px 10px",
    color: "#64748b",
    fontSize: 13,
};

const td: React.CSSProperties = {
    padding: "14px 10px",
    verticalAlign: "top",
};

const smallBtn: React.CSSProperties = {
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "white",
    padding: "8px 10px",
    cursor: "pointer",
    fontWeight: 600,
};

const primaryBtn: React.CSSProperties = {
    borderRadius: 10,
    border: "none",
    background: "#1f6feb",
    color: "white",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
};