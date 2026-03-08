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
                alignItems: "center",
                minHeight: 48,
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
                            border: active ? "1px solid #243847" : "1px solid #d6dde5",
                            background: active ? "#243847" : "#ffffff",
                            color: active ? "#ffffff" : "#33475b",
                            fontWeight: 600,
                            fontSize: 14,
                            letterSpacing: "0.01em",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: active
                                ? "0 6px 14px rgba(36, 56, 71, 0.14)"
                                : "0 2px 6px rgba(36, 56, 71, 0.04)",
                        }}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}