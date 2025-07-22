/**
 * Token configuration for Final Trade MVP
 * Maps real tokens (PEPE, DOGE, ARB) to game characters
 */
const TOKEN_CONFIG = {
  // 3TOED (Sloth) - mapped to PEPE
  species1: {
    id: '3TOED',
    name: 'Three-Toed Sloth',
    symbol: '$3TOED',
    realToken: 'PEPE',
    coingeckoId: 'pepe',
    emoji: '🦥',
    colorPrimary: '#00FFF7', // Cyan
    colorSecondary: '#5fffd7',
    description: 'Stable • Strategic • Resilient',
    characterPath: '/assets/images/characters/sloth/'
  },
  
  // MNRCH (Monarch) - mapped to DOGE
  species2: {
    id: 'MNRCH',
    name: 'Monarch Butterfly',
    symbol: '$MNRCH',
    realToken: 'DOGE',
    coingeckoId: 'dogecoin',
    emoji: '🦋',
    colorPrimary: '#FF3EC9', // Hot Pink
    colorSecondary: '#ff79b0',
    description: 'Volatile • High-Risk • Aggressive',
    characterPath: '/assets/images/characters/monarch/'
  },
  
  // $FINAL token - mapped to ARB
  finalToken: {
    id: 'FINAL',
    name: 'Final Token',
    symbol: '$FINAL',
    realToken: 'ARB',
    coingeckoId: 'arbitrum',
    colorPrimary: '#28A0F0', // Arbitrum blue
    gateAmount: 50, // Minimum to play
    regenAmount: 50, // Amount for +5 HP
    regenHP: 5,
    buffTiers: [
      { amount: 100, bonus: 1 }, // +1 tier
      { amount: 150, bonus: 2 }  // +2 tiers
    ]
  },
  
  // Game configuration
  game: {
    roundDuration: 30, // seconds
    startingHP: 100,
    countdownStart: 30,
    moveAnimationDuration: 2, // seconds
    minorMoveCooldown: 0.5 // seconds
  },
  
  // Market modes for testing
  marketModes: {
    LAUNCH_VOLATILITY: {
      id: 'launch',
      name: '🚀 Launch Volatility',
      description: 'Wild price swings and chaos',
      icon: '🚀'
    },
    RANGEBOUND_NEUTRAL: {
      id: 'neutral',
      name: '🌊 Rangebound Neutral',
      description: 'Steady, predictable trading',
      icon: '🌊'
    },
    DIVERGENCE_MODE: {
      id: 'divergence',
      name: '⚡ Divergence Mode',
      description: 'Tokens moving in opposite directions',
      icon: '⚡'
    },
    LIVE_MODE: {
      id: 'live',
      name: '🔴 Live Battle',
      description: 'Real-time market data',
      icon: '🔴'
    }
  }
};

// Helper functions
export const getSpeciesById = (id) => {
  if (TOKEN_CONFIG.species1.id === id) return TOKEN_CONFIG.species1;
  if (TOKEN_CONFIG.species2.id === id) return TOKEN_CONFIG.species2;
  return null;
};

export const getSpeciesByRealToken = (token) => {
  if (TOKEN_CONFIG.species1.realToken === token) return TOKEN_CONFIG.species1;
  if (TOKEN_CONFIG.species2.realToken === token) return TOKEN_CONFIG.species2;
  return null;
};

export default TOKEN_CONFIG;