import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
//import ordenTrabajoService from '../services/OrdenTrabajoService'
import materiaPrimaService from '../services/materiaPrimaService'
//import clienteService from '../services/clienteService'
//import usuarioService from '../services/usuarioService'
import { FiSave, FiArrowLeft } from 'react-icons/fi'

const OrdenTrabajoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    usuarioId: '',
    clienteId: '',
    materiasPrimasIds: []
  })
  
  // Opciones para selects
  const [materiasPrimas, setMateriasPrimas] = useState([])
  const [clientes, setClientes] = useState([])
  const [usuarios, setUsuarios] = useState([])
  
  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [mpsRes, clientesRes, usuariosRes] = await Promise.all([
          materiaPrimaService.obtenerTodas(),
          clienteService.obtenerTodos(),
          usuarioService.obtenerTodos()
        ])
        
        setMateriasPrimas(mpsRes.datos.materias)
        setClientes(clientesRes.datos.clientes)
        setUsuarios(usuariosRes.datos.usuarios)
        
        if (id) {
          setIsEditMode(true)
          const ordenRes = await ordenTrabajoService.obtenerPorId(id)
          const orden = ordenRes.datos.orden
          setFormData({
            titulo: orden.titulo,
            descripcion: orden.descripcion,
            usuarioId: orden.usuario.id,
            clienteId: orden.cliente.id,
            materiasPrimasIds: orden.materiasPrimas.map(mp => mp.id)
          })
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    cargarDatos()
  }, [id])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleMateriaPrimaChange = (e) => {
    const options = e.target.options
    const selectedIds = []
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value)
      }
    }
    setFormData(prev => ({ ...prev, materiasPrimasIds: selectedIds }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (isEditMode) {
        await ordenTrabajoService.actualizar(id, formData)
      } else {
        await ordenTrabajoService.crear(formData)
      }
      navigate('/orden')
    } catch (error) {
      console.error('Error guardando orden:', error)
      alert('Ocurrió un error al guardar la orden')
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/orden')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft /> Volver
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">
          {isEditMode ? 'Editar Orden de Trabajo' : 'Nueva Orden de Trabajo'}
        </h2>
        <div className="w-8"></div> {/* Espaciador para alinear el título */}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                minLength="5"
                maxLength="80"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Cliente *</label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
              maxLength="255"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-1">Responsable *</label>
              <select
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar responsable</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Materias Primas *</label>
              <select
                name="materiasPrimasIds"
                multiple
                value={formData.materiasPrimasIds}
                onChange={handleMateriaPrimaChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-auto min-h-[100px]"
                required
              >
                {materiasPrimas.map(mp => (
                  <option key={mp.id} value={mp.id}>
                    {mp.nombre} ({mp.cantidad} {mp.unidadMedida})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl para seleccionar múltiples</p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              <FiSave /> {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrdenTrabajoForm