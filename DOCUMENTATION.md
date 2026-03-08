# DOCUMENTATION.md

# GreenShelf Inventory Agent
Design Documentation

---

## System Overview

GreenShelf is a lightweight inventory management dashboard designed to help small businesses monitor stock levels, reduce waste from expiring products, and make more sustainable purchasing decisions.

The system focuses on three core goals:

1. Provide a simple and reliable inventory tracking system
2. Forecast potential stockouts and expiration risks
3. Surface sustainability insights and operational recommendations

AI capabilities are included but designed to be optional so the application remains functional even when AI services are unavailable.

---

## Architecture

The application follows a simple layered architecture.

### UI Layer
React components render the dashboard, forms, tables, and interaction workflows.

### Application Logic Layer
Core logic such as forecasting, validation, and AI integration is implemented in the `lib` directory.

### Data Layer
Inventory data is stored in JSON files to simplify setup and allow quick prototyping.

### AI Integration Layer
AI functionality is accessed through server-side API routes which call the OpenAI API.

---

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript

### Backend
- Next.js API routes

### AI Integration
- OpenAI Responses API

### Testing
- Vitest

### Data Storage
- JSON seed and runtime files

---

## Data Model

Each inventory item follows the structure:

```text
InventoryItem {
  id
  name
  category
  quantityOnHand
  unit
  avgDailyUse
  expirationDate
  asset
  sustainability
  createdAt
  updatedAt
}
```

The sustainability field stores metadata such as suggested materials and disposal guidance.

---

## Forecasting Logic

Forecasting uses deterministic calculations.

Days to stockout:

```text
daysToStockout = quantityOnHand / avgDailyUse
```

Expiration timing:

```text
daysToExpiry = expirationDate - currentDate
```

The system generates status tags based on these values:

- LOW_STOCK
- EXPIRING_SOON
- WASTE_RISK

This logic intentionally avoids AI so it remains reliable and testable.

---

## AI Integration

AI is used for two optional features:

1. Generating operational inventory insights
2. Image-based item scanning

AI is accessed through server routes that call the OpenAI API.

Fallback logic ensures the system continues working if:

- the API key is missing
- the API request fails
- the AI response is invalid

In these cases, deterministic fallback insights are returned instead.

---

## Sustainability Features

The sustainability dashboard aggregates sustainability-related metadata from inventory items.

The interface highlights:

- sustainable material alternatives
- packaging improvements
- waste reduction suggestions

This feature helps operators consider environmental impact alongside operational efficiency.

---

## Virtual Asset Scanning

The scanning feature supports two workflows.

### Text Scan
Users simulate scanning an item code.

### Image Scan
Users upload an image which is analyzed by AI to infer the item type and generate draft item fields.

Users can then:

- automatically create the item
- or send the draft to the add-item form for editing

---

## Testing Strategy

Automated unit tests verify the reliability of critical logic.

Tests cover:

- inventory forecasting calculations
- validation logic for new items
- fallback behavior when AI is unavailable

Vitest was selected because it is lightweight and integrates easily with modern JavaScript projects.

---

## Design Tradeoffs

Several design tradeoffs were made to stay within the assignment's recommended timebox.

### JSON Storage Instead of a Database
This simplified the environment setup and allowed rapid prototyping.

### Inline Styling Instead of a Design System
This reduced dependency overhead while maintaining a clean UI.

### Heuristic Sustainability Metrics
A full lifecycle analysis model would require significantly more data.

---

## Future Enhancements

With more development time, the system could be expanded with:

- persistent database storage
- authentication and role-based access
- camera-based barcode scanning
- inventory analytics dashboards
- automated supplier integrations
- advanced sustainability scoring models
