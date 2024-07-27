import React from "react";
import RepartoTabla from "../componentes/repartosNuevo/RepartoTabla";
import RepartoNuevo from "../componentes/repartosNuevo/RepartoNuevo";
import RepartoNuevoListado from "../componentes/repartosNuevo/RepartoNuevoListado";
const RepartosNuevo = ({ cliente }) => {
  return (
    <div className="flex flex-col">
      <div className="bg-black w-full h-20">
        <p className="text-indigo-600 uppercase text-center mt-5 text-3xl">
          panaderia teodelina
        </p>
      </div>
      <div>
        <RepartoTabla />
      </div>
    </div>
  );
};

export default RepartosNuevo;
