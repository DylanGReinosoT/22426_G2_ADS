import { useNavigate } from 'react-router-dom'

const Gestiones = () => {
  const navigate = useNavigate()

  const goToMateriaPrima = () => {
    navigate('/dashboard')
  }

  const goToOrdenTrabajo = () => {
    navigate('/dashboard/orden') 
  }

  const goToReportes = () => {
    navigate('/dashboard/reportes') 
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-md">
      <h2 className="text-4xl font-extrabold text-blue-700 mb-10 text-center">
        ¡Gestión de Inventario de PintAuto!
      </h2>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={goToMateriaPrima}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition"
        >
          Materia Prima
        </button>

        <button
          onClick={goToOrdenTrabajo}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition"
        >
          Orden de Trabajo
        </button>

        <button
          onClick={goToReportes}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md transition"
        >
          Reportes
        </button>
      </div>
    </div>
  )
}

export default Gestiones
