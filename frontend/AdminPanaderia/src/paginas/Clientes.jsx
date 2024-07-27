import React from "react";
import FormularioCliente from "../componentes/FormularioCliente";
import ListadoDeClientes from "../componentes/ListadoDeClientes";

const Clientes = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-black w-full h-20">
        <p className="text-indigo-600 uppercase text-center mt-5 text-3xl">
          panaderia teodelina
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
