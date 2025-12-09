
import { SolicitudAdopcion } from "../models/solicitudAdopcion.model.js";
import { SolicitudTransito } from "../models/solicitudTransito.model.js";
import { Animals } from "../models/animals.model.js";

const solicitudesController = {
    crearSolicitudAdopcion: async (req, res) => {
        try {
            console.log("📝 Creando solicitud de adopción...");
            console.log("Usuario ID:", req.userId);
            console.log("Animal ID:", req.params.animalId);
            console.log("Datos recibidos:", req.body);
            
            // Verificar que el animal exista
            const animal = await Animals.findById(req.params.animalId);
            if (!animal) {
                console.log("❌ Animal no encontrado:", req.params.animalId);
                return res.status(404).json({ 
                    success: false,
                    message: "Animal no encontrado" 
                });
            }
            
            // Verificar que el animal esté disponible
            if (animal.estadoGeneral === false) {
                return res.status(400).json({ 
                    success: false,
                    message: "Este animal ya no está disponible para adopción" 
                });
            }
            
            // Verificar que el usuario no tenga ya una solicitud para este animal
            const solicitudExistente = await SolicitudAdopcion.findOne({
                usuario: req.userId,
                animal: req.params.animalId
            });
            
            if (solicitudExistente) {
                return res.status(409).json({ 
                    success: false,
                    message: "Ya tienes una solicitud pendiente para este animal" 
                });
            }
            
            // 1) Crear solicitud
            const solicitud = await SolicitudAdopcion.create({
                usuario: req.userId,
                animal: req.params.animalId,
                ...req.body
            });
            
            // 2) Agregar solicitud al animal
            await Animals.findByIdAndUpdate(
                req.params.animalId,
                { $push: { postulaciones: solicitud._id } }
            );
            
            console.log("✅ Solicitud creada exitosamente:", solicitud._id);
            
            return res.status(201).json({
                success: true,
                message: "Solicitud de adopción creada exitosamente",
                data: solicitud
            });
            
        } catch (error) {
            console.error("❌ Error al crear solicitud de adopción:", error);
            
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
            
            return res.status(500).json({ 
                success: false,
                message: "Error al crear solicitud de adopción",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
    
    crearSolicitudTransito: async (req, res) => {
        try {
            console.log("📝 Creando solicitud de tránsito...");
            console.log("Usuario ID:", req.userId);
            console.log("Animal ID:", req.params.animalId);
            console.log("Datos recibidos:", req.body);
            
            // Verificar que el animal exista
            const animal = await Animals.findById(req.params.animalId);
            if (!animal) {
                console.log("❌ Animal no encontrado:", req.params.animalId);
                return res.status(404).json({ 
                    success: false,
                    message: "Animal no encontrado" 
                });
            }
            
            // Verificar que el animal necesite tránsito
            if (animal.tipoIngreso !== "transito") {
                return res.status(400).json({ 
                    success: false,
                    message: "Este animal no necesita hogar de tránsito" 
                });
            }
            
            // Verificar que el animal esté disponible
            if (animal.estadoGeneral === false) {
                return res.status(400).json({ 
                    success: false,
                    message: "Este animal ya no necesita hogar de tránsito" 
                });
            }
            
            // Verificar que el usuario no tenga ya una solicitud para este animal
            const solicitudExistente = await SolicitudTransito.findOne({
                usuario: req.userId,
                animal: req.params.animalId
            });
            
            if (solicitudExistente) {
                return res.status(409).json({ 
                    success: false,
                    message: "Ya tienes una solicitud pendiente para este animal" 
                });
            }
            
            const solicitud = await SolicitudTransito.create({
                usuario: req.userId,
                animal: req.params.animalId,
                ...req.body
            });
            
            // Agregar solicitud al animal
            await Animals.findByIdAndUpdate(
                req.params.animalId,
                { $push: { postulaciones: solicitud._id } }
            );
            
            console.log("✅ Solicitud de tránsito creada exitosamente:", solicitud._id);
            
            return res.status(201).json({
                success: true,
                message: "Solicitud de tránsito creada exitosamente",
                data: solicitud
            });
            
        } catch (error) {
            console.error("❌ Error al crear solicitud de tránsito:", error);
            
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
            
            return res.status(500).json({ 
                success: false,
                message: "Error al crear solicitud de tránsito",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
    
    obtenerSolicitudesPorUsuario: async (req, res) => {
        try {
            const adopciones = await SolicitudAdopcion.find({ usuario: req.userId })
                .populate("animal")
                .sort({ createdAt: -1 });
                
            const transitos = await SolicitudTransito.find({ usuario: req.userId })
                .populate("animal")
                .sort({ createdAt: -1 });
                
            return res.status(200).json({ 
                success: true,
                adopciones, 
                transitos 
            });
            
        } catch (error) {
            console.error("Error al obtener solicitudes:", error);
            return res.status(500).json({ 
                success: false,
                message: "Error al obtener solicitudes" 
            });
        }
    },
    
    obtenerTodasAdopciones: async (req, res) => {
        try {
            const solicitudes = await SolicitudAdopcion.find()
                .populate("usuario")
                .populate("animal")
                .sort({ createdAt: -1 });
                
            return res.status(200).json({ 
                success: true,
                data: solicitudes 
            });
            
        } catch (error) {
            console.error("Error al obtener solicitudes de adopción:", error);
            return res.status(500).json({ 
                success: false,
                message: "Error al obtener solicitudes de adopción" 
            });
        }
    },
    
    obtenerTodosTransitos: async (req, res) => {
        try {
            const solicitudes = await SolicitudTransito.find()
                .populate("usuario")
                .populate("animal")
                .sort({ createdAt: -1 });
                
            return res.status(200).json({ 
                success: true,
                data: solicitudes 
            });
            
        } catch (error) {
            console.error("Error al obtener solicitudes de tránsito:", error);
            return res.status(500).json({ 
                success: false,
                message: "Error al obtener solicitudes de tránsito" 
            });
        }
    },
    
    cambiarEstadoAdopcion: async (req, res) => {
        try {
            const solicitud = await SolicitudAdopcion.findByIdAndUpdate(
                req.params.id,
                { estadoSolicitud: req.body.estado },
                { new: true }
            );
            
            return res.status(200).json({ 
                success: true,
                data: solicitud 
            });
            
        } catch (error) {
            console.error("Error al actualizar estado de adopción:", error);
            return res.status(500).json({ 
                success: false,
                message: "Error al actualizar estado" 
            });
        }
    },
    
    cambiarEstadoTransito: async (req, res) => {
        try {
            const solicitud = await SolicitudTransito.findByIdAndUpdate(
                req.params.id,
                { estadoSolicitud: req.body.estado },
                { new: true }
            );
            
            return res.status(200).json({ 
                success: true,
                data: solicitud 
            });
            
        } catch (error) {
            console.error("Error al actualizar estado de tránsito:", error);
            return res.status(500).json({ 
                success: false,
                message: "Error al actualizar estado" 
            });
        }
    }
};

export default solicitudesController;