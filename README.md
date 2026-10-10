# Puls (puls.apps.harkco.se)
> **Live XRPL Adoption & Consensus Telemetry Monitor**  
> Real-time consensus heartbeat, native DEX & AMM volume (XLS-30D), institutional RLUSD adoption, and whale transaction radar.

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![XRPL Mainnet](https://img.shields.io/badge/XRPL-Mainnet%20Live-00F0FF.svg)](https://xrpl.org)
[![Status](https://img.shields.io/badge/Status-Live%20on%20Production-10b981.svg)](https://puls.apps.harkco.se)

---

## Overview

**Puls** (*Swedish for "Pulse"*) is an industrial, high-tactile live telemetry monitor for the XRP Ledger. Built for traders, analysts, and XRPL developers, Puls taps directly into consensus validation streams to surface real-time network adoption and institutional liquidity dynamics.

### Core Telemetry Features
- **Consensus Heartbeat**:
  - Live validated ledger sequence counter (`#107,560,xxx`)
  - Sub-4-second cadence interval gauge
  - Real-time transaction throughput (TPS) with rolling average
  - Base fee and network reserve trackers (1.0 XRP base reserve / 0.2 owner reserve)
  - Acoustic consensus heartbeat synthesizers via Web Audio API
- **Native DEX & AMM Intelligence (XLS-30D)**:
  - Total Value Locked (TVL) in native AMM pools ($28.2M+ across 1,000 active pools)
  - Top AMM Liquidity Pools table (XRP/CryptoLand, XRP/RLUSD, XRP/Fuzzybear, XRP/Magnetic, XRP/ARMY, etc.)
  - Real-time transaction load breakdown (OfferCreate DEX limit orders vs Payments vs XLS-56 Batches)
- **Institutional RLUSD Adoption (Ripple USD)**:
  - Total minted supply on XRPL ($1.22B+ RLUSD)
  - Active trustlines (102,700+) & unique holders (70,400+)
  - 24h native DEX trading volume ($3.1M+) & trade executions
  - Official issuer verification with NYDFS trust invariant
- **Live Whale Radar & Transaction Stream**:
  - Real-time streaming waterfall of validated transactions
  - Instant detection and acoustic chimes for high-value whale transfers (>5,000 XRP)
  - Special tracking for brand-new `BatchV1_1` (XLS-56) atomic transactions
  - 1-click inspection on XRPSCAN
- **Protocol Amendments Radar**:
  - Tracking activation and voting status for landmark amendments (`BatchV1_1`, `PermissionDelegationV1_1`, `fixAMMv1_1`, etc.)
- **Multi-Currency Pricing**:
  - Real-time global XRP market price (USD, EUR, SEK) via live ticker with 24h change and volume

---

## Tech Stack
- **Client**: React 19 + TypeScript + Vite 5 + Tailwind CSS
- **XRPL Client**: `xrpl@5.3.0` (WebSocket telemetry subscriptions)
- **Audio**: Web Audio API tactile synthesizers (heartbeat pulse & whale chimes)
- **Server**: Express 5 on Node 22
- **Deployment**: Coolify on OrbStack (`puls.apps.harkco.se`)

---

## Local Development

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```

---

## Built by Harkco
Crafted with pride by **Harkco** (`apps.harkco.se`).
Monetized via direct value exchange (zero ads, optional Pro unlock).
