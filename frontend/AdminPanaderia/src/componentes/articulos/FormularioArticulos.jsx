import { useState, useEffect } from "react";
import axios from "axios";

const FormularioArticulos = ({ articulo, onSubmit, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [unidad, setUnidad] = useState("");
  const [precioMostrador, setPrecioMostrador] = useState(0);
  const [lugarPreparacion, setLugarPreparacion] = useState("");
  const [precios, setPrecios] = useState({});
  const [localidades, setLocalidades] = useState([]);

  // useEffect(() => {
  //   if (articulo && articulo.precios) {
  //     const preciosIniciales = articulo.precios.reduce((acc, precio) => {
  //       acc[precio.localidad._id] = precio.precio;
  //       return acc;
  //     }, {});
  //     setPrecios(preciosIniciales);
  //   }
  // }, [articulo]);

  useEffect(() => {
    if (articulo) {
      setNombre(articulo.nombre || "");
      setUnidad(articulo.unidad || "");
      setPrecioMostrador(articulo.precioMostrador || 0);
      setLugarPreparacion(articulo.lugarPreparacion || "");

      if (articulo.precios) {
        const preciosIniciales = articulo.precios.reduce((acc, precio) => {
          acc[precio.localidad._id] = precio.precio;
          return acc;
        }, {});
        setPrecios(preciosIniciales);
      }
    }
  }, [articulo]);

  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/localidades/"
        );
        setLocalidades(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLocalidades();
  }, []);

  const handlePrecioChange = (localidadId, value) => {
    setPrecios({
      ...precios,
      [localidadId]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preciosArray = Object.keys(precios).map((localidadId) => ({
      localidad: localidadId,
      precio: Number(precios[localidadId]), // Convertir el precio a número
    }));
    onSubmit({
      nombre,
      unidad,
      precioMostrador,
      lugarPreparacion,
      precios: preciosArray,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-auto mx-auto p-8 bg-white shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <h2 className="text-2xl font-semibold mb-6 col-span-full">
        Formulario de Artículos
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Unidad</label>
        <input
          type="text"
          value={unidad}
          onChange={(e) => setUnidad(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Precio Mostrador</label>
        <input
          type="number"
          value={precioMostrador}
          onChange={(e) => setPrecioMostrador(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Lugar de Preparación</label>
        <input
          type="text"
          value={lugarPreparacion}
          onChange={(e) => setLugarPreparacion(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4 col-span-full ">
        <label className="block text-gray-700">Precios por Localidad</label>
        <div className="lg:grid-cols-3 grid">
          {localidades.map((localidad) => (
            <div key={localidad._id} className="mb-2 ">
              <label className=" text-gray-700">{localidad.nombre}</label>
              <input
                type="number"
                value={precios[localidad._id] || ""}
                onChange={(e) =>
                  handlePrecioChange(localidad._id, e.target.value)
                }
                className="w-60 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end col-span-full">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md mr-2"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioArticulos;
