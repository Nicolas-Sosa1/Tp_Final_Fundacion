import { Router } from "express";
import animalsController from '../controllers/animals.controller.js'
import { validateToken, isAdmin } from "../middleware/validateToken.js";

const animalsRoutes  = Router();

animalsRoutes.get("/:id", validateToken, animalsController.getOne);
animalsRoutes.post("/new", validateToken, isAdmin, animalsController.createOne);
animalsRoutes.put("/update/:id", validateToken, isAdmin, animalsController.updateOne);
animalsRoutes.delete("/destroy/:id", validateToken, isAdmin, animalsController.deleteOne);


export default animalsRoutes;