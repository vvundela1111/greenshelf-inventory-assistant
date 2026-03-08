# README.md

# GreenShelf Inventory Agent

## Candidate Name
Veda Vundela

## Scenario Chosen
Green-Tech Inventory Agent

## Estimated Time Spent
Approximately 5.5 hours

---

## Overview

GreenShelf is a lightweight inventory dashboard designed for small businesses such as cafés or food service operations. The system helps operators monitor inventory levels, anticipate stock shortages, reduce waste from expiring items, and surface sustainability recommendations.

The application provides a simple interface to:

- View and manage inventory items
- Forecast stockouts and expiration risks
- Generate AI-assisted operational insights with deterministic fallback logic
- Add and edit items through a structured form
- Track sustainability considerations for materials and packaging
- Scan items using simulated barcode or image-based virtual scanning
- Analyze inventory data through a dashboard interface

The system prioritizes reliability and deterministic behavior. AI features enhance the experience but are never required for the application to function.

---

## Demo Video


**Video Link:**  
INSERT VIDEO LINK HERE

## Quick Start

### Prerequisites

- Node.js 18+
- npm

Optional:

- OpenAI API key (for AI insights and image scanning)

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/greenshelf-inventory-agent
cd greenshelf-inventory-agent
```

Install dependencies:

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key
```

If the API key is not present, the application automatically falls back to deterministic logic instead of AI.

### Run the Application

Start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

### Run Tests

Run automated tests with:

```bash
npm test
```


---

## Project Structure

```text
src/
  app/                 Next.js routes and API handlers
  components/          UI components
  lib/                 business logic and forecasting
data/                  seed + runtime dataset

tests/
  predictions.test.ts
  validate.test.ts
  aiInsight.test.ts
```

---

## Synthetic Dataset

A small synthetic dataset is included in:

```text
data/inventory.seed.json
```

This dataset represents typical café inventory items like, ingredients, packaging supplies or cleaning products.

---

## AI Features

AI is used for two optional capabilities:

1. Inventory insight generation
2. Image-based item scanning

If AI services are unavailable, the application automatically falls back to deterministic logic so the system remains fully functional.

Fallback logic still produces stockout warnings, expiration warnings and reorder recommendations

---

## AI Disclosure

**Did you use an AI assistant (Copilot, ChatGPT, etc.)?**  
Yes, AI was used as a development assistant during the implementation process.

### Development Process

For most features, I first wrote out the intended logic in pseudocode, outlining the inputs and outputs, expected behavior, and edge cases

After defining the logic, I used an AI assistant to expand the pseudocode into working code.

### Verification

All AI-generated code was manually reviewed and verified.

### Example Suggestion That Was Modified

One AI suggestion attempted to integrate AI directly into the inventory forecasting logic. I modified this approach so forecasting remained deterministic and testable, and AI was only used to generate optional explanatory insights.

---

## Tradeoffs & Prioritization

Because the assignment recommended a 4–6 hour timebox, the implementation prioritized core functionality and system reliability over advanced polish.

### Features Prioritized

- deterministic inventory forecasting
- AI insight generation with fallback
- item creation and editing
- sustainability data tracking
- virtual scan feature
- a functional dashboard interface
- automated unit tests

### Features Cut to Stay Within Time Limit

- database persistence (JSON runtime storage was used instead)
- authentication / multi-user support
- advanced analytics charts
- real barcode scanning using device cameras
- complex sustainability scoring models

### What I Would Build Next

If given additional time, I would extend the project in the following ways:

- persistent database storage (PostgreSQL or Firestore)
- authentication and role-based permissions
- camera-based barcode scanning
- inventory analytics dashboards
- automated reorder workflows
- improved sustainability metrics and scoring

### Known Limitations

- inventory data is stored in JSON and resets when the server restarts
- AI image scanning may occasionally misidentify items
- forecasting assumes constant daily usage rates
- sustainability suggestions are heuristic rather than lifecycle-based calculations

Despite these limitations, the system demonstrates key engineering behaviors:

- deterministic core logic
- robust fallback behavior
- test coverage for critical functionality
- clear separation between AI and application logic
