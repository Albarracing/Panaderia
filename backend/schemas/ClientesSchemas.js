import Join from "@hapi/joi";

const clienteSchema = Join.object({
  codigo: Join.number(),
  nombre: Join.string().required(),
  apellido: Join.string().required(),
  localidad: Join.string().required(),
  direccion: Join.string().required(),
  celular: Join.number(),
  articuloData: Join.array().items(
    Join.object({
      productoId: Join.string().required(),
      nombre: Join.string(),
      cantidad: Join.number().integer().min(1).required(),
    })
  ),
});

export default clienteSchema;
