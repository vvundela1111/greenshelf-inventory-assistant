import { InventoryCategory } from "./types";

export function inferCategoryFromText(text: string): InventoryCategory {
    const value = text.toLowerCase();

    if (/(milk|cream|juice|fruit|egg|oat)/.test(value)) return "perishable";
    if (/(cup|lid|napkin|straw|container|bag|box)/.test(value)) return "packaging";
    if (/(coffee|bean|tea|syrup|sugar|flour)/.test(value)) return "ingredients";
    if (/(soap|clean|sanitizer)/.test(value)) return "cleaning";
    if (/(machine|grinder|fridge)/.test(value)) return "equipment";

    return "other";
}

export function titleizeFileName(fileName: string) {
    const base = fileName.replace(/\.[^.]+$/, "");
    const cleaned = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

    return cleaned
        .split(" ")
        .map((part) =>
            part.length ? part[0].toUpperCase() + part.slice(1) : part
        )
        .join(" ");
}