import Articulos from "../models/Articulos.js";
import mongoose from "mongoose";
import articuloSchema from "../schemas/ArticulosSchemas.js";
const verArticulos = async (req, res) => {
  try {
    const articulos = await Articulos.find().populate("precios.localidad");
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los artículos" });
  }
};
const generarCodigo = async () => {
  // Lógica para generar un código único
  const totalArticulos = await Articulos.countDocuments();
  return `${totalArticulos + 1}`;
};

const agregarArticulo = async (req, res) => {
  const { nombre, unidad, precioMostrador, lugarPreparacion, precios } =
    req.body;

  try {
    let codigo = req.body.codigo;
    if (!codigo) {
      codigo = await generarCodigo();
    }

    const articuloAlmacenado = new Articulos({
      codigo,
      nombre,
      unidad,
      precioMostrador,
      lugarPreparacion,
      precios,
    });
    await articuloAlmacenado.save();
    res.json(`${nombre} guardado`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar el artículo" });
  }
};

const actualizarArticulo = async (req, res) => {
  const { _id } = req.params;
  const { codigo, nombre, unidad, precioMostrador, lugarPreparacion, precios } =
    req.body;

  try {
    console.log("Datos recibidos:", req.body); // Verifica los datos que llegan al backend

    if (!mongoose.isValidObjectId(_id)) {
      return res
        .status(400)
        .json({ error: "El ID proporcionado no es válido." });
    }

    const articuloExistente = await Articulos.findById(_id);
    if (!articuloExistente) {
      return res.status(404).json({ error: "El artículo no existe." });
    }

    const articuloActualizado = await Articulos.findByIdAndUpdate(
      _id,
      {
        $set: {
          codigo,
          nombre,
          unidad,
          precioMostrador,
          lugarPreparacion,
          precios,
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!articuloActualizado) {
      return res
        .status(500)
        .json({ error: "No se pudo actualizar el artículo." });
    }

    res.json(articuloActualizado);
  } catch (error) {
    console.error("Error en la actualización:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
};

const eliminarArticulo = async (req, res) => {
  const { _id } = req.params;

  try {
    await Articulos.findByIdAndDelete(_id);
    res.json("Artículo eliminado");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el artículo" });
  }
};

export { verArticulos, agregarArticulo, actualizarArticulo, eliminarArticulo };
