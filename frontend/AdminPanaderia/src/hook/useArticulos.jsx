import { useContext } from "react";
import ArticulosContext from "../contex/AticulosProvider";

const useArticulos = () => {
  return useContext(ArticulosContext);
};

export default useArticulos;
