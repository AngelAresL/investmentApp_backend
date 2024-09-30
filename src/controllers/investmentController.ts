import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../index";
import { Investment, InvestmentType } from "../entity/investment";
import { User } from "../entity/user";
import priceService from "../services/priceServices";
import symbolSearchService from "../services/symbolSerachService";
import { AppError } from "../middleware/errorMiddleware";
import logger from "../utils/logger";

export const investmentController = {
  addInvestment: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Error de validación al añadir inversión", {
        errors: errors.array(),
      });
      return next(
        new AppError("Error de validación de datos.", 400, errors.array())
      );
    }

    const { name, type, amount, symbol,currency } = req.body;
    if (![InvestmentType.STOCK, InvestmentType.CRYPTO].includes(type)) {
      logger.warn(`Tipo de inversión inválido: ${type}`);
      return next(new AppError("Tipo de inversión inválido", 400));
    }

    try {
      const userId = res.locals.user.id;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        logger.info(`Usuario no encontrado con ID: ${userId}`);
        return next(new AppError("Usuario no encontrado", 404));
      }

      const investmentRepository = AppDataSource.getRepository(Investment);
      const newInvestment = investmentRepository.create({
        name,
        symbol,
        type,
        amount,
        currency,
        user,
      });

      await investmentRepository.save(newInvestment);
      logger.info(
        `Inversión añadida exitosamente: ${symbol}, Tipo: ${type}, Usuario ID: ${userId}`
      );

      return res
        .status(201)
        .json({ message: "Inversión añadida exitosamente" });
    } catch (error) {
      logger.error("Error al añadir la inversión", {
        error: (error as Error).message,
      });
      next(
        new AppError(
          "Error al añadir la inversión",
          500,
          (error as Error).message
        )
      );
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
        logger.info(
          `No se encontraron inversiones para el usuario ID: ${userId}`
        );
        return res
          .status(404)
          .json({ message: "No se encontraron inversiones" });
      }
  
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
            dividends = await priceService.getDividends(investment.symbol);
          }
  
          console.log(`Datos de precio para ${investment.symbol}:`, priceData);
  
          if (priceData && priceData.currentPrice) {
            let percentageChange = "N/A";
            if (priceData.previousClose) {
              percentageChange = (
                ((priceData.currentPrice - priceData.previousClose) /
                  priceData.previousClose) *
                100
              ).toFixed(2);
            }
  
            latestEarnings = await priceService.getLatestEarnings(
              investment.symbol
            );
            upcomingEarnings = await priceService.getUpcomingEarnings(
              investment.symbol
            );
  
            logger.info(
              `Datos de precios y earnings recuperados para: ${investment.symbol}`
            );
  
            return {
              id: investment.id,
              name: investment.name,
              symbol: investment.symbol,
              amount: investment.amount,
              type: investment.type,
              currency: investment.currency, 
              currentPrice: priceData.currentPrice,
              percentageChange,
              dividends,
              latestEarnings: latestEarnings || "N/A",
              upcomingEarnings: upcomingEarnings || "N/A",
              date: investment.date,
            };
          } else {
            logger.warn(
              `No se encontraron datos de precios para: ${investment.symbol}`
            );
  
            return {
              id: investment.id,
              name: investment.name,
              symbol: investment.symbol,
              amount: investment.amount,
              type: investment.type,
              currency: investment.currency, 
              currentPrice: "N/A",
              percentageChange: "N/A",
              dividends: dividends
                ? dividends
                : "No hay dividendos disponibles",
              latestEarnings: latestEarnings || "N/A",
              upcomingEarnings: upcomingEarnings || "N/A",
              date: investment.date,
            };
          }
        })
      );
  
      return res.status(200).json(investmentsWithPrices);
    } catch (error) {
      logger.error("Error al obtener las inversiones", {
        error: (error as Error).message,
      });
      next(
        new AppError(
          "Error al obtener las inversiones",
          500,
          (error as Error).message
        )
      );
    }
  },

  searchSymbol: async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      logger.warn("No se proporcionó una consulta válida para la búsqueda de símbolos");
      return next(new AppError("Consulta de búsqueda inválida.", 400));
    }

    try {
      const results = await symbolSearchService.searchSymbol(query);
      if (!results) {
        logger.info(`No se encontraron símbolos para la consulta: ${query}`);
        return res.status(404).json({ message: "No se encontraron símbolos." });
      }

      logger.info(`Símbolos encontrados para la consulta: ${query}`);
      console.log(results)
      return res.status(200).json(results);
      ;
      
    } catch (error) {
      logger.error("Error al buscar símbolos", { error: (error as Error).message });
      next(new AppError("Error al buscar símbolos.", 500, (error as Error).message));
    }
  },
  deleteInvestment: async (req: Request, res: Response, next: NextFunction) => {
    const { investmentId } = req.params;
    const userId = res.locals.user.id;

    try {
      const investmentRepository = AppDataSource.getRepository(Investment);
      
      // Verificamos si existe la inversión y pertenece al usuario logueado
      const investment = await investmentRepository.findOne({
        where: { id: parseInt(investmentId), user: { id: userId } },
      });

      if (!investment) {
        logger.info(`No se encontró la inversión con ID: ${investmentId} para el usuario ID: ${userId}`);
        return res.status(404).json({ message: "Inversión no encontrada" });
      }

      // Eliminar la inversión
      await investmentRepository.delete({ id: parseInt(investmentId) });

      logger.info(`Inversión con ID: ${investmentId} eliminada exitosamente para el usuario ID: ${userId}`);
      return res.status(200).json({ message: "Inversión eliminada exitosamente" });
    } catch (error) {
      logger.error("Error al eliminar la inversión", { error: (error as Error).message });
      next(new AppError("Error al eliminar la inversión", 500, (error as Error).message));
    }
}
};
