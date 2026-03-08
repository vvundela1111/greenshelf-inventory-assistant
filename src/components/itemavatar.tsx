type ItemAvatarProps = {
    name: string;
    category: string;
    asset?: {
        kind: "emoji" | "upload";
        emoji?: string;
        imageDataUrl?: string;
    };
};

function getFallbackEmoji(name: string, category: string) {
    const value = `${name} ${category}`.toLowerCase();

    if (value.includes("coffee")) return "☕";
    if (value.includes("milk")) return "🥛";
    if (value.includes("cup")) return "🥤";
    if (value.includes("tea")) return "🍵";
    if (value.includes("bread") || value.includes("pastry")) return "🥐";
    if (value.includes("package")) return "📦";
    if (value.includes("clean")) return "🧼";
    return "🌿";
}

export default function ItemAvatar({ name, category, asset }: ItemAvatarProps) {
    if (asset?.kind === "upload" && asset.imageDataUrl) {
        return (
            <img
                src={asset.imageDataUrl}
                alt={name}
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    objectFit: "cover",
                    border: "1px solid #e5e7eb",
                }}
            />
        );
    }

    const emoji = asset?.kind === "emoji" && asset.emoji
        ? asset.emoji
        : getFallbackEmoji(name, category);

    return (
        <div
            style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f1f5f9",
                fontSize: 20,
            }}
        >
            {emoji}
        </div>
    );
}