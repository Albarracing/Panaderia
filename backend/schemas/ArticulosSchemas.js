import Joi from "@hapi/joi";

const precioSchema = Joi.object({
  localidad: Joi.string().required(), // Assuming localidad is an ObjectId
  precio: Joi.number().required(),
});

const articuloSchema = Joi.object({
  codigo: Joi.string().optional(),
  nombre: Joi.string().required(),
  unidad: Joi.string().required(),
  precioMostrador: Joi.number().optional(),
  lugarPreparacion: Joi.string().required(),
  precios: Joi.array().items(precioSchema).required(),
});

export default articuloSchema;
