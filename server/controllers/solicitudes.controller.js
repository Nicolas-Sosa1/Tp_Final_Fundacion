import { SolicitudAdopcion } from "../models/solicitudAdopcion.model.js";
import { SolicitudTransito } from "../models/solicitudTransito.model.js";
import { Animals } from "../models/animals.model.js";

const solicitudesController = {

    crearSolicitudAdopcion: async (req, res) => {
        try {
            console.log("📝 Creando solicitud adopción para animal:", req.params.animalId);
            console.log("👤 Usuario:", req.userId);
            
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

            return res.status(201).json({
                success: true,
                message: "Solicitud de adopción creada exitosamente",
                data: solicitud
            });

        } catch (error) {
            console.error("❌ Error crearSolicitudAdopcion:", error);
            return res.status(400).json({ 
                success: false,
                message: "Error al crear solicitud de adopción",
                error: error.message 
            });
        }
    },

    crearSolicitudTransito: async (req, res) => {
        try {
            console.log("📝 Creando solicitud tránsito para animal:", req.params.animalId);
            
            const solicitud = await SolicitudTransito.create({
                usuario: req.userId,
                animal: req.params.animalId,
                ...req.body
            });

            return res.status(201).json({
                success: true,
                message: "Solicitud de tránsito creada exitosamente",
                data: solicitud
            });

        } catch (error) {
            console.error("❌ Error crearSolicitudTransito:", error);
            return res.status(400).json({ 
                success: false,
                message: "Error al crear solicitud de tránsito",
                error: error.message 
            });
        }
    },

    obtenerSolicitudesPorUsuario: async (req, res) => {
        try {
            console.log("🔍 obtenerSolicitudesPorUsuario - User ID:", req.userId);
            
            const adopciones = await SolicitudAdopcion.find({ usuario: req.userId })
                .populate("animal")
                .sort({ createdAt: -1 });

            const transitos = await SolicitudTransito.find({ usuario: req.userId })
                .populate("animal")
                .sort({ createdAt: -1 });

            console.log(`📊 Resultados: ${adopciones.length} adopciones, ${transitos.length} tránsitos`);

            // ✅ CORRECCIÓN PRINCIPAL: Agregar campo "success"
            return res.status(200).json({
                success: true,
                message: "Solicitudes obtenidas exitosamente",
                adopciones: adopciones || [],
                transitos: transitos || []
            });

        } catch (error) {
            console.error("❌ Error obtenerSolicitudesPorUsuario:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener solicitudes",
                error: error.message
            });
        }
    },

    obtenerTodasAdopciones: async (req, res) => {
        try {
            const solicitudes = await SolicitudAdopcion.find()
                .populate("usuario", "nombre email")
                .populate("animal", "nombre imagen tipoIngreso")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                data: solicitudes
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al obtener solicitudes de adopción"
            });
        }
    },

    obtenerTodosTransitos: async (req, res) => {
        try {
            const solicitudes = await SolicitudTransito.find()
                .populate("usuario", "nombre email")
                .populate("animal", "nombre imagen tipoIngreso")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                data: solicitudes
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al obtener solicitudes de tránsito"
            });
        }
    },

    cambiarEstadoAdopcion: async (req, res) => {
        try {
            const { estado } = req.body;
            const { id } = req.params;
            
            console.log(`🔄 Cambiando estado adopción ${id} a: ${estado}`);
            
            const solicitud = await SolicitudAdopcion.findByIdAndUpdate(
                id,
                { estadoSolicitud: estado },
                { new: true }
            ).populate("usuario animal");

            if (!solicitud) {
                return res.status(404).json({
                    success: false,
                    message: "Solicitud no encontrada"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Estado actualizado exitosamente",
                data: solicitud
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al actualizar estado"
            });
        }
    },

    cambiarEstadoTransito: async (req, res) => {
        try {
            const { estado } = req.body;
            const { id } = req.params;
            
            console.log(`🔄 Cambiando estado tránsito ${id} a: ${estado}`);
            
            const solicitud = await SolicitudTransito.findByIdAndUpdate(
                id,
                { estadoSolicitud: estado },
                { new: true }
            ).populate("usuario animal");

            if (!solicitud) {
                return res.status(404).json({
                    success: false,
                    message: "Solicitud no encontrada"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Estado actualizado exitosamente",
                data: solicitud
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al actualizar estado"
            });
        }
    },
    
    obtenerSolicitudAdopcionPorId: async (req, res) => {
        try {
            const solicitud = await SolicitudAdopcion.findById(req.params.id)
                .populate("usuario", "nombre email telefono")
                .populate("animal", "nombre imagen tipoIngreso ubicacion");

            if (!solicitud) {
                return res.status(404).json({
                    success: false,
                    message: "Solicitud no encontrada"
                });
            }

            return res.status(200).json({
                success: true,
                data: solicitud
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener la solicitud"
            });
        }
    }

};

export default solicitudesController;