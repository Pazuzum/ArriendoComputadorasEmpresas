import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from './paginas/EquiposPc.jsx'
import Hero from './paginas/Hero.jsx'
import CotizarForm from './paginas/Cotizar.jsx'
import Login from './paginas/Login.jsx'
import Register from './paginas/Register.jsx'
import { AuthProvider } from './context/authContext.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Hero/>} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/cotizar" element={<CotizarForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App
