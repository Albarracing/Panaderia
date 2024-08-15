import mongoose from "mongoose";

const articuloClienteSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  articuloId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articulos",
    required: true,
  },
  nombre: { type: String, required: true },
  cantidad: {
    lunes: { type: Number, default: 0 },
    martes: { type: Number, default: 0 },
    miercoles: { type: Number, default: 0 },
    jueves: { type: Number, default: 0 },
    viernes: { type: Number, default: 0 },
    sabado: { type: Number, default: 0 },
    domingo: { type: Number, default: 0 },
  },
});

// Crear índices en los campos de cantidad para cada día
articuloClienteSchema.index({ "cantidad.lunes": 1 });
articuloClienteSchema.index({ "cantidad.martes": 1 });
articuloClienteSchema.index({ "cantidad.miercoles": 1 });
articuloClienteSchema.index({ "cantidad.jueves": 1 });
articuloClienteSchema.index({ "cantidad.viernes": 1 });
articuloClienteSchema.index({ "cantidad.sabado": 1 });
articuloClienteSchema.index({ "cantidad.domingo": 1 });

const ArticuloCliente = mongoose.model(
  "ArticuloCliente",
  articuloClienteSchema
);

export default ArticuloCliente;
