/**
 * Service for handling game mechanics and battle calculations
 * Manages move selection, damage calculation, and battle flow
 */
import TOKEN_CONFIG from '../config/tokenConfig';
import { calculateMomentumTier } from '../config/playerProfiles';
import CoinGeckoService from './CoinGeckoService';
import majorMoves from '../data/major_moves.json';
import minorMoves from '../data/minor_moves.json';

class GameMechanicsService {
  constructor() {
    this.roundData = {};
    this.currentRound = 0;
  }

  /**
   * Calculate effective tier for a fighter
   * @param {Object} params - Calculation parameters
   * @returns {number} Effective tier (1-5)
   */
  calculateEffectiveTier({ marketTier, momentum, finalBalance }) {
    let effectiveTier = marketTier;
    
    // Add momentum bonus (0-3 maps to 0-1 tier bonus)
    effectiveTier += Math.floor(momentum / 3);
    
    // Add $FINAL buffs
    TOKEN_CONFIG.finalToken.buffTiers.forEach(buff => {
      if (finalBalance >= buff.amount) {
        effectiveTier = marketTier + buff.bonus;
      }
    });
    
    // Cap at tier 5
    return Math.min(effectiveTier, 5);
  }

  /**
   * Determine round winner and moves
   * @param {Object} round - Round data with both fighters
   * @returns {Object} Battle result
   */
  determineRoundOutcome(round) {
    const slothEffectiveTier = this.calculateEffectiveTier({
      marketTier: round.sloth.marketTier,
      momentum: round.sloth.momentum,
      finalBalance: round.sloth.finalBalance
    });
    
    const monarchEffectiveTier = this.calculateEffectiveTier({
      marketTier: round.monarch.marketTier,
      momentum: round.monarch.momentum,
      finalBalance: round.monarch.finalBalance
    });
    
    // Determine winner
    let winner, loser, winnerData, loserData;
    
    if (slothEffectiveTier > monarchEffectiveTier) {
      winner = '3TOED';
      loser = 'MNRCH';
      winnerData = { ...round.sloth, effectiveTier: slothEffectiveTier };
      loserData = { ...round.monarch, effectiveTier: monarchEffectiveTier };
    } else if (monarchEffectiveTier > slothEffectiveTier) {
      winner = 'MNRCH';
      loser = '3TOED';
      winnerData = { ...round.monarch, effectiveTier: monarchEffectiveTier };
      loserData = { ...round.sloth, effectiveTier: slothEffectiveTier };
    } else {
      // Tie breaker: higher momentum
      if (round.sloth.momentum > round.monarch.momentum) {
        winner = '3TOED';
        loser = 'MNRCH';
        winnerData = { ...round.sloth, effectiveTier: slothEffectiveTier };
        loserData = { ...round.monarch, effectiveTier: monarchEffectiveTier };
      } else if (round.monarch.momentum > round.sloth.momentum) {
        winner = 'MNRCH';
        loser = '3TOED';
        winnerData = { ...round.monarch, effectiveTier: monarchEffectiveTier };
        loserData = { ...round.sloth, effectiveTier: slothEffectiveTier };
      } else {
        // Complete tie: random
        winner = Math.random() > 0.5 ? '3TOED' : 'MNRCH';
        loser = winner === '3TOED' ? 'MNRCH' : '3TOED';
        winnerData = winner === '3TOED' 
          ? { ...round.sloth, effectiveTier: slothEffectiveTier }
          : { ...round.monarch, effectiveTier: monarchEffectiveTier };
        loserData = winner === '3TOED'
          ? { ...round.monarch, effectiveTier: monarchEffectiveTier }
          : { ...round.sloth, effectiveTier: slothEffectiveTier };
      }
    }
    
    // Select major move based on tier
    const majorMove = this.selectMajorMove(winner, winnerData.effectiveTier);
    
    // Calculate damage
    const damage = winnerData.marketTier; // Base damage = market tier
    
    return {
      winner,
      loser,
      winnerData,
      loserData,
      majorMove,
      damage,
      isCritical: winnerData.effectiveTier === 5
    };
  }

  /**
   * Select major move based on tier
   * @param {string} fighter - Fighter ID (3TOED or MNRCH)
   * @param {number} tier - Effective tier (1-5)
   * @returns {Object} Move data
   */
  selectMajorMove(fighter, tier) {
    const fighterKey = fighter === '3TOED' ? 'sloth' : 'monarch';
    const fighterMoves = majorMoves[fighterKey];
    
    if (!fighterMoves || fighterMoves.length === 0) {
      console.error('No moves found for fighter:', fighter);
      return { id: 'default', name: 'Basic Attack', tier: 1 };
    }
    
    // Tier 1-5 maps to moves 0-4 (array index)
    const moveIndex = Math.min(tier - 1, fighterMoves.length - 1);
    const move = fighterMoves[moveIndex];
    
    return {
      ...move,
      tier,
      imageFile: move.image_id || `${fighterKey}_major_${moveIndex + 1}.png`
    };
  }

  /**
   * Select minor move based on trade action
   * @param {string} fighter - Fighter ID
   * @param {string} action - 'buy' or 'sell'
   * @param {number} momentumTier - Momentum tier (1-3)
   * @returns {Object} Minor move data
   */
  selectMinorMove(fighter, action, momentumTier) {
    const fighterKey = fighter === '3TOED' ? 'sloth' : 'monarch';
    const direction = action === 'buy' ? 'pos' : 'neg';
    const tier = Math.min(Math.max(momentumTier, 1), 3);
    
    const imageKey = `${direction}_${tier}`;
    const imageFile = minorMoves[fighterKey][imageKey];
    
    return {
      id: imageKey,
      imageFile: imageFile || `${fighterKey}_momentum_${direction}_${tier}.png`,
      action,
      tier
    };
  }

  /**
   * Process a player trade and calculate momentum
   * @param {Object} params - Trade parameters
   * @returns {Object} Trade result
   */
  processTrade({ fighter, action, amount, playerProfile }) {
    const momentumTier = calculateMomentumTier(amount, playerProfile);
    const minorMove = this.selectMinorMove(fighter, action, momentumTier);
    
    return {
      momentumGained: momentumTier,
      minorMove,
      impactAmount: amount * playerProfile.tradingBehavior.impactMultiplier
    };
  }

  /**
   * Calculate HP regeneration from $FINAL purchases
   * @param {number} finalPurchased - Amount of $FINAL bought
   * @returns {number} HP to regenerate
   */
  calculateRegen(finalPurchased) {
    const regenUnits = Math.floor(finalPurchased / TOKEN_CONFIG.finalToken.regenAmount);
    return regenUnits * TOKEN_CONFIG.finalToken.regenHP;
  }

  /**
   * Get market commentary based on game state
   * @param {Object} battleState - Current battle state
   * @returns {string} Commentary text
   */
  getMarketCommentary(battleState) {
    const commentaries = {
      volumeSurge: [
        "Volume Spike Detected: 3TOED heating up",
        "Order book trembles: pressure builds",
        "Buy wall forming... is a major move coming?"
      ],
      priceAction: [
        "Price Surge: MNRCH just jumped +2.4%",
        "3TOED slips hard: -1.8%",
        "Flash swing: 3TOED rips through resistance"
      ],
      playerInput: [
        "Big buy registered: 3TOED builds strength!",
        "Momentum shift: MNRCH gains edge",
        "Your trades tip the scale — keep going!"
      ],
      roundStart: [
        "Round 4 begins — who holds the edge?",
        "Next major move incoming...",
        "Final round approaching — every input counts"
      ]
    };
    
    // Select appropriate commentary based on state
    const category = this.determineCommentaryCategory(battleState);
    const options = commentaries[category] || commentaries.roundStart;
    
    return options[Math.floor(Math.random() * options.length)];
  }

  determineCommentaryCategory(battleState) {
    if (battleState.lastAction === 'trade') return 'playerInput';
    if (battleState.volumeChange > 50) return 'volumeSurge';
    if (Math.abs(battleState.priceChange) > 1) return 'priceAction';
    return 'roundStart';
  }
}

// Export singleton instance
export default new GameMechanicsService();