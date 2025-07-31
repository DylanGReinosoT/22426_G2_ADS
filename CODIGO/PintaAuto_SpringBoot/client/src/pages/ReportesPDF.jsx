import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiCalendar, FiBox } from 'react-icons/fi';

const Reportes = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('fechas'); // 'fechas' o 'materia'
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [materiaPrima, setMateriaPrima] = useState('');

  const generarReporte = () => {
    if (filtro === 'fechas') {
      console.log('Generando reporte por fechas:', { fechaInicio, fechaFin });
      // Lógica para reporte por fechas
    } else {
      console.log('Generando reporte por materia prima:', { materiaPrima });
      // Lógica para reporte por materia prima
    }
  };

  // Animaciones (se mantienen igual)
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
  };

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
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(220, 38, 38, 0.3)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div 
        variants={itemVariants}
        className="mb-8 max-w-md w-full"
      >
        {/* Selector de tipo de filtro */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setFiltro('fechas')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${filtro === 'fechas' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
          >
            <FiCalendar className="h-5 w-5" />
            <span>Por Fechas</span>
          </button>
          
          <button
            onClick={() => setFiltro('materia')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${filtro === 'materia' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
          >
            <FiBox className="h-5 w-5" />
            <span>Por Materia</span>
          </button>
        </motion.div>

        {/* Icono dinámico */}
        <div className="flex justify-center mb-6">
          {filtro === 'fechas' ? (
            <FiCalendar className="h-24 w-24 text-red-500" />
          ) : (
            <FiBox className="h-24 w-24 text-red-500" />
          )}
        </div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          {filtro === 'fechas' ? "Reporte por Fechas" : "Reporte por Materia Prima"}
        </motion.h1>
        
        {/* Formulario dinámico */}
        <motion.div 
          variants={itemVariants}
          className="space-y-4 text-left"
        >
          {filtro === 'fechas' ? (
            <div>
              <label className="block text-gray-300 mb-1">Rango de fechas</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="text-gray-400 flex items-center">a</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-gray-300 mb-1">Materia prima</label>
              <select
                value={materiaPrima}
                onChange={(e) => setMateriaPrima(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todas las materias primas</option>
                <option value="pintura_roja">Pintura Roja</option>
                <option value="pintura_azul">Pintura Azul</option>
                <option value="disolvente">Disolvente</option>
                <option value="resina">Resina</option>
              </select>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Botones */}
      <motion.div variants={itemVariants} className="flex space-x-4">
        <motion.button
          onClick={generarReporte}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 border border-red-900 flex items-center"
        >
          <FiDownload className="h-5 w-5 mr-2" />
          Generar PDF
        </motion.button>
        
        <motion.button
          onClick={() => navigate(-1)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 border border-gray-600 flex items-center"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </motion.button>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mt-16 text-gray-500 text-sm"
      >
        © {new Date().getFullYear()} PintAuto - Todos los derechos reservados
      </motion.div>
    </motion.div>
  );
};

export default Reportes;