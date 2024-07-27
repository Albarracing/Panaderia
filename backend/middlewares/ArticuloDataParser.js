// import { mongoose } from "mongoose";

// const parseArticuloData = (req, res, next) => {
//   // if (!req.body.articuloData) {
//   //   return res
//   //     .status(400)
//   //     .json({ error: "Los datos del artículo son requeridos" });
//   // }

//   // // Continuar con el siguiente middleware o controlador
//   // next();

//   //Check if articuloData exists in the request body
//   if (!req.body.articuloData) {
//     return res
//       .status(400)
//       .json({ error: "Missing 'articuloData' property in request body." });
//   }

//   // Validate articuloData structure
//   if (!Array.isArray(req.body.articuloData)) {
//     return res
//       .status(400)
//       .json({ error: "'articuloData' must be an array of objects." });
//   }

//   for (const item of req.body.articuloData) {
//     if (!item.productoId || !mongoose.isValidObjectId(item.productoId)) {
//       return res
//         .status(400)
//         .json({ error: "Invalid product ID in articuloData." });
//     }

//     if (isNaN(item.cantidad) || item.cantidad <= 0) {
//       return res
//         .status(400)
//         .json({ error: "Invalid quantity in articuloData." });
//     }
//   }

//   // Parse articuloData successfully
//   next();
// };

// export default parseArticuloData;
