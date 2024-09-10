import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;


const openaiService = {
  async generatePortfolioReport(data: { totalPortfolioValue: number, investmentsInfo: any }) {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: `You are a highly experienced and professional investment advisor. Your task is to provide a detailed portfolio analysis, focusing on market trends and investment strategies that are relevant to the specific investments of the user. The user's portfolio includes investments across various sectors. Focus your analysis on sectors related to the user's investments, giving special attention to sectors or industries represented by the investments in the portfolio.
            
            The analysis should also include:
            - A brief overview of the global economy, but with emphasis on the sectors of the user's investments.
            - Risk factors affecting the portfolio, particularly those related to the user's investments.
            - Investment opportunities or strategies the user can consider in the upcoming months.
            - Suggestions for portfolio rebalancing or diversification if necessary.
            - Ensure the analysis is highly relevant to the user's portfolio, avoiding unrelated sectors unless absolutely necessary.`
          },
          { 
            role: "user", 
            content: `Here is the portfolio value: $${data.totalPortfolioValue}. The investments details are as follows: ${JSON.stringify(data.investmentsInfo)}. Please provide a detailed analysis of the portfolio based on the user's investments, market conditions, and any potential strategies or risks.` 
          }
        ],
        max_tokens: 700,  // Ajustar según necesidad
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();  // Devolvemos el contenido del informe generado por OpenAI
  },
};

export default openaiService;