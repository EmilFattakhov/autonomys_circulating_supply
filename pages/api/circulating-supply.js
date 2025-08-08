import { calculateCirculatingSupply, TGE_DATE } from '../../lib/tokenCalculations';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const currentDate = new Date();
    const tgeDate = TGE_DATE; // July 16, 2025 12:30PM EST
    
    const circulatingSupply = calculateCirculatingSupply(currentDate, tgeDate);
    const totalSupply = 1_000_000_000;
    const lockedSupply = totalSupply - circulatingSupply;

    const response = {
      total_supply: totalSupply,
      circulating_supply: circulatingSupply,
      locked_supply: lockedSupply,
      circulating_percentage: ((circulatingSupply / totalSupply) * 100).toFixed(2),
      last_updated: currentDate.toISOString(),
      block_time_seconds: 6,
      tge_date: tgeDate.toISOString(),
      tge_occurred: currentDate >= tgeDate
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error calculating circulating supply:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to calculate circulating supply'
    });
  }
}