// import useClientes from "../hook/useClientes";

// const Cliente = ({ cliente }) => {
//   const { setEditando, eliminarCliente } = useClientes();
//   const { nombre, apellido, direccion, celular, _id } = cliente;

//   const formatearFecha = (fecha) => {
//     if (!fecha) {
//       return "";
//     }
//     const nuevaFecha = new Date(fecha);
//     return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
//       nuevaFecha
//     );
//   };
//   return (
//     <div>
//       <div className="mx-5 my-7 bg-slate-50 shadow-md px-5 py-1 rounded-xl">
//         <p className="font-bold uppercase text-indigo-600 my-2">
//           Nombre: {""}
//           <span className="font-normal normal-case text-black">{nombre}</span>
//         </p>
//         <p className="font-bold uppercase text-indigo-600 my-2">
//           Apellido: {""}{" "}
//           <span className="font-normal normal-case text-black">{apellido}</span>{" "}
//         </p>
//         <p className="font-bold uppercase text-indigo-600 my-2">
//           Fecha de alta: {""}
//           <span className="font-normal normal-case text-black">
//             {formatearFecha(fecha_alta)}
//           </span>
//         </p>{" "}
//         <p className="font-bold uppercase text-indigo-600 my-2">
//           Direccion: {""}{" "}
//           <span className="font-normal normal-case text-black">
//             {direccion}
//           </span>{" "}
//         </p>
//         <p className="font-bold uppercase text-indigo-600 my-2">
//           Celular: {""}{" "}
//           <span className="font-normal normal-case text-black">{celular}</span>{" "}
//         </p>
//         <div className="flex justify-between my-5">
//           <button
//             type="button"
//             className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold rounded-lg"
//             onClick={() => setEditando(cliente)}
//           >
//             Editar
//           </button>

//           <button
//             type="button"
//             className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white uppercase font-bold rounded-lg"
//             onClick={() => eliminarCliente(_id)}
//           >
//             Eliminar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cliente;
