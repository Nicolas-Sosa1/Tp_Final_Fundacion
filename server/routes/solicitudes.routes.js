import { Router } from "express";
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";
import solicitudesController from "../controllers/solicitudes.controller.js";

const solicitudesRoutes = Router();

// ✅ ENDPOINT DE PRUEBA PARA DEBUG
solicitudesRoutes.get("/test", validateToken, (req, res) => {
    console.log("✅ Test endpoint - Usuario autenticado:", {
        id: req.userId,
        email: req.userEmail,
        role: req.userRole
    });
    
    res.json({
        success: true,
        message: "✅ Autenticación exitosa",
        user: {
            id: req.userId,
            email: req.userEmail,
            role: req.userRole
        },
        timestamp: new Date().toISOString()
    });
});

// USUARIO
solicitudesRoutes.post("/adopcion/:animalId", validateToken, solicitudesController.crearSolicitudAdopcion);
solicitudesRoutes.post("/transito/:animalId", validateToken, solicitudesController.crearSolicitudTransito);
solicitudesRoutes.get("/mis-solicitudes", validateToken, solicitudesController.obtenerSolicitudesPorUsuario);

// ADMIN
solicitudesRoutes.get("/adopcion", validateToken, isAdmin, solicitudesController.obtenerTodasAdopciones);
solicitudesRoutes.get("/transito", validateToken, isAdmin, solicitudesController.obtenerTodosTransitos);
solicitudesRoutes.get("/adopcion/:id",validateToken,isAdmin,solicitudesController.obtenerSolicitudAdopcionPorId);
solicitudesRoutes.patch("/adopcion/:id/estado", validateToken, isAdmin, solicitudesController.cambiarEstadoAdopcion);
solicitudesRoutes.patch("/transito/:id/estado", validateToken, isAdmin, solicitudesController.cambiarEstadoTransito);

export default solicitudesRoutes;