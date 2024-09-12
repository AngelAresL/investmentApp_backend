import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../index";
import { Investment, InvestmentType } from "../entity/investment";
import { User } from "../entity/user";
import priceService from "../services/priceServices"; // Importamos el servicio de precios
import { AppError } from "../middleware/errorMiddleware";
import logger from "../utils/logger"; // Importamos el logger

export const investmentController = {
  addInvestment: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Error de validación al añadir inversión', { errors: errors.array() }); // Log de advertencia
      return next(new AppError('Error de validación de datos.', 400, errors.array()));
    }

    const { name, type, amount, symbol } = req.body;
    if (![InvestmentType.STOCK, InvestmentType.CRYPTO].includes(type)) {
      logger.warn(`Tipo de inversión inválido: ${type}`); // Log de advertencia
      return next(new AppError("Tipo de inversión inválido", 400));
    }

    try {
      // Obtener el usuario autenticado desde res.locals
      const userId = res.locals.user.id;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        logger.info(`Usuario no encontrado con ID: ${userId}`); // Log informativo
        return next(new AppError("Usuario no encontrado", 404));
      }

      // Crear la nueva inversión
      const investmentRepository = AppDataSource.getRepository(Investment);
      const newInvestment = investmentRepository.create({
        name,
        symbol,
        type,
        amount,
        user,
      });

      await investmentRepository.save(newInvestment);
      logger.info(`Inversión añadida exitosamente: ${symbol}, Tipo: ${type}, Usuario ID: ${userId}`); // Log informativo

      return res.status(201).json({ message: "Inversión añadida exitosamente" });
    } catch (error) {
      logger.error("Error al añadir la inversión", { error: (error as Error).message }); // Log de error
      next(new AppError("Error al añadir la inversión", 500, (error as Error).message));
    }
  },

  getInvestments: async (req: Request, res: Response, next: NextFunction) => {
    const investmentRepository = AppDataSource.getRepository(Investment);
    const userId = res.locals.user.id;

    try {
      const investments = await investmentRepository.find({
        where: { user: { id: userId } },
      });

      if (!investments.length) {
        logger.info(`No se encontraron inversiones para el usuario ID: ${userId}`); // Log informativo
        return res.status(404).json({ message: "No se encontraron inversiones" });
      }

      // Obtener los precios de cierre y calcular las variaciones
      const investmentsWithPrices = await Promise.all(
        investments.map(async (investment) => {
          let priceData;
          let dividends = null;
          let latestEarnings;
          let upcomingEarnings;

          if (investment.type === "crypto") {
            priceData = await priceService.getCryptoPrice(investment.symbol);
          } else {
            priceData = await priceService.getPrice(investment.symbol);
            dividends = await priceService.getDividends(investment.symbol); // Recuperar dividendos
          }

          if (priceData && priceData.currentPrice) {
            let percentageChange = "N/A";
            if (priceData.previousClose) {
              percentageChange = (
                ((priceData.currentPrice - priceData.previousClose) /
                  priceData.previousClose) *
                100
              ).toFixed(2);
            }

            latestEarnings = await priceService.getLatestEarnings(investment.symbol);
            upcomingEarnings = await priceService.getUpcomingEarnings(investment.symbol);

            logger.info(`Datos de precios y earnings recuperados para: ${investment.symbol}`); // Log informativo

            return {
              ...investment,
              currentPrice: priceData.currentPrice,
              percentageChange,
              dividends,
              latestEarnings: latestEarnings || "N/A",
              upcomingEarnings: upcomingEarnings || "N/A",
            };
          } else {
            logger.warn(`No se encontraron datos de precios para: ${investment.symbol}`); // Log de advertencia

            return {
              ...investment,
              currentPrice: "N/A",
              percentageChange: "N/A",
              dividends: dividends ? dividends : "No hay dividendos disponibles",
              latestEarnings: latestEarnings || "N/A",
              upcomingEarnings: upcomingEarnings || "N/A",
            };
          }
        })
      );

      return res.status(200).json(investmentsWithPrices);
    } catch (error) {
      logger.error("Error al obtener las inversiones", { error: (error as Error).message }); // Log de error
      next(new AppError("Error al obtener las inversiones", 500, (error as Error).message));
    }
  },
};