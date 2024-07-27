import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const RepartosContext = createContext();

export const RepartosProvider = ({ children }) => {
  const [repartos, setRepartos] = useState([]);
  const [reparto, setReparto] = useState({});
  const [error, setError] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());

  const obtenerRepartos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/repartos");
      setRepartos(response.data);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    obtenerRepartos();
  }, []);

  const guardarReparto = async (nuevoReparto) => {
    try {
      console.log(
        "Datos recibidos para guardar:",
        JSON.stringify(nuevoReparto, null, 2)
      );

      const { data } = await axios.post(
        "http://localhost:3000/api/repartos/",
        nuevoReparto,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRepartos((prevRepartos) => [...prevRepartos, data]);
    } catch (error) {
      console.error("Error al guardar repartos:", error);
      setError(error.response?.data?.error || error.message);
    }
  };

  const actualizarPagoCompletoEnBackend = async (
    repartoId,
    clienteId,
    pagadoCompleto,
    montoPagado,
    deuda
  ) => {
    try {
      console.log(
        `Actualizando pago completo: repartoId=${repartoId}, clienteId=${clienteId}, pagadoCompleto=${pagadoCompleto}, montoPagado=${montoPagado}, deuda=${deuda}`
      );
      const response = await axios.put(
        `http://localhost:3000/api/repartos/${repartoId}/clientes/${clienteId}/pago`,
        { pagadoCompleto, montoPagado, deuda },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el pago completo:", error);
      throw error;
    }
  };

  const guardarMontoPagadoEnBackend = async (
    repartoId,
    clienteId,
    montoPagado,
    deuda
  ) => {
    try {
      console.log(
        `Guardando monto pagado: repartoId=${repartoId}, clienteId=${clienteId}, montoPagado=${montoPagado}, deuda=${deuda}`
      );
      const response = await axios.put(
        `http://localhost:3000/api/repartos/${repartoId}/clientes/${clienteId}/monto`,
        { montoPagado, deuda },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al guardar el monto pagado:", error);
      throw error;
    }
  };

  const registrarDevolucionEnBackend = async (
    repartoId,
    clienteId,
    articuloId,
    cantidadDevuelta,
    deuda,
    fechaDevolucion
  ) => {
    try {
      console.log(
        `Registrando devolución: repartoId=${repartoId}, clienteId=${clienteId}, articuloId=${articuloId}, cantidadDevuelta=${cantidadDevuelta}, deuda=${deuda}, fechaDevolucion=${fechaDevolucion}`
      );
      const response = await axios.put(
        `http://localhost:3000/api/repartos/${repartoId}/clientes/${clienteId}/articulos/${articuloId}/devolucion`,
        { cantidadDevuelta, deuda, fechaDevolucion },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al registrar la devolución:", error);
      throw error;
    }
  };

  const setEditando = (reparto) => {
    setReparto(reparto);
  };

  const eliminarReparto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/repartos/${id}`);
      setRepartos((prevRepartos) =>
        prevRepartos.filter((reparto) => reparto._id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el reparto:", error);
    }
  };

  return (
    <RepartosContext.Provider
      value={{
        repartos,
        obtenerRepartos,
        guardarReparto,
        setEditando,
        reparto,
        eliminarReparto,
        error,
        setFechaActual,
        actualizarPagoCompletoEnBackend,
        guardarMontoPagadoEnBackend,
        registrarDevolucionEnBackend,
      }}
    >
      {children}
    </RepartosContext.Provider>
  );
};

export default RepartosContext;
