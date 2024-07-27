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

const ListadoRepartos = () => {
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
      console.log("Repartos obtenidos:", response.data);
      setRepartos(response.data);
    } catch (error) {
      console.error("Error al obtener repartos por fecha:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Repartos", 14, 14);

    if (!repartos.length) {
      console.error("No hay repartos para generar el PDF.");
      return;
    }

    const localidades = {
      Arribeños: [],
      Arenales: [],
      TeodelinaVuelta1: [],
      TeodelinaVuelta2: [],
      TeodelinaVuelta3: [],
    };

    const totalesProductos = {};

    repartos.forEach((reparto) => {
      reparto.clientesArticulos.forEach((clienteArticulo) => {
        const localidad =
          clienteArticulo.clienteId.localidad?.nombre || "Desconocida";
        const cliente = `${clienteArticulo.clienteId.nombre} ${clienteArticulo.clienteId.apellido}`;
        const vuelta = clienteArticulo.clienteId.vuelta;

        // Agrupar los artículos del cliente en una sola fila
        const articulos = clienteArticulo.articulos
          .map((articulo) => {
            const articuloNombre = articulo.articuloId.nombre;
            const cantidad = articulo.cantidad;

            // Calcular totales por producto
            if (totalesProductos[articuloNombre]) {
              totalesProductos[articuloNombre] += cantidad;
            } else {
              totalesProductos[articuloNombre] = cantidad;
            }

            return `${articuloNombre}: ${cantidad}`;
          })
          .join(", ");

        const row = [cliente, articulos];

        if (localidad === "Teodelina") {
          if (vuelta === 1) {
            localidades.TeodelinaVuelta1.push(row);
          } else if (vuelta === 2) {
            localidades.TeodelinaVuelta2.push(row);
          } else if (vuelta === 3) {
            localidades.TeodelinaVuelta3.push(row);
          }
        } else if (localidad === "Arenales") {
          localidades.Arenales.push(row);
        } else if (localidad === "Arribeños") {
          localidades.Arribeños.push(row);
        }
      });
    });

    const tableBody = [];

    const addRowsToTable = (rows, title) => {
      if (rows.length > 0) {
        tableBody.push([
          {
            content: title,
            colSpan: 2,
            styles: { halign: "center", fillColor: [220, 220, 220] },
          },
        ]);
        rows.forEach((row) => tableBody.push(row));
      }
    };

    addRowsToTable(localidades.Arribeños, "Arribeños");
    addRowsToTable(localidades.Arenales, "Arenales");
    addRowsToTable(localidades.TeodelinaVuelta1, "Teodelina - Vuelta 1");
    addRowsToTable(localidades.TeodelinaVuelta2, "Teodelina - Vuelta 2");
    addRowsToTable(localidades.TeodelinaVuelta3, "Teodelina - Vuelta 3");

    doc.autoTable({
      head: [["Cliente", "Artículos"]],
      body: tableBody,
      startY: 20,
    });

    const startYTotales = doc.autoTable.previous.finalY + 10;
    doc.text("Totales por Producto", 14, startYTotales);
    const totalesBody = Object.entries(totalesProductos).map(
      ([nombre, cantidad]) => [nombre, cantidad]
    );
    doc.autoTable({
      head: [["Producto", "Cantidad Total"]],
      body: totalesBody,
      startY: startYTotales + 5,
    });

    doc.save(
      `reporte_repartos_${selectedDate.toISOString().split("T")[0]}.pdf`
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
        Repartos por Fecha
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
            </tr>
          </thead>
          <tbody>
            {repartos.map((reparto) =>
              reparto.clientesArticulos.map((clienteArticulo) => {
                const cliente = `${clienteArticulo.clienteId.nombre} ${clienteArticulo.clienteId.apellido}`;
                const articulos = clienteArticulo.articulos
                  .map(
                    (articulo) =>
                      `${articulo.articuloId.nombre}: ${articulo.cantidad}`
                  )
                  .join(", ");
                return (
                  <tr key={clienteArticulo.clienteId._id}>
                    <td className="py-2 px-4 border-b border-gray-200 text-left">
                      {cliente}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-left">
                      {articulos}
                    </td>
                  </tr>
                );
              })
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

export default ListadoRepartos;
