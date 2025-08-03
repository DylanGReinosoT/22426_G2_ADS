import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiCalendar, FiBox, FiEye, FiAlertCircle, FiCheckCircle, FiX, FiFileText } from 'react-icons/fi';
import reporteService from '../services/reporteService';

const Reportes = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('fechas'); // 'fechas' o 'materia'
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [materiaPrima, setMateriaPrima] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Función para mostrar notificaciones
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 4000);
  };

  // Función para validar los datos del formulario - MEJORADA
  const validarFormulario = () => {
    if (filtro === 'fechas') {
      if (!fechaInicio || !fechaFin) {
        showNotification('error', 'Por favor, selecciona ambas fechas');
        return false;
      }
      
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);
      const fechaActual = new Date();
      
      if (fechaInicioObj > fechaFinObj) {
        showNotification('error', 'La fecha de inicio no puede ser mayor a la fecha fin');
        return false;
      }
      
      // Validar que no sean fechas muy futuras
      if (fechaInicioObj > fechaActual) {
        showNotification('error', 'La fecha de inicio no puede ser futura');
        return false;
      }
      
      // Validar rango máximo (ej: no más de 1 año)
      const unAnoEnMs = 365 * 24 * 60 * 60 * 1000;
      if (fechaFinObj.getTime() - fechaInicioObj.getTime() > unAnoEnMs) {
        showNotification('error', 'El rango de fechas no puede ser mayor a 1 año');
        return false;
      }
    }
    return true;
  };

  // Función para descargar el archivo PDF
  const descargarPDF = (blob, nombreArchivo) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  // Función para previsualizar los datos del reporte - MEJORADA
  const previsualizarReporte = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      let datos;
      if (filtro === 'fechas') {
        datos = await reporteService.obtenerDatosReporteFechas(fechaInicio, fechaFin);
      } else {
        datos = await reporteService.obtenerDatosReporteMaterias(materiaPrima || null);
      }
      
      console.log('Datos recibidos del backend:', datos);
      console.log('Tipo de datos:', typeof datos);
      console.log('Es array:', Array.isArray(datos));
      
      setPreviewData(datos);
      setShowPreview(true);
      showNotification('success', 'Vista previa generada correctamente');
    } catch (error) {
      console.error('Error al obtener vista previa:', error);
      
      // Manejo específico de errores
      let mensajeError = 'Error al generar la vista previa del reporte';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            mensajeError = 'Parámetros de consulta inválidos. Verifica las fechas seleccionadas.';
            break;
          case 404:
            mensajeError = 'No se encontraron datos para el período seleccionado.';
            break;
          case 500:
            mensajeError = 'Error interno del servidor. Inténtalo más tarde.';
            break;
          default:
            mensajeError = `Error del servidor (${error.response.status}). Contacta al administrador.`;
        }
        
        // Si hay un mensaje específico del backend
        if (error.response.data && error.response.data.message) {
          mensajeError = error.response.data.message;
        }
      } else if (error.request) {
        mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      
      showNotification('error', mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // Función para generar y mostrar los datos del reporte (JSON)
  const generarReporte = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      let datos;
      
      if (filtro === 'fechas') {
        datos = await reporteService.generarReporteFechas(fechaInicio, fechaFin);
      } else {
        datos = await reporteService.generarReporteMaterias(materiaPrima || null);
      }
      
      setPreviewData(datos);
      setShowPreview(true);
      showNotification('success', 'Reporte generado correctamente');
    } catch (error) {
      console.error('Error al generar reporte:', error);
      
      // Manejo específico de errores
      let mensajeError = 'Error al generar el reporte';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            mensajeError = 'Parámetros inválidos. Verifica las fechas o materia prima seleccionada.';
            break;
          case 404:
            mensajeError = 'No se encontraron datos para generar el reporte.';
            break;
          case 500:
            mensajeError = 'Error interno del servidor. Inténtalo más tarde.';
            break;
          default:
            mensajeError = `Error del servidor (${error.response.status}). Contacta al administrador.`;
        }
        
        if (error.response.data && error.response.data.message) {
          mensajeError = error.response.data.message;
        }
      } else if (error.request) {
        mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      
      showNotification('error', mensajeError);
    } finally {
      setLoading(false);
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
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-6 text-center relative"
    >
      {/* Notificaciones */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
              notification.type === 'success' 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <FiCheckCircle className="text-xl flex-shrink-0" />
              ) : (
                <FiAlertCircle className="text-xl flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, type: '', message: '' })}
                className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Vista Previa */}
      <AnimatePresence>
        {showPreview && previewData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Vista Previa - {filtro === 'fechas' ? 'Reporte por Fechas' : 'Reporte por Materias'}
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>
              
              {/* Contenido de la vista previa */}
              <div className="text-white">
                {filtro === 'fechas' ? (
                  <ReportesPorFechas data={previewData} />
                ) : (
                  <ReportesPorMaterias data={previewData} />
                )}
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    generarReporte();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FiDownload className="text-sm" />
                  Descargar PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
                  className="date-input w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="text-gray-400 flex items-center">a</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="date-input w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
        <motion.button
          onClick={previsualizarReporte}
          disabled={loading}
          variants={buttonVariants}
          whileHover={loading ? {} : "hover"}
          whileTap={loading ? {} : "tap"}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-blue-900 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando...
            </>
          ) : (
            <>
              <FiEye className="h-5 w-5 mr-2" />
              Vista Previa
            </>
          )}
        </motion.button>
        
        <motion.button
          onClick={generarReporte}
          disabled={loading}
          variants={buttonVariants}
          whileHover={loading ? {} : "hover"}
          whileTap={loading ? {} : "tap"}
          className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-red-900 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando...
            </>
          ) : (
            <>
              <FiFileText className="h-5 w-5 mr-2" />
              Generar Reporte
            </>
          )}
        </motion.button>
        
        <motion.button
          onClick={() => navigate(-1)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-600 flex items-center"
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

      {/* Estilos CSS para inputs de fecha */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .date-input::-webkit-calendar-picker-indicator {
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e%3cpath fill='white' d='M15 2V1a1 1 0 0 0-2 0v1H7V1a1 1 0 0 0-2 0v1H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2zM3 6h14v10H3V6z'/%3e%3c/svg%3e");
            background-position: center;
            background-repeat: no-repeat;
            background-size: 16px 16px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s ease;
          }

          .date-input::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
          }

          .date-input {
            color-scheme: dark;
          }

          .date-input::-webkit-datetime-edit {
            color: white;
          }

          .date-input::-webkit-datetime-edit-fields-wrapper {
            color: white;
          }

          .date-input::-webkit-datetime-edit-text {
            color: white;
          }

          .date-input::-webkit-datetime-edit-month-field {
            color: white;
          }

          .date-input::-webkit-datetime-edit-day-field {
            color: white;
          }

          .date-input::-webkit-datetime-edit-year-field {
            color: white;
          }
        `
      }} />
    </motion.div>
  );
};

// Componente para vista previa de reportes por fechas
const ReportesPorFechas = ({ data }) => {
  if (!data || !data.reportesPorCliente) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          Período: {data.fechaInicio} - {data.fechaFin}
        </h3>
        <p className="text-gray-300">
          Total de órdenes encontradas: <span className="font-bold text-red-400">{data.totalOrdenes}</span>
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-bold text-white">Reportes por Cliente</h4>
        {data.reportesPorCliente.map((reporte, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className="font-semibold text-lg text-white">
                  {reporte.cliente.nombre} {reporte.cliente.apellido}
                </h5>
                <p className="text-gray-400 text-sm">Cédula: {reporte.cliente.cedula}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-300">Total Materiales:</p>
                <p className="font-bold text-red-400 text-lg">${reporte.totalMateriales}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h6 className="font-medium text-gray-300">Materiales utilizados:</h6>
              {reporte.materiales.map((material, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="text-white">{material.nombre}</span>
                  <div className="text-right">
                    <span className="text-gray-300">Cantidad: {material.cantidad}</span>
                    <br />
                    <span className="text-green-400 font-medium">${material.subtotal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-500">
        <h4 className="text-xl font-bold text-white text-center">
          Total General: <span className="text-red-400">${data.totalGeneral}</span>
        </h4>
      </div>
    </div>
  );
};

// Componente para vista previa de reportes por materias
const ReportesPorMaterias = ({ data }) => {
  if (!data || !data.reportesPorMateria) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          {data.materiaPrimaFiltro ? `Materia Prima: ${data.materiaPrimaFiltro}` : 'Todas las Materias Primas'}
        </h3>
        <p className="text-gray-300">
          Total de órdenes encontradas: <span className="font-bold text-red-400">{data.totalOrdenes}</span>
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-bold text-white">Reportes por Materia Prima</h4>
        {data.reportesPorMateria.map((reporte, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className="font-semibold text-lg text-white">{reporte.materiaPrima.nombre}</h5>
                <p className="text-gray-400 text-sm">Código: {reporte.materiaPrima.codigo}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-300">Total Utilizado:</p>
                <p className="font-bold text-red-400 text-lg">{reporte.cantidadTotal} {reporte.materiaPrima.unidadMedida}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h6 className="font-medium text-gray-300">Órdenes que utilizaron este material:</h6>
              {reporte.ordenes.map((orden, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <div>
                    <span className="text-white">Orden #{orden.numeroOrden}</span>
                    <br />
                    <span className="text-gray-400 text-sm">
                      Cliente: {orden.cliente.nombre} {orden.cliente.apellido}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-300">Fecha: {orden.fecha}</span>
                    <br />
                    <span className="text-green-400 font-medium">
                      Cantidad: {orden.cantidadUtilizada} {reporte.materiaPrima.unidadMedida}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-500">
        <h4 className="text-xl font-bold text-white text-center">
          Total de Materiales Utilizados: <span className="text-red-400">{data.totalMaterialesUtilizados}</span>
        </h4>
      </div>
    </div>
  );
};

export default Reportes;