// Documentación de estructuras de datos para los reportes

/**
 * Estructura para ReporteFechas
 * @typedef {Object} ReporteFechas
 * @property {string} fechaInicio - Fecha de inicio del reporte
 * @property {string} fechaFin - Fecha fin del reporte
 * @property {ReportePorCliente[]} reportesPorCliente - Array de reportes por cliente
 * @property {number} totalOrdenes - Total de órdenes encontradas
 * @property {number} totalGeneral - Total general de todos los materiales
 */

/**
 * @typedef {Object} ReportePorCliente
 * @property {Object} cliente - Información del cliente
 * @property {number} cliente.id
 * @property {string} cliente.nombre
 * @property {string} cliente.apellido
 * @property {string} cliente.cedula
 * @property {string} cliente.email
 * @property {MaterialUtilizado[]} materiales - Materiales utilizados por el cliente
 * @property {number} totalMateriales - Total de materiales del cliente
 */

/**
 * @typedef {Object} MaterialUtilizado
 * @property {number} id
 * @property {string} nombre
 * @property {string} codigo
 * @property {number} cantidad
 * @property {string} unidadMedida
 * @property {number} precioUnitario
 * @property {number} subtotal
 */

/**
 * Estructura para ReporteMaterias
 * @typedef {Object} ReporteMaterias
 * @property {string|null} materiaPrimaFiltro - Filtro aplicado o null si es todos
 * @property {ReportePorMateria[]} reportesPorMateria - Array de reportes por materia
 * @property {number} totalOrdenes - Total de órdenes encontradas
 * @property {string} totalMaterialesUtilizados - Total con unidades mixtas
 */

/**
 * @typedef {Object} ReportePorMateria
 * @property {Object} materiaPrima - Información de la materia prima
 * @property {number} materiaPrima.id
 * @property {string} materiaPrima.nombre
 * @property {string} materiaPrima.codigo
 * @property {string} materiaPrima.unidadMedida
 * @property {OrdenConMaterial[]} ordenes - Órdenes que usaron esta materia
 * @property {number} cantidadTotal - Cantidad total utilizada
 */

/**
 * @typedef {Object} OrdenConMaterial
 * @property {number} id
 * @property {string} numeroOrden
 * @property {string} fecha
 * @property {Object} cliente - Información del cliente
 * @property {number} cliente.id
 * @property {string} cliente.nombre
 * @property {string} cliente.apellido
 * @property {string} cliente.cedula
 * @property {number} cantidadUtilizada
 */

// Ejemplo de datos de prueba para el frontend
export const ejemploReporteFechas = {
  fechaInicio: "2024-01-01",
  fechaFin: "2024-01-31",
  totalOrdenes: 5,
  totalGeneral: 1250.00,
  reportesPorCliente: [
    {
      cliente: {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        cedula: "1234567890",
        email: "juan@email.com"
      },
      totalMateriales: 500.00,
      materiales: [
        {
          id: 1,
          nombre: "Pintura Roja",
          codigo: "PR001",
          cantidad: 2,
          unidadMedida: "litros",
          precioUnitario: 150.00,
          subtotal: 300.00
        },
        {
          id: 2,
          nombre: "Disolvente",
          codigo: "DS001",
          cantidad: 1,
          unidadMedida: "litros",
          precioUnitario: 200.00,
          subtotal: 200.00
        }
      ]
    }
  ]
};

export const ejemploReporteMaterias = {
  materiaPrimaFiltro: null,
  totalOrdenes: 8,
  totalMaterialesUtilizados: "15 litros, 5 kg",
  reportesPorMateria: [
    {
      materiaPrima: {
        id: 1,
        nombre: "Pintura Roja",
        codigo: "PR001",
        unidadMedida: "litros"
      },
      cantidadTotal: 10,
      ordenes: [
        {
          id: 1,
          numeroOrden: "ORD-001",
          fecha: "2024-01-15",
          cliente: {
            id: 1,
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "1234567890"
          },
          cantidadUtilizada: 2
        },
        {
          id: 2,
          numeroOrden: "ORD-002",
          fecha: "2024-01-20",
          cliente: {
            id: 2,
            nombre: "María",
            apellido: "González",
            cedula: "0987654321"
          },
          cantidadUtilizada: 3
        }
      ]
    }
  ]
};
