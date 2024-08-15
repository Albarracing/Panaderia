import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useClientes from "../hook/useClientes";
import FormularioCliente from "./FormularioCliente";
import PopupCliente from "./PopupCliente";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ListadoDeClientes = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const {
    clientes = [],
    eliminarCliente,
    obtenerClientes,
    setEditando,
  } = useClientes();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    obtenerClientes();
  }, [refresh]);

  const handleOpenPopup = (cliente = null) => {
    if (cliente) {
      setEditando(cliente);
      setSelectedCliente(cliente);
    } else {
      setEditando(null);
      setSelectedCliente(null);
    }
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCliente(null);
  };

  const handleFormSubmit = async (clienteData) => {
    if (selectedCliente) {
      await editarCliente(clienteData); // Asegúrate de tener la función editarCliente definida en tu hook useClientes
    } else {
      await crearCliente(clienteData); // Asegúrate de tener la función crearCliente definida en tu hook useClientes
    }
    setRefresh((prev) => prev + 1); // Refresca la lista de clientes
    handleClosePopup();
  };

  const handleClickEliminar = (clienteId) => {
    setClienteAEliminar(clienteId);
    setShowWarning(true);
  };

  const confirmEliminar = async () => {
    if (clienteAEliminar) {
      await eliminarCliente(clienteAEliminar);
      setRefresh((prev) => prev + 1); // Refresca la lista de clientes
      setShowWarning(false);
      setClienteAEliminar(null);
    }
  };

  const cancelEliminar = () => {
    setShowWarning(false);
    setClienteAEliminar(null);
  };

  const validClients = clientes.filter((cliente) => cliente);

  return (
    <>
      <div className="flex mb-4">
        <div className="flex space-x-4">
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver
          </Link>
          <button
            onClick={() => handleOpenPopup()}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded absolute right-4"
          >
            +
          </button>
        </div>
      </div>

      <PopupCliente isOpen={isPopupOpen} onClose={handleClosePopup}>
        <FormularioCliente
          cliente={selectedCliente}
          onSubmit={handleFormSubmit}
          onClose={handleClosePopup}
        />
      </PopupCliente>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 py-2 text-center border">Cod</th>
            <th className="px-2 py-2 text-center border">Nombre</th>
            <th className="px-2 py-2 text-center border">Apellido</th>
            <th className="px-2 py-2 text-center border">Localidad</th>
            <th className="px-2 py-2 text-center border">Dirección</th>
            <th className="px-2 py-2 text-center border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {validClients.map((cliente) => (
            <tr key={cliente._id} className="bg-white even:bg-gray-100">
              <td className="px-5 py-2 text-center border text-black">
                {cliente.codigo || "Código no disponible"}
              </td>
              <td className="px-5 py-2 text-center border">
                {cliente.nombre || "Nombre no disponible"}
              </td>
              <td className="px-5 py-2 text-center border">
                {cliente.apellido || "Apellido no disponible"}
              </td>
              <td className="px-5 py-2 text-center border">
                {cliente.localidad && cliente.localidad.nombre
                  ? cliente.localidad.nombre
                  : "Sin localidad"}
              </td>
              <td className="px-5 py-2 text-center border">
                {cliente.direccion || "Dirección no disponible"}
              </td>
              <td className="flex justify-center space-x-2">
                <button
                  onClick={() => handleOpenPopup(cliente)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                </button>
                <button
                  onClick={() => handleClickEliminar(cliente._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar este cliente?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmEliminar}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sí
              </button>
              <button
                onClick={cancelEliminar}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListadoDeClientes;

//------------aca-----------
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import useClientes from "../hook/useClientes";
// import FormularioCliente from "./FormularioCliente";
// import PopupCliente from "./PopupCliente";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

// const ListadoDeClientes = () => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedCliente, setSelectedCliente] = useState(null);
//   const [showWarning, setShowWarning] = useState(false);
//   const [clienteAEliminar, setClienteAEliminar] = useState(null);
//   const {
//     clientes = [],
//     eliminarCliente,
//     obtenerClientes,
//     setEditando,
//   } = useClientes();

//   const [refresh, setRefresh] = useState(0);

//   useEffect(() => {
//     console.log("Estado de clientes:", clientes);
//   }, [clientes]);

//   useEffect(() => {
//     obtenerClientes();
//   }, [refresh]);

//   useEffect(() => {
//     console.log("Clientes en ListadoDeClientes:", clientes);
//   }, [clientes]);

//   const handleOpenPopup = (cliente = null) => {
//     setSelectedCliente(cliente);
//     setEditando(cliente);
//     setIsPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//     setSelectedCliente(null);
//   };

//   const handleFormSubmit = (clienteData) => {
//     setIsPopupOpen(false);
//     setSelectedCliente(null);
//     setRefresh((prev) => prev + 1);
//   };

//   const handleClickEliminar = (clienteId) => {
//     setClienteAEliminar(clienteId);
//     setShowWarning(true);
//   };

//   const confirmEliminar = async () => {
//     if (clienteAEliminar) {
//       await eliminarCliente(clienteAEliminar);
//       setRefresh((prev) => prev + 1);
//       setShowWarning(false);
//       setClienteAEliminar(null);
//     }
//   };

//   const cancelEliminar = () => {
//     setShowWarning(false);
//     setClienteAEliminar(null);
//   };
//   const validClients = clientes.filter((cliente) => cliente);
//   return (
//     <>
//       <div className="flex mb-4">
//         <div className="flex space-x-4">
//           <Link
//             to="/"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Volver
//           </Link>

//           <button
//             onClick={() => handleOpenPopup()}
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded absolute right-4"
//           >
//             +
//           </button>

//           <PopupCliente isOpen={isPopupOpen} onClose={handleClosePopup}>
//             <FormularioCliente
//               cliente={selectedCliente}
//               onSubmit={handleFormSubmit}
//               onClose={handleClosePopup}
//             />
//           </PopupCliente>
//         </div>
//       </div>

//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="px-2 py-2 text-center border">Cod</th>
//             <th className="px-2 py-2 text-center border">Nombre</th>
//             <th className="px-2 py-2 text-center border">Apellido</th>
//             <th className="px-2 py-2 text-center border">Localidad</th>
//             <th className="px-2 py-2 text-center border">Dirección</th>
//             <th className="px-2 py-2 text-center border">Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {validClients.map((cliente) => (
//             <tr key={cliente._id} className="bg-white even:bg-gray-100">
//               <td className="px-5 py-2 text-center border text-black">
//                 {cliente && cliente.codigo
//                   ? cliente.codigo
//                   : "Código no disponible"}
//               </td>
//               <td className="px-5 py-2 text-center border">
//                 {cliente && cliente.nombre
//                   ? cliente.nombre
//                   : "Nombre no disponible"}
//               </td>
//               <td className="px-5 py-2 text-center border">
//                 {cliente && cliente.apellido
//                   ? cliente.apellido
//                   : "apellido no disponible"}
//               </td>
//               <td className="px-5 py-2 text-center border">
//                 {cliente && cliente.localidad && cliente.localidad.nombre
//                   ? cliente.localidad.nombre
//                   : "Sin localidad"}
//               </td>

//               <td className="px-5 py-2 text-center border">
//                 {cliente && cliente.direccion
//                   ? cliente.direccion
//                   : "direccion no disponible"}
//               </td>
//               <td className="flex justify-center space-x-2">
//                 <button
//                   onClick={() => handleOpenPopup(cliente)}
//                   className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center"
//                 >
//                   <FontAwesomeIcon icon={faEdit} className="mr-1" />
//                 </button>
//                 <button
//                   onClick={() => handleClickEliminar(cliente._id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center"
//                 >
//                   <FontAwesomeIcon icon={faTrash} className="mr-1" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showWarning && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-4 rounded shadow-md text-center">
//             <p className="mb-4">
//               ¿Estás seguro de que deseas eliminar este cliente?
//             </p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={confirmEliminar}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
//               >
//                 Sí
//               </button>
//               <button
//                 onClick={cancelEliminar}
//                 className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
// export default ListadoDeClientes;
