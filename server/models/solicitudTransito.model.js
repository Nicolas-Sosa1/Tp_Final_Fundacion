import mongoose from "mongoose";

const solicitudTransitoSchema = mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [true, "Debes iniciar sesión para enviar la solicitud"]
        },

        animal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "animals",
            required: [true, "Debes seleccionar un animal para postularte como hogar transitorio"]
        },

        direccion: {
            type: String,
            required: [true, "La dirección es obligatoria"],
            minlength: [5, "La dirección debe tener al menos 5 caracteres"]
        },

        telefono: {
            type: String,
            required: [true, "El teléfono es obligatorio"]
        },

        tiempoDisponible: {
            type: String,
            required: [true, "Debes indicar cuánto tiempo podés tener al animal"],
            minlength: [3, "Debes ingresar un tiempo válido"]
        },

        experienciaConAnimales: {
            type: String,
            required: [true, "Debes indicar si tenés experiencia cuidando animales"],
            minlength: [5, "Debes indicar más detalles sobre tu experiencia"]
        },

        cuidadosEspecialesPosibles: {
            type: String,
            required: [true, "Debes indicar si podés realizar cuidados especiales"],
        },

        cubrirGastos: {
            type: String,
            enum: ["si", "no"],
            required: [true, "Debes indicar si podés cubrir gastos básicos"]
        },

        espacioEnCasa: {
            type: String,
            enum: ["pequeño", "mediano", "grande"],
            required: [true, "Debes indicar el espacio disponible en tu vivienda"]
        },

        otrasMascotas: {
            type: String,
            required: [true, "Debes indicar si tenés otras mascotas"]
        },

        estadoSolicitud: {
            type: String,
            enum: ["pendiente", "aprobada", "rechazada"],
            default: "pendiente"
        }
    },
    { timestamps: true }
);

const SolicitudTransito = mongoose.model("solicitudes_transito", solicitudTransitoSchema);

export { SolicitudTransito, solicitudTransitoSchema };
