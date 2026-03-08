import { InventoryItem } from "@/lib/types";
import { forecastItem } from "@/lib/predictions";

type SustainabilityPanelProps = {
    items: InventoryItem[];
};

export default function SustainabilityPanel({ items }: SustainabilityPanelProps) {
    const packagingCount = items.filter((item) => item.category === "packaging").length;
    const wasteRiskCount = items.filter((item) =>
        forecastItem(item).statusTags.includes("WASTE_RISK")
    ).length;

    const alternatives = items
        .filter((item) => item.category === "packaging" || item.category === "perishable")
        .slice(0, 6);

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <section style={panel}>
                <h2 style={{ marginTop: 0 }}>Sustainability Dashboard</h2>
                <p style={{ color: "#64748b" }}>
                    A quick view of waste risk and material choices.
                </p>

                <div style={statsGrid}>
                    <div style={{ ...miniCard, background: "#ecfff1" }}>
                        <div style={miniTitle}>Waste Risk Items</div>
                        <div style={miniValue}>{wasteRiskCount}</div>
                    </div>
                    <div style={{ ...miniCard, background: "#eef4ff" }}>
                        <div style={miniTitle}>Packaging Items</div>
                        <div style={miniValue}>{packagingCount}</div>
                    </div>
                    <div style={{ ...miniCard, background: "#fff8dc" }}>
                        <div style={miniTitle}>Priority Focus</div>
                        <div style={{ fontWeight: 700 }}>Reduce waste before replacing materials</div>
                    </div>
                </div>
            </section>

            <section style={panel}>
                <h3 style={{ marginTop: 0 }}>Suggested More Sustainable Materials</h3>
                <div style={{ display: "grid", gap: 12 }}>
                    {alternatives.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 14,
                                padding: 14,
                                background: "#fafafa",
                            }}
                        >
                            <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.name}</div>
                            <div style={{ color: "#64748b", marginBottom: 8 }}>{item.category}</div>

                            {item.sustainability?.suggestedMaterials?.length ? (
                                <ul style={{ margin: 0, paddingLeft: 18 }}>
                                    {item.sustainability.suggestedMaterials.map((suggestion) => (
                                        <li key={suggestion}>{suggestion}</li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{ color: "#64748b" }}>
                                    Add sustainable material notes to this item in the Add Item form.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const panel: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
};

const statsGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
};

const miniCard: React.CSSProperties = {
    borderRadius: 14,
    padding: 16,
};

const miniTitle: React.CSSProperties = {
    color: "#475569",
    fontWeight: 600,
    marginBottom: 8,
};

const miniValue: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 800,
};