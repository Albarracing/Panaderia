import Cliente from "../models/Clientes.js";
import Articulo from "../models/Articulos.js";
import Reparto from "../models/Repartos.js";
import mongoose from "mongoose";

const verCliente = async (req, res) => {
  try {
    const clientes = await Cliente.find()
      .populate("localidad")
      .populate("articulo.articuloId");
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find()
      .populate("localidad")
      .populate("articulo.articuloId");
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registrar = async (req, res) => {
  try {
    console.log("Datos recibidos en registrar:", req.body);
    const {
      nombre,
      apellido,
      direccion,
      celular,
      localidadId,
      descuento,
      vuelta,
      tipoCliente,
      articuloData,
    } = req.body;

    if (!Array.isArray(articuloData)) {
      return res.status(400).json({ error: "articuloData debe ser un array." });
    }

    if (
      !nombre ||
      !apellido ||
      !direccion ||
      !celular ||
      !localidadId ||
      !descuento ||
      !vuelta ||
      !tipoCliente
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios." });
    }

    const cliente = new Cliente({
      nombre,
      apellido,
      localidad: localidadId,
      direccion,
      celular,
      descuento,
      vuelta,
      tipoCliente,
      articulo: articuloData.map((articulo) => ({
        articuloId: String(articulo.productoId), // Asegurarse de que sea una cadena
        nombre: articulo.nombre,
        cantidad: articulo.cantidad,
      })),
    });

    await cliente.save();

    res.json({ message: "Cliente y artículos creados exitosamente.", cliente });
  } catch (error) {
    console.error("Error al guardar el cliente:", error);
    res.status(500).json({
      error: "Hubo un error al procesar la solicitud.",
      detalles: error.message,
    });
  }
};

const actualizarCliente = async (req, res) => {
  let id;
  try {
    id = req.params.id;
    console.log(`ID recibido: ${id}`);

    console.log(`Cuerpo de la solicitud recibido:`, req.body);

    const {
      nombre,
      apellido,
      direccion,
      celular,
      localidadId,
      descuento,
      vuelta,
      tipoCliente,
      articuloData,
      codigo,
    } = req.body; // No desestructuramos desde req.body.cliente

    console.log(`Datos recibidos:`, req.body);

    const clienteExistente = await Cliente.findById(id);
    if (!clienteExistente) {
      console.log(`Cliente no encontrado para el ID: ${id}`);
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const articuloActualizado = articuloData
      ? articuloData.map((articulo) => ({
          articuloId: articulo.articuloId,
          nombre: articulo.nombre,
          cantidad: {
            lunes: articulo.cantidad.lunes || 0,
            martes: articulo.cantidad.martes || 0,
            miercoles: articulo.cantidad.miercoles || 0,
            jueves: articulo.cantidad.jueves || 0,
            viernes: articulo.cantidad.viernes || 0,
            sabado: articulo.cantidad.sabado || 0,
            domingo: articulo.cantidad.domingo || 0,
          },
        }))
      : clienteExistente.articulo;

    const clienteActualizado = await Cliente.findByIdAndUpdate(
      id,
      {
        nombre,
        apellido,
        localidad: localidadId,
        direccion,
        celular,
        descuento,
        vuelta,
        tipoCliente,
        articulo: articuloActualizado,
        codigo: codigo || clienteExistente.codigo,
      },
      { new: true }
    );

    console.log(`Cliente actualizado:`, clienteActualizado);

    res.json({
      message: "Cliente actualizado exitosamente.",
      clienteActualizado,
    });
  } catch (error) {
    console.error(`Error al actualizar el cliente con ID: ${id}`, error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
};

const eliminarCliente = async (req, res) => {
  const id = req.params.id;
  console.log("ID recibido:", id); // Log para verificar que el ID se está recibiendo
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const clienteEliminado = await Cliente.findByIdAndDelete(id);
    if (!clienteEliminado) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    console.error(`Error al eliminar el cliente con ID: ${id}`, error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
};

export {
  verCliente,
  obtenerClientes,
  registrar,
  actualizarCliente,
  eliminarCliente,
};
