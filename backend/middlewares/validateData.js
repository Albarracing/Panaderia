import Boom from "@hapi/boom";
import Joi from "@hapi/joi";

const validationMiddleware = (validationSchema) => {
  return (req, res, next) => {
    const { error } = validationSchema.validate(req.body);

    if (error) {
      // La validación falló
      res.status(422).send(Boom.badData(error.message));
    } else {
      // La validación fue exitosa, continuamos con el siguiente middleware o la lógica del controlador
      next();
    }
  };
};

export default validationMiddleware;

// const schema = () => {
//   return async (req, res, next) => {
//     try {
//       await schema.validateAsync(req.body);
//       next();
//     } catch (error) {
//       res.send(Boom.badData(error));
//     }
//   };
// };

// export default schema;
