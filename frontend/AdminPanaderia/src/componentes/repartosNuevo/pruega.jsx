// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// const ListaClientes = () => {
//   const [clientes, setClientes] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [localidades, setLocalidades] = useState([]);
//   const [repartidores, setRepartidores] = useState([]);
//   const [alias, setAlias] = useState("");
//   const [selectedRepartidor, setSelectedRepartidor] = useState("");
//   const [selectedLocalidad, setSelectedLocalidad] = useState("");
//   const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
//   const [cantidadesEditadas, setCantidadesEditadas] = useState({});
//   const [totalPedido, setTotalPedido] = useState(0);
//   const [totalPorCliente, setTotalPorCliente] = useState({});
//   const [repartoId, setRepartoId] = useState("");
//   useEffect(() => {
//     obtenerClientes();
//     obtenerRepartidores();
//   }, []);

//   const obtenerClientes = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/api/clientes/");
//       setClientes(response.data);

//       const uniqueLocalidades = [
//         ...new Set(response.data.map(({ cliente }) => cliente.localidad)),
//       ];
//       setLocalidades(uniqueLocalidades);

//       const cantidadesPreenlazadas = {};
//       response.data.forEach(({ cliente }) => {
//         cliente.articulo.forEach((articulo) => {
//           if (!cantidadesPreenlazadas[cliente._id]) {
//             cantidadesPreenlazadas[cliente._id] = {};
//           }
//           cantidadesPreenlazadas[cliente._id][articulo.articuloId] =
//             articulo.cantidad;
//         });
//       });
//       setCantidadesEditadas(cantidadesPreenlazadas);
//     } catch (error) {
//       console.error("Error al obtener clientes:", error);
//     }
//   };
//   const obtenerRepartidores = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/repertidores"
//       );
//       setRepartidores(response.data);
//     } catch (error) {
//       console.error("Error al obtener repartidores:", error);
//     }
//   };
//   const handleLocalidadChange = (e) => {
//     setSelectedLocalidad(e.target.value);
//   };

//   const handleCheckboxChange = (clienteId) => {
//     setClientesSeleccionados((prevSeleccionados) =>
//       prevSeleccionados.includes(clienteId)
//         ? prevSeleccionados.filter((id) => id !== clienteId)
//         : [...prevSeleccionados, clienteId]
//     );
//   };

//   const handleCantidadChange = (clienteId, articuloId, cantidad) => {
//     setCantidadesEditadas((prevCantidades) => ({
//       ...prevCantidades,
//       [clienteId]: {
//         ...prevCantidades[clienteId],
//         [articuloId]: cantidad !== "" ? cantidad : undefined,
//       },
//     }));
//     calcularImporteCliente(clienteId);
//   };
//   const handleRepartidorChange = (e) => {
//     const repartidorId = e.target.value; // Obtén el _id del repartidor seleccionado
//     setSelectedRepartidor(repartidorId); // Actualiza el estado con el _id del repartidor
//     const repartidorSeleccionado = repartidores.find(
//       (rep) => rep._id === repartidorId
//     );
//     setAlias(repartidorSeleccionado.alias); // Actualiza el alias del repartidor seleccionado
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (clientesSeleccionados.length === 0) {
//         alert(
//           "Por favor seleccione al menos un cliente antes de crear el reparto."
//         );
//         return;
//       }
//       if (!selectedRepartidor) {
//         alert("Por favor seleccione un repartidor antes de crear el reparto.");
//         return;
//       }
//       const clientesArticulos = clientesSeleccionados.map((clienteId) => {
//         const articulos = Object.keys(cantidadesEditadas[clienteId] || {}).map(
//           (articuloId) => {
//             return {
//               articulo: articuloId,
//               cantidad: parseInt(cantidadesEditadas[clienteId][articuloId], 10),
//             };
//           }
//         );
//         return {
//           cliente: clienteId,
//           articulos: articulos,
//           montoPagado: 0,
//           pagadoCompleto: false,
//         };
//       });

//       const data = {
//         clientesArticulos: clientesArticulos,
//         fecha: selectedDate.toISOString(),
//         repartidor: selectedRepartidor,
//         alias: alias,
//       };

//       console.log("Datos a enviar:", data);

//       const response = await axios.post(
//         "http://localhost:3000/api/repartos",
//         data
//       );

//       console.log("Reparto guardado:", response.data);
//       alert("Reparto creado exitosamente");
//     } catch (error) {
//       console.error(
//         "Error al guardar el reparto:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const calcularImporteCliente = (clienteId) => {
//     const importeTotalCliente = Object.keys(
//       cantidadesEditadas[clienteId] || {}
//     ).reduce((acc, articuloId) => {
//       const cantidad = cantidadesEditadas[clienteId][articuloId];
//       const precio = clientes
//         .find((cliente) => cliente._id === clienteId)
//         .articulo.find(
//           (articulo) => articulo.articuloId === articuloId
//         ).precio_uni;
//       return acc + (cantidad || 0) * precio;
//     }, 0);

//     // Actualizar el importe total del cliente
//     setTotalPorCliente((prevTotalPorCliente) => ({
//       ...prevTotalPorCliente,
//       [clienteId]: importeTotalCliente,
//     }));

//     // Actualizar el importe total del reparto
//     setTotalPedido((prevTotal) =>
//       Object.values({
//         ...prevTotalPorCliente,
//         [clienteId]: importeTotalCliente,
//       }).reduce((acc, val) => acc + val, 0)
//     );
//   };
//   const handleGeneratePDF = async () => {
//     const input = document.getElementById("reparto-details");
//     if (!input) {
//       console.error("No se encontró el elemento con el ID 'reparto-details'");
//       return;
//     }

//     try {
//       const pdf = new jsPDF();
//       const canvas = await html2canvas(input);
//       const imgData = canvas.toDataURL("image/png");
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`reparto_${repartoId}.pdf`);
//     } catch (error) {
//       console.error("Error al generar el PDF:", error);
//     }
//   };
//   const clientesFiltrados = selectedLocalidad
//     ? clientes.filter(({ cliente }) => cliente.localidad === selectedLocalidad)
//     : clientes;

//   return (
//     <div className="container mx-auto p-4" id="reparto-details">
//       <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
//       <Link to="/RepartosNuevo">
//         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//           Volver
//         </button>
//       </Link>
//       <div className="flex">
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Seleccionar fecha:
//           </label>
//           <DatePicker
//             selected={selectedDate}
//             onChange={(date) => setSelectedDate(date)}
//             className="w-full px-3 py-2 border rounded-md"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Filtrar por localidad:
//           </label>
//           <select
//             value={selectedLocalidad}
//             onChange={handleLocalidadChange}
//             className="w-full px-3 py-2 border rounded-md"
//           >
//             <option value="">Todas las localidades</option>
//             {localidades.map((localidad) => (
//               <option key={localidad} value={localidad}>
//                 {localidad}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Seleccionar repartidor:
//           </label>
//           <select
//             value={selectedRepartidor}
//             onChange={handleRepartidorChange}
//             className="w-full px-3 py-2 border rounded-md"
//           >
//             <option value="">Seleccionar repartidor</option>
//             {repartidores.map((repartidor) => (
//               <option key={repartidor._id} value={repartidor._id}>
//                 {repartidor.alias}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div className="space-y-4">
//           {clientesFiltrados.length === 0 ? (
//             <div className="text-red-500">No hay clientes disponibles</div>
//           ) : (
//             clientesFiltrados.map(({ cliente }) => (
//               <div
//                 key={cliente._id}
//                 className="border px-3 rounded-md shadow-md"
//               >
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`cliente-${cliente._id}`}
//                     className="mr-3"
//                     checked={clientesSeleccionados.includes(cliente._id)}
//                     onChange={() => handleCheckboxChange(cliente._id)}
//                   />
//                   <label
//                     htmlFor={`cliente-${cliente._id}`}
//                     className="text-xl font-semibold"
//                   >
//                     {cliente.nombre} {cliente.apellido}
//                   </label>
//                 </div>
//                 <p className="text-gray-600">{cliente.localidad}</p>
//                 <div className="flex flex-row">
//                   {cliente.articulo.map((articulo) => (
//                     <div key={articulo.articuloId} className="">
//                       <div className="flex items-center">
//                         <span className="">{articulo.nombre}:</span>
//                         <input
//                           type="number"
//                           value={
//                             cantidadesEditadas[cliente._id]?.[
//                               articulo.articuloId
//                             ] || ""
//                           }
//                           onChange={(e) =>
//                             handleCantidadChange(
//                               cliente._id,
//                               articulo.articuloId,
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="text-gray-700 font-semibold">
//                   Total Cliente: ${totalPorCliente[cliente._id] || 0}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//         <div className="flex justify-end mt-5">
//           <div className="text-gray-700 font-semibold mr-5">
//             Total Pedido: ${totalPedido}
//           </div>

//           <button
//             type="submit"
//             className="bg-indigo-700 w-64 py-3 rounded-lg text-white uppercase font-bold hover:cursor-pointer"
//           >
//             Guardar Reparto
//           </button>
//         </div>
//       </form>
//       <button
//         type="button"
//         onClick={handleGeneratePDF}
//         className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//       >
//         Generar PDF
//       </button>
//     </div>
//   );
// };

// export default ListaClientes;
