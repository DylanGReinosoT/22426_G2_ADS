import { useNavigate } from 'react-router-dom'
import logoCarro from '../assets/logo.jpg'
import { motion } from 'framer-motion'

const Inicio = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/login')
  }

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(220, 38, 38, 0.4)",
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.98
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-6"
    >
      <motion.div 
        variants={itemVariants}
        className="max-w-4xl w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-700"
      >
        {/* Sección de imagen */}
        <div className="md:w-1/2 bg-black flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/10 to-transparent animate-pulse"></div>
          <motion.img 
            src={logoCarro} 
            alt="Logo PintAuto" 
            className="w-full h-auto max-h-80 object-contain"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          />
        </div>
        
        {/* Sección de contenido */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-white mb-4 text-center md:text-left"
          >
            Sistema de Gestión <span className="text-red-600 animate-pulse">PintAuto</span>
          </motion.h1>
          
          <motion.h2 
            variants={itemVariants}
            className="text-xl text-red-400 font-semibold mb-6 text-center md:text-left"
          >
            Control Integral de Inventario
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-300 mb-8 leading-relaxed text-center md:text-left"
          >
            Optimiza tus procesos con nuestra plataforma especializada en gestión de materia prima, 
            proporcionando control en tiempo real y máxima eficiencia operativa.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex justify-center md:justify-start"
          >
            <motion.button
              onClick={handleClick}
              className="relative bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 group overflow-hidden border border-red-900"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-2">Iniciar Sesión</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.footer 
        variants={itemVariants}
        className="mt-8 text-center text-gray-400 text-sm"
      >
        © {new Date().getFullYear()} <span className="text-red-500 font-semibold">PintAuto</span> - Todos los derechos reservados
      </motion.footer>
    </motion.div>
  )
}

export default Inicio