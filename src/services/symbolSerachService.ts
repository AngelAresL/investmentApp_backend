import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const symbolSearchService = {
  async searchSymbol(query: string): Promise<any | null> {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });

      const bestMatches = response.data['bestMatches'];
      if (!bestMatches || bestMatches.length === 0) {
        console.error(`No se encontraron símbolos para la búsqueda: ${query}`);
        return null;
      }

      return bestMatches;
    } catch (error) {
      console.error('Error al buscar símbolo en Alpha Vantage', error);
      return null;
    }
  },
};

export default symbolSearchService;