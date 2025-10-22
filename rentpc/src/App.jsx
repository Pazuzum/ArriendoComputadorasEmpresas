import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from './paginas/EquiposPc.jsx'
import Hero from './paginas/Hero.jsx'
import CotizarForm from './paginas/Cotizar.jsx'
import CotizacionResumen from './paginas/CotizacionResumen.jsx'
import Login from './paginas/Login.jsx'
import Register from './paginas/Register.jsx'
import AdminPanel from './paginas/AdminPanel.jsx'
import ProtectedAdmin from './paginas/ProtectedAdmin.jsx'
import { AuthProvider } from './context/authContext.jsx'
import Nosotros from './paginas/Nosotros.jsx'
import { CotizacionProvider } from './Context/CotizacionContext.jsx'

function App() {
  return (
    <AuthProvider>
  <CotizacionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Hero/>} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/catalogo" element={<Catalogo />} />
            {/* Product detail page removed per request; images no longer link to a detail route */}
            <Route path="/cotizar" element={<CotizacionResumen />} />
          <Route path="/admin" element={
            <ProtectedAdmin>
              <AdminPanel />
            </ProtectedAdmin>
          } />
        </Routes>
      </BrowserRouter>
  </CotizacionProvider>
  </AuthProvider>
  )
}

export default App
