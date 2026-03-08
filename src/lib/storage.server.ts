import { promises as fs } from "fs";
import path from "path";
import { InventoryItem } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const SEED_PATH = path.join(DATA_DIR, "inventory.seed.json");
const RUNTIME_PATH = path.join(DATA_DIR, "inventory.runtime.json");

let writeLock: Promise<void> = Promise.resolve();

async function ensureRuntimeFile() {
    try {
        await fs.access(RUNTIME_PATH);
    } catch {
        const seed = await fs.readFile(SEED_PATH, "utf8");
        await fs.writeFile(RUNTIME_PATH, seed, "utf8");
    }
}

export async function readInventory(): Promise<InventoryItem[]> {
    await ensureRuntimeFile();
    const raw = await fs.readFile(RUNTIME_PATH, "utf8");
    return JSON.parse(raw) as InventoryItem[];
}

async function atomicWrite(json: string) {
    const tempPath = `${RUNTIME_PATH}.tmp`;
    await fs.writeFile(tempPath, json, "utf8");
    await fs.rename(tempPath, RUNTIME_PATH);
}

export async function writeInventory(items: InventoryItem[]) {
    await ensureRuntimeFile();

    writeLock = writeLock.then(async () => {
        await atomicWrite(JSON.stringify(items, null, 2));
    });

    await writeLock;
}

export async function addInventoryItem(
    draft: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
) {
    const now = new Date().toISOString();

    const item: InventoryItem = {
        ...draft,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
    };

    const items = await readInventory();
    items.unshift(item);
    await writeInventory(items);

    return item;
}

export async function patchInventoryItem(
    id: string,
    updates: Partial<InventoryItem>
) {
    const items = await readInventory();
    const now = new Date().toISOString();

    let updatedItem: InventoryItem | null = null;

    const nextItems = items.map((item) => {
        if (item.id !== id) return item;

        updatedItem = {
            ...item,
            ...updates,
            id: item.id,
            updatedAt: now,
        };

        return updatedItem;
    });

    await writeInventory(nextItems);
    return updatedItem;
}