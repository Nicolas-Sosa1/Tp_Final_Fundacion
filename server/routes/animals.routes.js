import { Router } from "express";
import animalsController from '../controllers/animals.controller.js'
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";

const animalsRoutes  = Router();

animalsRoutes.get("/:id", validateToken, animalsController.getOne);
animalsRoutes.post("/new", validateToken, isAdmin, animalsController.createOne);
animalsRoutes.put("/update/:id", validateToken, isAdmin, animalsController.updateOne);
animalsRoutes.delete("/destroy/:id", validateToken, isAdmin, animalsController.deleteOne);
animalsRoutes.get("/public/adopcion", animalsController.getAdopcionAlta);
animalsRoutes.get("/public/transito", animalsController.getTransitoAlta);



export default animalsRoutes;