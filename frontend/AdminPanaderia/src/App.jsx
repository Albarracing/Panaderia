import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paginas/home.jsx";
import Clientes from "./paginas/Clientes.jsx";
import Articulos from "./paginas/Articulos.jsx";
import RepartosNuevo from "./paginas/RepartosNuevo.jsx";
import Repartidores from "./paginas/Repartidores.jsx";
import Localidades from "./paginas/Localidades.jsx";
import Listados from "./paginas/Listados.jsx";

import { ClientesProvider } from "./contex/ClientesProvider.jsx";
import { ArticulosProvider } from "./contex/AticulosProvider.jsx";
import { RepartosProvider } from "./contex/RepartosProvider.jsx";
import FormularioReparto from "./componentes/repartosNuevo/FormularioReparto.jsx";
import RepartoDetalles from "./componentes/repartosNuevo/RepartoDetalles.jsx";
import ListadoRepartos from "./componentes/listados/ListadoRepartos.jsx";
import ListadoRepartosConDetalles from "./componentes/listados/ListadoRepartoConDetalles.jsx";
import ListadoRepartidor from "./componentes/listados/ListadoRepartidor.jsx";
function App() {
  const [shouldUpdate, setShouldUpdate] = useState(true);
  return (
    <BrowserRouter>
      <ClientesProvider>
        <ArticulosProvider>
          <RepartosProvider>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="Clientes" element={<Clientes />} />
              <Route path="Articulos" element={<Articulos />} />
              <Route
                path="crear-reparto"
                element={
                  <FormularioReparto setShouldUpdate={setShouldUpdate} />
                }
              />
              <Route
                path="RepartosNuevo"
                element={
                  <RepartosNuevo
                    shouldUpdate={shouldUpdate}
                    setShouldUpdate={setShouldUpdate}
                  />
                }
              />
              <Route path="/reparto-detalles" element={<RepartoDetalles />} />
              <Route path="/Repartidores" element={<Repartidores />} />
              <Route path="/Localidades" element={<Localidades />} />
              <Route path="/Listados" element={<Listados />} />
              <Route path="/ListadoVueltas" element={<ListadoRepartos />} />
              <Route
                path="/ListadoRepartidor"
                element={<ListadoRepartidor />}
              />
              <Route
                path="/ListadoRepartos"
                element={<ListadoRepartosConDetalles />}
              />
            </Routes>
          </RepartosProvider>
        </ArticulosProvider>
      </ClientesProvider>
    </BrowserRouter>
  );
}

export default App;
