import express from "express";

import {
  createLocalidad,
  getAllLocalidad,
  getLocalidadById,
  updateLocalidad,
  deleteLocalidad,
} from "../controllers/LocalidadesControllers.js";

const router = express.Router();

router.get("/", getAllLocalidad);
router.post("/", createLocalidad);
router.put("/:id", updateLocalidad);
router.delete("/:id", deleteLocalidad);

export default router;
