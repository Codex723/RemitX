# RemitX: Cross-Border Remittance Routing Protocol

RemitX is a mobile-first dApp built on the Stellar network, designed to optimize cross-border payments. It intelligently routes funds through the most cost-effective payment paths and compares anchor fees to ensure users get the best exchange rates for corridors like Nigeria (NGN), Philippines (PHP), UK (GBP), and USA (USD).

## Features

- **Path Payment Router**: Queries Stellar Horizon for optimal liquidity paths.
- **Anchor Comparison**: Real-time fee comparison for SEP-24 off-ramps.
- **Mobile-First UI**: High-fidelity React interface for seamless sending.
- **DEX Monitor**: Real-time rate tracking and threshold alerts.
- **Soroban Ready**: Includes `Cargo.toml` for future smart contract extensions.

## Getting Started

1. Install dependencies: `npm install`
2. Set up your `.env` (see `.env.example`)
3. Run dev server: `npm run dev`

## Architecture

RemitX uses a full-stack approach:
- **Backend (Express)**: Proxies Stellar networking and handles anchor fee calculations.
- **Frontend (React)**: Professional mobile-first UI with Framer Motion animations.

## License

MIT
