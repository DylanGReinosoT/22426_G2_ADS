import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ordenTrabajoService from '../services/OrdenTrabajoService'
import materiaprimaService from '../services/materiaPrimaService' // ✅ DESCOMENTADO
import { FiEdit, FiTrash2, FiPlus, FiEye } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const OrdenesTrabajo = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentOrden, setCurrentOrden] = useState(null);
  const [materiasCache, setMateriasCache] = useState(new Map()); 
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const navigate = useNavigate()

  const obtenerMateriasPrimasCompletas = async (materiasPrimasYcantidades) => {
    if (!materiasPrimasYcantidades || Object.keys(materiasPrimasYcantidades).length === 0) {
      return [];
    }


    const materiasCompletas = [];
    
    try {
      // Procesar cada materia prima del mapa
      for (const [materiaPrimaId, cantidad] of Object.entries(materiasPrimasYcantidades)) {
        const id = parseInt(materiaPrimaId);
        
        // Verificar si ya tenemos los datos en caché
        if (materiasCache.has(id)) {
          const materia = materiasCache.get(id);
          materiasCompletas.push({
            ...materia,
            cantidadUsada: cantidad
          });
        } else {
          try {
            // Obtener datos del backend
            const res = await materiaprimaService.obtenerPorId(id);
            console.log(`Response para materia prima ${id}:`, res); // Debug
            
            // Verificar la estructura del response
            const materia = res.datos || res; // Intentar ambas estructuras
            
            // Guardar en caché
            setMateriasCache(prev => new Map(prev.set(id, materia)));
            
            materiasCompletas.push({
              ...materia,
              cantidadUsada: cantidad
            });
            console.log(`Materia Prima ${id} cargada:`, materia);
          } catch (error) {
            console.error(`Error al obtener materia prima ${id}:`, error);
            // Fallback con datos mínimos
            materiasCompletas.push({
              id: id,
              nombre: `Materia Prima ${id}`,
              unidadMedida: 'N/A',
              cantidadUsada: cantidad,
              precioUnitario: 0
            });
          }
        }
      }
    } catch (error) {
      console.error('Error general al obtener materias primas:', error);
    }
    
    return materiasCompletas;
  };


  const cargarOrdenes = async () => {
    try {
      const res = await ordenTrabajoService.obtenerTodas();
      console.log('Ordenes cargadas:', res.datos);
      setOrdenes(res.datos || []);
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta orden?')) {
      try {
        await ordenTrabajoService.eliminar(id)
        setOrdenes(prev => prev.filter(orden => orden.id !== id))
      } catch (error) {
        console.error('Error al eliminar orden:', error)
      }
    }
  }

  const openDetailsModal = async (orden) => {
    setCurrentOrden(orden);
    setShowModal(true);
    
    // Si la orden tiene materias primas, cargar los datos completos
    if (orden.materiasPrimasYcantidades && Object.keys(orden.materiasPrimasYcantidades).length > 0) {
      setLoadingMaterias(true);
      try {
        const materiasCompletas = await obtenerMateriasPrimasCompletas(orden.materiasPrimasYcantidades);
        
        // Actualizar la orden actual con las materias primas completas
        setCurrentOrden(prev => ({
          ...prev,
          materiasPrimas: materiasCompletas
        }));
      } catch (error) {
        console.error('Error al cargar materias primas completas:', error);
      } finally {
        setLoadingMaterias(false);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black to-red-900">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"
      ></motion.div>
    </div>
  )

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-white"
        >
          Órdenes de Trabajo
        </motion.h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/crear')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg shadow-lg hover:shadow-red-500/30 transition-all"
        >
          <FiPlus className="text-lg" />
          Nueva Orden
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gradient-to-r from-black to-red-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Título</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Responsable</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {ordenes.map((orden) => (
                <motion.tr 
                  key={orden.id}
                  whileHover={{ 
                    backgroundColor: 'rgba(127, 29, 29, 0.1)',
                    transition: { duration: 0.2 }
                  }}
                  className="bg-gray-800/50 hover:bg-gray-800/80 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{orden.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{orden.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{orden.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{orden.usuario?.nombre || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{`${orden.cliente?.nombre.split(' ')[0]} ${orden.cliente?.apellido.split(' ')[0]}` || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                        orden.estado === 'COMPLETADA' ? 'bg-green-900/50 text-green-300' :
                        orden.estado === 'EN_PROCESO' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {orden.estado?.replace('_', ' ') || 'PENDIENTE'}
                    </motion.span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openDetailsModal(orden)}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 transition-all"
                      title="Ver detalles"
                    >
                      <FiEye />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/ordenes-trabajo/editar/${orden.id}`)}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 transition-all"
                      title="Editar"
                    >
                      <FiEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(orden.id)}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de Detalles */}
      <AnimatePresence>
        {showModal && currentOrden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  Detalles de Orden #{currentOrden.id}
                </h3>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold text-lg mb-3 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    Información Básica
                  </h4>
                  <div className="space-y-3">
                    <p className="text-gray-300"><span className="font-medium text-white">Título:</span> {currentOrden.titulo}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Descripción:</span> {currentOrden.descripcion}</p>
                    <div className="flex items-center">
                      <span className="font-medium text-white mr-2">Estado:</span>
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          currentOrden.estado === 'COMPLETADA' ? 'bg-green-900/50 text-green-300' :
                          currentOrden.estado === 'EN_PROCESO' ? 'bg-yellow-900/50 text-yellow-300' :
                          'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {currentOrden.estado?.replace('_', ' ') || 'PENDIENTE'}
                      </motion.span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    Responsables
                  </h4>
                  <div className="space-y-3">
                    <p className="text-gray-300"><span className="font-medium text-white">Cliente:</span> {currentOrden.cliente?.nombre || 'N/A'}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Responsable:</span> {currentOrden.usuario?.nombre || 'N/A'}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Fecha creación:</span> {new Date(currentOrden.fechaCreacion).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-3 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Materias Primas a usar
                </h4>
                
                {/* ✅ NUEVO: Mostrar loading específico para materias */}
                {loadingMaterias ? (
                  <div className="flex justify-center items-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"
                    ></motion.div>
                    <span className="ml-3 text-gray-300">Cargando materias primas...</span>
                  </div>
                ) : (
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gradient-to-r from-black to-red-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Nombre</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Cantidad Usada</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Unidad</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Precio Unit.</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {currentOrden.materiasPrimas?.length > 0 ? (
                          currentOrden.materiasPrimas.map((mp, index) => (
                            <motion.tr 
                              key={mp.id || index}
                              whileHover={{ backgroundColor: 'rgba(127, 29, 29, 0.1)' }}
                              className="bg-gray-800/50"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{mp.nombre}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{mp.cantidadUsada}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{mp.unidadMedida}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                ${mp.precioUnitario?.toFixed(2) || '0.00'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 font-semibold">
                                ${((mp.cantidadUsada || 0) * (mp.precioUnitario || 0)).toFixed(2)}
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                              No hay materias primas asignadas a esta orden
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {/* ✅ NUEVO: Total de materiales */}
                      {currentOrden.materiasPrimas?.length > 0 && (
                        <tfoot className="bg-gray-900">
                          <tr>
                            <td colSpan="4" className="px-4 py-3 text-right text-sm font-semibold text-white">
                              Total Materiales:
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-400">
                              ${currentOrden.materiasPrimas.reduce((total, mp) => 
                                total + ((mp.cantidadUsada || 0) * (mp.precioUnitario || 0)), 0
                              ).toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg border border-gray-600 hover:border-red-500 transition-all"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrdenesTrabajo