import Cliente from "../models/Clientes.js";
import ArticuloCliente from "../models/ArticulosCliente.js";

import mongoose from "mongoose";

const verCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Obtener los artículos asociados a este cliente
    const articulos = await ArticuloCliente.find({ clienteId: clienteId });

    // Devolver el cliente con sus artículos
    res.json({ cliente, articulos });
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener el cliente." });
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

const obtenerClientesConArticulos = async (req, res) => {
  try {
    // Obtener todos los clientes
    const clientes = await Cliente.find()
      .populate("localidad") // Popula la localidad si la tienes relacionada
      .lean(); // lean() convierte los documentos en objetos JS simples

    // Obtener todos los artículos para los clientes
    const clienteIds = clientes.map((cliente) => cliente._id);
    const articulos = await ArticuloCliente.find({
      clienteId: { $in: clienteIds },
    })
      .populate("articuloId") // Popula el artículo si la tienes relacionada
      .lean();

    // Asociar artículos a los clientes correspondientes
    const clientesConArticulos = clientes.map((cliente) => {
      const articulosDelCliente = articulos.filter(
        (articulo) => String(articulo.clienteId) === String(cliente._id)
      );
      return {
        ...cliente,
        articulos: articulosDelCliente,
      };
    });

    res.status(200).json(clientesConArticulos);
  } catch (error) {
    console.error("Error al obtener clientes con artículos:", error);
    res.status(500).json({ error: "Hubo un error al obtener los clientes." });
  }
};

const obtenerCantidadesPorDia = async (req, res) => {
  const { dia } = req.params;

  try {
    // Verifica si el parámetro 'dia' es válido
    if (
      ![
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
      ].includes(dia)
    ) {
      return res.status(400).json({ mensaje: "Día inválido" });
    }

    // Busca todos los documentos de ArticuloCliente y poblaciones de Articulo
    const resultados = await ArticuloCliente.find()
      .populate("articuloId")
      .exec();

    // Procesa los resultados
    const clientesConCantidades = resultados.map((articuloCliente) => {
      // Asegúrate de que articuloCliente.articuloId no sea null
      if (!articuloCliente.articuloId) {
        return {
          clienteId: articuloCliente.clienteId,
          nombre: "Nombre no disponible",
          cantidad: articuloCliente.cantidad[dia] || 0,
        };
      }

      return {
        clienteId: articuloCliente.clienteId,
        nombre: articuloCliente.articuloId.nombre || "Nombre no disponible",
        cantidad: articuloCliente.cantidad[dia] || 0,
      };
    });

    res.json(clientesConCantidades);
  } catch (error) {
    console.error("Error al obtener las cantidades:", error);
    res.status(500).json({ mensaje: "Error al obtener las cantidades" });
  }
};

const buscarArticulosPorCliente = async (clienteId) => {
  try {
    console.log("Buscando artículos para el cliente:", clienteId);

    const articulos = await ArticuloCliente.find({ clienteId }).populate(
      "productoId"
    );

    if (!articulos.length) {
      console.log("No se encontraron artículos para este cliente:", clienteId);
      throw new Error("No se encontraron artículos para este cliente");
    }

    console.log("Artículos encontrados:", articulos);
    return articulos;
  } catch (error) {
    console.error("Error en buscarArticulosPorCliente:", error.message);
    throw error;
  }
};

const buscarArticulosPorClienteYDia = async (clienteId, dia) => {
  try {
    if (
      ![
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
      ].includes(dia)
    ) {
      throw new Error(
        "Día inválido. Debe ser uno de: lunes, martes, miercoles, jueves, viernes, sabado, domingo."
      );
    }

    const articulos = await ArticuloCliente.find({ clienteId })
      .select("articuloId nombre cantidad")
      .exec();

    // Filtra los artículos por la cantidad en el día especificado
    const articulosFiltrados = articulos.map((articulo) => ({
      articuloId: articulo.articuloId,
      nombre: articulo.nombre,
      cantidad: articulo.cantidad[dia],
    }));

    return articulosFiltrados;
  } catch (error) {
    console.error("Error al buscar artículos por cliente y día:", error);
    throw error;
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

    // Filtrar artículos con al menos una cantidad > 0
    const articulosFiltrados = articuloData.filter((articulo) => {
      return Object.values(articulo.cantidad).some((cantidad) => cantidad > 0);
    });

    // Crear el cliente
    const nuevoCliente = new Cliente({
      nombre,
      apellido,
      localidad: localidadId,
      direccion,
      celular,
      descuento,
      vuelta,
      tipoCliente,
    });

    // Guardar el cliente en la base de datos
    const clienteGuardado = await nuevoCliente.save();

    // Crear los registros de artículos para el cliente
    const articulosCliente = articulosFiltrados.map((articulo) => ({
      clienteId: clienteGuardado._id,
      articuloId: articulo.articuloId,
      nombre: articulo.nombre,
      cantidad: articulo.cantidad,
    }));

    // Guardar los artículos en la base de datos
    await ArticuloCliente.insertMany(articulosCliente);

    res.json({
      message: "Cliente y artículos creados exitosamente.",
      cliente: clienteGuardado,
    });
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
    } = req.body;

    console.log(`Datos recibidos:`, req.body);

    const clienteExistente = await Cliente.findById(id);
    if (!clienteExistente) {
      console.log(`Cliente no encontrado para el ID: ${id}`);
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Actualizar los datos básicos del cliente
    clienteExistente.nombre = nombre;
    clienteExistente.apellido = apellido;
    clienteExistente.direccion = direccion;
    clienteExistente.celular = celular;
    clienteExistente.localidad = localidadId;
    clienteExistente.descuento = descuento;
    clienteExistente.vuelta = vuelta;
    clienteExistente.tipoCliente = tipoCliente;
    clienteExistente.codigo = codigo || clienteExistente.codigo;

    await clienteExistente.save();

    // Verificar y actualizar los artículos
    if (articuloData && articuloData.length > 0) {
      for (let articulo of articuloData) {
        await ArticuloCliente.findOneAndUpdate(
          { clienteId: id, articuloId: articulo.articuloId },
          { $set: { cantidad: articulo.cantidad } },
          { upsert: true } // Esto creará el documento si no existe
        );
      }
    }

    console.log(`Cliente actualizado:`, clienteExistente);

    res.json({
      message: "Cliente actualizado exitosamente.",
      clienteActualizado: clienteExistente,
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
  obtenerClientesConArticulos,
  obtenerCantidadesPorDia,
  buscarArticulosPorCliente,
  buscarArticulosPorClienteYDia,
  registrar,
  actualizarCliente,
  eliminarCliente,
};
