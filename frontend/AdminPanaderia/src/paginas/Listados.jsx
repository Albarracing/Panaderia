import React from "react";
import { Link } from "react-router-dom";

const Listados = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-black py-5">
        <p className="text-white uppercase text-center text-3xl">
          Panadería Teodelina
        </p>
      </div>
      <div className="flex justify-between items-center m-5">
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Volver
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 px-6">
        <Link to="/ListadoVueltas">
          <button className="bg-indigo-600 hover:bg-indigo-500 w-80 h-12 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
            Listado Vueltas
          </button>
        </Link>
        <Link to="/ListadoRepartos">
          <button className="bg-indigo-600 hover:bg-indigo-500 w-80 h-12 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
            Listado Repartos
          </button>
        </Link>
        <Link to="/ListadoRepartidor">
          <button className="bg-indigo-600 hover:bg-indigo-500 w-80 h-12 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
            Listado Repartidor
          </button>
        </Link>
        <Link to="/ListadoProductos">
          <button className="bg-indigo-600 hover:bg-indigo-500 w-80 h-12 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
            Listado Productos
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Listados;
