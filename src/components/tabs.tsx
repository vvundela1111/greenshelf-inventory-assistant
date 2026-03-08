"use client";

export type TabKey =
    | "overview"
    | "inventory"
    | "add"
    | "sustainability"
    | "scan"
    | "insights";

type TabsProps = {
    tab: TabKey;
    setTab: (tab: TabKey) => void;
};

const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "inventory", label: "Inventory" },
    { key: "add", label: "Add Item" },
    { key: "sustainability", label: "Sustainability" },
    { key: "scan", label: "Virtual Scan" },
    { key: "insights", label: "Insights" },
];

export default function Tabs({ tab, setTab }: TabsProps) {
    return (
        <div
            style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 16,
                marginBottom: 16,
            }}
        >
            {tabs.map((item) => {
                const active = tab === item.key;

                return (
                    <button
                        key={item.key}
                        onClick={() => setTab(item.key)}
                        style={{
                            borderRadius: 999,
                            padding: "10px 16px",
                            border: active ? "1px solid transparent" : "1px solid #d6dbe3",
                            background: active ? "#1f6feb" : "#ffffff",
                            color: active ? "#ffffff" : "#1f2937",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}