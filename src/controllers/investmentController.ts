import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { Investment } from '../entity/investment';
import { User } from '../entity/user';

export const investmentController = {
  addInvestment: async (req: Request, res: Response) => {
    const { name, type, amount, date } = req.body;

    try {
      // Obtener el usuario autenticado desde res.locals
      const userId = res.locals.user.id;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Crear la nueva inversión
      const investmentRepository = AppDataSource.getRepository(Investment);
      const newInvestment = investmentRepository.create({
        name,
        type,
        amount,
        date,
        user,
      });

      await investmentRepository.save(newInvestment);

      return res.status(201).json({ message: 'Inversión añadida exitosamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al añadir la inversión' });
    }
  },

  getInvestments: async (req: Request, res: Response) => {
    try {
      // Obtener el usuario autenticado desde res.locals
      const userId = res.locals.user.id;

      const investmentRepository = AppDataSource.getRepository(Investment);
      const investments = await investmentRepository.find({
        where: { user: { id: userId } },
      });

      return res.status(200).json(investments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener las inversiones' });
    }
  }
};