/**
 * Service for querying on-chain token supply data from Optimism
 * Uses ethers.js to connect to the blockchain and query ERC20 token contracts
 */
import { ethers } from 'ethers';

// Minimal ERC20 ABI - only the functions we need
const ERC20_ABI = [
  // Total supply function
  'function totalSupply() view returns (uint256)',
  // Balances function to check locked tokens
  'function balanceOf(address owner) view returns (uint256)'
];

// Cache to store supply data with expiration
const supplyCache = {
  data: {},
  timestamp: {},
  // Cache valid for 2 minutes by default
  CACHE_DURATION: 2 * 60 * 1000
};

const TokenSupplyService = {
  // Optimism RPC URLs - include multiple for redundancy
  RPC_URLS: [
    'https://optimism-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // Public Infura endpoint (rate limited)
    'https://mainnet.optimism.io', // Public OP endpoint (rate limited)
    'https://opt-mainnet.g.alchemy.com/v2/demo' // Public Alchemy endpoint (rate limited)
  ],
  
  // Provider instance
  provider: null,
  
  // Initialize provider
  initProvider: function() {
    if (!this.provider) {
      // Try to use a provider with fallback options
      try {
        this.provider = new ethers.JsonRpcProvider(this.RPC_URLS[0]);
        console.log('Initialized Optimism provider');
      } catch (error) {
        console.error('Error initializing ethers provider:', error);
        // Try fallback RPC URLs if the first one fails
        for (let i = 1; i < this.RPC_URLS.length; i++) {
          try {
            this.provider = new ethers.JsonRpcProvider(this.RPC_URLS[i]);
            console.log(`Using fallback RPC URL #${i}`);
            break;
          } catch (err) {
            console.error(`Error with fallback RPC #${i}:`, err);
          }
        }
      }
    }
    
    return this.provider;
  },
  
  /**
   * Get the total supply of a token from on-chain data
   * @param {string} tokenAddress - The token contract address
   * @returns {Promise<number>} - The total supply in token units (not wei)
   */
  getTotalSupply: async function(tokenAddress) {
    try {
      const provider = this.initProvider();
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      
      // Check cache first
      const cacheKey = `totalSupply-${tokenAddress}`;
      if (
        supplyCache.data[cacheKey] && 
        (Date.now() - supplyCache.timestamp[cacheKey] < supplyCache.CACHE_DURATION)
      ) {
        console.log(`Using cached total supply for ${tokenAddress}`);
        return supplyCache.data[cacheKey];
      }
      
      // Create contract instance with the minimal ABI
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      // Query total supply
      const totalSupplyWei = await contract.totalSupply();
      
      // Convert from wei to token units (assuming 18 decimals)
      // For more precision, we could query the decimals() function as well
      const totalSupply = parseFloat(ethers.formatUnits(totalSupplyWei, 18));
      
      // Cache the result
      supplyCache.data[cacheKey] = totalSupply;
      supplyCache.timestamp[cacheKey] = Date.now();
      
      console.log(`Total supply for ${tokenAddress}: ${totalSupply}`);
      return totalSupply;
    } catch (error) {
      console.error(`Error getting total supply for ${tokenAddress}:`, error);
      // Return a fallback value or cached value if available
      const cacheKey = `totalSupply-${tokenAddress}`;
      return supplyCache.data[cacheKey] || 0;
    }
  },
  
  /**
   * Get the circulating supply by subtracting known locked tokens
   * @param {string} tokenAddress - The token contract address
   * @param {string[]} lockedAddresses - Array of addresses with locked tokens
   * @returns {Promise<number>} - The circulating supply in token units
   */
  getCirculatingSupply: async function(tokenAddress, lockedAddresses = []) {
    try {
      const provider = this.initProvider();
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      
      // Check cache first
      const cacheKey = `circulatingSupply-${tokenAddress}`;
      if (
        supplyCache.data[cacheKey] && 
        (Date.now() - supplyCache.timestamp[cacheKey] < supplyCache.CACHE_DURATION)
      ) {
        console.log(`Using cached circulating supply for ${tokenAddress}`);
        return supplyCache.data[cacheKey];
      }
      
      // Get total supply first
      const totalSupply = await this.getTotalSupply(tokenAddress);
      
      // If no locked addresses provided, return total supply as circulating
      if (!lockedAddresses || lockedAddresses.length === 0) {
        supplyCache.data[cacheKey] = totalSupply;
        supplyCache.timestamp[cacheKey] = Date.now();
        return totalSupply;
      }
      
      // Create contract instance
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      // Query balances of locked addresses
      let lockedAmount = 0;
      for (const address of lockedAddresses) {
        try {
          const balance = await contract.balanceOf(address);
          const balanceFormatted = parseFloat(ethers.formatUnits(balance, 18));
          lockedAmount += balanceFormatted;
          console.log(`Locked at ${address}: ${balanceFormatted}`);
        } catch (err) {
          console.warn(`Error checking locked balance at ${address}:`, err);
        }
      }
      
      // Calculate circulating supply
      const circulatingSupply = Math.max(0, totalSupply - lockedAmount);
      
      // Cache the result
      supplyCache.data[cacheKey] = circulatingSupply;
      supplyCache.timestamp[cacheKey] = Date.now();
      
      console.log(`Circulating supply for ${tokenAddress}: ${circulatingSupply}`);
      return circulatingSupply;
    } catch (error) {
      console.error(`Error getting circulating supply for ${tokenAddress}:`, error);
      // Return a fallback value or cached value if available
      const cacheKey = `circulatingSupply-${tokenAddress}`;
      return supplyCache.data[cacheKey] || 0;
    }
  },
  
  /**
   * Calculate market cap using on-chain circulating supply and current price
   * @param {string} tokenAddress - The token contract address 
   * @param {number} price - Current token price in USD
   * @param {string[]} lockedAddresses - Array of addresses with locked tokens
   * @returns {Promise<number>} - The market cap in USD
   */
  // Add this to the calculateMarketCap function:
calculateMarketCap: async function(tokenAddress, price, lockedAddresses = []) {
  try {
    // Get circulating supply
    const circulatingSupply = await this.getCirculatingSupply(tokenAddress, lockedAddresses);
    
    // Calculate market cap
    const marketCap = circulatingSupply * price;
    
    // Add detailed logging
    console.log('Market Cap Calculation:');
    console.log(`- Token Address: ${tokenAddress}`);
    console.log(`- Price: $${price}`);
    console.log(`- Circulating Supply: ${circulatingSupply.toLocaleString()}`);
    console.log(`- Calculated Market Cap: $${marketCap.toLocaleString()}`);
    
    return marketCap;
  } catch (error) {
    console.error(`Error calculating market cap for ${tokenAddress}:`, error);
    return 0;
  }
},
  
  /**
   * Force refresh the cache for a specific token
   * @param {string} tokenAddress - The token contract address
   */
  refreshCache: function(tokenAddress) {
    const totalSupplyKey = `totalSupply-${tokenAddress}`;
    const circulatingSupplyKey = `circulatingSupply-${tokenAddress}`;
    
    delete supplyCache.data[totalSupplyKey];
    delete supplyCache.timestamp[totalSupplyKey];
    delete supplyCache.data[circulatingSupplyKey];
    delete supplyCache.timestamp[circulatingSupplyKey];
    
    console.log(`Cache cleared for ${tokenAddress}`);
  },
  
  /**
   * Set default fallback values for when RPC calls fail
   * @param {string} tokenAddress - The token contract address
   * @param {number} totalSupply - Fallback total supply value
   * @param {number} circulatingSupply - Fallback circulating supply value
   */
  setFallbackValues: function(tokenAddress, totalSupply, circulatingSupply) {
    const totalSupplyKey = `totalSupply-${tokenAddress}`;
    const circulatingSupplyKey = `circulatingSupply-${tokenAddress}`;
    
    // Only set if no existing cache
    if (!supplyCache.data[totalSupplyKey]) {
      supplyCache.data[totalSupplyKey] = totalSupply;
      supplyCache.timestamp[totalSupplyKey] = Date.now();
    }
    
    if (!supplyCache.data[circulatingSupplyKey]) {
      supplyCache.data[circulatingSupplyKey] = circulatingSupply;
      supplyCache.timestamp[circulatingSupplyKey] = Date.now();
    }
    
    console.log(`Fallback values set for ${tokenAddress}`);
  }
};

export default TokenSupplyService;
