import Joi from "@hapi/joi";

const repartoSchema = Joi.object({
  clientesArticulos: Joi.array()
    .items(
      Joi.object({
        cliente: Joi.string().required(),
        articulos: Joi.array()
          .items(
            Joi.object({
              articulo: Joi.string().required(),
              cantidad: Joi.number().required(),
            })
          )
          .required(),
      })
    )
    .required(),
  fecha: Joi.date().required(),
  montoPagado: Joi.boolean(),
  pagado: Joi.number(),
});

export default repartoSchema;

// import joi from "@hapi/joi";
// import mongoose from "mongoose";

// const repartoSchema = joi.object({
//   //nombre: joi.string().required(),
//   //fecha: joi.date().required(),
//   //cod_personal: joi.number().required(),
//   //cod_localidades: joi.number().required(),
//   precio: joi.number().required(),
//   cantidad: joi.number().required(),
//   devuelve: joi.number(),
//   cod_orden: joi.number().required(),
//   //cliente: joi.string().required(),
//   //articulo: joi.array().items(joi.string()).required(),
//   cliente: joi.string().required(),
//   articulo: joi.string().required(),
// });

// export default repartoSchema;
