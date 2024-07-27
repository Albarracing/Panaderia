import React from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { fas, far, fal } from "@awesome.me/kit-KIT_CODE/icons";
//const element = <FontAwesomeIcon icon="fa-solid fa-house" />;

const Home = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-black w-full h-20">
        <p className="text-indigo-600 uppercase text-center mt-5 text-3xl">
          panaderia teodelina
        </p>
      </div>
      <div className="flex justify-center ">
        <div className="  mt-10">
          <Link to="/Clientes">
            <button className="bg-indigo-600 hover:bg-indigo-500 mx-10 mt-5 w-52 h-10 rounded-md uppercase">
              clientes
            </button>
          </Link>
          <Link to="/Articulos">
            <button className="bg-indigo-600 hover:bg-indigo-500 mx-10 w-52 h-10 rounded-md uppercase">
              Articulos
            </button>
          </Link>
          <Link to="/RepartosNuevo">
            <button className="bg-indigo-600 hover:bg-indigo-500 mx-10 w-52 h-10 rounded-md uppercase">
              Repartos
            </button>
          </Link>
          <Link to="/Repartidores">
            <button className="bg-indigo-600 hover:bg-indigo-500 mx-10 w-52 h-10 rounded-md uppercase">
              Repartidores
            </button>
          </Link>
          <Link to="/Localidades">
            <button className="bg-indigo-600 hover:bg-indigo-500 mt-6 mx-10 w-52 h-10 rounded-md uppercase">
              Localidades
            </button>
          </Link>
          <Link to="/Listados">
            <button className="bg-indigo-600 hover:bg-indigo-500 mx-10 w-52 h-10 rounded-md uppercase">
              Listados
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
