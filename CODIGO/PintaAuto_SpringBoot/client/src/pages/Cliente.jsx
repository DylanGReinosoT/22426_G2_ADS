import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteService from '../services/ClienteService'
import { FiEdit, FiTrash2, FiPlus, FiEye, FiUser, FiUserCheck, FiCreditCard, FiCalendar, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'

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
      // Actualiza el estado local con el cliente editado
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
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Clientes</h2>
        <button
          onClick={() => navigate('/dashboard/cliente/registrar')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition"
        >
          <FiPlus /> Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Nacimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes && clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{cliente.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.apellido}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.cedula}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.fechaNacimiento ? new Date(cliente.fechaNacimiento).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefono}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cliente.direccion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => openDetailsModal(cliente)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Ver detalles"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => openEditModal(cliente)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Editar"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No hay clientes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showModal && currentCliente && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Detalles del Cliente #{currentCliente.id}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Información Personal</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Nombre:</span> {currentCliente.nombre}</p>
                  <p><span className="font-medium">Apellido:</span> {currentCliente.apellido}</p>
                  <p><span className="font-medium">Cédula:</span> {currentCliente.cedula}</p>
                  <p><span className="font-medium">Fecha de Nacimiento:</span> {
                    currentCliente.fechaNacimiento ? new Date(currentCliente.fechaNacimiento).toLocaleDateString() : 'N/A'
                  }</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Información de Contacto</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Teléfono:</span> {currentCliente.telefono}</p>
                  <p><span className="font-medium">Email:</span> {currentCliente.email}</p>
                  <p><span className="font-medium">Dirección:</span> {currentCliente.direccion}</p>
                </div>
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

      {/* Modal de Edición */}
      {showEditModal && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Editar Cliente #{editData.id}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nombre *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      value={editData.nombre}
                      onChange={handleEditChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Apellido *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUserCheck className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="apellido"
                      value={editData.apellido}
                      onChange={handleEditChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Cédula y Fecha de Nacimiento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Cédula *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCreditCard className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="cedula"
                      value={editData.cedula}
                      onChange={handleEditChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={editData.fechaNacimiento ? editData.fechaNacimiento.split('T')[0] : ''}
                      onChange={handleEditChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Teléfono y Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="tel"
                      name="telefono"
                      value={editData.telefono}
                      onChange={handleEditChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Dirección *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" size={18} />
                  </div>
                  <textarea
                    name="direccion"
                    value={editData.direccion}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cliente