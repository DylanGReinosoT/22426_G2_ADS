import materiaPrimaService from '../services/materiaPrimaService';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { FiEdit, FiTrash2, FiX, FiSave, FiLogOut } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion';

const MateriaPrima = () => {
  const [materiaPrima, setMateriaPrima] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  const openEditModal = (item) => {
    setEditData({ ...item });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = async (id, nuevosDatos) => {
    try {
      const res = await materiaPrimaService.actualizar(id, nuevosDatos);
      setMateriaPrima(prev =>
        prev.map(item =>
          item.id === id ? { ...item, ...nuevosDatos } : item
        )
      );
    } catch (error) {
      alert('Error al editar materia prima');
      console.error('Error al editar materia:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleEdit(editData.id, {
        nombre: editData.nombre,
        cantidad: editData.cantidad,
        unidadMedida: editData.unidadMedida,
        detalles: editData.detalles,
        precioUnitario: editData.precioUnitario,
        fechaIngreso: editData.fechaIngreso || new Date().toISOString().split('T')[0]
      });
      setShowEditModal(false);
    } catch (error) {
      alert('Error al editar materia prima');
    }
  };

  const cargarMaterias = async () => {
    try {
      const res = await materiaPrimaService.obtenerTodas();
      setMateriaPrima(res.datos.materias);
    } catch (error) {
      console.error('Error al cargar materias primas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta materia prima?')) {
      try {
        await materiaPrimaService.eliminar(id);
        setMateriaPrima(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error al eliminar materia:', error);
      }
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black to-red-900">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"
          >
            Materia Prima Disponible
          </motion.h2>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gradient-to-r from-black to-red-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Unidad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Detalles</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Precio Unitario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Fecha de ingreso</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {materiaPrima.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.cantidad}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.unidadMedida}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.detalles}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${item.precioUnitario}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {item.fechaIngreso
                        ? new Date(item.fechaIngreso).toLocaleDateString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' })
                        : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-400 hover:text-red-300 mr-4"
                        onClick={() => openEditModal(item)}
                      >
                        <FiEdit size={18} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-500"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FiTrash2 size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* MODAL DE EDICIÓN */}
        <AnimatePresence>
          {showEditModal && editData && (
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
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Editar Materia Prima</h3>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </motion.button>
                </div>
                
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={editData.nombre}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        value={editData.cantidad}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Unidad de Medida</label>
                    <select
                      name="unidadMedida"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={editData.unidadMedida}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="g">Gramos (g)</option>
                      <option value="l">Litros (l)</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="unidades">Unidades</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Precio Unitario</label>
                    <input
                      type="number"
                      name="precioUnitario"
                      value={editData.precioUnitario}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Detalles</label>
                    <input
                      type="text"
                      name="detalles"
                      value={editData.detalles}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 transition-all flex items-center gap-2"
                    >
                      <FiSave /> Guardar
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MateriaPrima