import Localidad from "../models/Localidades.js";
import LocalidadSchema from "../schemas/LocalidadSchema.js";
import mongoose from "mongoose";
// Crear un repartidor
const createLocalidad = async (req, res) => {
  try {
    // Validar el cuerpo de la solicitud
    const { error, value } = LocalidadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Crear un nuevo repartidor
    const localidad = new Localidad(value);
    await localidad.save();

    res.status(201).json(localidad);
  } catch (err) {
    res.status(500).json({ error: "Error al crear la localidad" });
  }
};
// Obtener todos los repartidores
const getAllLocalidad = async (req, res) => {
  try {
    const localidades = await Localidad.find();
    res.status(200).json(localidades);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las localidades" });
  }
};
// Obtener un repartidor por ID
const getLocalidadById = async (req, res) => {
  try {
    const { id } = req.params;
    const localidad = await Localidad.findById(id);

    if (!localidad) {
      return res.status(404).json({ error: "localidad no encontrado" });
    }

    res.status(200).json(localidad);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la localidad" });
  }
};
// Editar un repartidor
const updateLocalidad = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar el cuerpo de la solicitud
    const { error, value } = LocalidadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const localidad = await Localidad.findByIdAndUpdate(id, value, {
      new: true,
    });

    if (!localidad) {
      return res.status(404).json({ error: "localidad no encontrada" });
    }

    res.status(200).json(localidad);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la localidad" });
  }
};
// Eliminar un repartidor
const deleteLocalidad = async (req, res) => {
  try {
    const { id } = req.params;
    const localidad = await Localidad.findByIdAndDelete(id);

    if (!localidad) {
      return res.status(404).json({ error: "localidad no encontrada" });
    }

    res.status(200).json({ message: "localidad eliminada exitosamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar la localidad" });
  }
};

export {
  createLocalidad,
  getAllLocalidad,
  getLocalidadById,
  updateLocalidad,
  deleteLocalidad,
};
