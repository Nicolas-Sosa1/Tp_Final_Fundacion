import { User } from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;

const userController = {
  createOne: async (req, res) => {
    const { firstName, lastName, email, password, passwordConfirmation } =
      req.body;
    const newArray = {
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    };

    try {
      const newUser = await User.create(newArray);

      const saveToken = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        id: newUser._id,
        role: newUser.role,
      };

      jwt.sign(saveToken, SECRET, { expiresIn: "59m" }, (err, token) => {
        return res.status(201).json({ token });
      });
    } catch (e) {
      const messages = {};
      if (e.name === "ValidationError") {
        Object.keys(e.errors).forEach((key) => {
          messages[key] = e.errors[key].message;
        });
      }

      if (e.code === 11000) {
        messages.email = "El correo ya está registrado en la base de datos";
      }
      return res.status(400).json({ errors: { ...messages } });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email || email.trim() === "") {
      errors.email = "El correo electrónico es obligatorio";
    }
    if (!password || password.trim() === "") {
      errors.password = "La contraseña es obligatoria";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res
        .status(404)
        .json({ errors: { email: "El correo no está registrado" } });
    }

    const bcryptResponse = await bcrypt.compare(password, currentUser.password);

    if (!bcryptResponse) {
      return res
        .status(400)
        .json({ errors: { password: "La contraseña es incorrecta" } });
    }

    const saveToken = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      id: currentUser._id,
      role: currentUser.role,
    };

    jwt.sign(saveToken, SECRET, { expiresIn: "59m" }, (err, token) => {
      return res.status(201).json({ token });
    });
  },

  // NUEVA FUNCIÓN: Obtener perfil del usuario
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("-password");

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      return res.status(500).json({ error: "Error del servidor" });
    }
  },

  // NUEVA FUNCIÓN: Actualizar perfil
  updateProfile: async (req, res) => {
    try {
      const updates = req.body;

      // No permitir actualizar email si ya existe
      if (updates.email) {
        const existingUser = await User.findOne({
          email: updates.email,
          _id: { $ne: req.userId },
        });

        if (existingUser) {
          return res.status(400).json({ error: "El email ya está en uso" });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return res.status(500).json({ error: "Error del servidor" });
    }
  },
};

export default userController;
