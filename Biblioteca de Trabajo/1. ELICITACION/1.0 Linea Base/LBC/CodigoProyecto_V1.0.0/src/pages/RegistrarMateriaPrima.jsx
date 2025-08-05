import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import materiaprimaService from '../services/materiaPrimaService'

const RegistrarMateriaPrima = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    unidad: 'kg',
    precioUnitario: '',
  })
  
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await materiaprimaService.crear({
        nombre: formData.nombre,
        cantidad: formData.cantidad,
        unidadMedida: formData.unidad, // Asegúrate que el backend espera este nombre
        precioUnitario: formData.precioUnitario,
      });
      alert('Materia prima registrada con éxito!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error al registrar materia prima');
      console.error(error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registrar Nueva Materia Prima</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="nombre">
            Nombre de la Materia Prima
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="cantidad">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.cantidad}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="unidad">
              Unidad de Medida
            </label>
            <select
              id="unidad"
              name="unidad"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.unidad}
              onChange={handleChange}
              required
            >
              <option value="kg">Kilogramos (kg)</option>
              <option value="g">Gramos (g)</option>
              <option value="l">Litros (l)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="unidades">Unidades</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="fechaIngreso">
            Precio Unitario
          </label>
          <input
            type="input"
            id="precioUnitario"
            name="precioUnitario"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.precioUnitario}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Registrar Materia Prima
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegistrarMateriaPrima