import api from './api'

// Función auxiliar para convertir fecha a formato yyyy-MM-ddTHH:mm:ss
const formatearFechaParaBackend = (fecha) => {
  if (!fecha) return null;
  // Convertir yyyy-MM-dd a yyyy-MM-ddT00:00:00 para LocalDateTime
  return `${fecha}T00:00:00`;
};

const reporteService = {
  // Generar/obtener reporte por fechas (tu backend retorna JSON, no PDF)
  generarReporteFechas: async (fechaInicio, fechaFin) => {
    try {
      const params = {
        fechaInicio: formatearFechaParaBackend(fechaInicio),
        fechaFin: formatearFechaParaBackend(fechaFin)
      };
      
      console.log('Enviando parámetros al backend:', params);
      
      const response = await api.get('/reportes/fechas', {
        params
      })
      return response.data
    } catch (error) {
      console.error('Error al generar reporte por fechas:', error)
      console.error('Response data:', error.response?.data)
      throw error
    }
  },

  // Generar/obtener reporte por materia prima
  generarReporteMaterias: async (nombreMateria = null) => {
    try {
      const params = nombreMateria ? { nombreMateria } : {}
      const response = await api.get('/reportes/materia', {
        params
      })
      return response.data
    } catch (error) {
      console.error('Error al generar reporte por materias:', error)
      throw error
    }
  },

  // Para vista previa, usamos las mismas funciones ya que tu backend retorna JSON
  obtenerDatosReporteFechas: async (fechaInicio, fechaFin) => {
    return reporteService.generarReporteFechas(fechaInicio, fechaFin);
  },

  obtenerDatosReporteMaterias: async (nombreMateria = null) => {
    return reporteService.generarReporteMaterias(nombreMateria);
  },

  generarPDFFechas: async (reporteData) => {
    try {
      const response = await api.post('/reportes/fechas/pdf', reporteData, {
        responseType: 'blob', //  Importante para archivos binarios
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      return response.data; // Retorna el blob del PDF
    } catch (error) {
      console.error('Error al generar PDF por fechas:', error);
      throw error;
    }
  },

  generarPDFMaterias: async (reporteData) => {
    try {
      const response = await api.post('/reportes/materia/pdf', reporteData, {
        responseType: 'blob', //  Importante para archivos binarios
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      return response.data; // Retorna el blob del PDF
    } catch (error) {
      console.error('Error al generar PDF por materias:', error);
      throw error;
    }
  }
}

export default reporteService
