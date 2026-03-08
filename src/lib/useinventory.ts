"use client";

import { useEffect, useState } from "react";
import { InventoryItem } from "./types";

export function useInventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    async function refresh() {
        const res = await fetch("/api/inventory", { cache: "no-store" });
        const data = await res.json();
        setItems(data.items ?? []);
        setLoading(false);
    }

    useEffect(() => {
        refresh();
    }, []);

    async function addItem(
        draft: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
    ) {
        const res = await fetch("/api/inventory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(draft),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error((data.errors ?? ["Add failed"]).join(", "));
        }

        setItems((prev) => [data.item, ...prev]);
        return data.item as InventoryItem;
    }

    async function patchItem(id: string, updates: Partial<InventoryItem>) {
        const res = await fetch(`/api/inventory/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error ?? "Update failed");
        }

        setItems((prev) =>
            prev.map((item) => (item.id === id ? data.item : item))
        );

        return data.item as InventoryItem;
    }

    return {
        items,
        loading,
        refresh,
        addItem,
        patchItem,
    };
}