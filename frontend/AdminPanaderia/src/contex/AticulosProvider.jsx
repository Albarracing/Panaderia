import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ArticulosContext = createContext();

export const ArticulosProvider = ({ children }) => {
  const [articulos, setArticulos] = useState([]);
  const [articulo, setArticulo] = useState({});
  const [error, setError] = useState(null);

  const obtenerArticulos = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/articulos/");
      setArticulos(data);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  useEffect(() => {
    obtenerArticulos();
  }, []);

  const guardarArticulo = async (articulo) => {
    try {
      console.log("Enviando artículo al backend:", articulo);
      const { data: articuloGuardado } = await axios.post(
        "http://localhost:3000/api/articulos/",
        articulo
      );
      console.log("Artículo guardado:", articuloGuardado);
      setArticulos([articuloGuardado, ...articulos]);
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      setError(error);
    }
  };

  const actualizarArticulo = async (id, articuloActualizado) => {
    try {
      console.log("Datos enviados:", articuloActualizado); // <-- Agregar este console.log
      const { data: articuloActualizadoResponse } = await axios.put(
        `http://localhost:3000/api/articulos/${id}`,
        articuloActualizado
      );
      setArticulos(
        articulos.map((articulo) =>
          articulo._id === id ? articuloActualizadoResponse : articulo
        )
      );
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const setEditando = (articulo) => {
    setArticulo(articulo);
  };

  const eliminarArticulo = async (id) => {
    const confirmar = confirm("Seguro que deseas eliminar?");

    if (confirmar) {
      try {
        await axios.delete(`http://localhost:3000/api/articulos/${id}`);
        const articulosActualizados = articulos.filter(
          (articuloState) => articuloState._id !== id
        );
        setArticulos(articulosActualizados);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  };

  return (
    <ArticulosContext.Provider
      value={{
        articulos,
        obtenerArticulos,
        guardarArticulo,
        actualizarArticulo,
        setEditando,
        articulo,
        eliminarArticulo,
        error,
      }}
    >
      {children}
    </ArticulosContext.Provider>
  );
};

export default ArticulosContext;
