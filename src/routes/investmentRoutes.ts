import { Router } from 'express';
import { investmentController } from '../controllers/investmentController';
import authenticateJWT from '../middleware/autMiddleware';

const router = Router();

// Rutas protegidas por autenticación
router.post('/add', authenticateJWT, investmentController.addInvestment); // Añadir inversión
router.get('/all', authenticateJWT, investmentController.getInvestments); // Obtener todas las inversiones del usuario

export default router;