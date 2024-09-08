import express from 'express';
import dotenv from 'dotenv';
import openaiRoutes from './routes/openaiRoutes'; 
import authRoutes from "./routes/authRoutes"; 
import investmentRoutes from './routes/investmentRoutes';


dotenv.config();


const app = express();

// Middlewares
app.use(express.json());  // Para poder parsear JSON en las solicitudes

// Rutas
app.use('/api/openai', openaiRoutes); 
app.use("/api/auth", authRoutes); // Registrar las rutas de OpenAI
app.use('/api/investments', investmentRoutes); 

export default app;