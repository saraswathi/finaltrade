export const GAME_CONFIG = {
    // Token Configuration
    tokens: {
      player1: {
        id: '3TOED',
        name: 'Three-Toed Sloth',
        symbol: '$3TOED',
        color: '#00FFF7',
        character: 'sloth'
      },
      player2: {
        id: 'MNRCH',
        name: 'Monarch Butterfly',
        symbol: '$MNRCH',
        color: '#FF3EC9',
        character: 'monarch'
      }
    },
    
    // Game Rules
    rules: {
      startingHP: 100,
      roundDuration: 30, // seconds
      totalRounds: 6,
      victoryCondition: 'lastStanding', // or 'highestHP'
      gateAmount: 50 // $FINAL required to play
    },
    
    // Market Tiers (based on 30s price change %)
    tiers: {
      5: { threshold: 2.0, damage: 5, name: 'Devastating', moveType: 'major_5' },
      4: { threshold: 0.5, damage: 4, name: 'Strong', moveType: 'major_4' },
      3: { threshold: -0.49, damage: 3, name: 'Normal', moveType: 'major_3' },
      2: { threshold: -1.0, damage: 2, name: 'Weak', moveType: 'major_2' },
      1: { threshold: -Infinity, damage: 1, name: 'Minimal', moveType: 'major_1' }
    },
    
    // Momentum System
    momentum: {
      max: 5,
      decayRate: 0.1,
      tradeImpact: {
        small: { threshold: 100, value: 1 },
        medium: { threshold: 500, value: 2 },
        large: { threshold: 1000, value: 3 }
      }
    },
    
    // $FINAL Token Features
    finalToken: {
      symbol: '$FINAL',
      color: '#FFD700',
      buffs: [
        { amount: 100, bonus: 1, name: 'Bronze Buff' },
        { amount: 150, bonus: 2, name: 'Silver Buff' }
      ],
      regenPerPurchase: 5, // HP gained per 50 $FINAL bought
      regenAmount: 50 // $FINAL needed for regen
    },
    
    // Market Scenarios (pre-configured battles)
    scenarios: {
      launch: {
        name: 'Launch Volatility',
        description: 'Wild swings typical of new token launches'
      },
      neutral: {
        name: 'Rangebound Neutral', 
        description: 'Sideways market action'
      },
      divergence: {
        name: 'Divergence Mode',
        description: 'Tokens moving in opposite directions'
      }
    },
    
    // Animation Timings
    animations: {
      moveDisplay: 2000, // ms to show move animation
      damageFlash: 500,
      tradeEffect: 300,
      roundTransition: 1000
    },
    
    // Commentary Triggers
    commentary: {
      roundStart: ['Round begins - trade to influence the outcome!', 'Market opens - who will strike first?'],
      buyPressure: ['Buy pressure building!', 'Bulls are charging!'],
      sellPressure: ['Sell pressure mounting!', 'Bears take control!'],
      highMomentum: ['Momentum surging!', 'The tide is turning!'],
      lowHP: ['Fighter on the ropes!', 'Critical damage!'],
      victory: ['Victory achieved!', 'The market has spoken!']
    }
  };