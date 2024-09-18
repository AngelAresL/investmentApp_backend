import { Router } from "express";
import { check } from "express-validator";
import { authController } from "../controllers/authController";

const router = Router();


router.post(
  "/register",
  [
    check('email').isEmail().withMessage('Debe ser un email válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').notEmpty().withMessage('El apellido es obligatorio')
  ],
  authController.register
);


router.post(
  "/login",
  [
    check('email').isEmail().withMessage('Debe ser un email válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  authController.login
);

export default router;