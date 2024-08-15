import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-black py-5">
        <p className="text-white uppercase text-center text-4xl font-bold">
          Panadería Teodelina
        </p>
      </div>
      <div className="flex flex-col items-center justify-center mt-10 px-22">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
          <Link to="/Clientes">
            <button className="bg-indigo-600 hover:bg-indigo-500 w-52 h-16 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
              Clientes
            </button>
          </Link>
          <Link to="/Articulos">
            <button className="bg-indigo-600 hover:bg-indigo-500 w-52 h-16 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
              Artículos
            </button>
          </Link>
          <Link to="/RepartosNuevo">
            <button className="bg-indigo-600 hover:bg-indigo-500 w-52 h-16 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
              Repartos
            </button>
          </Link>
          <Link to="/Repartidores">
            <button className="bg-indigo-600 hover:bg-indigo-500 w-52 h-16 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
              Repartidores
            </button>
          </Link>
          <Link to="/Localidades">
            <button className="bg-indigo-600 hover:bg-indigo-500 w-52 h-16 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
              Localidades
            </button>
          </Link>
          <Link to="/Listados">
            <button className="bg-indigo-600 hover:bg-indigo-500 w-52 h-16 rounded-md uppercase text-white font-semibold transition duration-300 shadow-lg">
              Listados
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
