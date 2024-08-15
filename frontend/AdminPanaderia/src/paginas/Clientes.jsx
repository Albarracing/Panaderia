import React from "react";
import FormularioCliente from "../componentes/FormularioCliente";
import ListadoDeClientes from "../componentes/ListadoDeClientes";

const Clientes = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-black py-5">
        <p className="text-white uppercase text-center text-3xl">
          Panadería Teodelina
        </p>
      </div>
      <div className="">
        <ListadoDeClientes />
      </div>
      {/* <div className="px-10">
        <FormularioCliente />
      </div> */}
    </div>
  );
};

export default Clientes;
