import mongoose from "mongoose";

const RepartidorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  alias: { type: String, required: true },
});

const Repartidor = mongoose.model("Repartidor", RepartidorSchema);

export default Repartidor;
