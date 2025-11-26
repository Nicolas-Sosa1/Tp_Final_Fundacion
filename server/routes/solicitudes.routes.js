import { Router } from "express";
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";
import solicitudesController from "../controllers/solicitudes.controller.js";


const solicitudesRoutes = Router();

// USUARIO
solicitudesRoutes.post("/adopcion/:animalId", validateToken, solicitudesController.crearSolicitudTransito);
solicitudesRoutes.post("/transito/:animalId", validateToken, solicitudesController.crearSolicitudTransito);

solicitudesRoutes.get("/mis-solicitudes", validateToken, solicitudesController.obtenerSolicitudesPorUsuario);

// ADMIN
solicitudesRoutes.get("/adopcion", validateToken, isAdmin, solicitudesController.obtenerTodasAdopciones);
solicitudesRoutes.get("/transito", validateToken, isAdmin, solicitudesController.obtenerTodosTransitos);

solicitudesRoutes.patch("/adopcion/:id/estado", validateToken, isAdmin, solicitudesController.cambiarEstadoAdopcion);
solicitudesRoutes.patch("/transito/:id/estado", validateToken, isAdmin, solicitudesController.cambiarEstadoTransito);

export default solicitudesRoutes
