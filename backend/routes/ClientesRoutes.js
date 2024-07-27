import express from "express";
import validationMiddleware from "../middlewares/validateData.js";
//import parseArticuloData from "../middlewares/ArticuloDataParser.js";
import clienteSchema from "../schemas/ClientesSchemas.js";
import {
  verCliente,
  registrar,
  actualizarCliente,
  eliminarCliente,
  obtenerClientes,
} from "../controllers/ClientesControllers.js";

const router = express.Router();

router.get("/", obtenerClientes);
router.post("/", registrar);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);
export default router;
