# Shakthi-Acentra: Frontend Module
## Acentra Health — Clinical Precision Live Operations Command Center

The Shakthi-Acentra frontend is engineered with a **"Clinical Precision"** design language: calm, authoritative, trustworthy, and tailored for high-stakes healthcare logistics (cold-chain pharmaceuticals, sterile surgical supplies, ICU medical devices). It replaces generic dark/gamer UI patterns with a regulated-software design system featuring soft clinical slate backgrounds, dual-mode theme support (Clinical Light by default, Clinical Slate Dark Mode), elevated regulatory compliance signposts, and an isometric **Three.js 3D Architectural Pipeline**.

---

## 1. Architecture & Technology Stack

- **Core Framework**: React 18 (SPA) powered by Vite 5
- **3D Hero Visualization**: Three.js with Orthographic isometric projection and canvas animation loop
- **Styling**: Vanilla CSS Design System with CSS variables (`index.css`), dual light/slate themes, and keyframe animations
- **Iconography**: Lucide React
- **Telemetry & State**: Custom `useLiveTelemetry` hook with 2000ms polling, pause/resume, and manual refresh
- **Reverse Proxy**: Vite development proxy forwarding `/api` to the Spring Boot backend (`http://localhost:8080`)

---

## 2. Directory & Component Hierarchy

```
frontend/
├── index.html                                 # HTML5 entry with Inter & JetBrains Mono font links
├── vite.config.js                             # Vite configuration with /api reverse-proxy to backend (8080)
├── package.json                               # Dependencies: React 18, Lucide React, Three.js, Vite
├── README.md                                  # Frontend architecture documentation
└── src/
    ├── main.jsx                               # Application bootstrap & DOM mount
    ├── App.jsx                                # Root shell, tab router, modal state & theme provider
    ├── index.css                              # Design system tokens, dual themes, keyframe animations
    ├── services/
    │   ├── api.js                             # REST client (fetch wrapper with auto-headers & error handling)
    │   └── liveSync.js                        # useLiveTelemetry hook (2s polling, pause/resume, last sync)
    └── components/
        ├── layout/
        │   ├── ComplianceBanner.jsx           # Regulatory banner (21 CFR Part 11, SOC2, AMQP 0-9-1)
        │   ├── Header.jsx                     # Top navigation, status indicator, sync controls & theme toggle
        │   └── Navigation.jsx                 # Tab switching bar (Overview, Ledger, Inventory, DLQ, etc.)
        ├── summary/
        │   └── CommandSummary.jsx             # 6 high-level KPI metric cards with accent top-borders
        ├── pipeline/
        │   └── ArchitecturalPipeline3D.jsx    # Hero Three.js Isometric 3D Pipeline & 2D station metrics
        ├── feed/
        │   └── OperationsFeed.jsx             # Live event feed with category filters & audit trail
        ├── inventory/
        │   └── InventoryPressure.jsx          # Real-time stock monitor, safety badges & restock modal
        ├── queues/
        │   └── QueueMonitor.jsx               # RabbitMQ AMQP telemetry & consumer status
        ├── dlq/
        │   └── FailureDLQCenter.jsx           # Quarantine manager with 1-click DLQ message replay
        ├── orders/
        │   └── OrdersTable.jsx                # Full clinical order ledger with search & inspector trigger
        ├── inspector/
        │   └── OrderInspector.jsx             # Clinical Audit Dossier modal with chronological event timeline
        ├── health/
        │   └── SystemHealth.jsx               # Cluster diagnostics (MySQL, RabbitMQ, Spring Boot, Engine)
        └── demo/
            └── DemoControls.jsx               # Simulation workbench (Single, Burst 5, Retry, DLQ)
```

---

## 3. Visual Design System: "Clinical Precision"

The UI uses standard CSS variables inside `index.css` supporting two synchronized palettes:

### Color Semantics

| Semantic Role | Clinical Light Mode (Default) | Clinical Slate Dark Mode | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` (Slate 50) | `#0B1320` (Deep Clinical Slate) | Primary viewport backdrop |
| **Surface Card** | `#FFFFFF` (Pure White) | `#152238` (Elevated Charcoal Slate) | Panel & module containers |
| **Surface Subdued** | `#F1F5F9` (Slate 100) | `#1A2B45` (Soft Slate) | Nested wells, tables, code tags |
| **Primary Brand** | `#0D9488` (Clinical Teal) | `#14B8A6` (Vibrant Teal) | Brand identity, primary buttons |
| **Trust Blue** | `#0284C7` (Trust Blue) | `#38BDF8` (Sky Teal) | Intake & triage, AMQP info |
| **Clinical Success** | `#15803D` (Muted Emerald) | `#22C55E` (Emerald) | Dispatched, healthy, available |
| **Clinical Amber** | `#D97706` (Restrained Amber) | `#F59E0B` (Amber) | High stock pressure, retries |
| **Clinical Rose** | `#BE123C` (Regulated Red) | `#FB7185` (Rose) | DLQ quarantine, failures |
| **Text Primary** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | High-contrast readable typography |
| **Text Secondary** | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Metadata, sub-labels |
| **Borders** | `#E2E8F0` (Slate 200) | `#273D5E` (Deep Border Slate) | Restrained, non-distracting lines |

### Typography
- **Primary Interface**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` for headers, narrative labels, and UI controls.
- **Data & Numerical Metrics**: `'JetBrains Mono', 'SF Mono', Consolas, monospace` exclusively for Order IDs, UUIDs, SKUs, inventory counts, timestamps, and AMQP payload snippets.

---

## 4. Key Functional Modules

1. **Compliance Banner**: Displays active regulatory standards (21 CFR Part 11, SOC2 Type II, Pessimistic Row-Lock Engine, AMQP 0-9-1 Isolated Broker).
2. **Hero 3D Architectural Pipeline**: Three.js orthographic visualizer showing order capsules moving across 4 clinical stations:
   - Station 1: Intake & Triage
   - Station 2: Allocation Engine
   - Station 3: Sterile Reserve
   - Station 4: Verification & Dispatch
3. **Clinical Supply Chain Monitor**: Real-time stock counts with automated stock pressure bars and integrated restock modal.
4. **Operations Event Stream**: Filterable live event log displaying state transitions with micro-animations.
5. **RabbitMQ Queue Monitor**: Live AMQP queue depths and consumer states.
6. **DLQ Quarantine Center**: Quarantined order inspection and 1-click replay into the processing pipeline.
7. **Simulation Workbench**: One-click actions for Single Order, 5-Order Burst, Transient Retry, and Unrecoverable DLQ generation.
8. **Clinical Audit Dossier**: Modal window displaying patient hospital info, items, totals, and end-to-end event history.

---

## 5. Running Locally

```bash
cd frontend
npm install
npm run dev
```

The dev server will run on `http://localhost:5173` with reverse proxy to `http://localhost:8080`.
To create a production build:
```bash
npm run build
```
