import Badge from "./badge";

type InsightPanelProps = {
    insight: {
        itemName: string;
        mode: "ai" | "fallback";
        text: string;
        forecast: {
            daysToStockout: number | null;
            daysToExpiry: number | null;
            statusTags: string[];
        };
    } | null;
};

export default function InsightPanel({ insight }: InsightPanelProps) {
    return (
        <section
            style={{
                background: "white",
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
            }}
        >
            <h2 style={{ marginTop: 0 }}>Insights</h2>

            {!insight ? (
                <p style={{ color: "#64748b" }}>
                    Generate an insight from the Inventory tab to see recommendations here.
                </p>
            ) : (
                <div style={{ display: "grid", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 18 }}>{insight.itemName}</div>
                            <div style={{ color: "#64748b", marginTop: 4 }}>
                                Stockout: {insight.forecast.daysToStockout ?? "unknown"} | Expiry:{" "}
                                {insight.forecast.daysToExpiry ?? "N/A"}
                            </div>
                        </div>
                        <Badge label={insight.mode.toUpperCase()} />
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {insight.forecast.statusTags.length ? (
                            insight.forecast.statusTags.map((tag) => <Badge key={tag} label={tag} />)
                        ) : (
                            <Badge label="OK" />
                        )}
                    </div>

                    <div
                        style={{
                            borderRadius: 14,
                            border: "1px solid #e5e7eb",
                            background: "#fafafa",
                            padding: 16,
                            lineHeight: 1.6,
                        }}
                    >
                        {insight.text}
                    </div>
                </div>
            )}
        </section>
    );
}