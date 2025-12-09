import { Router } from "express";
import animalsController from "../controllers/animals.controller.js";
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";

const animalsRoutes = Router();

// =====================
// RUTAS PÚBLICAS
// =====================
animalsRoutes.get("/public/adopcion", animalsController.getAdopcionAlta);
animalsRoutes.get("/public/transito", animalsController.getTransitoAlta);
animalsRoutes.get("/public/adopcion/baja", animalsController.getAdopcionBaja);
animalsRoutes.get("/public/transito/baja", animalsController.getTransitoBaja);
animalsRoutes.get("/public/all", animalsController.getAllPublic);
animalsRoutes.get("/public/adopcion/list", animalsController.getPublicAdopcion);
animalsRoutes.get("/public/transito/list", animalsController.getPublicTransito);

// =====================
// RUTAS PROTEGIDAS
// =====================
// Obtener un animal específico
animalsRoutes.get("/:id", validateToken, animalsController.getOne);

// Crear, actualizar y eliminar animales (solo admin)
animalsRoutes.post("/new", validateToken, isAdmin, animalsController.createOne);
animalsRoutes.put(
  "/update/:id",
  validateToken,
  isAdmin,
  animalsController.updateOne
);
animalsRoutes.delete(
  "/destroy/:id",
  validateToken,
  isAdmin,
  animalsController.deleteOne
);

// =====================
// RUTAS ADMINISTRACIÓN AVANZADA
// =====================
// Eliminar permanentemente
animalsRoutes.delete(
  "/delete-permanent/:id",
  validateToken,
  isAdmin,
  animalsController.deletePermanent
);

// Marcar adoptado o disponible
animalsRoutes.patch(
  "/adoptado/:id",
  validateToken,
  isAdmin,
  animalsController.toggleAdoptado
);

export default animalsRoutes;
