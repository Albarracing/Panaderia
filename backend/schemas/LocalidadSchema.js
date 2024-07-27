import Join from "@hapi/joi";

const LocalidadSchema = Join.object({
  nombre: Join.string().required(),
  codigoPostal: Join.number().required(),
});

export default LocalidadSchema;
