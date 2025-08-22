// Token calculation utilities

export const TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens
export const MAINNET_PHASE_1_LAUNCH = new Date('2024-11-06T17:30:00Z'); // November 6, 2024 12:30PM EST
export const TGE_DATE = new Date('2025-07-16T17:30:00Z'); // July 16, 2025 12:30PM EST
export const BLOCK_TIME_SECONDS = 6;
const BLOCKS_PER_DAY = (24 * 60 * 60) / BLOCK_TIME_SECONDS;

// Initial allocations (at Phase-1 launch)
const ALLOCATIONS = {
  investors: { percent: 21.53, tokens: 215_300_000, vesting: 'cliff12_linear36' },
  team: {
    founders: { percent: 2.00, tokens: 20_000_000, vesting: 'cliff12_linear36' },
    advisors: { percent: 2.35, tokens: 23_500_000, vesting: 'cliff12_linear36' },
    staff: { percent: 5.14, tokens: 51_400_000, vesting: 'cliff12_linear36' }
  },
  autonomysLabs: {
    devcoTreasury: { percent: 7.00, tokens: 70_000_000, vesting: 'cliff12_linear36' },
    marketLiquidity: { percent: 2.00, tokens: 20_000_000, vesting: 'immediate' }
  },
  partners: { percent: 1.43, tokens: 14_300_000, vesting: 'cliff12_linear36' },
  subspaceFoundation: {
    operations: { percent: 0.68, tokens: 6_800_000, vesting: 'immediate' },
    nearTermTreasury: { percent: 5.00, tokens: 50_000_000, vesting: 'tbd' },
    longTermTreasury: { percent: 10.00, tokens: 100_000_000, vesting: 'cliff12_linear36' }
  },
  testnets: {
    testnetRewards: { percent: 5.97, tokens: 59_700_000, vesting: 'immediate' },
    stakeWars1: { percent: 0.60, tokens: 6_000_000, vesting: 'immediate' },
    stakeWars2: { percent: 0.30, tokens: 3_000_000, vesting: 'locked' } // Not yet distributed
  },
  ambassadors: { percent: 1.00, tokens: 10_000_000, vesting: 'variable' },
  farmerRewards: { percent: 35.00, tokens: 350_000_000, vesting: 'farming' }
};

// Calculate farming rewards using calibrated parameters to match known data
// Known: ~9.1M AI3 tokens minted from November 2024 to Q1 2025 (official report)
// Source: BlockScience dynamic issuance model + empirical data calibration
function calculateFarmingRewards(currentDate = new Date()) {
  // Mainnet farming started November 6, 2024 12:30PM EST
  const FARMING_START_DATE = new Date('2024-11-06T17:30:00Z'); 
  
  // Rewards activated when 210PB target was reached (late November 2024)
  const REWARDS_ACTIVATION_DATE = new Date('2024-11-26T00:00:00Z');
  
  // If before rewards activation, no rewards
  if (currentDate < REWARDS_ACTIVATION_DATE) {
    return 0;
  }
  
  const millisecondsSinceActivation = Math.max(0, currentDate - REWARDS_ACTIVATION_DATE);
  const totalBlocks = Math.floor(millisecondsSinceActivation / (BLOCK_TIME_SECONDS * 1000));
  
  if (totalBlocks === 0) return 0;
  
  // Calibrated parameters to match empirical data of ~9.1M tokens by Q1 2025
  // The actual implementation appears to have faster decay or other factors
  const INITIAL_SUBSIDY = 5.0; // AI3 per block (confirmed from official sources)
  const MAX_ISSUANCE_TOKENS = 350_000_000; // Total farming rewards pool
  
  // Empirically calibrated decay rate to match known data points
  // 9.1M tokens over ~255 days suggests faster decay than pure exponential
  const EFFECTIVE_DECAY_RATE = 2.8; // Calibrated multiplier for decay
  
  let totalRewards = 0;
  
  // Use exponential decay with calibrated rate
  // Process in chunks for performance
  const CHUNK_SIZE = 50000;
  
  for (let startBlock = 0; startBlock < totalBlocks; startBlock += CHUNK_SIZE) {
    const endBlock = Math.min(startBlock + CHUNK_SIZE, totalBlocks);
    const midBlock = (startBlock + endBlock) / 2;
    
    // Exponential decay formula with calibrated rate
    const referenceSubsidy = INITIAL_SUBSIDY * Math.exp(-INITIAL_SUBSIDY * EFFECTIVE_DECAY_RATE * midBlock / MAX_ISSUANCE_TOKENS);
    
    // Add rewards for all blocks in this chunk
    const blocksInChunk = endBlock - startBlock;
    totalRewards += referenceSubsidy * blocksInChunk;
    
    // Safety check to not exceed max issuance
    if (totalRewards >= MAX_ISSUANCE_TOKENS) {
      return MAX_ISSUANCE_TOKENS;
    }
  }
  
  return Math.floor(totalRewards);
}

// Calculate vested amount based on vesting schedule
function calculateVestedAmount(allocation, vestingType, currentDate = new Date(), tgeDate = TGE_DATE) {
  if (vestingType === 'immediate') {
    return allocation;
  }
  
  if (vestingType === 'locked') {
    return 0; // Not yet distributed
  }
  
  if (vestingType === 'farming') {
    return calculateFarmingRewards(currentDate);
  }
  
  if (vestingType === 'tbd' || vestingType === 'variable') {
    return 0; // Conservative assumption
  }
  
  if (vestingType === 'cliff12_linear36') {
    const monthsSinceTGE = Math.max(0, (currentDate - tgeDate) / (1000 * 60 * 60 * 24 * 30.44));
    
    if (monthsSinceTGE < 12) {
      return 0; // Still in cliff period
    }
    
    if (monthsSinceTGE >= 48) {
      return allocation; // Fully vested
    }
    
    // 25% at month 12, then linear over 36 months
    const cliffAmount = allocation * 0.25;
    const linearMonths = monthsSinceTGE - 12;
    const linearAmount = (allocation * 0.75 * linearMonths) / 36;
    
    return cliffAmount + linearAmount;
  }
  
  return 0;
}

// Calculate total circulating supply
export function calculateCirculatingSupply(currentDate = new Date(), tgeDate = TGE_DATE) {
  // IMPORTANT: Token transferability is disabled at protocol level until TGE
  // Even though tokens are minted at Phase-1, they cannot be transferred until TGE
  const tgeOccurred = currentDate >= tgeDate;
  
  if (!tgeOccurred) {
    // Before TGE, circulating supply is 0 due to protocol-level transfer restrictions
    return 0;
  }
  
  let circulatingSupply = 0;
  
  // After TGE, count unlocked tokens:
  
  // 1. Market Liquidity - unlocked at TGE
  circulatingSupply += ALLOCATIONS.autonomysLabs.marketLiquidity.tokens;
  
  // 2. Foundation Operations - liquid
  circulatingSupply += ALLOCATIONS.subspaceFoundation.operations.tokens;
  
  // 3. Testnet rewards - no lockup (but only transferable after TGE)
  circulatingSupply += ALLOCATIONS.testnets.testnetRewards.tokens;
  circulatingSupply += ALLOCATIONS.testnets.stakeWars1.tokens;
  // Note: stakeWars2 tokens are locked (not yet distributed)
  
  // 4. Vested tokens from cliff + linear schedules (all start from TGE date)
  circulatingSupply += calculateVestedAmount(ALLOCATIONS.investors.tokens, 'cliff12_linear36', currentDate, tgeDate);
  circulatingSupply += calculateVestedAmount(ALLOCATIONS.team.founders.tokens, 'cliff12_linear36', currentDate, tgeDate);
  circulatingSupply += calculateVestedAmount(ALLOCATIONS.team.advisors.tokens, 'cliff12_linear36', currentDate, tgeDate);
  circulatingSupply += calculateVestedAmount(ALLOCATIONS.team.staff.tokens, 'cliff12_linear36', currentDate, tgeDate);
  circulatingSupply += calculateVestedAmount(ALLOCATIONS.autonomysLabs.devcoTreasury.tokens, 'cliff12_linear36', currentDate, tgeDate);
  circulatingSupply += calculateVestedAmount(ALLOCATIONS.partners.tokens, 'cliff12_linear36', currentDate, tgeDate);
  circulatingSupply += calculateVestedAmount(ALLOCATIONS.subspaceFoundation.longTermTreasury.tokens, 'cliff12_linear36', currentDate, tgeDate);
  
  // 5. Farming rewards (minted since Nov 6, 2024, but only transferable after TGE)
  circulatingSupply += calculateFarmingRewards(currentDate);
  
  return Math.floor(circulatingSupply);
}

export function getTokenDistribution() {
  return {
    totalSupply: TOTAL_SUPPLY,
    allocations: ALLOCATIONS,
    currentCirculating: calculateCirculatingSupply(),
    lastUpdated: new Date().toISOString()
  };
}

// Export the calculateFarmingRewards function
export { calculateFarmingRewards };