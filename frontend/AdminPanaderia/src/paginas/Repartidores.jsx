import React from "react";
import ListaRepartidores from "../componentes/repartidores/ListadoRepartidores";

const Repartidores = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-black py-5">
        <p className="text-white uppercase text-center text-3xl">
          Panadería Teodelina
        </p>
      </div>
      <div className="">
        <ListaRepartidores />
      </div>
      {/* <div className="px-10">
        <FormularioCliente />
      </div> */}
    </div>
  );
};

export default Repartidores;
