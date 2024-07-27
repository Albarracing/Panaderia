import Join from "@hapi/joi";

const RepartidorSchema = Join.object({
  nombre: Join.string().required(),
  alias: Join.string().required(),
});

export default RepartidorSchema;
