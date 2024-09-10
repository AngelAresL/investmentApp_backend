// import { Request, Response } from 'express';
// import openaiService from '../services/openaiServices'; 

// export const askQuestion = async (req: Request, res: Response) => {
//   try {
//     const { question } = req.body;
//     if (!question) {
//       return res.status(400).json({ error: 'La pregunta es requerida' });
//     }

//     const answer = await openaiService.askQuestion(question);
//     res.json({ answer });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Error al obtener respuesta de OpenAI' });
//   }
// };