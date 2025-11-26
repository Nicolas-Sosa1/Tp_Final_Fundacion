import { Vacuna } from "../models/vacunas.model.js";

const vacunasController = {

    getAll: async (req, res) => {
        try {
            const vacunas = await Vacuna.find().sort({ nombre: 1 });
            res.status(200).json(vacunas);
        } catch (e) {
            console.error("Error al obtener vacunas:", e.message);
            res.status(500).json({ message: "Error al obtener vacunas" });
        }
    },

    createOne: async (req, res) => {
        try {
            const newVacuna = await Vacuna.create(req.body);
            res.status(201).json(newVacuna);
        } catch (e) {
            console.error("Error al crear vacuna:", e.message);

            const messages = {};
            if (e.name === "ValidationError") {
                Object.keys(e.errors).forEach(key => {
                    messages[key] = e.errors[key].message;
                });
            }

            res.status(400).json({ errors: messages });
        }
    },

    deleteOne: async (req, res) => {
        try {
            const deleted = await Vacuna.findByIdAndDelete(req.params.id);

            if (!deleted) {
                return res.status(404).json({ message: "Vacuna no encontrada" });
            }

            res.status(200).json({ message: "Vacuna eliminada correctamente" });
        } catch (e) {
            console.error("Error al eliminar vacuna:", e.message);
            res.status(500).json({ message: "Error al eliminar la vacuna" });
        }
    }
};

export default vacunasController;
