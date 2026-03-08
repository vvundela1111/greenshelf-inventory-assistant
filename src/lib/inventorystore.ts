import inventoryData from "../../data/inventory.seed.json";
import { InventoryItem } from "./types";

let items: InventoryItem[] = [...(inventoryData as InventoryItem[])];

export function getInventoryItems(): InventoryItem[] {
    return items;
}

export function addInventoryItem(item: InventoryItem) {
    items.push(item);
}

export function updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    items = items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
    );
}