import express from "express";
import {
  crearReparto,
  verRepartosFecha,
  verRepartos,
  actualizarPagoCompleto,
  actualizarMontoPagado,
  eliminarReparto,
  actualizarCantidadDevuelta,
  obtenerRepartoDetalles,
} from "../controllers/RepartosControllers.js";

const router = express.Router();

router.get("/fecha/:fecha", verRepartosFecha);
router.get("/", verRepartos);
router.get("/:repartoId", obtenerRepartoDetalles);
router.post("/", crearReparto);
// router.put("/:repartoId/clientes/:clienteId/pago", actualizarPago);
router.put(
  "/:repartoId/clientes/:clienteId/articulos/:articuloId/devolucion",
  actualizarCantidadDevuelta
);

router.put("/:repartoId/clientes/:clienteId/pago", actualizarPagoCompleto);
router.put("/:repartoId/clientes/:clienteId/monto", actualizarMontoPagado);
router.delete("/:id", eliminarReparto);

export default router;
