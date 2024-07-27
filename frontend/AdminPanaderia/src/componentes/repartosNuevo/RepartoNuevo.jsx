import RepartoTabla from "./RepartoTabla";
import RepartosNuevo from "../../paginas/RepartosNuevo";
import useClientes from "../../hook/useClientes";
const RepartoNuevo = ({ cliente }) => {
  const { nombre, apellido } = cliente;

  return (
    <div className="flex flex-col">
      <div className="mx-5 my-7 bg-slate-50 shadow-md px-5 py-1 rounded-xl">
        <p className="font-bold uppercase text-indigo-600 my-2">
          Nombre: {nombre}
          {/* <span className="font-normal normal-case text-black">{nombre}</span> */}
        </p>
      </div>
      <div className="mx-5 my-7 bg-slate-50 shadow-md px-5 py-1 rounded-xl">
        <p className="font-bold uppercase text-indigo-600 my-2">
          Apellido: {apellido}
          {/* <span className="font-normal normal-case text-black">{apellido}</span> */}
        </p>
      </div>
      <RepartoTabla cliente={cliente} />
    </div>
  );
};

export default RepartoNuevo;
