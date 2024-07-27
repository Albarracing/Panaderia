import { useContext } from "react";
import ClientesContext from "../contex/ClientesProvider";

const useClientes = () => {
  return useContext(ClientesContext);
};

export default useClientes;
