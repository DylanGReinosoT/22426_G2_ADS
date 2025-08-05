import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiCalendar, FiBox, FiEye, FiAlertCircle, FiCheckCircle, FiX, FiFileText } from 'react-icons/fi';
import reporteService from '../services/reporteService';
import materiaprimaService from '../services/materiaPrimaService' ;

const Reportes = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('fechas'); // 'fechas' o 'materia'
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [materiaPrima, setMateriaPrima] = useState('');
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Cargar materias primas al montar el componente
  useEffect(() => {
    cargarMateriasPrimas();
  }, []);

  const cargarMateriasPrimas = async () => {
    setLoadingMaterias(true);
    try {
      const response = await materiaprimaService.obtenerTodas();
      if (response.success && response.datos && response.datos.materias) {
        setMateriasPrimas(response.datos.materias);
      }
    } catch (error) {
      console.error('Error al cargar materias primas:', error);
      showNotification('error', 'Error al cargar la lista de materias primas');
    } finally {
      setLoadingMaterias(false);
    }
  };

  // Función para mostrar notificaciones
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 4000);
  };

  // Función para validar los datos del formulario - MEJORADA
  const validarFormulario = () => {
    console.log('=== VALIDANDO FORMULARIO ===');
    console.log('Filtro:', filtro);
    console.log('Fecha inicio:', fechaInicio);
    console.log('Fecha fin:', fechaFin);
    console.log('Materia prima:', materiaPrima);
    
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
    
    console.log('Formulario válido ✓');
    return true;
  };

  // Función para descargar el archivo PDF
  const descargarPDFDesdePreview = async () => {
  if (!previewData) {
    showNotification('error', 'No hay datos para generar el PDF');
    return;
  }

  setLoading(true);
  try {
    let pdfBlob;
    let nombreArchivo;

    if (filtro === 'fechas') {
      // Usar los datos completos de la vista previa para generar PDF
      pdfBlob = await reporteService.generarPDFFechas(previewData);
      nombreArchivo = `reporte_fechas_${fechaInicio}_${fechaFin}.pdf`;
    } else {
      // Usar los datos completos de la vista previa para generar PDF
      pdfBlob = await reporteService.generarPDFMaterias(previewData);
      const materiaTexto = materiaPrima || 'todas_materias';
      nombreArchivo = `reporte_materia_${materiaTexto}.pdf`;
    }

    
    descargarPDF(pdfBlob, nombreArchivo);
    showNotification('success', 'PDF descargado correctamente');
    
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    
    let mensajeError = 'Error al generar el PDF';
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          mensajeError = 'Datos inválidos para generar el PDF';
          break;
        case 500:
          mensajeError = 'Error interno del servidor al generar el PDF';
          break;
        default:
          mensajeError = `Error del servidor (${error.response.status}) al generar PDF`;
      }
    } else if (error.request) {
      mensajeError = 'No se pudo conectar con el servidor para generar el PDF';
    }
    
    showNotification('error', mensajeError);
  } finally {
    setLoading(false);
  }
};

const generarYDescargarPDF = async () => {
  if (!validarFormulario()) return;

  setLoading(true);
  console.log('=== INICIANDO DESCARGA DIRECTA DE PDF ===');
  console.log('Filtro:', filtro);
  console.log('Fechas:', { fechaInicio, fechaFin });
  console.log('Materia prima:', materiaPrima);
  
  try {
    let pdfBlob;
    let nombreArchivo;
    
    if (filtro === 'fechas') {
      console.log('Generando reporte por fechas...');
      // Paso 1: Obtener los datos completos del reporte usando la función correcta
      const reporteData = await reporteService.obtenerDatosReporteFechas(fechaInicio, fechaFin);
      console.log('Datos del reporte obtenidos:', reporteData);
      
      // Paso 2: Enviar el reporte completo para generar PDF
      console.log('Generando PDF...');
      pdfBlob = await reporteService.generarPDFFechas(reporteData);
      nombreArchivo = `reporte_fechas_${fechaInicio}_${fechaFin}.pdf`;
    } else {
      console.log('Generando reporte por materia prima...');
      // Paso 1: Obtener los datos completos del reporte usando la función correcta
      const reporteData = await reporteService.obtenerDatosReporteMaterias(materiaPrima || null);
      console.log('Datos del reporte obtenidos:', reporteData);
      
      // Paso 2: Enviar el reporte completo para generar PDF
      console.log('Generando PDF...');
      pdfBlob = await reporteService.generarPDFMaterias(reporteData);
      const materiaTexto = materiaPrima || 'todas_materias';
      nombreArchivo = `reporte_materia_${materiaTexto}.pdf`;
    }
    
    console.log('PDF generado, iniciando descarga...');
    console.log('Blob type:', pdfBlob.type);
    console.log('Blob size:', pdfBlob.size);
    
    // Descargar el PDF
    descargarPDF(pdfBlob, nombreArchivo);
    showNotification('success', 'PDF generado y descargado correctamente');
    
  } catch (error) {
    console.error('=== ERROR AL GENERAR Y DESCARGAR PDF ===');
    console.error('Error completo:', error);
    console.error('Response data:', error.response?.data);
    console.error('Status:', error.response?.status);
    
    let mensajeError = 'Error al generar el PDF';
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          mensajeError = 'Parámetros inválidos para generar el PDF. Verifica las fechas o materia prima seleccionada.';
          break;
        case 404:
          mensajeError = 'No se encontraron datos para generar el PDF con los parámetros especificados.';
          break;
        case 500:
          mensajeError = 'Error interno del servidor al generar el PDF';
          break;
        default:
          mensajeError = `Error del servidor (${error.response.status}) al generar PDF`;
      }
      
      if (error.response.data && error.response.data.message) {
        mensajeError = error.response.data.message;
      }
    } else if (error.request) {
      mensajeError = 'No se pudo conectar con el servidor para generar el PDF';
    } else {
      mensajeError = `Error inesperado: ${error.message}`;
    }
    
    showNotification('error', mensajeError);
  } finally {
    setLoading(false);
  }
};

//  Función mejorada para descargar archivos PDF
const descargarPDF = (blob, nombreArchivo) => {
  try {
    console.log('=== INICIANDO DESCARGA DE ARCHIVO ===');
    console.log('Tipo de blob:', blob.type);
    console.log('Tamaño del blob:', blob.size, 'bytes');
    console.log('Nombre del archivo:', nombreArchivo);
    
    // Verificar que el blob sea válido
    if (!blob || blob.size === 0) {
      console.error('Blob inválido o vacío');
      showNotification('error', 'El archivo PDF está vacío o es inválido');
      return;
    }
    
    // Verificar que sea un PDF
    if (blob.type && !blob.type.includes('pdf') && !blob.type.includes('application/octet-stream')) {
      console.warn('Tipo de archivo inesperado:', blob.type);
    }
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    
    //  Agregar al DOM temporalmente para Firefox
    document.body.appendChild(link);
    link.click();
    
    //  Limpiar recursos
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    console.log(`PDF descargado exitosamente: ${nombreArchivo}`);
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    showNotification('error', 'Error al descargar el archivo PDF: ' + error.message);
  }
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
                  onClick={descargarPDFDesdePreview}
                  disabled={loading}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generando...
                    </>
                  ) : (
                    <>
                      <FiDownload className="text-sm" />
                      Descargar PDF
                    </>
                  )}
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
                disabled={loadingMaterias}
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
               
                {loadingMaterias ? (
                  <option disabled>Cargando...</option>
                ) : (
                  materiasPrimas.map((materia) => (
                    <option key={materia.id} value={materia.nombre}>
                      {materia.nombre} ({materia.detalles})
                    </option>
                  ))
                )}
              </select>
              {loadingMaterias && (
                <p className="text-gray-400 text-sm mt-1">Cargando materias primas...</p>
              )}
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
          onClick={generarYDescargarPDF}
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
              Generando PDF...
            </>
          ) : (
            <>
              <FiDownload className="h-5 w-5 mr-2" />
              Descargar PDF
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
  console.log('Datos en ReportesPorFechas:', data);
  
  if (!data || !data.ordenes || data.ordenes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-lg">No se encontraron órdenes para el período seleccionado</div>
      </div>
    );
  }

  // Función para formatear fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          Resumen del Reporte por Fechas
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-gray-300">
            Total de órdenes encontradas: <span className="font-bold text-blue-400">{data.ordenes.length}</span>
          </p>
          <p className="text-gray-300">
            Total materiales: <span className="font-bold text-green-400">${data.totalMateriales.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-white">Órdenes de Trabajo</h4>
        {data.ordenes.map((orden, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
            {/* Encabezado de la orden */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className="font-semibold text-lg text-white">
                  {orden.cliente}
                </h5>
                <p className="text-gray-400 text-sm">
                  Usuario: {orden.usuario} | Fecha: {formatearFecha(orden.fechaCreacion)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">Total Orden:</p>
                <p className="font-bold text-green-400 text-lg">${orden.valorMateriales.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Materiales de la orden */}
            <div className="space-y-2">
              <h6 className="font-medium text-gray-300 mb-2">Materiales utilizados:</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {orden.materiales.map((material, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                    <div>
                      <span className="text-white font-medium">{material.nombre}</span>
                      <br />
                      <span className="text-gray-400 text-sm">
                        Cantidad: {material.cantidad} | Precio unit.: ${material.precioUnitario.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-bold">${material.valorTotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total general */}
      <div className="bg-red-900 bg-opacity-30 p-6 rounded-lg border border-red-500">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-white mb-2">
            Total General del Período
          </h4>
          <p className="text-3xl font-bold text-red-400">${data.totalMateriales.toFixed(2)}</p>
          <p className="text-gray-300 mt-2">
            {data.ordenes.length} {data.ordenes.length === 1 ? 'orden procesada' : 'órdenes procesadas'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente para vista previa de reportes por materias
const ReportesPorMaterias = ({ data }) => {
  console.log('Datos en ReportesPorMaterias:', data);
  
  if (!data || !data.ordenes || data.ordenes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-lg">No se encontraron datos para la materia prima seleccionada</div>
      </div>
    );
  }

  // Función para formatear fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular estadísticas
  const totalCantidad = data.ordenes.reduce((total, orden) => total + orden.cantidad, 0);
  const totalOrdenes = data.ordenes.length;

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          Resumen del Reporte por Materia Prima
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-300 text-sm">Total Órdenes</p>
            <p className="font-bold text-blue-400 text-xl">{totalOrdenes}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-300 text-sm">Cantidad Total Usada</p>
            <p className="font-bold text-yellow-400 text-xl">{totalCantidad.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-300 text-sm">Valor Total</p>
            <p className="font-bold text-green-400 text-xl">${data.totalMateriales.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Lista de usos de la materia prima */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-white">Uso de Materia Prima por Cliente</h4>
        {data.ordenes.map((orden, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
            {/* Encabezado del uso */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className="font-semibold text-lg text-white">
                  {orden.cliente}
                </h5>
                <p className="text-gray-400 text-sm">
                  Usuario: {orden.usuario} | Fecha de uso: {formatearFecha(orden.fechaUso)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">Valor Total:</p>
                <p className="font-bold text-green-400 text-lg">${orden.valorTotal.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Detalles del uso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800 p-3 rounded">
              <div className="text-center">
                <span className="text-gray-400 text-sm block">Cantidad Usada</span>
                <span className="text-white font-bold text-lg">{orden.cantidad}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-sm block">Precio Unitario</span>
                <span className="text-yellow-400 font-bold">${orden.valorUnitario.toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-sm block">Subtotal</span>
                <span className="text-green-400 font-bold">${orden.valorTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totales finales */}
      <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg border border-blue-500">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-white mb-2">
            Resumen Total de la Materia Prima
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-gray-300 text-sm">Cantidad Total Utilizada</p>
              <p className="text-2xl font-bold text-yellow-400">{totalCantidad.toFixed(2)} unidades</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Valor Total Generado</p>
              <p className="text-2xl font-bold text-green-400">${data.totalMateriales.toFixed(2)}</p>
            </div>
          </div>
          <p className="text-gray-300 mt-4">
            {totalOrdenes} {totalOrdenes === 1 ? 'orden utilizó' : 'órdenes utilizaron'} esta materia prima
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reportes;