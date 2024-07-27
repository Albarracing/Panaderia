import Repartidor from "../models/Repartidor.js";
import RepartidorSchema from "../schemas/RepartidorSchema.js";

// Crear un repartidor
export const createRepartidor = async (req, res) => {
  try {
    // Validar el cuerpo de la solicitud
    const { error, value } = RepartidorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Crear un nuevo repartidor
    const repartidor = new Repartidor(value);
    await repartidor.save();

    res.status(201).json(repartidor);
  } catch (err) {
    res.status(500).json({ error: "Error al crear el repartidor" });
  }
};
// Obtener todos los repartidores
export const getAllRepartidores = async (req, res) => {
  try {
    const repartidores = await Repartidor.find();
    res.status(200).json(repartidores);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los repartidores" });
  }
};
// Obtener un repartidor por ID
export const getRepartidorById = async (req, res) => {
  try {
    const { id } = req.params;
    const repartidor = await Repartidor.findById(id);

    if (!repartidor) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    res.status(200).json(repartidor);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el repartidor" });
  }
};
// Editar un repartidor
export const updateRepartidor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar el cuerpo de la solicitud
    const { error, value } = RepartidorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const repartidor = await Repartidor.findByIdAndUpdate(id, value, {
      new: true,
    });

    if (!repartidor) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    res.status(200).json(repartidor);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el repartidor" });
  }
};
// Eliminar un repartidor
export const deleteRepartidor = async (req, res) => {
  try {
    const { id } = req.params;
    const repartidor = await Repartidor.findByIdAndDelete(id);

    if (!repartidor) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    res.status(200).json({ message: "Repartidor eliminado exitosamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el repartidor" });
  }
};
