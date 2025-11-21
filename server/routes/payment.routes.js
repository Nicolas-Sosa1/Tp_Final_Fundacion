import {Router} from "express"
import paymentController from '../controllers/payment.controller.js'

const paymentRoutes = Router();


paymentRoutes.post('/create-order', paymentController.createOrden);
paymentRoutes.post('/webhook', paymentController.webhook);

paymentRoutes.get("/success", (req, res) => res.send("SUCCESS PAYMENT"));
paymentRoutes.get("/failure", (req, res) => res.send("FAILED PAYMENT"));
paymentRoutes.get("/pending", (req, res) => res.send("PENDING PAYMENT"));

export default paymentRoutes

