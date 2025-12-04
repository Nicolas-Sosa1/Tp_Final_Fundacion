import {Router} from "express"
import paymentController from '../controllers/payment.controller.js'
import validateToken from "../middleware/validateToken.js";
import isAdmin from "../middleware/validateAdmin.js";


const paymentRoutes = Router();


paymentRoutes.post('/create-order', paymentController.createOrden);
paymentRoutes.post('/webhook', paymentController.webhook);

paymentRoutes.get("/success", (req, res) => res.send("SUCCESS PAYMENT"));
paymentRoutes.get("/failure", (req, res) => res.send("FAILED PAYMENT"));
paymentRoutes.get("/pending", (req, res) => res.send("PENDING PAYMENT"));

paymentRoutes.get('/all', validateToken, isAdmin, paymentController.getAll);
paymentRoutes.get('/mine', validateToken, paymentController.getMine);



export default paymentRoutes

