import mongoose from "mongoose";

const LocalidadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  codigoPostal: { type: Number, required: false },
});

const Localidad = mongoose.model("Localidad", LocalidadSchema);

export default Localidad;
