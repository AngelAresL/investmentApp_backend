import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;


const openaiService = {
  async askQuestion(question: string) {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // Cambiar la URL para usar chat completions con gpt-3.5-turbo
      {
        model: "gpt-3.5-turbo", // Cambiar a gpt-3.5-turbo
        messages: [
          { role: "system", content: "You are a helpful assistant." }, // Contexto inicial opcional
          { role: "user", content: question }, // El mensaje del usuario
        ],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim(); // gpt-3.5-turbo usa message.content
  },
};

export default openaiService;
