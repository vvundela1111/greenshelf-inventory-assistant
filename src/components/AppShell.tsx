"use client";

import { useMemo, useState } from "react";
import Tabs, { TabKey } from "./tabs";
import StatCards from "./statcards";
import InventoryTable from "./inventorytable";
import AddItemForm from "./additemform";
import SustainabilityPanel from "./sustainabilitypanel";
import ScanPanel from "./scanpanel";
import InsightPanel from "./insightpanel";
import { useInventory } from "@/lib/useinventory";
import { forecastItem } from "@/lib/predictions";

export default function AppShell() {
    const [tab, setTab] = useState<TabKey>("overview");
    const [selectedInsight, setSelectedInsight] = useState<{
        itemName: string;
        mode: "ai" | "fallback";
        text: string;
        forecast: {
            daysToStockout: number | null;
            daysToExpiry: number | null;
            statusTags: string[];
        };
    } | null>(null);

    const { items, addItem, patchItem, refresh } = useInventory();

    const stats = useMemo(() => {
        return {
            total: items.length,
            lowStock: items.filter((i) => forecastItem(i).statusTags.includes("LOW_STOCK")).length,
            expiring: items.filter((i) => forecastItem(i).statusTags.includes("EXPIRING_SOON")).length,
            wasteRisk: items.filter((i) => forecastItem(i).statusTags.includes("WASTE_RISK")).length,
        };
    }, [items]);

    async function handleGenerateInsight(id: string) {
        const response = await fetch("/api/insights", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        const data = await response.json();
        const item = items.find((i) => i.id === id);

        if (!item) return;

        setSelectedInsight({
            itemName: item.name,
            mode: data.insight.mode,
            text: data.insight.text,
            forecast: data.forecast,
        });

        setTab("insights");
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f6f7fb",
                padding: 24,
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <section
                    style={{
                        background: "white",
                        borderRadius: 20,
                        padding: 22,
                        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <div style={{ fontSize: 28, fontWeight: 800 }}>GreenShelf</div>
                        <div style={{ color: "#64748b", marginTop: 6 }}>
                            A cafe inventory dashboard with AI insights, sustainability suggestions, and virtual scanning.
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button onClick={() => setTab("add")} style={headerPrimary}>
                            + Add Item
                        </button>
                        <button onClick={() => setTab("scan")} style={headerSecondary}>
                            Scan Asset
                        </button>
                        <button onClick={refresh} style={headerSecondary}>
                            Refresh
                        </button>
                    </div>
                </section>

                <div style={{ marginTop: 16 }}>
                    <StatCards stats={stats} />
                </div>

                <Tabs tab={tab} setTab={setTab} />

                {tab === "overview" && (
                    <InventoryTable
                        items={items}
                        onPatch={patchItem}
                        onShowAdd={() => setTab("add")}
                        onGenerateInsight={handleGenerateInsight}
                    />
                )}

                {tab === "inventory" && (
                    <InventoryTable
                        items={items}
                        onPatch={patchItem}
                        onShowAdd={() => setTab("add")}
                        onGenerateInsight={handleGenerateInsight}
                        showFilters
                    />
                )}

                {tab === "add" && <AddItemForm onAdd={addItem} />}

                {tab === "sustainability" && <SustainabilityPanel items={items} />}

                {tab === "scan" && (
                    <ScanPanel
                        onCreateFromScan={async (draft) => {
                            await addItem(draft);
                            setTab("inventory");
                        }}
                    />
                )}

                {tab === "insights" && <InsightPanel insight={selectedInsight} />}
            </div>
        </div>
    );
}

const headerPrimary: React.CSSProperties = {
    borderRadius: 12,
    border: "none",
    background: "#111827",
    color: "white",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
};

const headerSecondary: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid #d1d5db",
    background: "white",
    color: "#111827",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
};