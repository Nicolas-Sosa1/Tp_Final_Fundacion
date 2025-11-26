import { Router } from "express";
import vacunasController from "../controllers/vacunas.controller.js";
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";

const vacunasRoutes = Router();


vacunasRoutes.get("/", vacunasController.getAll);
vacunasRoutes.post("/new", validateToken, isAdmin, vacunasController.createOne);
vacunasRoutes.delete("/:id", validateToken, isAdmin, vacunasController.deleteOne);

export default vacunasRoutes;
