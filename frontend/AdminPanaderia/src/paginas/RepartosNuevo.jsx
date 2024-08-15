import React from "react";
import RepartoTabla from "../componentes/repartosNuevo/RepartoTabla";

const RepartosNuevo = ({ cliente }) => {
  return (
    <div className="flex flex-col">
      <div className="bg-black py-5">
        <p className="text-white uppercase text-center text-3xl">
          Panadería Teodelina
        </p>
      </div>
      <div>
        <RepartoTabla />
      </div>
    </div>
  );
};

export default RepartosNuevo;
