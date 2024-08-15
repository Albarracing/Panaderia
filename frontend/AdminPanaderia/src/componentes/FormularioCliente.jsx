//------aca-----
import React, { useEffect, useState } from "react";
import Alerta from "./Alerta";
import useClientes from "../hook/useClientes";
import axios from "axios";

const FormularioCliente = ({ onClose }) => {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [celular, setCelular] = useState("");
  const [localidadId, setLocalidadId] = useState("");
  const [localidadNombre, setLocalidadNombre] = useState("");
  const [descuento, setDescuento] = useState("");
  const [vuelta, setVuelta] = useState("");
  const [tipoCliente, setTipoCliente] = useState("lista");
  const [productos, setProductos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [id, setId] = useState(null);
  const { guardarCliente, actualizarCliente } = useClientes();
  const [localidades, setLocalidades] = useState([]);
  const { obtenerCliente, cliente, articulos, obtenerArticulosCliente } =
    useClientes();

  useEffect(() => {
    if (id) {
      obtenerCliente(id); // Obtener cliente y artículos cuando id cambia
    }
  }, [id]);

  useEffect(() => {
    if (cliente?._id) {
      setCodigo(cliente.codigo || "");
      setNombre(cliente.nombre);
      setApellido(cliente.apellido);
      setDireccion(cliente.direccion);
      setCelular(cliente.celular);
      setLocalidadId(cliente.localidadId);
      setLocalidadNombre(cliente.localidadNombre);
      setDescuento(cliente.descuento);
      setVuelta(cliente.vuelta);
      setTipoCliente(cliente.tipoCliente || "lista");
      setId(cliente._id);

      // Obtener los artículos y cantidades del cliente
      obtenerArticulosCliente(cliente._id)
        .then((articulos) => {
          setProductos(
            articulos.map((articulo) => ({
              _id: articulo.articuloId,
              nombre: articulo.nombre,
              cantidad: articulo.cantidad,
            }))
          );
        })
        .catch((error) => {
          console.error("Error al cargar los artículos del cliente:", error);
        });
    }
  }, [cliente]);

  useEffect(() => {
    const obtenerLocalidades = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/localidades"
        );
        setLocalidades(response.data); // Actualiza el estado con las localidades obtenidas del backend
      } catch (error) {
        console.log(error);
      }
    };
    obtenerLocalidades();
  }, []);

  const handleLocalidadChange = (e) => {
    const localidadId = e.target.value;
    const localidad = localidades.find((loc) => loc._id === localidadId);
    if (localidad) {
      setLocalidadId(localidadId);
      setLocalidadNombre(localidad.nombre); // Actualiza el nombre de la localidad seleccionada
    }
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/articulos");
        setProductos((prevProductos) =>
          prevProductos.length === 0
            ? data.map((producto) => ({
                ...producto,
                articuloId: producto._id,
                cantidad: {
                  lunes: 0,
                  martes: 0,
                  miercoles: 0,
                  jueves: 0,
                  viernes: 0,
                  sabado: 0,
                  domingo: 0,
                },
              }))
            : prevProductos
        );
      } catch (error) {
        console.log(error);
      }
    };
    obtenerProductos();
  }, []);

  useEffect(() => {
    if (!id) {
      const obtenerCodigo = async () => {
        try {
          const { data } = await axios.get(
            "http://localhost:3000/api/clientes/"
          );
          setCodigo(data.codigo); // Obtener el código generado desde el backend
        } catch (error) {
          console.log(error);
        }
      };
      obtenerCodigo();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos necesarios estén presentes y sean válidos
    if (
      [
        nombre,
        apellido,
        direccion,
        celular,
        localidadId,
        localidadNombre,
        descuento,
        vuelta,
        tipoCliente,
      ].some((campo) => typeof campo === "string" && campo.trim() === "") ||
      !localidadId ||
      !localidadNombre
    ) {
      setAlerta({
        msg: "Todos los campos son obligatorios, incluyendo la localidad.",
        error: true,
      });
      return;
    }

    const clienteData = {
      nombre,
      apellido,
      direccion,
      celular,
      localidadId,
      localidadNombre,
      descuento,
      vuelta,
      tipoCliente,
      articuloData: productos
        .map((producto) => ({
          articuloId: producto._id,
          nombre: producto.nombre,
          cantidad: producto.cantidad,
        }))
        .filter((articulo) => {
          // Filtrar artículos con al menos una cantidad > 0
          return Object.values(articulo.cantidad).some(
            (cantidad) => cantidad > 0
          );
        }),
    };

    // Validar la estructura de clienteData
    if (!clienteData.articuloData.length) {
      setAlerta({
        msg: "Debe haber al menos un artículo con cantidad mayor a 0",
        error: true,
      });
      return;
    }

    console.log("Datos antes de enviar:", clienteData.articuloData);
    console.log("Datos a enviar:", clienteData);

    try {
      // Decidir la función a llamar según si es creación o actualización
      const response = id
        ? await actualizarCliente(clienteData, id) // Actualizar
        : await guardarCliente(clienteData); // Crear

      setAlerta({
        msg: `Cliente ${id ? "actualizado" : "guardado"} correctamente`,
        error: false,
      });

      // Resetear el formulario
      setCodigo("");
      setNombre("");
      setApellido("");
      setDireccion("");
      setCelular("");
      setLocalidadId("");
      setLocalidadNombre("");
      setDescuento("");
      setVuelta("");
      setTipoCliente("lista");
      setProductos([]);
      setId(null);
      onClose();
    } catch (error) {
      const mensajeError =
        error.response && error.response.data
          ? error.response.data
          : "Hubo un error al guardar el cliente. Por favor, inténtalo de nuevo.";

      console.error("Error al guardar el cliente:", mensajeError);
      setAlerta({
        msg: mensajeError,
        error: true,
      });
    }
  };

  const handleCantidadChange = (e, productoId, dia) => {
    const { value } = e.target;
    // Actualizar la cantidad del producto seleccionado para el día específico
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto._id === productoId
          ? {
              ...producto,
              cantidad: {
                ...producto.cantidad,
                [dia]: parseInt(value) || 0,
              },
            }
          : producto
      )
    );
  };

  return (
    <>
      <p className="text-lg text-center mb-10">
        {id ? "Editar Cliente" : "Agregar Cliente"}
      </p>
      <form
        className="p-3 bg-white rounded-lg shadow-md overflow-y-auto max-h-screen"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="uppercase text-gray-600 text-sm font-bold">
              Cod
            </label>
            <input
              type="text"
              className="border w-full h-10 bg-white rounded-lg p-2 mt-1"
              value={codigo}
              readOnly
            />
          </div>
          <div>
            <label className="uppercase text-gray-600 text-sm font-bold">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Nombre del cliente"
              className="border w-full h-10 bg-white rounded-lg p-2 mt-1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label className="uppercase text-gray-600 text-sm font-bold">
              Apellido
            </label>
            <input
              type="text"
              placeholder="Apellido del cliente"
              className="border w-full h-10 bg-white rounded-lg p-2 mt-1"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor={`localidad-${cliente?._id}`}
              className="uppercase text-gray-600 text-sm font-bold"
            >
              localidad
            </label>
            <select
              id="localidad"
              value={localidadId}
              onChange={handleLocalidadChange}
              className="px-3 py-2 border rounded-md"
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
            <label className="uppercase text-gray-600 text-sm font-bold">
              Direccion
            </label>
            <input
              type="text"
              placeholder="Direccion"
              className="border w-full h-10 bg-white rounded-lg p-2 mt-1"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <div>
            <label className="uppercase text-gray-600 text-sm font-bold">
              Celular
            </label>
            <input
              type="number"
              placeholder="Celular"
              className="border w-full h-10 bg-white rounded-lg p-2 mt-1"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
          </div>
          <div>
            <label className="uppercase text-gray-600 text-sm font-bold">
              Descuento
            </label>
            <input
              type="number"
              placeholder="Descuento"
              className="border w-full h-10 bg-white rounded-lg p-2 mt-1"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
            />
          </div>
          <div>
            <label className="uppercase text-gray-600 text-sm font-bold">
              Vuelta
            </label>
            <input
              type="number"
              placeholder="Nro de Vuelta"
              className="border w-full h-10 bg-white rounded-lg p-2 mt-1"
              value={vuelta}
              onChange={(e) => setVuelta(e.target.value)}
            />
          </div>
          <div>
            <label className="uppercase text-gray-600 text-sm font-bold">
              Tipo de Cliente
            </label>
            <div className="flex mt-1">
              <button
                type="button"
                className={`w-1/2 h-10 rounded-l-lg p-2 transition-colors duration-300 ease-in-out ${
                  tipoCliente === "lista"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-800 border"
                }`}
                onClick={() => setTipoCliente("lista")}
              >
                Lista
              </button>
              <button
                type="button"
                className={`w-1/2 h-10 rounded-r-lg p-2 transition-colors duration-300 ease-in-out ${
                  tipoCliente === "individual"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-800 border"
                }`}
                onClick={() => setTipoCliente("individual")}
              >
                Individual
              </button>
            </div>
          </div>

          {/* <div>
          <label className="uppercase text-gray-600 text-sm font-bold">
            Anulado
          </label>
          <input
            type="checkbox"
            className="border w-5 h-5 mt-1 bg-white rounded-lg"
          />
        </div> */}
        </div>
        <div className="mt-5">
          <h2 className="uppercase text-gray-600 text-sm font-bold">
            Seleccione los productos:
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  {[
                    "lunes",
                    "martes",
                    "miercoles",
                    "jueves",
                    "viernes",
                    "sabado",
                    "domingo",
                  ].map((dia) => (
                    <th
                      key={dia}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto._id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {producto.nombre}
                    </td>
                    {[
                      "lunes",
                      "martes",
                      "miercoles",
                      "jueves",
                      "viernes",
                      "sabado",
                      "domingo",
                    ].map((dia) => (
                      <td key={dia} className="px-4 py-2 whitespace-nowrap">
                        <input
                          className="border w-16 h-8 p-1 bg-white rounded-lg text-center"
                          type="number"
                          min="0"
                          value={producto.cantidad[dia]}
                          onChange={(e) =>
                            handleCantidadChange(e, producto._id, dia)
                          }
                          placeholder="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <input
            type="submit"
            value={id ? "Guardar cambios" : "Registrar cliente"}
            className="bg-indigo-700 w-40 py-3 rounded-lg text-white uppercase font-bold hover:cursor-pointer hover:bg-indigo-800"
          />
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 ml-3 rounded-lg"
          >
            Cerrar
          </button>
        </div>
        {alerta.msg && <Alerta alerta={alerta} />}
      </form>
    </>
  );
};

export default FormularioCliente;
