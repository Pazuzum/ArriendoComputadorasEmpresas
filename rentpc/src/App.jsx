import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from './paginas/EquiposPc.jsx'
import Hero from './paginas/Hero.jsx'
import CotizarForm from './paginas/Cotizar.jsx'
import CotizacionResumen from './paginas/CotizacionResumen.jsx'
import Login from './paginas/Login.jsx'
import Register from './paginas/Register.jsx'
import AdminPanel from './paginas/AdminPanel.jsx'
import ProtectedAdmin from './paginas/ProtectedAdmin.jsx'
import AdminProducts from './paginas/AdminProducts.jsx'
import { AuthProvider } from './Context/authContext.jsx'
import Nosotros from './paginas/Nosotros.jsx'
import { CotizacionProvider } from './Context/CotizacionContext.jsx'
import MisCotizaciones from './paginas/MisCotizaciones.jsx'
import DetalleCotizacion from './paginas/DetalleCotizacion.jsx'
import PagoSimulado from './paginas/PagoSimulado.jsx'
import PagoExitoso from './paginas/PagoExitoso.jsx'
import Perfil from './paginas/Perfil.jsx'

// Componente principal de la aplicación con sistema de rutas y providers
function App() {
  return (
    <AuthProvider>
      <CotizacionProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas de autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas públicas */}
            <Route path="/" element={<Hero />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/catalogo" element={<Catalogo />} />
            
            {/* Rutas de cotización y pago */}
            <Route path="/cotizar" element={<CotizacionResumen />} />
            <Route path="/pago" element={<PagoSimulado />} />
            <Route path="/pago-exitoso" element={<PagoExitoso />} />
            
            {/* Rutas de usuario autenticado */}
            <Route path="/mis-cotizaciones" element={<MisCotizaciones />} />
            <Route path="/mis-cotizaciones/:id" element={<DetalleCotizacion />} />
            <Route path="/perfil" element={<Perfil />} />
            
            {/* Rutas protegidas de administrador */}
            <Route path="/admin" element={
              <ProtectedAdmin>
                <AdminPanel />
              </ProtectedAdmin>
            } />
            <Route path="/admin/productos" element={
              <ProtectedAdmin>
                <AdminProducts />
              </ProtectedAdmin>
            } />
          </Routes>
        </BrowserRouter>
      </CotizacionProvider>
    </AuthProvider>
  )
}

export default App
