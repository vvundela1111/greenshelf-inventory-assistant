type ItemAvatarProps = {
    name: string;
    category: string;
    asset?: {
        kind: "emoji" | "upload";
        emoji?: string;
        imageDataUrl?: string;
    };
};

function getFallbackColor(category: string) {
    switch (category) {
        case "ingredients":
            return "#dbeafe";
        case "perishable":
            return "#dcfce7";
        case "packaging":
            return "#fef3c7";
        case "equipment":
            return "#e9d5ff";
        case "cleaning":
            return "#fde2e2";
        default:
            return "#e5e7eb";
    }
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

    if (asset?.kind === "emoji" && asset.emoji) {
        return (
            <div
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f8fafc",
                    fontSize: 20,
                    border: "1px solid #e5e7eb",
                }}
            >
                {asset.emoji}
            </div>
        );
    }

    return (
        <div
            aria-label={`${name} placeholder`}
            style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: getFallbackColor(category),
                border: "1px solid #d1d5db",
            }}
        />
    );
}