import mongoose from "mongoose";
//import AutoIncrementFactory from "mongoose-sequence";

//const AutoIncrement = AutoIncrementFactory(mongoose);
const precioSchema = new mongoose.Schema({
  localidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Localidad",
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
});

const articuloSchema = new mongoose.Schema({
  codigo: { type: String, required: false, unique: true },
  nombre: {
    type: String,
    required: true,
  },
  precios: [
    {
      localidad: { type: mongoose.Schema.Types.ObjectId, ref: "Localidad" },
      precio: { type: Number, required: true },
    },
  ],
  unidad: {
    type: String,
    required: true,
  },
  precioMostrador: {
    type: Number,
    required: true,
  },
  lugarPreparacion: {
    type: Number,
    required: true,
  },
  precios: [precioSchema],
});
//articuloSchema.plugin(AutoIncrement, { inc_field: "codigo" });
const Articulos = mongoose.model("Articulos", articuloSchema);

export default Articulos;
