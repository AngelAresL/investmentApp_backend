import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { User } from "../entity/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

export const authController = {
  register: async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    // Validar que todos los campos estén presentes
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);

      // Verificar si ya existe un usuario con el mismo email
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe." });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear y guardar el nuevo usuario
      const newUser = userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      await userRepository.save(newUser);

      return res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al registrar usuario." });
    }
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOneBy({ email });

      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      // Verificar la contraseña
      const validPassword = await bcrypt.compare(password, existingUser.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Contraseña incorrecta.' });
      }

      // Generar un token JWT
      const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' } // Token expira en 1 hora
      );

      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};