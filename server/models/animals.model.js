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
            type: Boolean,
            required : [true, "Debes indicar si el animal está castrado"],
        },
        vacunas: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "vacunas"
        }],
        desparasitado:{
            type: Boolean,
            required : [true, "Debes indicar si el animal está desparasitado"],
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
            type: Boolean,
            default: true
        },

    }, {timestamps:true}
)


const Animals = mongoose.model("animals", animalsShema);

export {Animals, animalsShema};