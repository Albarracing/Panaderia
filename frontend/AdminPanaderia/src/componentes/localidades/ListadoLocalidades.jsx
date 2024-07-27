import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ListaLocalidades = () => {
  const [Localidades, setLocalidades] = useState([]);
  const [nombre, setNombre] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLocalidad, setEditingLocalidad] = useState(null);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchLocalidad();
  }, []);

  const fetchLocalidad = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/localidades");
      setLocalidades(response.data);
    } catch (error) {
      console.error("Error al obtener los localidades:", error);
    }
  };

  const handleCrearLocalidad = async () => {
    if (editingLocalidad) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/localidades/${editingLocalidad._id}`,
          { nombre, codigoPostal }
        );
        console.log("Localidad actualizada:", response.data);
        setMessage("Localidad actualizada exitosamente");
      } catch (error) {
        console.error("Error al actualizar la localidad:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/localidades",
          {
            nombre,
            codigoPostal,
          }
        );
        console.log("Localidad creado:", response.data);
        setMessage("Localidad creada exitosamente");
      } catch (error) {
        console.error("Error al crear la localidad:", error);
      }
    }

    setShowModal(false);
    fetchLocalidad();
    setNombre("");
    setCodigoPostal("");
    setEditingLocalidad(null);

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleEliminarLocalidad = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/localidades/${deleteId}`);
      console.log("Localidad eliminada:", deleteId);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      fetchLocalidad();
      setMessage("Localidad eliminada exitosamente");

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al eliminar la localidad:", error);
    }
  };

  const handleEditLocalidad = (localidad) => {
    setEditingLocalidad(localidad);
    setNombre(localidad.nombre);
    setCodigoPostal(localidad.codigoPostal);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNombre("");
    setAlias("");
    setEditingLocalidad(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <Link to="/">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Volver
          </button>
        </Link>
        <h2 className="text-2xl text-center font-bold mb-4">
          Lista de Localidades
        </h2>
        {message && (
          <div className="bg-green-100  p-2 mb-4 rounded">{message}</div>
        )}
        <button
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded mb-4"
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      </div>

      {/* Modal para crear o editar repartidor */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3 relative">
            <button
              className=" bg-red-500 text-white px-4 py-2 rounded mb-6 right-6 absolute bottom-0"
              onClick={handleCloseModal}
            >
              Cerrar
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingLocalidad ? "Editar Localidad" : "Crear Nueva Localidad"}
            </h2>
            <input
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              type="text"
              placeholder="Codigo postal"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleCrearLocalidad}
            >
              {editingLocalidad ? "Actualizar localidad" : "Crear localidad"}
            </button>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3 relative">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar esta localidad?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleEliminarLocalidad}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de repartidores */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-300 text-left">
              Nombre
            </th>
            <th className="px-6 py-3 border-b border-gray-300 text-left">
              Codigo Postal
            </th>
            <th className="px-6 py-3 border-b border-gray-300 text-left">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(Localidades) &&
            Localidades.map((localidad) => (
              <tr key={localidad._id}>
                <td className="px-6 py-4 border-b border-gray-300">
                  {localidad.nombre}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {localidad.codigoPostal}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleEditLocalidad(localidad)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setDeleteId(localidad._id);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaLocalidades;
