import { Router } from "express";
import correoController from '../controllers/Correo.controller.js';
import validateToken from '../middleware/validateToken.js';

const correoRoutes = Router();

// Rutas públicas (sin autenticación)
correoRoutes.get('/estado', correoController.verificarEstado);
correoRoutes.get('/provincias', correoController.obtenerCodigosProvincia);
correoRoutes.get('/tipos-entrega', correoController.obtenerTiposEntrega);

// Rutas protegidas (requieren autenticación con tu sistema)
correoRoutes.post('/registrar', validateToken, correoController.registrarUsuario);
correoRoutes.post('/validar', validateToken, correoController.validarUsuario);
correoRoutes.get('/sucursales', validateToken, correoController.obtenerSucursales);
correoRoutes.post('/cotizar', validateToken, correoController.cotizarEnvio);
correoRoutes.post('/envio/importar', validateToken, correoController.importarEnvio);
correoRoutes.get('/envio/seguimiento', validateToken, correoController.obtenerSeguimiento);

export default correoRoutes;