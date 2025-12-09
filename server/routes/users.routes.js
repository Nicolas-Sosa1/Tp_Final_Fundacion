import {Router} from "express"
import userController from "../controllers/users.controller.js"
import validateToken from "../middleware/validateToken.js";

const usersRoutes = Router();

// Rutas públicas
usersRoutes.post('/register', userController.createOne);
usersRoutes.post('/login', userController.login);

// Rutas protegidas
usersRoutes.get('/profile', validateToken, userController.getProfile);
usersRoutes.put('/profile', validateToken, userController.updateProfile);

export default usersRoutes;