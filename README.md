# Autonomys Token Distribution

Simple one-page app showing $AI3 token distribution and circulating supply API for Autonomys Network Consensus Chain.

## Quick Start

```bash
npm install
npm run dev
```

Visit `https://autonomys-circulating-supply.vercel.app/`

## API

**POST** `https://autonomys-circulating-supply.vercel.app/api/circulating-supply`

```bash
# Current data
curl -X POST https://your-app.vercel.app/api/circulating-supply

# Historical data
curl -X POST https://your-app.vercel.app/api/circulating-supply \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-12-31T00:00:00Z"}'
```

## Features

- Real-time circulating supply calculations
- Token distribution breakdown with vesting schedules
- POST API for programmatic access
- Mobile-responsive design

## Links

- [Official Tokenomics](https://subspace.foundation/tokenomics)