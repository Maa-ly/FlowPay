# FlowPay Frontend

Modern Next.js app for intent-driven, agentic payments on Cronos using x402 programmatic flows.

## Tech Stack
- Next.js 16 (App Router, Turbopack dev)
- TypeScript, Tailwind CSS
- RainbowKit + Wagmi for wallet connect

## Getting Started
1. Install dependencies:
   - `npm install`
2. Configure environment:
   - Create `.env.local` and set:
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id`
     - `THIRDWEB_SECRET_KEY=optional_if_using_facilitator_examples`
3. Run dev server:
   - `npm run dev` and open http://localhost:3000
4. Build:
   - `npm run build`

## Pages
- `/` Hero with CTAs and feature cards
- `/intent` Create payment intent with constraints and preview
- `/status` View agent decisions and reasoning

## Notes
- Tailwind configured via `@tailwindcss/postcss` for Next 16.
- Cronos chains are defined under `src/lib/chains.ts`.
- Wallet connect configured in `src/app/providers.tsx`.

