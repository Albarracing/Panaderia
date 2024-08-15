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

const ListadoRepartidor = () => {
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

  const obtenerDeudaPendiente = async (clienteId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/deudaPendiente/${clienteId}`
      );
      return response.data.deudaPendiente;
    } catch (error) {
      console.error("Error al obtener la deuda pendiente:", error);
      return 0;
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    let yPosition = 16;

    doc.text("Reporte de Repartos con Detalles", 14, yPosition);
    yPosition += 10;

    for (const reparto of repartos) {
      for (const clienteArticulo of reparto.clientesArticulos) {
        const clienteNombre = `${clienteArticulo.clienteId.nombre} ${clienteArticulo.clienteId.apellido}`;
        const articulos = clienteArticulo.articulos
          .map(
            (articulo) => `${articulo.articuloId.nombre}: ${articulo.cantidad}`
          )
          .join("     ");
        const importes = clienteArticulo.articulos
          .map((articulo) => articulo.importe.toFixed(2))
          .join("     ");

        doc.text(clienteNombre, 14, yPosition);
        yPosition += 10;
        doc.text(`Artículos: ${articulos}`, 14, yPosition);
        yPosition += 10;
        doc.text(`Importes: ${importes}`, 14, yPosition);
        yPosition += 10;

        const deudaAnterior = await obtenerDeudaPendiente(
          clienteArticulo.clienteId._id
        );

        doc.text(
          `Deuda Anterior: $${deudaAnterior.toFixed(
            2
          )}   Importe Total: $${clienteArticulo.totalCliente.toFixed(2)}`,
          14,
          yPosition
        );
        yPosition += 10;

        yPosition += 10;

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 16;
          doc.text("Reporte de Repartos con Detalles", 14, yPosition);
          yPosition += 10;
        }
      }
    }

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
        <div>
          {repartos.map((reparto) =>
            reparto.clientesArticulos.map((clienteArticulo) => (
              <div key={clienteArticulo._id} className="border p-4 mb-4">
                <p>{`${clienteArticulo.clienteId.nombre} ${clienteArticulo.clienteId.apellido}`}</p>
                <p>
                  {" "}
                  {clienteArticulo.articulos
                    .map(
                      (articulo) =>
                        `${articulo.articuloId.nombre}: ${articulo.cantidad}`
                    )
                    .join("     ")}
                </p>
                <p>
                  $
                  {clienteArticulo.articulos
                    .map((articulo) => articulo.importe.toFixed(2))
                    .join("     ")}
                </p>
                <p>
                  Deuda: ${clienteArticulo.deudaAnterior.toFixed(2)} Importe: $
                  {clienteArticulo.totalCliente.toFixed(2)}
                </p>
                {/* <p>Devuelve: ____________ Monto Pagado: ____________</p> */}
              </div>
            ))
          )}
        </div>
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

export default ListadoRepartidor;
