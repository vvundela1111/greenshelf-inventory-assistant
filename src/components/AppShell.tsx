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
import { InventoryItem } from "@/lib/types";

type DraftItem = Omit<InventoryItem, "id" | "createdAt" | "updatedAt">;

export default function AppShell() {
    const [tab, setTab] = useState<TabKey>("overview");
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [draftItem, setDraftItem] = useState<DraftItem | null>(null);

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

    const { items, addItem, patchItem, refresh, loading } = useInventory();

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

    function handleStartEdit(item: InventoryItem) {
        setDraftItem(null);
        setEditingItem(item);
        setTab("add");
    }

    function handleCancelEdit() {
        setEditingItem(null);
    }

    async function handleEditItem(id: string, updates: Partial<InventoryItem>) {
        const updated = await patchItem(id, updates);
        setEditingItem(null);
        setTab("inventory");
        return updated;
    }

    function openFreshAddForm() {
        setEditingItem(null);
        setDraftItem(null);
        setTab("add");
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <header style={styles.hero}>
                    <div style={styles.heroLeft}>
                        <div style={styles.brandRow}>
                            <div style={styles.brandMark}>GS</div>
                            <div>
                                <div style={styles.brandTitle}>GreenShelf</div>
                                <div style={styles.brandSubtitle}>
                                    Inventory and sustainability operations dashboard
                                </div>
                            </div>
                        </div>

                        <h1 style={styles.heroTitle}>
                            Inventory oversight with clearer forecasting and more sustainable decisions
                        </h1>

                        <p style={styles.heroText}>
                            Monitor stock levels, surface expiry and waste risks, generate AI-backed recommendations,
                            and manage item records in a single internal dashboard.
                        </p>

                        <div style={styles.heroActions}>
                            <button onClick={openFreshAddForm} style={styles.primaryButton}>
                                Add Item
                            </button>
                            <button onClick={() => setTab("scan")} style={styles.secondaryButton}>
                                Virtual Scan
                            </button>
                            <button onClick={() => setTab("sustainability")} style={styles.secondaryButton}>
                                Sustainability Dashboard
                            </button>
                        </div>
                    </div>

                    <div style={styles.heroRight}>
                        <div style={styles.summaryCard}>
                            <div style={styles.summaryLabel}>System Status</div>
                            <div style={styles.summaryValue}>{loading ? "Loading..." : "Active"}</div>
                            <div style={styles.summaryText}>
                                Data, forecasts, and inventory controls are available for review.
                            </div>
                        </div>

                        <div style={styles.summaryCard}>
                            <div style={styles.summaryLabel}>Current Focus</div>
                            <div style={styles.summaryValue}>Waste Prevention</div>
                            <div style={styles.summaryText}>
                                Prioritize low-stock and short-dated items before placing new orders.
                            </div>
                        </div>
                    </div>
                </header>

                <section style={{ marginTop: 22 }}>
                    <StatCards stats={stats} />
                </section>

                <section style={styles.navCard}>
                    <Tabs tab={tab} setTab={setTab} />
                </section>

                <section style={{ marginTop: 18 }}>
                    {tab === "overview" && (
                        <InventoryTable
                            items={items}
                            onPatch={patchItem}
                            onShowAdd={openFreshAddForm}
                            onGenerateInsight={handleGenerateInsight}
                            onEdit={handleStartEdit}
                        />
                    )}

                    {tab === "inventory" && (
                        <InventoryTable
                            items={items}
                            onPatch={patchItem}
                            onShowAdd={openFreshAddForm}
                            onGenerateInsight={handleGenerateInsight}
                            onEdit={handleStartEdit}
                            showFilters
                        />
                    )}

                    {tab === "add" && (
                        <AddItemForm
                            onAdd={async (item) => {
                                const created = await addItem(item);
                                setDraftItem(null);
                                return created;
                            }}
                            onEdit={handleEditItem}
                            editingItem={editingItem}
                            draftItem={draftItem}
                            onCancelEdit={handleCancelEdit}
                        />
                    )}

                    {tab === "sustainability" && <SustainabilityPanel items={items} />}

                    {tab === "scan" && (
                        <ScanPanel
                            onCreateFromScan={async (draft) => {
                                await addItem(draft);
                                setDraftItem(null);
                                setEditingItem(null);
                                setTab("inventory");
                            }}
                            onUseDraft={(draft) => {
                                setEditingItem(null);
                                setDraftItem(draft);
                                setTab("add");
                            }}
                        />
                    )}

                    {tab === "insights" && <InsightPanel insight={selectedInsight} />}
                </section>

                <footer style={styles.footer}>
                    <div>GreenShelf Internal Dashboard</div>
                    <div style={styles.footerMuted}>
                        Built for inventory visibility, operational forecasting, and sustainability planning.
                    </div>
                </footer>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: 28,
        fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#23313f",
    },
    container: {
        maxWidth: 1240,
        margin: "0 auto",
    },
    hero: {
        display: "grid",
        gridTemplateColumns: "1.7fr 1fr",
        gap: 20,
        background: "linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%)",
        borderRadius: 20,
        padding: 28,
        border: "1px solid #e4e9ee",
        boxShadow: "0 12px 30px rgba(17, 27, 39, 0.06)",
    },
    heroLeft: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    heroRight: {
        display: "grid",
        gap: 14,
    },
    brandRow: {
        display: "flex",
        alignItems: "center",
        gap: 14,
    },
    brandMark: {
        width: 48,
        height: 48,
        borderRadius: 14,
        background: "#243847",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        letterSpacing: "0.04em",
    },
    brandTitle: {
        fontSize: 26,
        fontWeight: 600,
        color: "#1f2e3b",
        fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
    },
    brandSubtitle: {
        color: "#617486",
        fontSize: 14,
        marginTop: 2,
    },
    heroTitle: {
        margin: 0,
        fontSize: 34,
        lineHeight: 1.2,
        fontWeight: 600,
        color: "#1f2e3b",
        fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
        maxWidth: 760,
    },
    heroText: {
        margin: 0,
        color: "#5e7183",
        lineHeight: 1.7,
        fontSize: 15,
        maxWidth: 760,
    },
    heroActions: {
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
    summaryCard: {
        background: "#f9fbfc",
        border: "1px solid #e3e9ef",
        borderRadius: 16,
        padding: 18,
    },
    summaryLabel: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#708395",
        marginBottom: 10,
        fontWeight: 700,
    },
    summaryValue: {
        fontSize: 22,
        fontWeight: 600,
        color: "#243847",
        fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
        marginBottom: 8,
    },
    summaryText: {
        color: "#617486",
        lineHeight: 1.6,
        fontSize: 14,
    },
    navCard: {
        marginTop: 18,
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid #e4e9ee",
        boxShadow: "0 8px 20px rgba(17, 27, 39, 0.05)",
        padding: "8px 14px",
    },
    footer: {
        marginTop: 28,
        padding: "18px 4px 10px 4px",
        color: "#4e6173",
        fontWeight: 600,
    },
    footerMuted: {
        marginTop: 6,
        color: "#7a8c9d",
        fontWeight: 400,
        fontSize: 14,
    },
};