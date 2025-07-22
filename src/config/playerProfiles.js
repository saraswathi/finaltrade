/**
 * Player profile configurations for Final Trade MVP
 * Different player types for testing various gameplay strategies
 */
const PLAYER_PROFILES = {
    whale: {
      id: 'whale',
      name: 'Whale',
      emoji: '🐋',
      balances: {
        ETH: 200,
        FINAL: 50,
        '3TOED': 100000,
        'MNRCH': 100000
      },
      tradeSize: {
        min: 500,
        max: 2000,
        default: 1000
      },
      tradingBehavior: {
        frequency: 'low', // trades per round
        strategy: 'market-moving',
        impactMultiplier: 1.5 // their trades have more impact
      },
      momentumScaling: {
        // Amount needed to reach each momentum tier
        tier1: 200,
        tier2: 500,
        tier3: 1000
      },
      description: 'Big trades, big impact. Controls the market.'
    },
    
    degen: {
      id: 'degen',
      name: 'Degen',
      emoji: '🎰',
      balances: {
        ETH: 20,
        FINAL: 50,
        '3TOED': 10000,
        'MNRCH': 10000
      },
      tradeSize: {
        min: 10,
        max: 50,
        default: 30
      },
      tradingBehavior: {
        frequency: 'high',
        strategy: 'momentum-chasing',
        impactMultiplier: 1.0
      },
      momentumScaling: {
        tier1: 10,
        tier2: 30,
        tier3: 50
      },
      description: 'High frequency, high risk. Lives for the volatility.'
    },
    
    regen: {
      id: 'regen',
      name: 'Regen',
      emoji: '🌱',
      balances: {
        ETH: 20,
        FINAL: 50,
        '3TOED': 5000,
        'MNRCH': 5000
      },
      tradeSize: {
        min: 50,
        max: 100,
        default: 75
      },
      tradingBehavior: {
        frequency: 'medium',
        strategy: 'heal-focused',
        impactMultiplier: 1.2 // bonus for strategic play
      },
      momentumScaling: {
        tier1: 20,
        tier2: 50,
        tier3: 100
      },
      description: 'Balanced approach. Focuses on $FINAL for healing.'
    },
    
    normie: {
      id: 'normie',
      name: 'Normie',
      emoji: '👤',
      balances: {
        ETH: 5,
        FINAL: 50,
        '3TOED': 1000,
        'MNRCH': 1000
      },
      tradeSize: {
        min: 10,
        max: 30,
        default: 20
      },
      tradingBehavior: {
        frequency: 'low',
        strategy: 'random',
        impactMultiplier: 0.8
      },
      momentumScaling: {
        tier1: 10,
        tier2: 20,
        tier3: 30
      },
      description: 'Just here for fun. Small trades, learning the ropes.'
    }
  };
  
  // Helper functions
  export const getProfileById = (id) => PLAYER_PROFILES[id] || PLAYER_PROFILES.normie;
  
  export const calculateMomentumTier = (tradeAmount, profile) => {
    const scaling = profile.momentumScaling;
    
    if (tradeAmount >= scaling.tier3) return 3;
    if (tradeAmount >= scaling.tier2) return 2;
    if (tradeAmount >= scaling.tier1) return 1;
    return 0;
  };
  
  export const getTradeImpact = (tradeAmount, profile) => {
    return tradeAmount * profile.tradingBehavior.impactMultiplier;
  };
  
  // Export default profile for initial state
  export const DEFAULT_PROFILE = PLAYER_PROFILES.normie;
  
  export default PLAYER_PROFILES;