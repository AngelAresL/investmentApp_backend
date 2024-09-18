import { Router } from "express";
import { check } from "express-validator";
import { investmentController } from '../controllers/investmentController';
import authenticateJWT from '../middleware/autMiddleware';
import { InvestmentType } from '../entity/investment';

const router = Router();


router.post(
  '/add',
  [
    authenticateJWT,
    check('name').notEmpty().withMessage('El nombre de la inversión es obligatorio'),
    check('symbol').notEmpty().withMessage('El símbolo de la inversión es obligatorio'),
    check('amount').isNumeric().withMessage('El monto debe ser un número'),
    check('type')
    .isIn([InvestmentType.STOCK, InvestmentType.CRYPTO])
    .withMessage('El tipo de inversión debe ser stock o crypto'),
],
  investmentController.addInvestment
);


router.get('/all', authenticateJWT, investmentController.getInvestments);

export default router;