import mongoose from "mongoose";

const solicitudAdopcionSchema = mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [true, "Debes iniciar sesión para enviar la solicitud"]
        },

        animal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "animals",
            required: [true, "Debes seleccionar un animal para adoptar"]
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

        convivientes: {
            type: String,
            required: [true, "Debes indicar con quién vivís"]
        },

        experienciaConAnimales: {
            type: String,
            required: [true, "Debes indicar tu experiencia con animales"]
        },

        motivoAdopcion: {
            type: String,
            required: [true, "Debes explicar por qué querés adoptar"],
            minlength: [10, "El motivo debe tener al menos 10 caracteres"]
        },

        viviendaTipo: {
            type: String,
            enum: ["casa", "departamento", "quinta", "otro"],
            required: [true, "Debes indicar el tipo de vivienda"]
        },

        tienePatio: {
            type: String,
            enum: ["si", "no"],
            required: [true, "Debes indicar si tenés patio"]
        },

        otrasMascotas: {
            type: String,
            required: [true, "Debes indicar si tenés otras mascotas"]
        },

        aptoEconomicamente: {
            type: String,
            enum: ["si", "no"],
            required: [true, "Debes indicar si podes cubrir gastos básicos del animal"]
        },

        horasFueraDeCasa: {
            type: Number,
            required: [true, "Debes indicar cuántas horas estás fuera de casa por día"]
        },

        estadoSolicitud: {
            type: String,
            enum: ["pendiente", "aprobada", "rechazada"],
            default: "pendiente"
        }
    },
    { timestamps: true }
);

const SolicitudAdopcion = mongoose.model("solicitudes_adopcion", solicitudAdopcionSchema);

export { SolicitudAdopcion, solicitudAdopcionSchema };
