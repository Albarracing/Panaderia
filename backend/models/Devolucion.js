// import mongoose from "mongoose";

// const devolucionSchema = new mongoose.Schema({
//   repartoId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Repartos",
//     required: true,
//   },
//   clienteId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Cliente",
//     required: true,
//   },
//   articuloId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Articulos",
//     required: true,
//   },
//   cantidadDevuelta: {
//     type: Number,
//     required: true,
//   },
//   importeDevuelto: {
//     type: Number,
//     required: true,
//   },
//   fechaDevolucion: {
//     type: Date,
//     required: true,
//   },
//   fechaEntrega: {
//     type: Date,
//     required: true,
//   },
//   importeReintegrado: {
//     type: Boolean,
//     default: false,
//   },
// });

// const Devoluciones = mongoose.model("Devoluciones", devolucionSchema);

// export default Devoluciones;
