import React from "react";
import FormularioReparto from "../componentes/repartos/FormularioReparto";
import ListadoRepartos from "../componentes/repartos/ListadoRepartos";

const Repartos = () => {
  return (
    <div className="flex">
      <div className="px-10">
        <FormularioReparto />
      </div>

      <div className="md:w-1/2 lg:w-3/5">
        <ListadoRepartos />
      </div>
    </div>
  );
};

export default Repartos;
