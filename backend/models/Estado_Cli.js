import mongoose from "mongoose";

const Estado_CliSchema = mongoose.Schema(
  {
    fecha_desde: {
      type: Date,
    },
    fecha_hasta: {
      type: Date,
    },
    precio_final: {
      type: Number,
    },
    cantidad: {
      type: Number,
    },
    devuelve: {
      type: Number,
    },
    total: {
      type: Number,
    },
    saldo: {
      type: Number,
    },
    cliente: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
      },
    ],
    reparto: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reparto",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Estado_cli = mongoose.model("Estado_cli", Estado_CliSchema);

export default Estado_cli;
