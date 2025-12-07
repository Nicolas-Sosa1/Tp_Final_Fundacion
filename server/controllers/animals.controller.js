import { Animals} from "../models/animals.model.js";

const animalsController = {
    createOne: async (req,res)=> {
        const {
    nombre,
    edad,
    sexo,
    peso,
    castrado,
    vacunas,
    desparasitado,
    discapacidad,
    imagen,
    historia,
    tamaño,
    ubicacion,
    tipoIngreso,
    estadoGeneral
} = req.body;

const newAnimalData = {
    nombre,
    edad,
    sexo,
    peso,
    castrado,
    vacunas,
    desparasitado,
    discapacidad,
    imagen,
    historia,
    tamaño,
    ubicacion,
    tipoIngreso,
    estadoGeneral
};

        try{
            const newAnimal = await Animals.create(newAnimalData)
            res.status(201).json(newAnimal)
        }catch(e){

            const messages = {};

            if (e.name === "ValidationError") {
                Object.keys(e.errors).forEach((key) => {
                    messages[key] = e.errors[key].message;
                });

            }

            return res.status(400).json({ errors: { ...messages } });
        }

    },
    getAdopcionAlta: async (req, res) => {
        try {
            const lista = await Animals.find({
                tipoIngreso: "adopcion",
                estadoGeneral: true,
            }).populate("vacunas").sort({ createdAt: -1 });

            return res.status(200).json(lista);

        } catch (e) {
            console.error("Error al obtener adopción alta:", e.message);
            return res.status(500).json({ message: "Error al obtener animales en adopción alta" });
        }
    },
    getAdopcionBaja: async (req, res) => {
        try {
            const lista = await Animals.find({
                tipoIngreso: "adopcion",
                estadoGeneral: false,
            }).populate("vacunas").sort({ createdAt: -1 });

            return res.status(200).json(lista);

        } catch (e) {
            console.error("Error al obtener adopción baja:", e.message);
            return res.status(500).json({ message: "Error al obtener animales en adopción baja" });
        }
    },
    getTransitoAlta: async (req, res) => {
        try {
            const lista = await Animals.find({
                tipoIngreso: "transito",
                estadoGeneral: true,
            }).populate("vacunas").sort({ createdAt: -1 });

            return res.status(200).json(lista);

        } catch (e) {
            console.error("Error al obtener tránsito alta:", e.message);
            return res.status(500).json({ message: "Error al obtener animales en tránsito alta" });
        }
    },
    getTransitoBaja: async (req, res) => {
        try {
            const lista = await Animals.find({
                tipoIngreso: "transito",
                estadoGeneral: false,
            }).populate("vacunas").sort({ createdAt: -1 });

            return res.status(200).json(lista);

        } catch (e) {
            console.error("Error al obtener tránsito baja:", e.message);
            return res.status(500).json({ message: "Error al obtener animales en tránsito baja" });
        }
    },
    getOne: async (req, res) => {
        const id = req.params.id;

        try {
            const animal = await Animals.findById(id).populate("vacunas");

            if (!animal) {
                return res.status(404).json({ message: "No hay animal con ese ID" });
            }

            res.status(200).json({animal});

        } catch (e) {
            res.status(400).json({ message: "Error al buscar el animal", error: e.message });
        }
    },
    updateOne: async (req, res) => {
        const { id } = req.params;

        const {
            nombre,
            edad,
            sexo,
            peso,
            castrado,
            vacunas,
            desparasitado,
            discapacidad,
            imagen,
            historia,
            tamaño,
            ubicacion,
            tipoIngreso,
            estadoGeneral
        } = req.body;

        const dataToBeUpdated = {
            nombre,
            edad,
            sexo,
            peso,
            castrado,
            vacunas,
            desparasitado,
            discapacidad,
            imagen,
            historia,
            tamaño,
            ubicacion,
            tipoIngreso,
            estadoGeneral
        };


        try{
            const animal = await Animals.findById(id);

            if (!animal) {
                return res.status(404).json({ message: "No hay animal con ese ID" });
            }

            const oneUpdated = await Animals.findByIdAndUpdate(id, dataToBeUpdated, {new:true, runValidators:true})
            
            res.status(200).json(oneUpdated)

        }catch(e){
            console.error(`Error al editar animal: ${e.message}`);
            
            if (e.name === "ValidationError") {
                const messages = {};
                Object.keys(e.errors).forEach((key) => {
                    messages[key] = e.errors[key].message;
                });
                
                return res.status(400).json({ errors: { ...messages } });
            }

            return res.status(400).json({ message: "Error al actualizar el animal" });

        }
    },
    deleteOne: async (req, res) => {
        const { id } = req.params;

        try {
            const updatedAnimal = await Animals.findByIdAndUpdate(
                id,
                { estadoGeneral: "no_disponible" },
                { new: true }
            );

            if (!updatedAnimal) {
                return res.status(404).json({ message: "Animal no encontrado" });
            }

            return res.status(200).json({
                message: "El animal ha sido marcado como no disponible",
                animal: updatedAnimal
            });

        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar el estado del animal" });
        }
}

}

export default animalsController