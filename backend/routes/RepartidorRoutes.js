import express from "express";
import {
  createRepartidor,
  getAllRepartidores,
  getRepartidorById,
  updateRepartidor,
  deleteRepartidor,
} from "../controllers/RepartidorControllers.js";

const router = express.Router();

// Crear un repartidor
router.post("/", createRepartidor);

// Obtener todos los repartidores
router.get("/", getAllRepartidores);

// Obtener un repartidor por ID
router.get("/:id", getRepartidorById);

// Editar un repartidor
router.put("/:id", updateRepartidor);

// Eliminar un repartidor
router.delete("/:id", deleteRepartidor);

export default router;
