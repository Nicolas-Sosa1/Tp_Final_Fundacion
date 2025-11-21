import mongoose from "mongoose";

const animalsShema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required : [true, "El nombre del animal es obligatorio"],
            minlength:[3, "El nombre debe tener al menos 3 caracteres"]
        },
        edad: {
            type: Number,
            required : [true, "La edad del animal es obligatoria"],
        },
        sexo:{
            type:String,
            required : [true, "El sexo del animal es obligatorio"],
            enum: ["macho", "hembra"], 
        },
        peso:{
            type: Number,
            required : [true, "El peso del animal es obligatorio"],
        },
        castrado:{
            type: String,
            required : [true, "Debes indicar si el animal está castrado"],
            enum: ["si", "no"],
        },
        vacunado:{
            type: String,
            required : [true, "Debes indicar si el animal está vacunado"],
            enum: ["si", "no"],
        },
        desparasitado:{
            type: String,
            required : [true, "Debes indicar si el animal está desparasitado"],
            enum: ["si", "no"],
        },
        discapacidad:{
            type: String,
            required : [true, "Debes indicar si presenta algún tipo de discapacidad"],
        },
        imagen: {
            type: String,
            required: [true, "Debes subir una imagen del animal"],
        },
        tipoIngreso: {
            type: String,
            enum: ["adopcion", "transito"],
            required: [true, "Debes especificar si el animal ingresa por adopción o por tránsito"]
        },
        estadoGeneral: {
            type: String,
            enum: ["disponible", "no_disponible"],
            default: "disponible"
        },

    }, {timestamps:true}
)


const Animals = mongoose.model("users", animalsShema);

export {Animals, animalsShema};