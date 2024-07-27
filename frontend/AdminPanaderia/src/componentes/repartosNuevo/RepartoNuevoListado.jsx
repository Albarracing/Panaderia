// import React from 'react'
/// import useClientes from "../hook/useClientes";
// //import Cliente from "./Cliente";
// import RepartoTabla from './RepartoTabla';
// const  = ({  }) => {
//   /// const { nombre } = cliente;
//   return (
//     <>
//       <table className="table-auto border border-gray-500">
//         <thead>
//           <tr className="flex bg-red-500 w-screen">
//             <th className="px-4 py-2 w-1/4">Cliente</th>
//             <th className="px-4 py-2 w-1/4">Cantidad</th>
//             <th className="px-4 py-2 w-1/4">Importe</th>
//             <th className="px-4 py-2 w-1/4">Observaciones</th>
//           </tr>
//         </thead>
//       </table>
//     </>
//   );
// };

//export default ;

import React from "react";
import RepartoNuevo from "./RepartoNuevo";
import useClientes from "../../hook/useClientes";

const RepartoNuevoListado = () => {
  const { clientes } = useClientes();
  return (
    <div>
      {clientes.map((cliente) => (
        <RepartoNuevo key={cliente._id} cliente={cliente} />
      ))}
    </div>
  );
};

export default RepartoNuevoListado;
