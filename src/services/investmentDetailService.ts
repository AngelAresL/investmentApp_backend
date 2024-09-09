// src/services/investmentDetailsService.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FINNHUB_API_KEY = process.env.FINHUB_API_KEY;

const investmentDetailsService = {
  async getDividends(symbol: string) {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/stock/dividend`, {
        params: {
          symbol,
          from: '2023-01-01',
          to: '2023-12-31',
          token: FINNHUB_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo dividendos para ${symbol}:`, error);
      return null;
    }
  },

  async getEarnings(symbol: string) {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/calendar/earnings`, {
        params: {
          symbol,
          token: FINNHUB_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo fechas de earnings para ${symbol}:`, error);
      return null;
    }
  },

  async getPriceTarget(symbol: string) {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/stock/price-target`, {
        params: {
          symbol,
          token: FINNHUB_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo precio objetivo para ${symbol}:`, error);
      return null;
    }
  },
};

export default investmentDetailsService;