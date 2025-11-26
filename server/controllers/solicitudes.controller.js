import { SolicitudAdopcion } from "../models/solicitudAdopcion.model.js";
import { SolicitudTransito } from "../models/solicitudTransito.model.js";

const solicitudesController = {

    crearSolicitudAdopcion: async (req, res) => {

        try {
            const solicitud = await SolicitudAdopcion.create({
                usuario: req.userId,
                animal: req.params.animalId,
                ...req.body
            });

            return res.status(201).json(solicitud);

        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Error al crear solicitud de adopción" });
        }
    },


    crearSolicitudTransito: async (req, res) => {
        try {
            const solicitud = await SolicitudTransito.create({
                usuario: req.userId,
                animal: req.params.animalId,
                ...req.body
            });

            return res.status(201).json(solicitud);

        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Error al crear solicitud de tránsito" });
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

            return res.status(200).json({ adopciones, transitos });

        } catch (error) {
            return res.status(500).json({ message: "Error al obtener solicitudes" });
        }
    },


    obtenerTodasAdopciones: async (req, res) => {
        try {
            const solicitudes = await SolicitudAdopcion.find()
                .populate("usuario")
                .populate("animal")
                .sort({ createdAt: -1 });

            return res.status(200).json(solicitudes);

        } catch (error) {
            return res.status(500).json({ message: "Error al obtener solicitudes de adopción" });
        }
    },

    obtenerTodosTransitos: async (req, res) => {
        try {
            const solicitudes = await SolicitudTransito.find()
                .populate("usuario")
                .populate("animal")
                .sort({ createdAt: -1 });

            return res.status(200).json(solicitudes);

        } catch (error) {
            return res.status(500).json({ message: "Error al obtener solicitudes de tránsito" });
        }
    },

    cambiarEstadoAdopcion: async (req, res) => {
        try {
            const solicitud = await SolicitudAdopcion.findByIdAndUpdate(
                req.params.id,
                { estadoSolicitud: req.body.estado },
                { new: true }
            );

            return res.status(200).json(solicitud);

        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar estado" });
        }
    },

    cambiarEstadoTransito: async (req, res) => {
        try {
            const solicitud = await SolicitudTransito.findByIdAndUpdate(
                req.params.id,
                { estadoSolicitud: req.body.estado },
                { new: true }
            );

            return res.status(200).json(solicitud);

        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar estado" });
        }
    }
};

export default solicitudesController;
