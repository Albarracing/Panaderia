import Cliente from "../models/Clientes.js";

const asignarCodigoCliente = async (next) => {
  try {
    const ultimoCliente = await Cliente.findOne(
      {},
      {},
      { sort: { codigo: -1 } }
    );
    if (!ultimoCliente) {
      this.codigo = 1;
    } else {
      this.codigo = ultimoCliente.codigo + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default asignarCodigoCliente;
