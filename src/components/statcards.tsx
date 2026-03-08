type StatCardsProps = {
    stats: {
        total: number;
        lowStock: number;
        expiring: number;
        wasteRisk: number;
    };
};

const cardStyle = {
    background: "white",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
};

export default function StatCards({ stats }: StatCardsProps) {
    const cards = [
        { label: "Total Items", value: stats.total, emoji: "📦", bg: "#eef4ff" },
        { label: "Low Stock", value: stats.lowStock, emoji: "⚠️", bg: "#fff4e8" },
        { label: "Expiring Soon", value: stats.expiring, emoji: "⏳", bg: "#fff8dc" },
        { label: "Waste Risk", value: stats.wasteRisk, emoji: "♻️", bg: "#ecfff1" },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
            }}
        >
            {cards.map((card) => (
                <div key={card.label} style={{ ...cardStyle, background: card.bg }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <div style={{ fontWeight: 600, color: "#475569" }}>{card.label}</div>
                        <div style={{ fontSize: 22 }}>{card.emoji}</div>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{card.value}</div>
                </div>
            ))}
        </div>
    );
}