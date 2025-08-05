import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteService from '../services/ClienteService'
import { FiEdit, FiTrash2, FiPlus, FiEye, FiUser, FiUserCheck, FiCreditCard, FiCalendar, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate()

  const cargarClientes = async () => {
    try {
      const res = await clienteService.obtenerTodos();
      console.log('Clientes cargados:', res.datos);
      setClientes(res.datos || []);
    } catch (error) {
      console.error('Error al cargar clientes:', error)
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await clienteService.eliminar(id)
        setClientes(prev => prev.filter(cliente => cliente.id !== id))
      } catch (error) {
        console.error('Error al eliminar cliente:', error)
      }
    }
  }

  const openDetailsModal = (cliente) => {
    setCurrentCliente(cliente)
    setShowModal(true)
  }

  const openEditModal = (cliente) => {
    setEditData({ ...cliente });
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
      const res = await clienteService.actualizar(id, nuevosDatos);
      setClientes(prev =>
        prev.map(cliente =>
          cliente.id === id ? { ...cliente, ...nuevosDatos } : cliente
        )
      );
    } catch (error) {
      alert('Error al editar cliente');
      console.error('Error al editar cliente:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleEdit(editData.id, {
        nombre: editData.nombre,
        apellido: editData.apellido,
        cedula: editData.cedula,
        fechaNacimiento: editData.fechaNacimiento,
        telefono: editData.telefono,
        email: editData.email,
        direccion: editData.direccion
      });
      setShowEditModal(false);
      alert('Cliente editado exitosamente');
    } catch (error) {
      alert('Error al editar cliente');
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
          Gestión de Clientes
        </motion.h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/cliente/registrar')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg shadow-lg hover:shadow-red-500/30 transition-all"
        >
          <FiPlus className="text-lg" />
          Nuevo Cliente
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Nombres</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Apellidos</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Cédula</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {clientes && clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <motion.tr 
                    key={cliente.id}
                    whileHover={{ 
                      backgroundColor: 'rgba(127, 29, 29, 0.1)',
                      transition: { duration: 0.2 }
                    }}
                    className="bg-gray-800/50 hover:bg-gray-800/80 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{cliente.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.apellido}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.cedula}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.telefono}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openDetailsModal(cliente)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 transition-all"
                        title="Ver detalles"
                      >
                        <FiEye />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(cliente)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 transition-all"
                        title="Editar"
                      >
                        <FiEdit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(cliente.id)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all"
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    No hay clientes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de Detalles */}
      <AnimatePresence>
        {showModal && currentCliente && (
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
                  Detalles del Cliente #{currentCliente.id}
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
                    Información Personal
                  </h4>
                  <div className="space-y-3">
                    <p className="text-gray-300"><span className="font-medium text-white">Nombre:</span> {currentCliente.nombre}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Apellido:</span> {currentCliente.apellido}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Cédula:</span> {currentCliente.cedula}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Fecha de Nacimiento:</span> {
                      currentCliente.fechaNacimiento ? new Date(currentCliente.fechaNacimiento).toLocaleDateString() : 'N/A'
                    }</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    Información de Contacto
                  </h4>
                  <div className="space-y-3">
                    <p className="text-gray-300"><span className="font-medium text-white">Teléfono:</span> {currentCliente.telefono}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Email:</span> {currentCliente.email}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Dirección:</span> {currentCliente.direccion}</p>
                  </div>
                </div>
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

      {/* Modal de Edición */}
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
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  <FiUser className="text-red-500" />
                  Editar Cliente #{editData.id}
                </h3>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </motion.button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Nombre *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-500" size={18} />
                      </div>
                      <input
                        type="text"
                        name="nombre"
                        value={editData.nombre}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Apellido *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUserCheck className="text-gray-500" size={18} />
                      </div>
                      <input
                        type="text"
                        name="apellido"
                        value={editData.apellido}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Cédula y Fecha de Nacimiento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Cédula *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCreditCard className="text-gray-500" size={18} />
                      </div>
                      <input
                        type="text"
                        name="cedula"
                        value={editData.cedula}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Fecha de Nacimiento *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-500" size={18} />
                      </div>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={editData.fechaNacimiento ? editData.fechaNacimiento.split('T')[0] : ''}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Teléfono y Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-500" size={18} />
                      </div>
                      <input
                        type="tel"
                        name="telefono"
                        value={editData.telefono}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-500" size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Dirección *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-500" size={18} />
                    </div>
                    <textarea
                      name="direccion"
                      value={editData.direccion}
                      onChange={handleEditChange}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-all"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg hover:shadow-red-500/30 transition-all"
                  >
                    Guardar Cambios
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Cliente