// const testSchema = Join.object({
//   articulo: Join.array(
//     Join.object({
//       productoId: Join.string().required(),
//       cantidad: Join.number().required(),
//     })
//   ),
// });

// {

//     "fecha": "2024/03/23",
//     "cod_personal": 2,
//     "cod_localidades": 2,
//     "precio": 17000,
//     "cantidad": 16,
//     "devuelve": 3,
//     "cod_orden": 2,
//     "cliente":"65e213050a423b2001d8e808",
//     "articulo":["65d3b7437d68a19b7b574f2e"]

// }

//       <form onSubmit={handleSubmit}>
//         <button
//           type="submit"
//           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 mt-5 ml-5 px-4 rounded"
//         >
//           Guardar
//         </button>

//         <table className="table-auto w-full mt-5">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="">Cliente</th>
//               <th className="px-4 py-2">Artículo</th>
//               <th className="px-4 py-2">Cantidad</th>
//             </tr>
//           </thead>

//---formulario de repartos antes de agregar el calculo de el importe-----
// import React, { useState, useEffect } from "react";
// import useClientes from "../../hook/useClientes";
// import useArticulos from "../../hook/useArticulos";
// import useRepartos from "../../hook/useRepartos";
// import { Link } from "react-router-dom";
// const FormularioReparto = () => {
//   const { guardarReparto, error } = useRepartos();
//   const { clientes } = useClientes();
//   const { articulos } = useArticulos();
//   const [formState, setFormState] = useState([]);

//   useEffect(() => {
//     const initialFormState = clientes.map((cliente) => ({
//       clienteId: cliente._id,
//       articulos: articulos.map((articulo) => ({
//         articuloId: articulo._id,
//         cantidad: 0,
//       })),
//     }));
//     setFormState(initialFormState);
//   }, [clientes, articulos]);

//   const handleInputChange = (clienteId, articuloId, value) => {
//     setFormState((prevState) => {
//       return prevState.map((reparto) => {
//         if (reparto.clienteId === clienteId) {
//           return {
//             ...reparto,
//             articulos: reparto.articulos.map((articulo) => {
//               if (articulo.articuloId === articuloId) {
//                 return { ...articulo, cantidad: value };
//               }
//               return articulo;
//             }),
//           };
//         }
//         return reparto;
//       });
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const clientesArticulos = formState.map((reparto) => ({
//         cliente: reparto.clienteId,
//         articulos: reparto.articulos.map((articulo) => ({
//           articulo: articulo.articuloId,
//           cantidad: articulo.cantidad,
//         })),
//       }));
//       const nuevoReparto = { clientesArticulos };

//       // Agregar console.log para depuración
//       console.log("Datos enviados:", JSON.stringify(nuevoReparto, null, 2));

//       await guardarReparto(nuevoReparto);
//       alert("Reparto creado exitosamente");
//     } catch (error) {
//       console.error("Error al crear el reparto", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h1 className="text-2xl font-bold mb-4">Formulario de Pedidos</h1>
//       <div>
//         <Link to="/RepartosNuevo">
//           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mt-5 ml-5 px-4 rounded">
//             Volver
//           </button>
//         </Link>
//       </div>
//       <form onSubmit={handleSubmit}>
//         {error && <div className="text-red-500">{error}</div>}
//         <table className="  w-full mt-5">
//           <tr className="  w-full bg-gray-500 h-10 py-4">
//             <th className="absolute  left-10">Cliente</th>
//             <th className="absolute left-52">Producto</th>
//             <th className="absolute left-80">Cantidad</th>
//           </tr>

//           <tbody className="">
//             {clientes.map((cliente) => (
//               <React.Fragment key={cliente._id}>
//                 <div className="border-b flex flex-row items-center">
//                   <tr className="bg-white even:bg-gray-200">
//                     <td className="" colSpan={3}>
//                       {cliente.nombre} {cliente.apellido}
//                     </td>
//                   </tr>
//                   <td className=" flex flex-row items-center px-4">
//                     {articulos.map((articulo) => (
//                       <tr key={articulo._id} className="">
//                         <td className="py-2  mr-4 mb-2"></td>
//                         <td className="py-2  mr-4 mb-2">{articulo.nombre}:</td>
//                         <td className="py-2">
//                           <input
//                             type="number"
//                             className="w-12 rounded-md focus:outline-none border border-black bg-white"
//                             value={
//                               formState
//                                 .find(
//                                   (stateReparto) =>
//                                     stateReparto.clienteId === cliente._id
//                                 )
//                                 ?.articulos.find(
//                                   (a) => a.articuloId === articulo._id
//                                 )?.cantidad || ""
//                             }
//                             onChange={(e) =>
//                               handleInputChange(
//                                 cliente._id,
//                                 articulo._id,
//                                 parseInt(e.target.value, 10) || 0
//                               )
//                             }
//                           />
//                         </td>
//                       </tr>
//                     ))}
//                   </td>
//                 </div>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//         <button
//           type="submit"
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded absolute right-2"
//         >
//           Crear Reparto
//         </button>
//       </form>
//     </div>
//   );
// };

// export default FormularioReparto;

//----funcion para crear repartos antes de incorporar la fecha
// const crearReparto = async (req, res) => {
//   const { clientesArticulos } = req.body;

//   try {
//     // Obtiene todos los artículos una vez para evitar múltiples consultas a la base de datos
//     const todosLosArticulos = await Articulos.find();

//     // Calcular el total del reparto
//     let totalReparto = 0;

//     // Mapear los datos correctamente para que coincidan con el esquema de Mongoose
//     const clientesArticulosConTotales = clientesArticulos.map(
//       (clienteArticulo) => {
//         let totalCliente = 0;

//         const articulosConImportes = clienteArticulo.articulos.map(
//           (articulo) => {
//             const articuloInfo = todosLosArticulos.find((a) =>
//               a._id.equals(articulo.articulo)
//             );
//             const importe = articulo.cantidad * articuloInfo.precio_uni;
//             totalCliente += importe;
//             return {
//               articuloId: articulo.articulo,
//               cantidad: articulo.cantidad,
//               importe: importe, // Almacena el importe calculado
//             };
//           }
//         );

//         totalReparto += totalCliente;

//         return {
//           clienteId: clienteArticulo.cliente,
//           articulos: articulosConImportes,
//           totalCliente: totalCliente, // Almacena el total por cliente
//         };
//       }
//     );

//     const repartoAlmacenado = new Repartos({
//       clientesArticulos: clientesArticulosConTotales,
//       totalReparto: totalReparto, // Almacena el total general del reparto
//       fecha: new Date(), // Añade la fecha actual al reparto
//     });

//     await repartoAlmacenado.save();
//     res.json("Reparto almacenado con clientes y artículos asignados");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error interno del servidor");
//   }
// };
