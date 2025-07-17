import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './utils/Dashboard'
import MateriaPrima from './pages/MateriaPrima'
import RegistrarMateriaPrima from './pages/RegistrarMateriaPrima'
import Inicio from './pages/Inicio'
import Gestiones from './utils/Gestiones'
import Proximente from './pages/Proximamente'
import OrdenesTrabajo from './pages/OrdenTrabajo'
import OrdenTrabajoForm from './pages/RegistrarOrdenTrabajo'

function App() {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Inicio />} />
      <Route path="/gestiones" element={<Gestiones />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<MateriaPrima />} />
        <Route path="registrar" element={<RegistrarMateriaPrima />} />
        <Route path="orden" element={<OrdenesTrabajo />} />
        <Route path="crear" element={<OrdenTrabajoForm/>} />
      <Route path="reportes" element={<Proximente/>} />
      </Route>
    </Routes>
  )
}

export default App