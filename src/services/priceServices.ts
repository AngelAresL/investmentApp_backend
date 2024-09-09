import axios from 'axios';
import dotenv from 'dotenv';
import { PriceData } from '../types/priceData'; // Interfaz que ya tienes creada
import { DividendResponse } from '../types/dividendData'; // Interfaz que ya tienes creada

dotenv.config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const priceService = {
  async getPrice(symbol: string): Promise<PriceData | null> {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });

      const timeSeries = response.data['Time Series (Daily)'];
      if (!timeSeries) {
        console.error(`No se encontraron datos de precios para ${symbol}`);
        return null;
      }

      const today = Object.keys(timeSeries)[0]; // Última fecha disponible
      const yesterday = Object.keys(timeSeries)[1]; // Fecha anterior disponible

      const currentPrice = parseFloat(timeSeries[today]['4. close']);
      const previousClose = parseFloat(timeSeries[yesterday]['4. close']);

      return { currentPrice, previousClose };
    } catch (error) {
      console.error('Error obteniendo el precio para', symbol, ':', error);
      return null;
    }
  },

  async getCryptoPrice(symbol: string): Promise<PriceData | null> {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: symbol,
          to_currency: 'USD',
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });

      const data = response.data['Realtime Currency Exchange Rate'];
      if (!data) {
        console.error(`No se encontraron datos de criptomonedas para ${symbol}`);
        return null;
      }

      const currentPrice = parseFloat(data['5. Exchange Rate']);
      return { currentPrice }; // Solo tenemos precio actual para criptomonedas
    } catch (error) {
      console.error('Error obteniendo el precio para la criptomoneda', symbol, ':', error);
      return null;
    }
  },

  async getDividends(symbol: string): Promise<DividendResponse | null> {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'DIVIDENDS',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });

      const dividendData = response.data['data'];
      if (!dividendData || dividendData.length === 0) {
        console.error(`No se encontraron datos de dividendos para ${symbol}`);
        return null;
      }

      // Procesamos los dividendos y devolvemos solo los más recientes y futuros
      const currentDate = new Date();

      const pastDividends = dividendData
        .filter((dividend: any) => new Date(dividend.ex_dividend_date) < currentDate)
        .slice(0, 5)  // Limitar a los últimos 5 dividendos pasados
        .map((dividend: any) => ({
          exDate: dividend.ex_dividend_date,
          amount: dividend.amount,
          paymentDate: dividend.payment_date,
        }));

      const upcomingDividends = dividendData
        .filter((dividend: any) => new Date(dividend.ex_dividend_date) >= currentDate)
        .map((dividend: any) => ({
          exDate: dividend.ex_dividend_date,
          amount: dividend.amount,
          paymentDate: dividend.payment_date,
          declarationDate: dividend.declaration_date,
        }));

      return {
        pastDividends,
        upcomingDividends,
      };
    } catch (error) {
      console.error('Error obteniendo dividendos para', symbol, ':', error);
      return null;
    }
  },
};


export default priceService;