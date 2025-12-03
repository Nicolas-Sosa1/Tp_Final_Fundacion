import express from "express";
import paymentController from '../controllers/payment.controller.js';
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";

const paymentRoutes = express.Router();

// Ruta para crear orden de pago (pública)
paymentRoutes.post('/create-order', paymentController.createOrden);

// Ruta para crear orden de donación (protegida)
paymentRoutes.post('/create-order-donacion', validateToken, paymentController.createOrdenDonacion);

// Webhook (pública - MercadoPago llama a esta ruta)
paymentRoutes.post('/webhook', paymentController.webhook);

// Rutas de redirección después del pago
paymentRoutes.get("/success", paymentController.donacionExitosa);
paymentRoutes.get("/failure", (req, res) => res.send("FAILED PAYMENT"));
paymentRoutes.get("/pending", (req, res) => res.send("PENDING PAYMENT"));

// Ruta para verificar pago (protegida)
paymentRoutes.get('/verify/:paymentId', validateToken, paymentController.verificarPago);

// Ruta para obtener todos los pagos (solo admin)
paymentRoutes.get('/all', validateToken, isAdmin, paymentController.obtenerTodosPagos);

export default paymentRoutes;