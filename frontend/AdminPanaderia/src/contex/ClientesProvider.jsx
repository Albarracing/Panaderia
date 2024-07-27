// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const ClientesContext = createContext();

// export const ClientesProvider = ({ children }) => {
//   const [clientes, setClientes] = useState([]);
//   const [cliente, setCliente] = useState({});
//   const [error, setError] = useState(null);

//   const obtenerClientes = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/api/clientes");
//       const data = await response.json();
//       console.log("Datos obtenidos:", data);
//       setClientes(data);
//     } catch (error) {
//       console.error("Error al obtener clientes:", error);
//       setClientes([]);
//     }
//   };

//   const guardarCliente = async (clienteData, id) => {
//     try {
//       const url = id
//         ? `http://localhost:3000/api/clientes/${id}`
//         : "http://localhost:3000/api/clientes";
//       const method = id ? "PUT" : "POST";
//       const { data } = await axios({
//         method: method,
//         url: url,
//         data: clienteData,
//       });
//       if (!id) {
//         setClientes([...clientes, data.cliente]);
//       } else {
//         setClientes(
//           clientes.map((cliente) =>
//             cliente._id === id ? data.cliente : cliente
//           )
//         );
//       }

//       return data;
//     } catch (error) {
//       console.error("Error al guardar cliente:", error.response.data);
//       throw error;
//     }
//   };

//   const setEditando = (cliente) => {
//     setCliente(cliente);
//   };

//   const eliminarCliente = async (id) => {
//     try {
//       if (!id) {
//         throw new Error("ID no proporcionado");
//       }

//       const url = `http://localhost:3000/api/clientes/${id}`;
//       const { data } = await axios.delete(url);
//       setClientes(clientes.filter((cliente) => cliente._id !== id));
//       return data;
//     } catch (error) {
//       console.error(`Error al eliminar el cliente con ID: ${id}`, error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     obtenerClientes();
//   }, []);

//   return (
//     <ClientesContext.Provider
//       value={{
//         clientes,
//         obtenerClientes,
//         guardarCliente,
//         setEditando,
//         cliente,
//         eliminarCliente,
//       }}
//     >
//       {children}
//     </ClientesContext.Provider>
//   );
// };

// export default ClientesContext;

//-----------------------aca--------------------

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState({});
  const [error, setError] = useState(null);

  const obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  const guardarCliente = async (clienteData, id) => {
    try {
      const url = id
        ? `http://localhost:3000/api/clientes/${id}`
        : "http://localhost:3000/api/clientes";
      const method = id ? "PUT" : "POST";
      const { data } = await axios({
        method: method,
        url: url,
        data: clienteData, // No anidamos clienteData en cliente
      });
      if (!id) {
        setClientes([...clientes, data.cliente]);
      } else {
        setClientes(
          clientes.map((cliente) =>
            cliente._id === id ? data.cliente : cliente
          )
        );
      }

      return data;
    } catch (error) {
      console.error("Error al guardar cliente:", error.response.data); // Log detallado del error
      throw error;
    }
  };

  const setEditando = (cliente) => {
    setCliente(cliente);
  };

  const eliminarCliente = async (id) => {
    try {
      if (!id) {
        throw new Error("ID no proporcionado");
      }

      const url = "http://localhost:3000/api/clientes/${id}";
      const { data } = await axios.delete(url);
      setClientes(clientes.filter((cliente) => cliente._id !== id));
      return data;
    } catch (error) {
      console.error(`Error al eliminar el cliente con ID: ${id}, error`);
      throw error;
    }
  };
  useEffect(() => {
    obtenerClientes();
  }, []);

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        obtenerClientes,
        guardarCliente,
        setEditando,
        cliente,
        eliminarCliente,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};
export default ClientesContext;
