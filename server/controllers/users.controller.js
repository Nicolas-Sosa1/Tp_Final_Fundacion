// users.controller.js - VERSIÓN COMPLETA Y CORREGIDA
import {User} from '../models/users.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const SECRET = process.env.SECRET;

const userController = {
    createOne: async(req, res) =>{
        const {firstName, lastName, email, password, passwordConfirmation} = req.body;
        const newArray = {firstName, lastName, email, password, passwordConfirmation}

        try{
            const newUser = await User.create(newArray);

            const saveToken = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                id: newUser._id,
                role: newUser.role
            }
            
            jwt.sign(saveToken, SECRET, {expiresIn: "59m"}, (err, token) => {
                return res.status(201).json({token})
            })

        }catch(e){
            const messages = {};
            if (e.name === "ValidationError") {
                Object.keys(e.errors).forEach((key) => {
                    messages[key] = e.errors[key].message;
                });
            }

            if (e.code === 11000) {
                messages.email = "El correo ya está registrado en la base de datos";
            }           
            return res.status(400).json({ errors: { ...messages } });
        }
    },
    
    login: async(req, res) =>{
        const {email, password} = req.body;
        const errors = {};

        if (!email || email.trim() === "") {
            errors.email = "El correo electrónico es obligatorio";
        }
        if (!password || password.trim() === "") {
            errors.password = "La contraseña es obligatoria";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
        
        const currentUser = await User.findOne({email});
        if(!currentUser){
            return res.status(404).json({ errors: { email: "El correo no está registrado" } });
        }
        
        const bcryptResponse = await bcrypt.compare(password, currentUser.password);
        if(!bcryptResponse){
            return res.status(400).json({ errors: { password: "La contraseña es incorrecta" } });
        }

        const saveToken = {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            id: currentUser._id,
            role: currentUser.role
        }
        
        jwt.sign(saveToken, SECRET, {expiresIn: "59m"}, (err, token) => {
            return res.status(200).json({token})
        })
    },
    
    // ✅ MÉTODO AGREGADO: getProfile
    getProfile: async (req, res) => {
        try {
            console.log("📌 Obteniendo perfil para userId:", req.userId);
            
            // Verificar que tenemos el userId del middleware
            if (!req.userId) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Usuario no autenticado" 
                });
            }
            
            const user = await User.findById(req.userId).select('-password');
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }
            
            console.log("✅ Perfil encontrado:", user.email);
            
            return res.status(200).json({
                success: true,
                user
            });
            
        } catch (error) {
            console.error("❌ Error al obtener perfil:", error);
            return res.status(500).json({ 
                success: false, 
                message: "Error al obtener perfil del usuario" 
            });
        }
    },
    
    // ✅ MÉTODO AGREGADO: updateProfile
    updateProfile: async (req, res) => {
        try {
            console.log("📌 Actualizando perfil para userId:", req.userId);
            console.log("📋 Datos recibidos:", req.body);
            
            if (!req.userId) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Usuario no autenticado" 
                });
            }
            
            const userId = req.userId;
            const updateData = req.body;
            
            // Remover campos que no deben ser actualizados
            delete updateData.role;
            delete updateData._id;
            
            // Si se envía una nueva contraseña, hay que encriptarla
            if (updateData.password) {
                console.log("🔑 Encriptando nueva contraseña...");
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }
            
            // Si se envía email, verificar que no esté en uso por otro usuario
            if (updateData.email) {
                const existingUser = await User.findOne({ 
                    email: updateData.email, 
                    _id: { $ne: userId } 
                });
                
                if (existingUser) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "El correo electrónico ya está en uso por otro usuario" 
                    });
                }
            }
            
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');
            
            if (!updatedUser) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }
            
            console.log("✅ Perfil actualizado correctamente");
            
            return res.status(200).json({
                success: true,
                message: "Perfil actualizado correctamente",
                user: updatedUser
            });
            
        } catch (error) {
            console.error("❌ Error al actualizar perfil:", error);
            
            // Manejo de errores de validación
            if (error.name === "ValidationError") {
                const messages = {};
                Object.keys(error.errors).forEach((key) => {
                    messages[key] = error.errors[key].message;
                });
                return res.status(400).json({ 
                    success: false, 
                    errors: messages 
                });
            }
            
            // Manejo de error de email duplicado
            if (error.code === 11000) {
                return res.status(400).json({ 
                    success: false, 
                    message: "El correo electrónico ya está en uso" 
                });
            }
            
            return res.status(500).json({ 
                success: false, 
                message: "Error al actualizar perfil" 
            });
        }
    }
};

export default userController;