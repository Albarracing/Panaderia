import React from "react";
import ListadoDeArticulos from "../componentes/articulos/ListadoArticulos";

const Articulos = () => {
  return (
    <div className="">
      <div className="bg-black py-5">
        <p className="text-white uppercase text-center text-3xl">
          Panadería Teodelina
        </p>
      </div>
      <div className="bg-white rounded-lg">
        <ListadoDeArticulos />
      </div>
    </div>
  );
};

export default Articulos;
