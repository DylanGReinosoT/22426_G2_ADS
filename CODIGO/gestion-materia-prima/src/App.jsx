import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MateriaPrima from './pages/MateriaPrima'
import RegistrarMateriaPrima from './pages/RegistrarMateriaPrima'
import Inicio from './pages/Inicio'
import Gestiones from './pages/Gestiones'
import Proximente from './pages/Proximamente'

function App() {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Inicio />} />
      <Route path="/gestiones" element={<Gestiones />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<MateriaPrima />} />
        <Route path="registrar" element={<RegistrarMateriaPrima />} />
        <Route path="orden" element={<Proximente/>} />
      <Route path="reportes" element={<Proximente/>} />
      </Route>
    </Routes>
  )
}

export default App