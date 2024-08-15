import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import useRepartos from "../../hook/useRepartos";
import debounce from "lodash/debounce";
import axios from "axios";

const RepartoDetalles = ({}) => {
  const location = useLocation();
  const { pedidos, repartoId, numeroPedido } = location.state || {
    pedidos: [],
    repartoId: null,
    numeroPedido: null,
  };
  const {
    actualizarPagoCompletoEnBackend,
    guardarMontoPagadoEnBackend,
    registrarDevolucionEnBackend,
  } = useRepartos();
  const [clientesArticulos, setClientesArticulos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempCantidadDevuelta, setTempCantidadDevuelta] = useState({});
  const [reparto, setReparto] = useState(null);

  useEffect(() => {
    console.log("location.state:", location.state);
    console.log("Pedidos recibidos:", pedidos); // Agregar esta línea
    if (pedidos.length > 0) {
      setClientesArticulos(pedidos.map(prepararClienteArticulo));
    }
  }, [pedidos]);

  const prepararClienteArticulo = (clienteArticulo) => ({
    ...clienteArticulo,
    originalPagadoCompleto: clienteArticulo.pagadoCompleto,
    originalMontoPagado: clienteArticulo.montoPagado,
    cantidadDevuelta: 0,
    deudaAnterior: clienteArticulo.deudaAnterior || 0, // Asegurando que deudaAnterior esté definido
  });

  const handleCantidadDevueltaChange = (clienteId, articuloId, newValue) => {
    setTempCantidadDevuelta((prev) => ({
      ...prev,
      [`${clienteId}_${articuloId}`]: newValue,
    }));
  };

  const handleCantidadDevueltaBlur = (clienteId, articuloId) => {
    const cantidadDevuelta =
      parseFloat(tempCantidadDevuelta[`${clienteId}_${articuloId}`]) || 0;
    setClientesArticulos((prevClientesArticulos) =>
      prevClientesArticulos.map((clienteArticulo) => {
        if (clienteArticulo.clienteId._id === clienteId) {
          const nuevosArticulos = clienteArticulo.articulos.map((articulo) => {
            if (articulo.articuloId._id === articuloId) {
              const precioUnitario = articulo.importe / articulo.cantidad;

              const nuevoImporte =
                (articulo.cantidad - cantidadDevuelta) * precioUnitario;

              if (isNaN(nuevoImporte)) {
                console.error(
                  `Nuevo Importe calculado como NaN para articuloId=${articuloId}`
                );
                return articulo;
              }

              return {
                ...articulo,
                cantidadDevuelta,
                importe: nuevoImporte,
              };
            }
            return articulo;
          });

          const nuevoTotalCliente = nuevosArticulos.reduce(
            (acc, art) => acc + art.importe,
            0
          );

          const nuevaDeuda = Math.max(
            nuevoTotalCliente - clienteArticulo.montoPagado,
            0
          );

          return {
            ...clienteArticulo,
            articulos: nuevosArticulos,
            totalCliente: nuevoTotalCliente,
            deuda: nuevaDeuda,
          };
        }
        return clienteArticulo;
      })
    );
  };

  const calcularImporteTotalReparto = () => {
    const total = clientesArticulos.reduce(
      (acc, clienteArticulo) => acc + clienteArticulo.totalCliente,
      0
    );

    console.log("Importe Total Reparto:", total);

    return total;
  };

  const handlePagoCompletoChangeLocal = (clienteId, pagadoCompleto) => {
    setClientesArticulos((prevClientesArticulos) =>
      prevClientesArticulos.map((clienteArticulo) =>
        clienteArticulo.clienteId._id === clienteId
          ? {
              ...clienteArticulo,
              pagadoCompleto,
              montoPagado: pagadoCompleto
                ? clienteArticulo.totalCliente
                : clienteArticulo.montoPagado,
              deuda: pagadoCompleto
                ? 0
                : Math.max(
                    clienteArticulo.totalCliente - clienteArticulo.montoPagado,
                    0
                  ),
            }
          : clienteArticulo
      )
    );
  };

  const handleMontoPagadoChange = (clienteId, montoPagado) => {
    setClientesArticulos((prevClientesArticulos) =>
      prevClientesArticulos.map((clienteArticulo) =>
        clienteArticulo.clienteId._id === clienteId
          ? {
              ...clienteArticulo,
              montoPagado: parseFloat(montoPagado) || 0,
              deuda: Math.max(
                clienteArticulo.totalCliente - (parseFloat(montoPagado) || 0),
                0
              ),
            }
          : clienteArticulo
      )
    );
  };

  const handleGuardarCambios = async () => {
    try {
      setLoading(true);
      await Promise.all(
        clientesArticulos.map(async (clienteArticulo) => {
          if (
            clienteArticulo.pagadoCompleto !==
            clienteArticulo.originalPagadoCompleto
          ) {
            await actualizarPagoCompletoEnBackend(
              repartoId,
              clienteArticulo.clienteId._id,
              clienteArticulo.pagadoCompleto,
              clienteArticulo.montoPagado,
              clienteArticulo.deuda
            );
          }

          if (
            clienteArticulo.montoPagado !== clienteArticulo.originalMontoPagado
          ) {
            await guardarMontoPagadoEnBackend(
              repartoId,
              clienteArticulo.clienteId._id,
              clienteArticulo.montoPagado,
              clienteArticulo.deuda
            );
          }

          await Promise.all(
            clienteArticulo.articulos.map(async (articulo) => {
              if (articulo.cantidadDevuelta > 0) {
                const fechaDevolucion = new Date().toISOString().split("T")[0];
                const deuda = Math.max(
                  clienteArticulo.totalCliente - clienteArticulo.montoPagado,
                  0
                );
                await registrarDevolucionEnBackend(
                  repartoId,
                  clienteArticulo.clienteId._id,
                  articulo.articuloId._id,
                  articulo.cantidadDevuelta,
                  deuda,
                  fechaDevolucion
                );
              }
            })
          );
        })
      );

      setClientesArticulos((prevClientesArticulos) =>
        prevClientesArticulos.map((clienteArticulo) => ({
          ...clienteArticulo,
          originalPagadoCompleto: clienteArticulo.pagadoCompleto,
          originalMontoPagado: clienteArticulo.montoPagado,
        }))
      );

      console.log("Cambios guardados exitosamente!");
    } catch (error) {
      setError("Error al guardar cambios");
      console.error("Error al guardar cambios:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!clientesArticulos.length) {
    return <div>No hay pedidos disponibles.</div>;
  }

  return (
    <div className="container mx-auto" id="reparto-details">
      <Link
        to="/RepartosNuevo"
        className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Volver
      </Link>
      <h1 className="text-2xl font-bold mb-4">
        Detalles del Reparto N°: {numeroPedido}
      </h1>
      {error && <div className="text-red-600">{error}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <div className="space-y-4">
            {clientesArticulos.map((clienteArticulo) => (
              <div
                key={clienteArticulo._id}
                className="border px-3 rounded-md shadow-md"
              >
                <div className="flex justify-between mb-2">
                  <h2 className="text-xl font-semibold">
                    {clienteArticulo.clienteId.nombre}{" "}
                    {clienteArticulo.clienteId.apellido}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="transform scale-150"
                        checked={clienteArticulo.pagadoCompleto}
                        onChange={(e) =>
                          handlePagoCompletoChangeLocal(
                            clienteArticulo.clienteId._id,
                            e.target.checked
                          )
                        }
                      />
                      <span className="ml-2">Pagado Completo</span>
                    </label>
                    {!clienteArticulo.pagadoCompleto && (
                      <label className="flex items-center">
                        Monto Pagado:
                        <input
                          type="number"
                          value={clienteArticulo.montoPagado || ""}
                          onChange={(e) =>
                            handleMontoPagadoChange(
                              clienteArticulo.clienteId._id,
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-24 ml-2 rounded-md focus:outline-none border border-gray-300 py-1 px-2"
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-1 mb-1">
                  <div className="flex flex-wrap gap-4">
                    {clienteArticulo.articulos.map((articulo) => (
                      <div key={articulo.articuloId._id} className="mb-1">
                        <div className="flex items-center">
                          <span className="font-medium">
                            {articulo.articuloId.nombre}:
                          </span>
                          <span className="ml-2">{articulo.cantidad}</span>
                        </div>
                        <div className="text-gray-700">
                          ${(articulo.importe || 0).toFixed(2)}
                        </div>
                        <div className="flex items-center mt-1">
                          <h2 className="mr-2">Devuelve:</h2>
                          <input
                            type="number"
                            step="0.01"
                            value={
                              tempCantidadDevuelta[
                                `${clienteArticulo.clienteId._id}_${articulo.articuloId._id}`
                              ] || articulo.cantidadDevuelta
                            }
                            onChange={(e) =>
                              handleCantidadDevueltaChange(
                                clienteArticulo.clienteId._id,
                                articulo.articuloId._id,
                                e.target.value
                              )
                            }
                            onBlur={() =>
                              handleCantidadDevueltaBlur(
                                clienteArticulo.clienteId._id,
                                articulo.articuloId._id
                              )
                            }
                            className="w-24 ml-2 rounded-md focus:outline-none border border-gray-300 py-1 px-2"
                          />
                        </div>
                        <div className="text-gray-700">
                          Importe Actual: ${(articulo.importe || 0).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-4">
                      <div className="text-sm text-gray-600 inline-flex items-center">
                        Pagado: $
                        {clienteArticulo.montoPagado
                          ? clienteArticulo.montoPagado.toFixed(2)
                          : "0.00"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Restante: $
                        {(
                          clienteArticulo.totalCliente -
                          (clienteArticulo.montoPagado || 0)
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-1">
                      <div className="text-right text-lg font-semibold">
                        Importe Total: $
                        {(clienteArticulo.totalCliente || 0).toFixed(2)}
                      </div>
                      <div className="text-right text-lg font-semibold text-red-600">
                        Deuda: ${clienteArticulo.deuda.toFixed(2)}
                      </div>
                      {/* <div className="text-right text-lg font-semibold">
                        Deuda Acumulada: $
                        {(
                          clienteArticulo.clienteId.deudaAcumulada || 0
                        ).toFixed(2)}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xl font-semibold">
            Importe Total del Reparto: $
            {calcularImporteTotalReparto().toFixed(2)}
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleGuardarCambios}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar Cambios
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RepartoDetalles;
