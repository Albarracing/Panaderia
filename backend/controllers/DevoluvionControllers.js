// import Devoluciones from "../models/Devolucion.js";
// import Repartos from "../models/Repartos.js";
// import Cliente from "../models/Clientes.js";
// import Articulos from "../models/Articulos.js";

// const registrarDevolucion = async (req, res) => {
//   const { repartoId, clienteId, articuloId, cantidadDevuelta } = req.body;

//   try {
//     if (
//       !repartoId ||
//       !clienteId ||
//       !articuloId ||
//       cantidadDevuelta === undefined
//     ) {
//       return res.status(400).json({ message: "Faltan datos necesarios" });
//     }

//     // Obtener el reparto y el cliente en el reparto
//     const reparto = await Repartos.findById(repartoId).populate(
//       "clientesArticulos.clienteId"
//     );
//     if (!reparto) {
//       return res.status(404).json({ message: "Reparto no encontrado" });
//     }

//     const clienteArticulo = reparto.clientesArticulos.find(
//       (ca) => ca.clienteId._id.toString() === clienteId
//     );
//     if (!clienteArticulo) {
//       return res
//         .status(404)
//         .json({ message: "Cliente no encontrado en este reparto" });
//     }

//     const localidadCliente = clienteArticulo.clienteId.localidad;

//     // Obtener el artículo
//     const articulo = await Articulos.findById(articuloId);
//     if (!articulo) {
//       return res.status(404).json({ message: "Artículo no encontrado" });
//     }

//     // Encontrar el precio del artículo para la localidad del cliente
//     const precioInfo = articulo.precios.find(
//       (p) => p.localidad.toString() === localidadCliente.toString()
//     );
//     if (!precioInfo) {
//       return res.status(400).json({
//         message: "Precio no encontrado para la localidad del cliente",
//       });
//     }

//     const precioUnitario = precioInfo.precio;
//     const importeDevuelto = cantidadDevuelta * precioUnitario;

//     const fechaActual = new Date(); // Establecer la fecha actual

//     const nuevaDevolucion = new Devoluciones({
//       repartoId,
//       clienteId,
//       articuloId,
//       cantidadDevuelta,
//       importeDevuelto,
//       fechaDevolucion: fechaActual,
//       fechaEntrega: fechaActual,
//       importeReintegrado: false,
//     });

//     await nuevaDevolucion.save();

//     const cliente = await Cliente.findById(clienteId);
//     if (!cliente) {
//       return res.status(404).json({ message: "Cliente no encontrado" });
//     }

//     cliente.deudaAcumulada -= importeDevuelto;
//     if (cliente.deudaAcumulada < 0) {
//       cliente.creditoDisponible = Math.abs(cliente.deudaAcumulada);
//       cliente.deudaAcumulada = 0;
//     } else {
//       cliente.creditoDisponible += importeDevuelto;
//     }

//     await cliente.save();

//     // Actualizar el reparto con la nueva devolución
//     reparto.devoluciones.push(nuevaDevolucion._id);
//     await reparto.save();

//     res.json({
//       message: "Devolución registrada y crédito actualizado",
//       nuevaDevolucion,
//     });
//   } catch (error) {
//     console.error("Error al registrar la devolución:", error);
//     res.status(500).json({
//       message: "Error al registrar la devolución",
//       error: error.message,
//     });
//   }
// };

// const crearPedidoConCredito = async (req, res) => {
//   const { clienteId, articulos, fecha, repartidor, alias } = req.body;

//   try {
//     const cliente = await Cliente.findById(clienteId);
//     if (!cliente) {
//       return res.status(404).json({ message: "Cliente no encontrado" });
//     }

//     const totalImporte = articulos.reduce(
//       (acc, articulo) => acc + articulo.importe,
//       0
//     );
//     let importeAPagar = totalImporte;

//     if (cliente.creditoDisponible > 0) {
//       if (cliente.creditoDisponible >= totalImporte) {
//         cliente.creditoDisponible -= totalImporte;
//         importeAPagar = 0;
//       } else {
//         importeAPagar -= cliente.creditoDisponible;
//         cliente.creditoDisponible = 0;
//       }
//     }

//     const nuevoPedido = new Repartos({
//       clientesArticulos: [
//         {
//           clienteId,
//           articulos,
//           totalCliente: totalImporte,
//           deuda: importeAPagar,
//         },
//       ],
//       totalReparto: totalImporte,
//       fecha: new Date(fecha),
//       repartidor,
//       alias,
//     });

//     await nuevoPedido.save();
//     await cliente.save();

//     res.json({
//       message: "Pedido creado con éxito y crédito aplicado",
//       nuevoPedido,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error al crear el pedido", error: error.message });
//   }
// };

// export { registrarDevolucion, crearPedidoConCredito };
