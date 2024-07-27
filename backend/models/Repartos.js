import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const articuloSchema = new mongoose.Schema({
  articuloId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articulos",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  cantidadDevuelta: {
    type: Number,
    default: 0,
  },
  importe: {
    type: Number,
    required: true,
  },
});

const devolucionSchema = new mongoose.Schema({
  articuloId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articulos",
    required: true,
  },
  cantidadDevuelta: {
    type: Number,
    required: true,
  },
  importeDevuelto: {
    type: Number,
    required: true,
  },
  fechaDevolucion: {
    type: Date,
    required: true,
  },
});

const clienteArticuloSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  articulos: [articuloSchema],
  devoluciones: [devolucionSchema], // Añadir devoluciones aquí
  totalCliente: {
    type: Number,
  },
  pagadoCompleto: {
    type: Boolean,
    default: false,
  },
  montoPagado: {
    type: Number,
    default: 0,
  },
  deuda: {
    type: Number,
    default: 0,
  },
});

const repartoSchema = new mongoose.Schema({
  clientesArticulos: [clienteArticuloSchema],
  totalReparto: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  cantidadTotalPorProducto: {
    type: Map,
    of: Number,
    default: {},
  },
  cantidadDevueltaTotal: {
    type: Number,
    default: 0,
  },
  numeroPedido: {
    type: Number,
    unique: true,
  },
  repartidor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repartidor",
  },
  alias: {
    type: String,
  },
});

repartoSchema.plugin(autopopulate);

const Repartos = mongoose.model("Reparto", repartoSchema);

export default Repartos;
