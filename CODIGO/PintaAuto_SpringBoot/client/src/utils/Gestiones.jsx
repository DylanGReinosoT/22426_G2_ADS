import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
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
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3
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
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-gray-900 via-black to-gray-800"
    >
      <motion.div 
        variants={itemVariants}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Gestión de Inventario
        </h2>
        <p className="text-xl text-red-400 font-semibold">
          Sistema Integral <span className="text-white">PintAuto</span>
        </p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl px-4"
      >
        <motion.button
          onClick={goToMateriaPrima}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex-1 bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold py-6 px-6 rounded-xl transition-all border border-gray-700 hover:border-red-500/30 shadow-lg"
        >
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-lg">Materia Prima</span>
            <span className="text-sm text-gray-300 mt-1">Gestión de insumos</span>
          </div>
        </motion.button>

        <motion.button
          onClick={goToOrdenTrabajo}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex-1 bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold py-6 px-6 rounded-xl transition-all border border-gray-700 hover:border-red-500/30 shadow-lg"
        >
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-lg">Orden de Trabajo</span>
            <span className="text-sm text-gray-300 mt-1">Control de producción</span>
          </div>
        </motion.button>

        <motion.button
          onClick={goToReportes}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex-1 bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold py-6 px-6 rounded-xl transition-all border border-gray-700 hover:border-red-500/30 shadow-lg"
        >
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-lg">Reportes</span>
            <span className="text-sm text-gray-300 mt-1">Análisis y estadísticas</span>
          </div>
        </motion.button>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mt-16 text-center text-gray-400 text-sm"
      >
        © {new Date().getFullYear()} PintAuto - Sistema de Gestión
      </motion.div>
    </motion.div>
  )
}

export default Gestiones