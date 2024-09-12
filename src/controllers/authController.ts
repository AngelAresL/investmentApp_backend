import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../index";
import { User } from "../entity/user";
import { InvestmentReport } from "../entity/investmentReport";
import generateDailyReport from "../services/dailyReportService";
import { MoreThanOrEqual } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorMiddleware";
import logger from "../utils/logger"; // Importar el logger

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Error de validación en registro', { errors: errors.array() }); // Log de advertencia
      return next(new AppError('Error de validación de datos.', 400, errors.array()));
    }

    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      logger.warn('Campos faltantes en registro', { email, firstName, lastName }); // Log de advertencia
      return next(new AppError("Todos los campos son obligatorios.", 400));
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOneBy({ email });

      if (existingUser) {
        logger.info(`Intento de registro con email ya existente: ${email}`); // Log informativo
        return next(new AppError("El usuario ya existe.", 400));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      await userRepository.save(newUser);

      logger.info(`Usuario registrado exitosamente: ${email}`); // Log informativo
      return res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (error) {
      logger.error("Error al registrar usuario", { error: (error as Error).message }); // Log de error
      next(new AppError("Error al registrar usuario.", 500, (error as Error).message));
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Error de validación en login', { errors: errors.array() }); // Log de advertencia
      return next(new AppError('Error de validación de datos.', 400, errors.array()));
    }

    const { email, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOneBy({ email });

      if (!existingUser) {
        logger.info(`Intento de login con email no registrado: ${email}`); // Log informativo
        return next(new AppError("Usuario no encontrado.", 404));
      }

      const validPassword = await bcrypt.compare(password, existingUser.password);
      if (!validPassword) {
        logger.info(`Intento de login fallido para el usuario: ${email}`); // Log informativo
        return next(new AppError("Contraseña incorrecta.", 400));
      }

      const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );

      logger.info(`Login exitoso para el usuario: ${email}`); // Log informativo

      const currentDate = new Date();
      const investmentReportRepository = AppDataSource.getRepository(InvestmentReport);
      const lastReport = await investmentReportRepository.findOne({
        where: {
          user: { id: existingUser.id },
          createdAt: MoreThanOrEqual(new Date(currentDate.setUTCHours(0, 0, 0, 0))),
        },
      });

      if (!lastReport) {
        await generateDailyReport(token, existingUser.id);
        logger.info(`Generado reporte diario para el usuario: ${email}`); // Log informativo
      }

      return res.json({ token });
    } catch (error) {
      logger.error("Error en el login", { error: (error as Error).message }); // Log de error
      next(new AppError("Error en el servidor", 500, (error as Error).message));
    }
  },
};