import React from "react";
import { Link } from "react-router-dom";
import ListadoRepartos from "../componentes/listados/ListadoRepartos";

const Listados = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-black w-full h-20">
        <p className="text-indigo-600 uppercase text-center mt-5 text-3xl">
          panaderia teodelina
        </p>
      </div>
      <div className="flex justify-between items-center m-5">
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver
        </Link>
      </div>
      <div className="absolute left-52 mt-44">
        <button className="bg-indigo-600 hover:bg-indigo-500 mx-10 w-52 h-10 rounded-md uppercase">
          <Link to="/ListadoVueltas">listado vueltas</Link>
        </button>
        <button className="bg-indigo-600 hover:bg-indigo-500 mx-10 w-52 h-10 rounded-md uppercase">
          <Link to="/ListadoRepartos">listado repartos</Link>
        </button>
        <button className="bg-indigo-600 hover:bg-indigo-500 mx-10 w-52 h-10 rounded-md uppercase">
          <Link to="/ListadoRepartidor">listado repartidor</Link>
        </button>
      </div>
    </div>
  );
};

export default Listados;
