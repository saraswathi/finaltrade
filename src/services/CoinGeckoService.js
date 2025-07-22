/**
 * Service for interacting with CoinGecko API
 * Handles fetching real-time and historical price data
 */
class CoinGeckoService {
    constructor() {
      this.baseURL = 'https://api.coingecko.com/api/v3';
      this.cache = new Map();
      this.cacheTimeout = 30000; // 30 seconds
    }
  
    /**
     * Fetch current price for multiple tokens
     * @param {string[]} ids - Array of CoinGecko token IDs
     * @returns {Promise<Object>} Price data
     */
    async getCurrentPrices(ids) {
      const cacheKey = `prices_${ids.join('_')}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
  
      try {
        const response = await fetch(
          `${this.baseURL}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
        );
        
        if (!response.ok) throw new Error('Failed to fetch prices');
        
        const data = await response.json();
        this.setCache(cacheKey, data);
        return data;
      } catch (error) {
        console.error('Error fetching current prices:', error);
        return this.getFallbackPrices(ids);
      }
    }
  
    /**
     * Fetch historical market data for a token
     * @param {string} id - CoinGecko token ID
     * @param {number} from - Unix timestamp
     * @param {number} to - Unix timestamp
     * @returns {Promise<Object>} Historical data
     */
    async getMarketChartRange(id, from, to) {
      const cacheKey = `chart_${id}_${from}_${to}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
  
      try {
        const response = await fetch(
          `${this.baseURL}/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch market chart');
        
        const data = await response.json();
        this.setCache(cacheKey, data);
        return data;
      } catch (error) {
        console.error('Error fetching market chart:', error);
        return this.getFallbackMarketData(id);
      }
    }
  
    /**
     * Calculate price change over a specific period
     * @param {string} id - CoinGecko token ID
     * @param {number} seconds - Period in seconds
     * @returns {Promise<Object>} Price change data
     */
    async getPriceChange(id, seconds = 30) {
      const to = Math.floor(Date.now() / 1000);
      const from = to - seconds;
      
      try {
        const data = await this.getMarketChartRange(id, from, to);
        
        if (!data.prices || data.prices.length < 2) {
          return { changePercent: 0, volume: 0 };
        }
        
        const startPrice = data.prices[0][1];
        const endPrice = data.prices[data.prices.length - 1][1];
        const changePercent = ((endPrice - startPrice) / startPrice) * 100;
        
        // Calculate volume over period
        const volume = data.total_volumes.reduce((sum, [_, vol]) => sum + vol, 0) / data.total_volumes.length;
        
        return {
          changePercent,
          volume,
          startPrice,
          endPrice,
          dataPoints: data.prices.length
        };
      } catch (error) {
        console.error('Error calculating price change:', error);
        return { changePercent: 0, volume: 0 };
      }
    }
  
    /**
     * Get tier based on price change percentage
     * @param {number} changePercent - Price change percentage
     * @returns {number} Tier (1-5)
     */
    getTierFromPriceChange(changePercent) {
      if (changePercent >= 2) return 5;
      if (changePercent >= 0.5) return 4;
      if (changePercent >= -0.49) return 3;
      if (changePercent >= -1) return 2;
      return 1;
    }
  
    // Cache management
    getFromCache(key) {
      const item = this.cache.get(key);
      if (!item) return null;
      
      if (Date.now() - item.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
        return null;
      }
      
      return item.data;
    }
  
    setCache(key, data) {
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
    }
  
    clearCache() {
      this.cache.clear();
    }
  
    // Fallback data for offline testing
    getFallbackPrices(ids) {
      const fallback = {
        pepe: {
          usd: 0.00000119,
          usd_24h_change: 5.2,
          usd_24h_vol: 285000000
        },
        dogecoin: {
          usd: 0.0823,
          usd_24h_change: -2.1,
          usd_24h_vol: 520000000
        },
        arbitrum: {
          usd: 1.15,
          usd_24h_change: 3.8,
          usd_24h_vol: 180000000
        }
      };
      
      return ids.reduce((acc, id) => {
        if (fallback[id]) acc[id] = fallback[id];
        return acc;
      }, {});
    }
  
    getFallbackMarketData(id) {
      // Generate some realistic looking data
      const now = Date.now();
      const prices = [];
      const volumes = [];
      
      for (let i = 0; i < 10; i++) {
        const timestamp = now - (30000 - (i * 3000)); // 30s of data
        const price = 1 + (Math.random() * 0.04 - 0.02); // ±2% variation
        const volume = 1000000 + (Math.random() * 500000);
        
        prices.push([timestamp, price]);
        volumes.push([timestamp, volume]);
      }
      
      return {
        prices,
        total_volumes: volumes
      };
    }
  }
  
  // Export singleton instance
  export default new CoinGeckoService();