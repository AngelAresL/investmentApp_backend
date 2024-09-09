import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { Investment } from "../entity/investment";
import { User } from "../entity/user";
import priceService from "../services/priceServices"; // Importamos el servicio de precios

export const investmentController = {
  addInvestment: async (req: Request, res: Response) => {
    const { name, type, amount, symbol } = req.body; // Ahora incluimos el símbolo

    try {
      // Obtener el usuario autenticado desde res.locals
      const userId = res.locals.user.id;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Crear la nueva inversión con fecha automática
      const investmentRepository = AppDataSource.getRepository(Investment);
      const newInvestment = investmentRepository.create({
        name,
        symbol,
        type,
        amount,
        user,
      });

      await investmentRepository.save(newInvestment);

      return res
        .status(201)
        .json({ message: "Inversión añadida exitosamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al añadir la inversión" });
    }
  },

  getInvestments: async (req: Request, res: Response) => {
    const investmentRepository = AppDataSource.getRepository(Investment);
    const userId = res.locals.user.id;

    try {
      const investments = await investmentRepository.find({
        where: { user: { id: userId } },
      });

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

            const latestEarnings = await priceService.getLatestEarnings(
              investment.symbol
            );
            const upcomingEarnings = await priceService.getUpcomingEarnings(
              investment.symbol
            );

            return {
              ...investment,
              currentPrice: priceData.currentPrice,
              percentageChange,
              dividends,
              latestEarnings: latestEarnings || "N/A", // Últimos earnings
              upcomingEarnings: upcomingEarnings || "N/A", // Próximos earnings // Añadimos los dividendos a la respuesta
            };
          } else {
            return {
              ...investment,
              currentPrice: "N/A",
              percentageChange: "N/A",
              dividends: dividends
                ? dividends
                : "No hay dividendos disponibles",
              latestEarnings: latestEarnings || "N/A", // Últimos earnings
              upcomingEarnings: upcomingEarnings || "N/A", // Próximos earnings
            };
          }
        })
      );

      return res.status(200).json(investmentsWithPrices);
    } catch (error) {
      console.error("Error al obtener las inversiones:", error);
      return res
        .status(500)
        .json({ message: "Error al obtener las inversiones" });
    }
  },
};
