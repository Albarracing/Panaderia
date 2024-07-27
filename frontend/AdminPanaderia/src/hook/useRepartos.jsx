import { useContext } from "react";
import RepartosContext from "../contex/RepartosProvider";

const useRepartos = () => {
  return useContext(RepartosContext);
};

export default useRepartos;
