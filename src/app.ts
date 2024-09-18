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


// app.use(helmet());
// app.use(cors());
app.use(express.json());  


// app.use('/api/openai', openaiRoutes); 
app.use("/api/auth", authRoutes); 
app.use('/api/investments', investmentRoutes); 

app.use(globalErrorHandler);


export default app;