// file: animals.routes.js (VERSIÓN CORREGIDA)
import { Router } from "express";
import animalsController from '../controllers/animals.controller.js'
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";
import { upload } from "../config/multer.config.js";

const animalsRoutes = Router();

animalsRoutes.get("/:id", validateToken, animalsController.getOne);
animalsRoutes.post("/new", validateToken, isAdmin, upload.single("imagen"), animalsController.createOne);
animalsRoutes.put("/update/:id", validateToken, isAdmin, animalsController.updateOne);
animalsRoutes.get("/public/adopcion", animalsController.getAdopcionAlta);
animalsRoutes.get("/public/transito", animalsController.getTransitoAlta);
animalsRoutes.get("/public/adopcion/baja", animalsController.getAdopcionBaja);
animalsRoutes.get("/public/transito/baja", animalsController.getTransitoBaja);
animalsRoutes.delete("/delete-permanent/:id", validateToken, isAdmin, animalsController.deletePermanent);
animalsRoutes.patch("/adoptado/:id", validateToken, isAdmin, animalsController.toggleAdoptado);


// ⚠️ AGREGAR estas rutas para compatibilidad con Form.jsx
animalsRoutes.get("/public/adopcion/list", animalsController.getAdopcionAlta);
animalsRoutes.get("/public/transito/list", animalsController.getTransitoAlta);


// Rutas de administración
animalsRoutes.post("/neww", validateToken, isAdmin, animalsController.createOne1);
animalsRoutes.delete("/destroy/:id", validateToken, isAdmin, animalsController.deleteOne);

export default animalsRoutes;