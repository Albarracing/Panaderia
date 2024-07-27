import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import useArticulos from "../../hook/useArticulos";
import FormularioArticulos from "./FormularioArticulos";
import PopupArticulo from "./PopupArticulo";

const ListadoDeArticulos = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const { guardarArticulo, actualizarArticulo, eliminarArticulo, setEditando } =
    useArticulos();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    obtenerArticulos();
  }, [refresh]);

  useEffect(() => {
    console.log("Artículos en ListadoDeArticulos:", articulos);
  }, [articulos]);

  const obtenerArticulos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/articulos");
      if (response.ok) {
        const data = await response.json();
        setArticulos(data);
      } else {
        console.error("Error al obtener los artículos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener los artículos:", error);
    }
  };

  const handleOpenPopup = (articulo = null) => {
    setSelectedArticulo(articulo);
    setEditando(articulo);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedArticulo(null);
  };

  const handleFormSubmit = async (articuloData) => {
    try {
      if (selectedArticulo) {
        await actualizarArticulo(selectedArticulo._id, articuloData);
      } else {
        await guardarArticulo(articuloData);
      }
      setIsPopupOpen(false);
      setSelectedArticulo(null);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
    }
  };

  const handleClickEliminar = (articuloId) => {
    setArticuloAEliminar(articuloId);
    setShowWarning(true);
  };

  const confirmEliminar = async () => {
    try {
      if (articuloAEliminar) {
        await eliminarArticulo(articuloAEliminar);
        setRefresh((prev) => prev + 1);
        setShowWarning(false);
        setArticuloAEliminar(null);
      }
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
    }
  };

  const cancelEliminar = () => {
    setShowWarning(false);
    setArticuloAEliminar(null);
  };

  if (!articulos) {
    return <div>Cargando artículos...</div>;
  }

  return (
    <>
      <div className="container w-full mx-auto">
        <div className="flex justify-between mb-6">
          <Link to="/">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Volver
            </button>
          </Link>
          <button
            onClick={() => handleOpenPopup()}
            className="bg-green-500 text-white px-4 py-2 rounded my-2 hover:bg-green-700"
          >
            Nuevo Artículo
          </button>
        </div>
        {isPopupOpen && (
          <PopupArticulo onClose={handleClosePopup}>
            <FormularioArticulos
              articulo={selectedArticulo}
              onSubmit={handleFormSubmit}
              onClose={handleClosePopup}
            />
          </PopupArticulo>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Precio Mostrador
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Lugar Preparación
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Precios por Localidad
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((articulo) => (
                <tr key={articulo._id}>
                  <td className="px-6  whitespace-no-wrap border-b border-gray-200">
                    {articulo.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {articulo.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {articulo.unidad}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {articulo.precioMostrador}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {articulo.lugarPreparacion}
                  </td>
                  <td className="px-6  whitespace-no-wrap border-b border-gray-200">
                    {articulo.precios && articulo.precios.length > 0 ? (
                      articulo.precios.map((precio) => (
                        <div key={precio.localidad._id}>
                          {precio.localidad.nombre}: {precio.precio}
                        </div>
                      ))
                    ) : (
                      <div>No hay precios disponibles</div>
                    )}
                  </td>
                  <td className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleOpenPopup(articulo)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    </button>
                    <button
                      onClick={() => handleClickEliminar(articulo._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow-md text-center">
              <p className="mb-4">
                ¿Estás seguro de que deseas eliminar este artículo?
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
      </div>
    </>
  );
};

export default ListadoDeArticulos;
