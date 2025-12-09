import { SolicitudAdopcion } from "../models/solicitudAdopcion.model.js";
import { SolicitudTransito } from "../models/solicitudTransito.model.js";
import { Animals } from "../models/animals.model.js";

const solicitudesController = {
  crearSolicitudAdopcion: async (req, res) => {
    console.log("📝 Creando solicitud de adopción...");
    console.log("Usuario ID:", req.userId);
    console.log("Animal ID:", req.params.animalId);
    console.log("Datos recibidos:", req.body);

    try {
      const solicitudData = {
        usuario: req.userId,
        animal: req.params.animalId,
        ...req.body,
      };

      const solicitud = await SolicitudAdopcion.create(solicitudData);

      console.log("✅ Solicitud creada:", solicitud._id);

      // Vincular la solicitud al animal
      await Animals.findByIdAndUpdate(req.params.animalId, {
        $push: { postulaciones: solicitud._id },
      });

      return res.status(201).json({
        success: true,
        message: "Solicitud de adopción creada exitosamente",
        data: solicitud,
      });
    } catch (error) {
      console.error("❌ ERROR al crear solicitud de adopción:", error);
      console.error("Tipo de error:", error.name);
      console.error("Mensaje:", error.message);

      if (error.name === "ValidationError") {
        const validationErrors = {};
        Object.keys(error.errors).forEach((key) => {
          validationErrors[key] = error.errors[key].message;
        });

        return res.status(400).json({
          success: false,
          message: "Errores de validación en el formulario",
          errors: validationErrors,
          fieldErrors: Object.keys(validationErrors),
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una solicitud para este animal",
          error: error.message,
        });
      }

      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "ID de animal inválido",
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al crear solicitud de adopción",
        error: error.message,
        errorType: error.name,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  crearSolicitudTransito: async (req, res) => {
    console.log("📝 Creando solicitud de tránsito...");

    try {
      const solicitudData = {
        usuario: req.userId,
        animal: req.params.animalId,
        ...req.body,
      };

      const solicitud = await SolicitudTransito.create(solicitudData);

      console.log("✅ Solicitud de tránsito creada:", solicitud._id);

      return res.status(201).json({
        success: true,
        message: "Solicitud de tránsito creada exitosamente",
        data: solicitud,
      });
    } catch (error) {
      console.error("❌ Error al crear solicitud de tránsito:", error);

      if (error.name === "ValidationError") {
        const validationErrors = {};
        Object.keys(error.errors).forEach((key) => {
          validationErrors[key] = error.errors[key].message;
        });

        return res.status(400).json({
          success: false,
          message: "Errores de validación en el formulario",
          errors: validationErrors,
          fieldErrors: Object.keys(validationErrors),
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al crear solicitud de tránsito",
        error: error.message,
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
        transitos,
      });
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener solicitudes",
        error: error.message,
      });
    }
  },

  obtenerTodasAdopciones: async (req, res) => {
    try {
      const solicitudes = await SolicitudAdopcion.find()
        .populate("usuario", "firstName lastName email")
        .populate("animal", "nombre tipoIngreso")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: solicitudes,
      });
    } catch (error) {
      console.error("Error al obtener solicitudes de adopción:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener solicitudes de adopción",
        error: error.message,
      });
    }
  },

  obtenerTodosTransitos: async (req, res) => {
    try {
      const solicitudes = await SolicitudTransito.find()
        .populate("usuario", "firstName lastName email")
        .populate("animal", "nombre tipoIngreso")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: solicitudes,
      });
    } catch (error) {
      console.error("Error al obtener solicitudes de tránsito:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener solicitudes de tránsito",
        error: error.message,
      });
    }
  },

  cambiarEstadoAdopcion: async (req, res) => {
    try {
      const { estado } = req.body;

      if (!["pendiente", "aprobada", "rechazada"].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: "Estado inválido",
        });
      }

      const solicitud = await SolicitudAdopcion.findByIdAndUpdate(
        req.params.id,
        { estadoSolicitud: estado },
        { new: true }
      )
        .populate("usuario", "firstName lastName email")
        .populate("animal", "nombre");

      if (!solicitud) {
        return res.status(404).json({
          success: false,
          message: "Solicitud no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Estado actualizado correctamente",
        data: solicitud,
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar estado",
        error: error.message,
      });
    }
  },

  cambiarEstadoTransito: async (req, res) => {
    try {
      const { estado } = req.body;

      if (!["pendiente", "aprobada", "rechazada"].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: "Estado inválido",
        });
      }

      const solicitud = await SolicitudTransito.findByIdAndUpdate(
        req.params.id,
        { estadoSolicitud: estado },
        { new: true }
      )
        .populate("usuario", "firstName lastName email")
        .populate("animal", "nombre");

      if (!solicitud) {
        return res.status(404).json({
          success: false,
          message: "Solicitud no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Estado actualizado correctamente",
        data: solicitud,
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar estado",
        error: error.message,
      });
    }
  },
};

export default solicitudesController;
