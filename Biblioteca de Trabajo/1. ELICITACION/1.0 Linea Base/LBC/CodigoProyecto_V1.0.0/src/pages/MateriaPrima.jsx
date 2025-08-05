import materiaPrimaService from '../services/materiaPrimaService';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { FiEdit, FiTrash2 } from 'react-icons/fi'



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
    // Actualiza el estado local con la materia editada
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
        precioUnitario: editData.precioUnitario,
      });
      setShowEditModal(false);
    } catch (error) {
      alert('Error al editar materia prima');
    }
  };

  const cargarMaterias = async () => {
    try {
      const res = await materiaPrimaService.obtenerTodas();
      setMateriaPrima(res.datos.materias); // asegúrate de que la estructura del backend es correcta
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
    try {
      await materiaPrimaService.eliminar(id);
      setMateriaPrima(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar materia:', error);
    }
  }



  if (loading) return <p>Cargando materias primas...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Volver al Inicio
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">Materia Prima Disponible</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materiaPrima.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unidadMedida}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.precioUnitario}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3"
                   onClick={() => openEditModal(item)}
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* MODAL DE EDICIÓN */}
      {showEditModal && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Editar Materia Prima</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={editData.nombre}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={editData.cantidad}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Unidad de Medida</label>
                <select
                  id="unidad"
                  name="unidadMedida"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-gray-700 mb-1">Precio Unitario</label>
                <input
                  type="number"
                  name="precioUnitario"
                  value={editData.precioUnitario}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
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

export default MateriaPrima
