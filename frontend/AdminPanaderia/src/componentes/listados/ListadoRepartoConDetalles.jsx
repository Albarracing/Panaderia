import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

const ListadoRepartosConDetalles = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [repartos, setRepartos] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      obtenerRepartosPorFecha(selectedDate);
    }
  }, [selectedDate]);

  const obtenerRepartosPorFecha = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `http://localhost:3000/api/repartos/fecha/${formattedDate}`
      );
      setRepartos(response.data);
    } catch (error) {
      console.error("Error al obtener repartos por fecha:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Repartos con Detalles", 14, 16);

    if (!repartos.length) {
      console.error("No hay repartos para generar el PDF.");
      return;
    }

    const columns = [
      "Cliente",
      "Artículos",
      "Importe",
      "Deuda",
      "Importe Total",
    ];
    const rows = [];

    repartos.forEach((reparto) => {
      reparto.clientesArticulos.forEach((clienteArticulo) => {
        const articulos = clienteArticulo.articulos
          .map(
            (articulo) => `${articulo.articuloId.nombre} (${articulo.cantidad})`
          )
          .join(", ");
        const importes = clienteArticulo.articulos
          .map((articulo) => articulo.importe)
          .join(", ");

        rows.push([
          `${clienteArticulo.clienteId.nombre} ${clienteArticulo.clienteId.apellido}`,
          articulos,
          importes,
          clienteArticulo.deuda,
          clienteArticulo.totalCliente,
        ]);
      });
    });

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save(
      `reporte_repartos_detalles_${
        selectedDate.toISOString().split("T")[0]
      }.pdf`
    );
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
      <Link
        to="/Listados"
        className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Volver
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">
        Repartos por Fecha con Detalles
      </h1>
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          locale="es"
          dateFormat="dd/MM/yyyy"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      {repartos.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Cliente
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Artículos
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-right">
                Importe
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-right">
                Deuda
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-right">
                Importe Total
              </th>
            </tr>
          </thead>
          <tbody>
            {repartos.map((reparto) =>
              reparto.clientesArticulos.map((clienteArticulo) => (
                <tr key={clienteArticulo._id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-left">
                    {clienteArticulo.clienteId.nombre}{" "}
                    {clienteArticulo.clienteId.apellido}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-left">
                    {clienteArticulo.articulos
                      .map(
                        (articulo) =>
                          `${articulo.articuloId.nombre} (${articulo.cantidad})`
                      )
                      .join(", ")}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">
                    {clienteArticulo.articulos
                      .map((articulo) => articulo.importe.toFixed(2))
                      .join(", ")}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">
                    {clienteArticulo.deuda.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">
                    {clienteArticulo.totalCliente.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-red-500">
          No hay repartos para la fecha seleccionada.
        </div>
      )}
      <div className="flex justify-end mt-6">
        <button
          onClick={generatePDF}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Generar PDF
        </button>
      </div>
    </div>
  );
};

export default ListadoRepartosConDetalles;
