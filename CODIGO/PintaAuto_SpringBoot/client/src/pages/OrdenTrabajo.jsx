import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ordenTrabajoService from '../services/OrdenTrabajoService'
import { FiEdit, FiTrash2, FiPlus, FiEye } from 'react-icons/fi'

const OrdenesTrabajo = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentOrden, setCurrentOrden] = useState(null);
  const navigate = useNavigate()

  const cargarOrdenes = async () => {
    try {
      // setLoading(true)
      const res = await ordenTrabajoService.obtenerTodas();
      console.log('Ordenes cargadas:', res.datos);
      setOrdenes(res.datos || []);
      
      // setOrdenes(res.datos.ordenes)
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

  const openDetailsModal = (orden) => {
    setCurrentOrden(orden)
    setShowModal(true)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Órdenes de Trabajo</h2>
        <button
          onClick={() => navigate('/orden/crear')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition"
        >
          <FiPlus /> Nueva Orden
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordenes.map((orden) => (
                <tr key={orden.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orden.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{orden.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{orden.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orden.usuario?.nombre || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${orden.cliente?.nombre.split(' ')[0]} ${orden.cliente?.apellido.split(' ')[0]}` || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      orden.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                      orden.estado === 'EN_PROCESO' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {orden.estado?.replace('_', ' ') || 'PENDIENTE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button
                      onClick={() => openDetailsModal(orden)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Ver detalles"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => navigate(`/ordenes-trabajo/editar/${orden.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="Editar"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(orden.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showModal && currentOrden && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Detalles de Orden #{currentOrden.id}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Información Básica</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Título:</span> {currentOrden.titulo}</p>
                  <p><span className="font-medium">Descripción:</span> {currentOrden.descripcion}</p>
                  <p><span className="font-medium">Estado:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      currentOrden.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                      currentOrden.estado === 'EN_PROCESO' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {currentOrden.estado?.replace('_', ' ') || 'PENDIENTE'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Responsables</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Cliente:</span> {currentOrden.cliente?.nombre || 'N/A'}</p>
                  <p><span className="font-medium">Responsable:</span> {currentOrden.usuario?.nombre || 'N/A'}</p>
                  <p><span className="font-medium">Fecha creación:</span> {new Date(currentOrden.fechaCreacion).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Materias Primas a usar</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrden.materiasPrimas?.map((mp) => (
                      <tr key={mp.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{mp.nombre}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{mp.cantidad}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{mp.unidadMedida}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdenesTrabajo