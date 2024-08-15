import express from "express";
import validationMiddleware from "../middlewares/validateData.js";
import articuloSchema from "../schemas/ArticulosSchemas.js";
import {
  verArticulos,
  agregarArticulo,
  actualizarArticulo,
  eliminarArticulo,
} from "../controllers/ArticulosControllers.js";
const router = express.Router();

router.get("/", verArticulos);
router.post("/", validationMiddleware(articuloSchema), agregarArticulo);
router.put("/:_id", actualizarArticulo);
router.delete("/:_id", eliminarArticulo);
export default router;
