import express from "express";
import Repartos from "../models/Repartos.js";
import {
  crearReparto,
  verRepartosFecha,
  verRepartos,
  obtenerDeudaPendiente,
  actualizarPagoCompleto,
  actualizarMontoPagado,
  eliminarReparto,
  actualizarCantidadDevuelta,
  obtenerRepartoDetalles,
  actualizarDeudaCliente,
} from "../controllers/RepartosControllers.js";

const router = express.Router();

router.get("/fecha/:fecha", verRepartosFecha);
router.get("/", verRepartos);
router.get("/:repartoId", obtenerRepartoDetalles);

router.post("/", crearReparto);
router.put("/:repartoId/clientes/:clienteId/deuda", actualizarDeudaCliente);
router.put(
  "/:repartoId/clientes/:clienteId/articulos/:articuloId/devolucion",
  actualizarCantidadDevuelta
);
router.put("/:repartoId/clientes/:clienteId/pago", actualizarPagoCompleto);
router.put("/:repartoId/clientes/:clienteId/monto", actualizarMontoPagado);
router.delete("/:id", eliminarReparto);

// Ruta en el backend
router.get("/deudaPendiente/:clienteId", async (req, res) => {
  const { clienteId } = req.params;

  try {
    const ultimoRepartoConDeuda = await Repartos.findOne({
      "clientesArticulos.clienteId": clienteId,
      "clientesArticulos.pagadoCompleto": false,
    }).sort({ fecha: -1 });

    if (!ultimoRepartoConDeuda) {
      return res.json({ deudaPendiente: 0 });
    }

    const clienteArticulo = ultimoRepartoConDeuda.clientesArticulos.find(
      (ca) => ca.clienteId.toString() === clienteId.toString()
    );

    const deudaPendiente = clienteArticulo.deuda || 0;

    res.json({ deudaPendiente });
  } catch (error) {
    console.error("Error al obtener la deuda pendiente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
