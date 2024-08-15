import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import Modal from "react-modal";

const ListaClientes = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const [articuloAdicional, setArticuloAdicional] = useState("");
  const [cantidadAdicional, setCantidadAdicional] = useState(0);
  const [articulosAdicionales, setArticulosAdicionales] = useState({});

  const navigate = useNavigate();

  registerLocale("es", es);
  useEffect(() => {
    obtenerArticulos();
    //  obtenerClientes();
    obtenerClientesConArticulos();
    obtenerRepartidores();
    obtenerLocalidades();
  }, []);

  useEffect(() => {
    if (selectedLocalidad) {
      const clientesFiltrados = clientes.filter(
        (cliente) => cliente.localidad._id === selectedLocalidad
      );
      setFilteredClientes(clientesFiltrados);
    } else {
      setFilteredClientes(clientes); // Mostrar todos los clientes si no se ha seleccionado una localidad
    }
  }, [selectedLocalidad, clientes]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await obtenerClientesConArticulos();
        console.log("Datos recibidos del backend:", respuesta); // Aquí colocas el console.log
        // Aquí procesas los datos y actualizas el estado
        setClientes(respuesta.data);
      } catch (error) {
        console.error("Error al obtener datos del backend", error);
      }
    }
    fetchData();
  }, []);

  const obtenerArticulos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/articulos");
      setArticulos(response.data); // Almacena todos los artículos en el estado
    } catch (error) {
      console.error("Error al obtener artículos:", error);
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

  const obtenerClientesConArticulos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/clientes/clientes-con-articulos"
      );
      if (!Array.isArray(response.data)) {
        console.error("Datos de clientes inválidos:", response.data);
        return;
      }
      setClientes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener clientes con artículos:", error);
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    const daysOfWeek = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    const day = daysOfWeek[date.getDay()];
    setSelectedDay(day);

    console.log(`Día seleccionado: ${day}`); // Log para confirmar el día seleccionado

    // Re-inicializar las cantidades editadas para el nuevo día
    try {
      const response = await axios.get(
        `http://localhost:3000/api/clientes/cantidades/${day}`
      );
      const cantidades = response.data;

      console.log("Cantidades obtenidas:", cantidades); // Log para verificar datos recibidos

      // Actualizar el estado con las cantidades obtenidas
      const cantidadesEditadas = {};
      cantidades.forEach((item) => {
        if (!cantidadesEditadas[item.clienteId]) {
          cantidadesEditadas[item.clienteId] = {};
        }
        // Puedes usar el nombre del artículo como clave si es necesario
        // Aquí se está utilizando el `nombre` como clave
        cantidadesEditadas[item.clienteId][item.nombre] = item.cantidad;
      });
      setCantidadesEditadas(cantidadesEditadas);

      console.log("Cantidades editadas actualizadas:", cantidadesEditadas); // Log para verificar el estado actualizado
    } catch (error) {
      console.error("Error al obtener las cantidades:", error);
    }
  };

  const handleCantidadChange = (clienteId, articuloId, value) => {
    const cantidadNumerica = parseInt(value, 10);

    // Verifica si el valor es válido
    if (isNaN(cantidadNumerica)) {
      console.error(
        `Cantidad inválida para el artículo ${articuloId} del cliente ${clienteId}:`,
        value
      );
      return;
    }

    setCantidadesEditadas((prevState) => ({
      ...prevState,
      [clienteId]: {
        ...prevState[clienteId],
        [articuloId]: cantidadNumerica,
      },
    }));
  };

  // const handleCantidadChange = (clienteId, articuloId, value) => {
  //   const cantidadNumerica = parseInt(value, 10);

  //   // Verifica si el valor es válido
  //   if (isNaN(cantidadNumerica)) {
  //     console.error(
  //       `Cantidad inválida para el artículo ${articuloId} del cliente ${clienteId}:`,
  //       value
  //     );
  //     return;
  //   }

  //   setCantidadesEditadas((prevState) => ({
  //     ...prevState,
  //     [clienteId]: {
  //       ...prevState[clienteId],
  //       [articuloId]: cantidadNumerica,
  //     },
  //   }));
  // };

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

    const clientesArticulos = clientesSeleccionados
      .map((clienteId) => {
        const cliente = clientes.find((c) => c._id === clienteId);
        if (!cliente) {
          console.error(`Cliente con ID ${clienteId} no encontrado`);
          return null;
        }

        const articulos = (cliente.articulos || [])
          .map((articulo) => {
            // Obtener la cantidad editada del estado
            const cantidadEditada =
              cantidadesEditadas[String(clienteId)]?.[
                String(articulo.articuloId._id)
              ] || 0;

            // La cantidad por defecto para el artículo y el día seleccionado
            const cantidadPorDefecto = articulo.cantidad[selectedDay] || 0;

            // La cantidad total es la cantidad editada si está disponible, o la cantidad por defecto si no se ha editado
            const cantidadTotal =
              cantidadEditada > 0 ? cantidadEditada : cantidadPorDefecto;

            // Filtrar artículos con cantidad total menor o igual a 0
            if (cantidadTotal <= 0) return null;

            return {
              articulo: String(articulo.articuloId._id),
              cantidad: cantidadTotal,
            };
          })
          .filter((art) => art !== null);

        if (articulos.length === 0) return null;

        return {
          cliente: String(clienteId),
          localidad: String(cliente.localidad._id),
          articulos: articulos,
          montoPagado: 0,
          pagadoCompleto: false,
        };
      })
      .filter((ca) => ca !== null && ca.articulos.length > 0);

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

    try {
      await axios.post("http://localhost:3000/api/repartos", data);
      alert("Reparto creado exitosamente");
      navigate("/RepartosNuevo");
    } catch (error) {
      console.error(
        "Error al guardar el reparto:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (clientesSeleccionados.length === 0) {
  //     alert(
  //       "Por favor seleccione al menos un cliente antes de crear el reparto."
  //     );
  //     return;
  //   }
  //   if (!selectedRepartidor) {
  //     alert("Por favor seleccione un repartidor antes de crear el reparto.");
  //     return;
  //   }

  //   const clientesArticulos = clientesSeleccionados
  //     .map((clienteId) => {
  //       const cliente = clientes.find((c) => c._id === clienteId);
  //       if (!cliente) {
  //         console.error(`Cliente con ID ${clienteId} no encontrado`);
  //         return null;
  //       }

  //       const articulos = (cliente.articulos || [])
  //         .map((articulo) => {
  //           const cantidadGuardada =
  //             cantidadesEditadas[String(clienteId)]?.[
  //               String(articulo.articuloId._id)
  //             ] || 0;
  //           const cantidadTotal =
  //             cantidadGuardada + (articulo.cantidad[selectedDay] || 0);
  //           if (cantidadTotal <= 0) return null;
  //           return {
  //             articulo: String(articulo.articuloId._id),
  //             cantidad: cantidadTotal,
  //           };
  //         })
  //         .filter((art) => art !== null);

  //       if (articulos.length === 0) return null;

  //       return {
  //         cliente: String(clienteId),
  //         localidad: String(cliente.localidad._id),
  //         articulos: articulos,
  //         montoPagado: 0,
  //         pagadoCompleto: false,
  //       };
  //     })
  //     .filter((ca) => ca !== null && ca.articulos.length > 0);

  //   if (clientesArticulos.length === 0) {
  //     alert("No se encontraron artículos para los clientes seleccionados.");
  //     return;
  //   }

  //   const data = {
  //     clientesArticulos: clientesArticulos,
  //     fecha: selectedDate.toISOString(),
  //     repartidor: String(selectedRepartidor),
  //     alias: alias,
  //   };

  //   try {
  //     await axios.post("http://localhost:3000/api/repartos", data);
  //     alert("Reparto creado exitosamente");
  //     navigate("/RepartosNuevo");
  //   } catch (error) {
  //     console.error(
  //       "Error al guardar el reparto:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  // };

  const openModal = (clienteId) => {
    setSelectedClienteId(clienteId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClienteId(null);
    setArticuloAdicional("");
    setCantidadAdicional(0);
  };

  const obtenerArticulosFaltantes = (clienteArticulos) => {
    // Extrae los IDs de los artículos que tiene el cliente
    const articuloIdsCliente = clienteArticulos.map((a) => a.articuloId._id);

    // Filtra los artículos que no están en la lista del cliente
    return articulos.filter((art) => !articuloIdsCliente.includes(art._id));
  };

  const handleArticuloAdicionalChange = (articuloId, cantidad) => {
    setArticulosAdicionales((prev) => ({
      ...prev,
      [articuloId]: cantidad,
    }));
  };

  const handleAddArticuloAdicional = () => {
    if (selectedClienteId && Object.keys(articulosAdicionales).length > 0) {
      const clienteIndex = filteredClientes.findIndex(
        (cliente) => cliente._id === selectedClienteId
      );

      if (clienteIndex !== -1) {
        const updatedClientes = [...filteredClientes];
        const cliente = updatedClientes[clienteIndex];

        Object.keys(articulosAdicionales).forEach((articuloAdicional) => {
          const cantidadAdicional = articulosAdicionales[articuloAdicional];

          if (cantidadAdicional > 0) {
            // Verifica si el artículo ya existe en la lista del cliente
            const articuloExists = cliente.articulos.some(
              (a) => a.articuloId?._id === articuloAdicional
            );

            if (!articuloExists) {
              cliente.articulos.push({
                articuloId: { _id: articuloAdicional },
                nombre: articulos.find((art) => art._id === articuloAdicional)
                  ?.nombre,
                cantidad: { [selectedDate]: cantidadAdicional },
              });

              setCantidadesEditadas((prevCantidades) => ({
                ...prevCantidades,
                [String(selectedClienteId)]: {
                  ...prevCantidades[String(selectedClienteId)],
                  [articuloAdicional]: cantidadAdicional,
                },
              }));
            }
          }
        });

        setFilteredClientes(updatedClientes);
        closeModal();
      }
    } else {
      alert("Por favor seleccione una cantidad válida para los artículos.");
    }
  };

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
            <div className="text-red-500">No hay clientes disponibles.</div>
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      openModal(cliente._id);
                    }}
                    className="ml-2 p-1 w-8 bg-green-500 text-white rounded"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-4">
                  {Array.isArray(cliente.articulos) &&
                  cliente.articulos.length > 0 ? (
                    cliente.articulos.map((articulo) => {
                      const articuloNombre =
                        articulo.articuloId?.nombre || articulo.nombre;

                      if (!articulo || !articuloNombre) {
                        console.error(
                          `Artículo inválido para el cliente: ${cliente._id}`,
                          articulo
                        );
                        return null;
                      }

                      // Obtener la cantidad guardada para el día seleccionado
                      const cantidadGuardada =
                        cliente.articulos.find(
                          (art) =>
                            art.articuloId._id === articulo.articuloId._id
                        )?.cantidad[selectedDay] || 0;

                      // Obtener la cantidad editada si existe
                      const cantidadEditada =
                        cantidadesEditadas[cliente._id]?.[
                          articulo.articuloId._id
                        ] || 0;

                      // Cantidad final que se muestra en el input
                      const cantidadMostrar =
                        cantidadEditada > 0
                          ? cantidadEditada
                          : cantidadGuardada;

                      return (
                        <div
                          key={articulo.articuloId._id}
                          className="flex items-center space-x-2"
                        >
                          <span>{articuloNombre}:</span>
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border rounded-md"
                            value={cantidadMostrar}
                            onChange={(e) =>
                              handleCantidadChange(
                                cliente._id,
                                articulo.articuloId._id,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p>No hay artículos disponibles para este cliente.</p>
                  )}
                </div>

                {/* <div className="flex flex-wrap gap-4">
                  {Array.isArray(cliente.articulos) &&
                  cliente.articulos.length > 0 ? (
                    cliente.articulos.map((articulo) => {
                      const articuloNombre =
                        articulo.articuloId?.nombre || articulo.nombre;

                      if (!articulo || !articuloNombre) {
                        console.error(
                          `Artículo inválido para el cliente: ${cliente._id}`,
                          articulo
                        );
                        return null;
                      }

                      // Obtener la cantidad guardada para el día seleccionado
                      const cantidadGuardada =
                        cantidadesEditadas[cliente._id]?.[articuloNombre] || 0;

                      // Obtener la cantidad adicional que se ha agregado
                      const cantidadAdicional =
                        articulosAdicionales[articulo.articuloId._id] || 0;

                      // Combina la cantidad guardada y la cantidad adicional
                      const cantidadTotal =
                        cantidadGuardada + cantidadAdicional;

                      console.log(
                        `Cliente: ${cliente._id}, Artículo: ${articuloNombre}, Día: ${selectedDay}, Cantidad Total: ${cantidadTotal}`
                      );
                      console.log(
                        `Cantidad guardada: ${cantidadGuardada}, Cantidad adicional: ${cantidadAdicional}`
                      );

                      return (
                        <div
                          key={articuloNombre}
                          className="flex items-center space-x-2"
                        >
                          <span>{articuloNombre}:</span>


                          <input
                            type="number"
                            className="w-20 px-2 py-1 border rounded-md"
                            value={cantidadTotal}
                            onChange={(e) =>
                              handleCantidadChange(
                                cliente._id,
                                articuloNombre,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p>No hay artículos disponibles para este cliente.</p>
                  )}
                </div> */}
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Seleccionar Artículo Adicional"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            Seleccionar Artículo Adicional
          </h2>
          <div className="space-y-4">
            {articulos
              .filter((art) => {
                const cliente = filteredClientes.find(
                  (c) => c._id === selectedClienteId
                );
                return (
                  cliente &&
                  !cliente.articulos.some((a) => a.articuloId?._id === art._id)
                );
              })
              .map((art) => (
                <div
                  key={art._id}
                  className="flex items-center justify-between space-x-2"
                >
                  <span className="text-lg">{art.nombre}</span>
                  <input
                    type="number"
                    value={articulosAdicionales[art._id] || ""}
                    onChange={(e) =>
                      handleArticuloAdicionalChange(
                        art._id,
                        parseInt(e.target.value, 10)
                      )
                    }
                    placeholder="Cantidad"
                    className="w-24 px-2 py-1 border rounded-md text-center"
                  />
                </div>
              ))}
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={handleAddArticuloAdicional}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Agregar Artículo
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListaClientes;

// //------------aca-------
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import DatePicker, { registerLocale } from "react-datepicker";
// import es from "date-fns/locale/es";

// const ListaClientes = ({ setShouldUpdate }) => {
//   const [clientes, setClientes] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [localidades, setLocalidades] = useState([]);
//   const [filteredClientes, setFilteredClientes] = useState([]);
//   const [repartidores, setRepartidores] = useState([]);
//   const [alias, setAlias] = useState("");
//   const [selectedRepartidor, setSelectedRepartidor] = useState("");
//   const [selectedLocalidad, setSelectedLocalidad] = useState("");
//   const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
//   const [cantidadesEditadas, setCantidadesEditadas] = useState({});
//   const [repartoId, setRepartoId] = useState("");
//   const [articulos, setArticulos] = useState([]);
//   const [totalPedido, setTotalPedido] = useState(0);
//   const [totalPorCliente, setTotalPorCliente] = useState({});
//   const [selectedDay, setSelectedDay] = useState("");
//   const navigate = useNavigate();
//   registerLocale("es", es);
//   useEffect(() => {
//     obtenerArticulos();
//     obtenerClientes();
//     obtenerRepartidores();
//     obtenerLocalidades();
//   }, []);

//   const obtenerArticulos = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/api/articulos/");
//       setArticulos(response.data);
//     } catch (error) {
//       console.error("Error al obtener artículos:", error);
//     }
//   };

//   const obtenerClientes = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/api/clientes/");
//       console.log("Clientes obtenidos:", response.data); // Depuración
//       if (!Array.isArray(response.data)) {
//         console.error("Datos de clientes inválidos:", response.data);
//         return;
//       }
//       setClientes(response.data);
//       setFilteredClientes(response.data); // Inicializar con todos los clientes
//       inicializarCantidadesEditadas(response.data);
//     } catch (error) {
//       console.error("Error al obtener clientes:", error);
//     }
//   };

//   const obtenerRepartidores = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/repartidores"
//       );
//       setRepartidores(response.data);
//     } catch (error) {
//       console.error("Error al obtener repartidores:", error);
//     }
//   };

//   const obtenerLocalidades = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/localidades/"
//       );
//       console.log("Localidades obtenidas:", response.data); // Depuración
//       setLocalidades(response.data);
//     } catch (error) {
//       console.error("Error al obtener localidades:", error);
//     }
//   };

//   const inicializarCantidadesEditadas = (clientes) => {
//     const inicial = {};
//     clientes.forEach((cliente) => {
//       if (!cliente || !cliente._id) {
//         console.error("Cliente inválido:", cliente);
//         return; // Salta este cliente si no tiene un _id válido
//       }
//       inicial[cliente._id] = {};
//       if (cliente.articulo && Array.isArray(cliente.articulo)) {
//         cliente.articulo.forEach((articulo) => {
//           if (!articulo || !articulo.articuloId || !articulo.articuloId._id) {
//             console.error(
//               "Artículo inválido para el cliente:",
//               cliente._id,
//               articulo
//             );
//             return; // Salta este artículo si no tiene un articuloId._id válido
//           }
//           inicial[cliente._id][articulo.articuloId._id] =
//             articulo.cantidad[selectedDay] || 0;
//         });
//       } else {
//         console.error("Cliente sin artículos válidos:", cliente._id);
//       }
//     });
//     setCantidadesEditadas(inicial);
//   };

//   const handleLocalidadChange = (e) => {
//     const localidadId = e.target.value;
//     setSelectedLocalidad(localidadId);
//     console.log("Localidad seleccionada:", localidadId);

//     if (localidadId) {
//       const clientesFiltrados = clientes.filter((cliente) => {
//         return cliente.localidad && cliente.localidad._id === localidadId;
//       });
//       console.log("Clientes filtrados:", clientesFiltrados);
//       setFilteredClientes(clientesFiltrados);
//     } else {
//       setFilteredClientes(clientes);
//     }
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
//       [String(clienteId)]: {
//         ...prevCantidades[String(clienteId)],
//         [String(articuloId)]: cantidad !== "" ? parseInt(cantidad, 10) : 0,
//       },
//     }));
//   };

//   const obtenerCantidadPorDia = (clienteId, articuloId) => {
//     const clienteData = clientes.find(
//       (clienteObj) => clienteObj._id === clienteId
//     );
//     if (clienteData && clienteData.articulo) {
//       const articulo = clienteData.articulo.find(
//         (art) => String(art.articuloId._id) === String(articuloId)
//       );
//       return articulo ? articulo.cantidad[selectedDay] : 0;
//     }
//     return 0;
//   };

//   const handleRepartidorChange = (e) => {
//     const repartidorId = e.target.value;
//     setSelectedRepartidor(repartidorId);
//     const repartidorSeleccionado = repartidores.find(
//       (rep) => rep._id === repartidorId
//     );
//     setAlias(repartidorSeleccionado.alias);
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

//       console.log("Clientes seleccionados:", clientesSeleccionados);

//       const clientesArticulos = clientesSeleccionados
//         .map((clienteId) => {
//           const cliente = clientes.find((c) => c._id === clienteId);
//           if (!cliente) {
//             console.error(`Cliente con ID ${clienteId} no encontrado`);
//             return null;
//           }

//           console.log(`Cliente encontrado: ${cliente.nombre}`);

//           const articulos = cliente.articulo
//             .map((articulo) => {
//               const cantidad =
//                 cantidadesEditadas[String(clienteId)]?.[
//                   String(articulo.articuloId._id)
//                 ] || articulo.cantidad[selectedDay];
//               console.log(
//                 `Artículo ID: ${String(
//                   articulo.articuloId._id
//                 )}, Cantidad: ${cantidad}`
//               );
//               return {
//                 articulo: String(articulo.articuloId._id), // Aquí se asegura de que solo el ID del artículo se envíe
//                 cantidad: parseInt(cantidad, 10),
//               };
//             })
//             .filter((art) => art.cantidad > 0); // Filtrar artículos con cantidad > 0

//           console.log(
//             `Artículos para el cliente ${cliente.nombre}:`,
//             articulos
//           );

//           return {
//             cliente: String(clienteId),
//             localidad: String(cliente.localidad._id), // Incluye la localidad
//             articulos: articulos,
//             montoPagado: 0,
//             pagadoCompleto: false,
//           };
//         })
//         .filter((ca) => ca !== null && ca.articulos.length > 0); // Filtrar nulos y clientes sin artículos

//       if (clientesArticulos.length === 0) {
//         alert("No se encontraron artículos para los clientes seleccionados.");
//         return;
//       }

//       const data = {
//         clientesArticulos: clientesArticulos,
//         fecha: selectedDate.toISOString(),
//         repartidor: String(selectedRepartidor),
//         alias: alias,
//       };

//       console.log(
//         "Datos que se enviarán al backend:",
//         JSON.stringify(data, null, 2)
//       );

//       const response = await axios.post(
//         "http://localhost:3000/api/repartos",
//         data
//       );

//       alert("Reparto creado exitosamente");
//     } catch (error) {
//       console.error(
//         "Error al guardar el reparto:",
//         error.response ? error.response.data : error.message
//       );
//     }
//     // Trigger update
//     setShouldUpdate(true);

//     // Navegar a la tabla de repartos
//     navigate("/RepartosNuevo");
//   };

//   const getDayOfWeek = (date) => {
//     const daysOfWeek = [
//       "lunes",
//       "martes",
//       "miercoles",
//       "jueves",
//       "viernes",
//       "sabado",
//       "domingo",
//     ];
//     return daysOfWeek[date.getDay()];
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     const dayOfWeek = getDayOfWeek(date);
//     setSelectedDay(dayOfWeek);
//     inicializarCantidadesEditadas(clientes); // Actualizar cantidades editadas al cambiar la fecha
//   };

//   console.log("Clientes filtrados:", filteredClientes);
//   useEffect(() => {
//     console.log("Estado cantidadesEditadas:", cantidadesEditadas);
//   }, [cantidadesEditadas]);

//   return (
//     <div
//       className="container mx-auto p-6 bg-white rounded-md shadow-md"
//       id="reparto-details"
//     >
//       <h1 className="text-3xl font-bold mb-6 text-center">Lista de Clientes</h1>
//       <div className="flex justify-between mb-6">
//         <Link to="/RepartosNuevo">
//           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//             Volver
//           </button>
//         </Link>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block text-gray-700 font-bold mb-2">
//             Seleccionar fecha:
//           </label>
//           <DatePicker
//             selected={selectedDate}
//             onChange={handleDateChange}
//             locale="es"
//             dateFormat="dd/MM/yyyy"
//             className="w-full px-3 py-2 border rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-bold mb-2">
//             Filtrar por localidad:
//           </label>
//           <select
//             value={selectedLocalidad}
//             onChange={handleLocalidadChange}
//             className="w-full px-3 py-2 border rounded-md"
//           >
//             <option value="">Seleccionar localidad</option>
//             {localidades.map((localidad) => (
//               <option key={localidad._id} value={localidad._id}>
//                 {localidad.nombre}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-gray-700 font-bold mb-2">
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
//                 {repartidor.nombre} - {repartidor.alias}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div className="space-y-6">
//           {filteredClientes.length === 0 ? (
//             <div className="text-red-500">
//               Elige una localidad para ver los clientes
//             </div>
//           ) : (
//             filteredClientes.map((cliente) => (
//               <div
//                 key={cliente._id}
//                 className="border p-4 rounded-md shadow-md"
//               >
//                 <div className="flex items-center mb-0">
//                   <input
//                     type="checkbox"
//                     id={`cliente-${cliente._id}`}
//                     className="mr-2 transform scale-150"
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
//                 {/* ---aca-- */}
//                 <div className="flex flex-wrap gap-4">
//                   {cliente.articulo.map((articulo, index) => {
//                     if (!articulo.articuloId || !articulo.articuloId._id) {
//                       console.error(
//                         `Artículo inválido para el cliente: ${cliente._id}`,
//                         articulo
//                       );
//                       return null;
//                     }

//                     return (
//                       <div
//                         key={articulo.articuloId._id}
//                         className="flex items-center space-x-2"
//                       >
//                         <span>{articulo.nombre}:</span>
//                         <input
//                           type="number"
//                           className="w-20 px-2 py-1 border rounded-md"
//                           value={
//                             cantidadesEditadas[cliente._id]?.[
//                               articulo.articuloId._id
//                             ] ||
//                             obtenerCantidadPorDia(
//                               cliente._id,
//                               articulo.articuloId._id
//                             )
//                           }
//                           onChange={(e) =>
//                             handleCantidadChange(
//                               cliente._id,
//                               articulo.articuloId._id,
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//         <div className="flex justify-end mt-6">
//           <button
//             type="submit"
//             className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-6 rounded"
//           >
//             Guardar Reparto
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ListaClientes;
