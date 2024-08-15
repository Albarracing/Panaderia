import Cliente from "../models/Cliente.js";
import ArticuloCliente from "../models/ArticuloCliente.js";

const registrar = async (req, res) => {
  try {
    const { articuloData, ...clienteData } = req.body;

    const cliente = new Cliente(clienteData);
    await cliente.save();

    if (articuloData && articuloData.length > 0) {
      const articulos = articuloData.map((articulo) => ({
        ...articulo,
        clienteId: cliente._id,
      }));
      await ArticuloCliente.insertMany(articulos);
    }

    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el cliente" });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { articuloData, ...clienteData } = req.body;

    const cliente = await Cliente.findByIdAndUpdate(id, clienteData, {
      new: true,
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    if (articuloData) {
      // Delete existing articles for the client
      await ArticuloCliente.deleteMany({ clienteId: id });

      // Insert updated articles
      const articulos = articuloData.map((articulo) => ({
        ...articulo,
        clienteId: id,
      }));
      await ArticuloCliente.insertMany(articulos);
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

export { actualizarCliente, registrar };
