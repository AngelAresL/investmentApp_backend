import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors';
// import helmet from 'helmet';
// import openaiRoutes from './routes/openaiRoutes'; 
import authRoutes from "./routes/authRoutes"; 
import investmentRoutes from './routes/investmentRoutes';
import { globalErrorHandler } from './middleware/errorMiddleware';


dotenv.config();


const app = express();

// Middlewares
// app.use(helmet());
// app.use(cors());
app.use(express.json());  // Para poder parsear JSON en las solicitudes

// Rutas
// app.use('/api/openai', openaiRoutes); 
app.use("/api/auth", authRoutes); // Registrar las rutas de OpenAI
app.use('/api/investments', investmentRoutes); 

app.use(globalErrorHandler);


export default app;