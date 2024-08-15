import express from "express";
import validationMiddleware from "../middlewares/validateData.js";
//import parseArticuloData from "../middlewares/ArticuloDataParser.js";
import clienteSchema from "../schemas/ClientesSchemas.js";
import {
  verCliente,
  obtenerClientesConArticulos,
  obtenerCantidadesPorDia,
  registrar,
  actualizarCliente,
  eliminarCliente,
  obtenerClientes,
  buscarArticulosPorCliente,
  buscarArticulosPorClienteYDia,
} from "../controllers/ClientesControllers.js";

const router = express.Router();

router.get("/clientes-con-articulos", obtenerClientesConArticulos);
router.get("/cantidades/:dia", obtenerCantidadesPorDia);
router.get("/:clienteId/:dia", async (req, res) => {
  try {
    const { clienteId, dia } = req.params;
    const articulos = await buscarArticulosPorClienteYDia(clienteId, dia);
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener los artículos." });
  }
});

router.get("/:clienteId", async (req, res) => {
  try {
    const articulos = await buscarArticulosPorCliente(req.params.clienteId);
    res.json(articulos);
  } catch (error) {
    console.error("Error en la ruta /:clienteId:", error.message);
    res
      .status(500)
      .json({ error: "Hubo un error al obtener el cliente y sus artículos." });
  }
});

router.get("/", obtenerClientes);
router.post("/", registrar);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);
export default router;
