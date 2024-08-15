import React from "react";
import ListaLocalidades from "../componentes/localidades/ListadoLocalidades.jsx";

const Localidades = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-black py-5">
        <p className="text-white uppercase text-center text-3xl">
          Panadería Teodelina
        </p>
      </div>
      <div className="">
        <ListaLocalidades />
      </div>
      {/* <div className="px-10">
        <FormularioCliente />
      </div> */}
    </div>
  );
};

export default Localidades;
