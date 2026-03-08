type BadgeProps = {
    label: string;
};

export default function Badge({ label }: BadgeProps) {
    const normalized = label.toUpperCase();

    let background = "#e5e7eb";
    let color = "#374151";

    if (normalized === "LOW_STOCK") {
        background = "#fee2e2";
        color = "#b91c1c";
    } else if (normalized === "EXPIRING_SOON") {
        background = "#fef3c7";
        color = "#b45309";
    } else if (normalized === "WASTE_RISK") {
        background = "#ede9fe";
        color = "#6d28d9";
    } else if (normalized === "OK") {
        background = "#dcfce7";
        color = "#15803d";
    } else if (normalized === "AI") {
        background = "#dbeafe";
        color = "#1d4ed8";
    } else if (normalized === "FALLBACK") {
        background = "#f3f4f6";
        color = "#374151";
    }

    return (
        <span
            style={{
                display: "inline-block",
                padding: "5px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                background,
                color,
            }}
        >
            {label.replaceAll("_", " ")}
        </span>
    );
}