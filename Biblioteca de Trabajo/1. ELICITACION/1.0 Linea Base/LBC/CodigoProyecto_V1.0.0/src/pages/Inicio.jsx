import { useNavigate } from 'react-router-dom'
import logoCarro from '../assets/logo.jpg' // Ajusta la ruta según tu estructura

const Inicio = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-md">
      
      
      <img src={logoCarro} alt="Logo Carro" className="w-auto h-auto mb-8 rounded-sm" />
      
      <h2 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
        ¡Bienvenido al Sistema de Gestion de Inventario de PintAuto!
      </h2>
      <p className="text-gray-600 max-w-xl mb-8 text-center">
        Este sistema te ayudará a administrar eficientemente la materia prima, facilitando la
        gestión y el control para optimizar tus procesos.
      </p>

      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition"
      >
        Inicio de Sesión
      </button>
    </div>
  )
}

export default Inicio
