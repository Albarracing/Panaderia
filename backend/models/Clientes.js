import mongoose from "mongoose";
//import autopopulate from "mongoose-autopopulate";

const clienteSchema = new mongoose.Schema({
  codigo: { type: Number, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  direccion: { type: String, required: true },
  celular: { type: Number, required: true },
  descuento: { type: Number, require: true },
  vuelta: { type: Number, require: true },
  tipoCliente: { type: String, enum: ["lista", "individual"], required: true },
  localidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Localidad",
    required: true,
  },
  deudaAcumulada: { type: Number, default: 0 },
});

clienteSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastCliente = await this.constructor.findOne(
      {},
      {},
      { sort: { codigo: -1 } }
    );
    this.codigo = lastCliente ? lastCliente.codigo + 1 : 1;
  }
  next();
});

//clienteSchema.plugin(autopopulate);

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;
