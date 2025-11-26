import mongoose from "mongoose";

const vacunaSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre de la vacuna es obligatorio"],
            minlength: [3, "El nombre de la vacuna debe tener al menos 3 caracteres"]
        },
        descripcion: {
            type: String
        },
    },
    { timestamps: true }
);

const Vacuna = mongoose.model("vacunas", vacunaSchema);

export { Vacuna, vacunaSchema };
