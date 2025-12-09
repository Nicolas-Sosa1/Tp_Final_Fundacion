// file: animals.routes.js (VERSIÓN CORREGIDA)
import { Router } from "express";
import animalsController from '../controllers/animals.controller.js'
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";

const animalsRoutes = Router();

// Rutas públicas (sin autenticación para ver animales disponibles)
animalsRoutes.get("/public/adopcion", animalsController.getAdopcionAlta);
animalsRoutes.get("/public/transito", animalsController.getTransitoAlta);
animalsRoutes.get("/public/adopcion/baja", animalsController.getAdopcionBaja);
animalsRoutes.get("/public/transito/baja", animalsController.getTransitoBaja);

// ⚠️ AGREGAR estas rutas para compatibilidad con Form.jsx
animalsRoutes.get("/public/adopcion/list", animalsController.getAdopcionAlta);
animalsRoutes.get("/public/transito/list", animalsController.getTransitoAlta);

// Rutas protegidas para obtener un animal específico
animalsRoutes.get("/:id", validateToken, animalsController.getOne);

// Rutas de administración
animalsRoutes.post("/new", validateToken, isAdmin, animalsController.createOne);
animalsRoutes.put("/update/:id", validateToken, isAdmin, animalsController.updateOne);
animalsRoutes.delete("/destroy/:id", validateToken, isAdmin, animalsController.deleteOne);

export default animalsRoutes;