import { Router } from "express";
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";
import solicitudesController from "../controllers/solicitudes.controller.js";

const solicitudesRoutes = Router();

// RUTAS PARA USUARIOS AUTENTICADOS
solicitudesRoutes.post('/adopcion/:animalId', validateToken, solicitudesController.crearSolicitudAdopcion);
solicitudesRoutes.post('/transito/:animalId', validateToken, solicitudesController.crearSolicitudTransito);
solicitudesRoutes.get('/mis-solicitudes', validateToken, solicitudesController.obtenerSolicitudesPorUsuario);

// RUTAS SOLO PARA ADMINISTRADORES
solicitudesRoutes.get('/adopciones', validateToken, isAdmin, solicitudesController.obtenerTodasAdopciones);
solicitudesRoutes.get('/transitos', validateToken, isAdmin, solicitudesController.obtenerTodosTransitos);
solicitudesRoutes.patch('/adopcion/:id/estado', validateToken, isAdmin, solicitudesController.cambiarEstadoAdopcion);
solicitudesRoutes.patch('/transito/:id/estado', validateToken, isAdmin, solicitudesController.cambiarEstadoTransito);

// AÑADIR ESTA RUTA PARA PRUEBAS (OPCIONAL)
solicitudesRoutes.get('/test', (req, res) => {
    res.json({ 
        message: 'API de solicitudes funcionando',
        endpoints: ['/adopcion/:animalId', '/transito/:animalId', '/mis-solicitudes']
    });
});

export default solicitudesRoutes;