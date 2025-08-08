# Autonomys Token Information App

A Next.js application that displays $AI3 token distribution and provides a JSON API for circulating supply data.

## Features

- **Token Information Page**: Comprehensive breakdown of $AI3 token distribution
- **JSON API Endpoint**: Returns circulating supply data at `/api/circulating-supply`
- **Real-time Calculations**: Accounts for vesting schedules and farming rewards
- **Responsive Design**: Works on desktop and mobile

## Quick Start

### 1. Local Development

```bash
# Clone or create the project
mkdir autonomys-token-info
cd autonomys-token-info

# Create package.json and install dependencies
npm init -y
npm install next react react-dom

# Copy the provided files:
# - lib/tokenCalculations.js
# - pages/index.js  
# - pages/api/circulating-supply.js

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### 2. Deploy to Vercel (Recommended - FREE)

**Option A: Deploy via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel

# Follow prompts - it will auto-detect Next.js
```

**Option B: Deploy via GitHub**
1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "Import Project" and select your repo
5. Vercel will automatically deploy your Next.js app

**Option C: Deploy via Web Interface**
1. Zip your project files
2. Go to [vercel.com](https://vercel.com)
3. Drag and drop your zip file

### 3. Alternative Deployment Options

**Netlify (Also FREE)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod --dir=out
```

**Railway**
1. Connect GitHub repo to Railway
2. Automatic deployments on push

**DigitalOcean App Platform**
1. Connect GitHub repo
2. Select Node.js environment
3. Auto-detects Next.js build commands

## Configuration

### Important: Update These Values

1. **Mainnet Phase-1 Launch Date**
   - Update in `lib/tokenCalculations.js`
   - Currently set to placeholder date

2. **TGE Date**
   - Update in both `pages/index.js` and `pages/api/circulating-supply.js`
   - Currently set to `2024-06-01`

3. **Farming Reward Formula**
   - The current farming reward calculation is simplified
   - Replace with actual BlockScience model
   - Located in `calculateFarmingRewards()` function

### Environment Variables (Optional)

Create `.env.local` for configuration:

```
NEXT_PUBLIC_TGE_DATE=2024-06-01
NEXT_PUBLIC_MAINNET_LAUNCH=2024-01-01
```

## API Usage

### GET /api/circulating-supply

Returns current token supply information:

```json
{
  "total_supply": 1000000000,
  "circulating_supply": 108500000,
  "locked_supply": 891500000,
  "circulating_percentage": "10.85",
  "last_updated": "2024-08-08T12:00:00.000Z",
  "block_time_seconds": 6,
  "tge_date": "2024-06-01T00:00:00.000Z",
  "tge_occurred": true
}
```

## Project Structure

```
autonomys-token-info/
├── lib/
│   └── tokenCalculations.js    # Token logic and calculations
├── pages/
│   ├── index.js               # Main token info page
│   └── api/
│       └── circulating-supply.js  # JSON API endpoint
├── package.json
└── README.md
```

## Customization

### Styling
- Currently uses inline styles for simplicity
- Can be converted to CSS modules or Tailwind CSS
- All styles are in the React components

### Data Updates
- Token calculations update automatically based on current date
- Vesting schedules are calculated in real-time
- Farming rewards use simplified formula (update with actual model)

### Adding Features
- Add more API endpoints in `pages/api/`
- Create additional pages in `pages/`
- Extend calculations in `lib/tokenCalculations.js`

## Performance

- **Fast Loading**: Server-side rendering with Next.js
- **Global CDN**: Automatic with Vercel deployment
- **Caching**: API responses can be cached for better performance

## Support

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - Feel free to modify and use as needed.