import { useNavigate } from 'react-router-dom'
import logoCarro from '../assets/logo.jpg'

const Inicio = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Sección de imagen */}
        <div className="md:w-1/2 bg-black flex items-center justify-center p-8">
          <img 
            src={logoCarro} 
            alt="Logo PintAuto" 
            className="w-full h-auto max-h-80 object-contain transition-transform duration-500 hover:scale-105" 
          />
        </div>
        
        {/* Sección de contenido */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center md:text-left">
            Sistema de Gestión <span className="text-blue-600">PintAuto</span>
          </h1>
          
          <h2 className="text-xl text-blue-500 font-semibold mb-6 text-center md:text-left">
            Control Integral de Inventario
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed text-center md:text-left">
            Optimiza tus procesos con nuestra plataforma especializada en gestión de materia prima, 
            proporcionando control en tiempo real y máxima eficiencia operativa.
          </p>
          
          <div className="flex justify-center md:justify-start">
            <button
              onClick={handleClick}
              className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-blue-500 hover:to-blue-600 group overflow-hidden"
            >
              <span className="relative z-10">Iniciar Sesión</span>
              <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </button>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} PintAuto - Todos los derechos reservados
      </footer>
    </div>
  )
}

export default Inicio