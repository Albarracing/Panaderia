import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

const ListaClientes = ({ setShouldUpdate }) => {
  const [clientes, setClientes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [localidades, setLocalidades] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [alias, setAlias] = useState("");
  const [selectedRepartidor, setSelectedRepartidor] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [cantidadesEditadas, setCantidadesEditadas] = useState({});
  const [repartoId, setRepartoId] = useState("");
  const [articulos, setArticulos] = useState([]);
  const [totalPedido, setTotalPedido] = useState(0);
  const [totalPorCliente, setTotalPorCliente] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const navigate = useNavigate();
  registerLocale("es", es);
  useEffect(() => {
    obtenerArticulos();
    obtenerClientes();
    obtenerRepartidores();
    obtenerLocalidades();
  }, []);

  const obtenerArticulos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/articulos/");
      setArticulos(response.data);
    } catch (error) {
      console.error("Error al obtener artículos:", error);
    }
  };

  const obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clientes/");
      console.log("Clientes obtenidos:", response.data); // Depuración
      if (!Array.isArray(response.data)) {
        console.error("Datos de clientes inválidos:", response.data);
        return;
      }
      setClientes(response.data);
      setFilteredClientes(response.data); // Inicializar con todos los clientes
      inicializarCantidadesEditadas(response.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const obtenerRepartidores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/repartidores"
      );
      setRepartidores(response.data);
    } catch (error) {
      console.error("Error al obtener repartidores:", error);
    }
  };

  const obtenerLocalidades = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/localidades/"
      );
      console.log("Localidades obtenidas:", response.data); // Depuración
      setLocalidades(response.data);
    } catch (error) {
      console.error("Error al obtener localidades:", error);
    }
  };

  const inicializarCantidadesEditadas = (clientes) => {
    const inicial = {};
    clientes.forEach((cliente) => {
      if (!cliente || !cliente._id) {
        console.error("Cliente inválido:", cliente);
        return; // Salta este cliente si no tiene un _id válido
      }
      inicial[cliente._id] = {};
      if (cliente.articulo && Array.isArray(cliente.articulo)) {
        cliente.articulo.forEach((articulo) => {
          if (!articulo || !articulo.articuloId || !articulo.articuloId._id) {
            console.error(
              "Artículo inválido para el cliente:",
              cliente._id,
              articulo
            );
            return; // Salta este artículo si no tiene un articuloId._id válido
          }
          inicial[cliente._id][articulo.articuloId._id] =
            articulo.cantidad[selectedDay] || 0;
        });
      } else {
        console.error("Cliente sin artículos válidos:", cliente._id);
      }
    });
    setCantidadesEditadas(inicial);
  };

  const handleLocalidadChange = (e) => {
    const localidadId = e.target.value;
    setSelectedLocalidad(localidadId);
    console.log("Localidad seleccionada:", localidadId);

    if (localidadId) {
      const clientesFiltrados = clientes.filter((cliente) => {
        return cliente.localidad && cliente.localidad._id === localidadId;
      });
      console.log("Clientes filtrados:", clientesFiltrados);
      setFilteredClientes(clientesFiltrados);
    } else {
      setFilteredClientes(clientes);
    }
  };

  const handleCheckboxChange = (clienteId) => {
    setClientesSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(clienteId)
        ? prevSeleccionados.filter((id) => id !== clienteId)
        : [...prevSeleccionados, clienteId]
    );
  };

  const handleCantidadChange = (clienteId, articuloId, cantidad) => {
    setCantidadesEditadas((prevCantidades) => ({
      ...prevCantidades,
      [String(clienteId)]: {
        ...prevCantidades[String(clienteId)],
        [String(articuloId)]: cantidad !== "" ? parseInt(cantidad, 10) : 0,
      },
    }));
  };

  const obtenerCantidadPorDia = (clienteId, articuloId) => {
    const clienteData = clientes.find(
      (clienteObj) => clienteObj._id === clienteId
    );
    if (clienteData && clienteData.articulo) {
      const articulo = clienteData.articulo.find(
        (art) => String(art.articuloId._id) === String(articuloId)
      );
      return articulo ? articulo.cantidad[selectedDay] : 0;
    }
    return 0;
  };

  const handleRepartidorChange = (e) => {
    const repartidorId = e.target.value;
    setSelectedRepartidor(repartidorId);
    const repartidorSeleccionado = repartidores.find(
      (rep) => rep._id === repartidorId
    );
    setAlias(repartidorSeleccionado.alias);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (clientesSeleccionados.length === 0) {
        alert(
          "Por favor seleccione al menos un cliente antes de crear el reparto."
        );
        return;
      }
      if (!selectedRepartidor) {
        alert("Por favor seleccione un repartidor antes de crear el reparto.");
        return;
      }

      console.log("Clientes seleccionados:", clientesSeleccionados);

      const clientesArticulos = clientesSeleccionados
        .map((clienteId) => {
          const cliente = clientes.find((c) => c._id === clienteId);
          if (!cliente) {
            console.error(`Cliente con ID ${clienteId} no encontrado`);
            return null;
          }

          console.log(`Cliente encontrado: ${cliente.nombre}`);

          const articulos = cliente.articulo
            .map((articulo) => {
              const cantidad =
                cantidadesEditadas[String(clienteId)]?.[
                  String(articulo.articuloId._id)
                ] || articulo.cantidad[selectedDay];
              console.log(
                `Artículo ID: ${String(
                  articulo.articuloId._id
                )}, Cantidad: ${cantidad}`
              );
              return {
                articulo: String(articulo.articuloId._id), // Aquí se asegura de que solo el ID del artículo se envíe
                cantidad: parseInt(cantidad, 10),
              };
            })
            .filter((art) => art.cantidad > 0); // Filtrar artículos con cantidad > 0

          console.log(
            `Artículos para el cliente ${cliente.nombre}:`,
            articulos
          );

          return {
            cliente: String(clienteId),
            localidad: String(cliente.localidad._id), // Incluye la localidad
            articulos: articulos,
            montoPagado: 0,
            pagadoCompleto: false,
          };
        })
        .filter((ca) => ca !== null && ca.articulos.length > 0); // Filtrar nulos y clientes sin artículos

      if (clientesArticulos.length === 0) {
        alert("No se encontraron artículos para los clientes seleccionados.");
        return;
      }

      const data = {
        clientesArticulos: clientesArticulos,
        fecha: selectedDate.toISOString(),
        repartidor: String(selectedRepartidor),
        alias: alias,
      };

      console.log(
        "Datos que se enviarán al backend:",
        JSON.stringify(data, null, 2)
      );

      const response = await axios.post(
        "http://localhost:3000/api/repartos",
        data
      );

      alert("Reparto creado exitosamente");
    } catch (error) {
      console.error(
        "Error al guardar el reparto:",
        error.response ? error.response.data : error.message
      );
    }
    // Trigger update
    setShouldUpdate(true);

    // Navegar a la tabla de repartos
    navigate("/RepartosNuevo");
  };

  const getDayOfWeek = (date) => {
    const daysOfWeek = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];
    return daysOfWeek[date.getDay()];
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dayOfWeek = getDayOfWeek(date);
    setSelectedDay(dayOfWeek);
    inicializarCantidadesEditadas(clientes); // Actualizar cantidades editadas al cambiar la fecha
  };

  console.log("Clientes filtrados:", filteredClientes);
  useEffect(() => {
    console.log("Estado cantidadesEditadas:", cantidadesEditadas);
  }, [cantidadesEditadas]);

  return (
    <div
      className="container mx-auto p-6 bg-white rounded-md shadow-md"
      id="reparto-details"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Clientes</h1>
      <div className="flex justify-between mb-6">
        <Link to="/RepartosNuevo">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Volver
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Seleccionar fecha:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Filtrar por localidad:
          </label>
          <select
            value={selectedLocalidad}
            onChange={handleLocalidadChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Seleccionar localidad</option>
            {localidades.map((localidad) => (
              <option key={localidad._id} value={localidad._id}>
                {localidad.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Seleccionar repartidor:
          </label>
          <select
            value={selectedRepartidor}
            onChange={handleRepartidorChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Seleccionar repartidor</option>
            {repartidores.map((repartidor) => (
              <option key={repartidor._id} value={repartidor._id}>
                {repartidor.nombre} - {repartidor.alias}
              </option>
            ))}
          </select>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {filteredClientes.length === 0 ? (
            <div className="text-red-500">
              Elige una localidad para ver los clientes
            </div>
          ) : (
            filteredClientes.map((cliente) => (
              <div
                key={cliente._id}
                className="border p-4 rounded-md shadow-md"
              >
                <div className="flex items-center mb-0">
                  <input
                    type="checkbox"
                    id={`cliente-${cliente._id}`}
                    className="mr-2 transform scale-150"
                    checked={clientesSeleccionados.includes(cliente._id)}
                    onChange={() => handleCheckboxChange(cliente._id)}
                  />
                  <label
                    htmlFor={`cliente-${cliente._id}`}
                    className="text-xl font-semibold"
                  >
                    {cliente.nombre} {cliente.apellido}
                  </label>
                </div>
                <div className="flex flex-wrap gap-4">
                  {cliente.articulo.map((articulo) => (
                    <div
                      key={articulo.articuloId._id}
                      className="flex items-center space-x-2"
                    >
                      <span>{articulo.nombre}:</span>
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border rounded-md"
                        value={
                          cantidadesEditadas[cliente._id]?.[
                            articulo.articuloId._id
                          ] ||
                          obtenerCantidadPorDia(
                            cliente._id,
                            articulo.articuloId._id
                          )
                        }
                        onChange={(e) =>
                          handleCantidadChange(
                            cliente._id,
                            articulo.articuloId._id,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-6 rounded"
          >
            Guardar Reparto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListaClientes;
