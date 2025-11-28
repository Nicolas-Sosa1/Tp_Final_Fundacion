// routes/Correo.routes.js
import express from 'express';
import correoController from '../controllers/Correo.controller.js';
import validateToken from '../middleware/validateToken.js';
import isAdmin from '../middleware/validateAdmin.js';

const correoRoutes = express.Router();


correoRoutes.post( '/envio/importar', validateToken, correoController.importarEnvio);
correoRoutes.post('/envio/cotizar',validateToken, correoController.cotizarEnvio);
correoRoutes.get('/envio/seguimiento/:idEnvio', validateToken, correoController.obtenerSeguimiento);
correoRoutes.get('/envio/mis-envios',validateToken,correoController.misEnvios);

correoRoutes.get(
  '/envio/sucursales',
  validateToken,
  async (req, res) => {
    try {
      const sucursales = await correoController.service.obtenerSucursales();
      res.json(sucursales);
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: error.message,
      });
    }
  }
);


correoRoutes.get(
  '/envio/estados',
  validateToken,
  async (req, res) => {
    try {
      const estados = await correoController.service.obtenerEstadosEnvio();
      res.json(estados);
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: error.message,
      });
    }
  }
);

// 🏢 PROVINCIAS
correoRoutes.get('/envio/provincias', validateToken, correoController.obtenerCodigosProvincia);


correoRoutes.get( '/envio/tipos-entrega',validateToken, correoController.obtenerTiposEntrega);

correoRoutes.get(
  '/envio/todos',
  validateToken,
  isAdmin,
  async (req, res) => {
    try {
      
      const todosEnvios = await CorreoMockService.obtenerTodosEnvios();
      res.json({
        exito: true,
        datos: todosEnvios
      });
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: error.message
      });
    }
  }
);


correoRoutes.get(
  '/envio/usuario/:userId',
  validateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const enviosUsuario = await CorreoMockService.obtenerEnviosPorUsuario(userId);
      res.json({
        exito: true,
        datos: enviosUsuario
      });
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: error.message
      });
    }
  }
);


correoRoutes.put(
  '/envio/:idEnvio/estado',
  validateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { idEnvio } = req.params;
      const { nuevoEstado } = req.body;
      
      const envioActualizado = await CorreoMockService.actualizarEstadoEnvio(idEnvio, nuevoEstado);
      res.json({
        exito: true,
        datos: envioActualizado
      });
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: error.message
      });
    }
  }
);


correoRoutes.get(
  '/envio/estadisticas',
  validateToken,
  isAdmin,
  async (req, res) => {
    try {
      const estadisticas = await CorreoMockService.obtenerEstadisticas();
      res.json({
        exito: true,
        datos: estadisticas
      });
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: error.message
      });
    }
  }
);

export default correoRoutes;