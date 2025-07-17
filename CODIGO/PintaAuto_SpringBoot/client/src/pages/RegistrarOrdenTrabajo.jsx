import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ordenTrabajoService from '../services/OrdenTrabajoService'
import materiaPrimaService from '../services/materiaPrimaService'
import clienteService from '../services/ClienteService'
// import usuarioService from '../services/UsuarioService'
import { FiSave, FiArrowLeft, FiTruck, FiUser, FiTool, FiPackage } from 'react-icons/fi'

const OrdenTrabajoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [currentUser, setCurrentUser] = useState(null)
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    vehiculo: '',
    usuarioId: '',
    clienteId: '',
    materiasPrimasIds: []
  })
  
  const [materiasPrimas, setMateriasPrimas] = useState([])
  const [clientes, setClientes] = useState([])
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    // Obtener usuario logueado desde localStorage
    const obtenerUsuarioLogueado = () => {
      try {
        const userData = localStorage.getItem('user') || localStorage.getItem('userData')
        if (userData) {
          const user = JSON.parse(userData)
          setCurrentUser(user)
          // Establecer automáticamente el usuarioId en el formulario
          setFormData(prev => ({ ...prev, usuarioId: user.id }))
        } else {
          // Si no hay usuario logueado, redirigir al login
          navigate('/login')
        }
      } catch (error) {
        console.error('Error obteniendo usuario logueado:', error)
        navigate('/login')
      }
    }

    obtenerUsuarioLogueado()
  }, [navigate])
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [mpsRes, clientesRes, usuariosRes] = await Promise.all([
          materiaPrimaService.obtenerTodas(),
          clienteService.obtenerTodos(),
          // usuarioService.obtenerTodos()
        ])
        
        setMateriasPrimas(mpsRes.datos.materias)
        setClientes(clientesRes.datos)
        // setUsuarios(usuariosRes.datos.usuarios)
        
        if (id) {
          setIsEditMode(true)
          const ordenRes = await ordenTrabajoService.obtenerPorId(id)
          const orden = ordenRes.datos.orden
          setFormData({
            titulo: orden.titulo,
            descripcion: orden.descripcion,
            vehiculo: orden.vehiculo || '',
            // usuarioId: orden.usuario.id,
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
    // Solo cargar datos si ya tenemos el usuario
    if (currentUser) {
      cargarDatos()
    }
  }, [id, currentUser])
  
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
      navigate('/dashboard/orden')
    } catch (error) {
      console.error('Error guardando orden:', error)
      alert('Ocurrió un error al guardar la orden')
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Encabezado con gradiente */}
      <div className="bg-gradient-to-r from-black to-red-900 rounded-xl shadow-xl mb-8 overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <button
            onClick={() => navigate('/ordenes-trabajo')}
            className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
          >
            <FiArrowLeft className="text-red-400" /> 
            <span className="font-medium">Volver al listado</span>
          </button>
          
          <h2 className="text-3xl font-bold text-white px-4 py-2">
            {isEditMode ? 'Editar Orden de Trabajo' : 'Nueva Orden de Trabajo'}
          </h2>
          
          <div className="w-8"></div>
        </div>
      </div>
      
      {/* Tarjeta del formulario con gradiente sutil */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Barra superior con gradiente */}
        <div className="bg-gradient-to-r from-black via-red-900 to-black h-2"></div>
        
        {/* Encabezado del formulario */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center">
          <FiTool className="text-red-500 mr-3 text-xl" />
          <h3 className="font-semibold text-lg text-white">Datos de la Orden</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Título */}
            <div className="relative group">
              <label className="block text-gray-800 font-medium mb-1 flex items-center gap-2">
                <FiTool className="text-red-600 group-hover:text-red-700 transition-colors" /> 
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white shadow-sm group-hover:shadow-md"
                placeholder="Ej: Reparación de abolladura frontal"
                required
                minLength="5"
                maxLength="80"
              />
            </div>
            
            {/* Campo Vehículo */}
            <div className="relative group">
              <label className="block text-gray-800 font-medium mb-1 flex items-center gap-2">
                <FiTruck className="text-red-600 group-hover:text-red-700 transition-colors" /> 
                Vehículo *
              </label>
              <input
                type="text"
                name="vehiculo"
                value={formData.vehiculo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white shadow-sm group-hover:shadow-md"
                placeholder="Ej: Mazda 5"
                required
              />
            </div>
          </div>
          
          {/* Campo Descripción */}
          <div className="relative group">
            <label className="block text-gray-800 font-medium mb-1">
              Descripción detallada *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white shadow-sm group-hover:shadow-md"
              rows="4"
              placeholder="Describa los trabajos a realizar..."
              required
              maxLength="500"
            ></textarea>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">
                Máximo 500 caracteres
              </p>
              <p className={`text-xs font-medium ${formData.descripcion.length > 450 ? 'text-red-600' : 'text-gray-600'}`}>
                {formData.descripcion.length}/500
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Cliente */}
            <div className="relative group">
              <label className="block text-gray-800 font-medium mb-1 flex items-center gap-2">
                <FiUser className="text-red-600 group-hover:text-red-700 transition-colors" /> 
                Cliente *
              </label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white shadow-sm group-hover:shadow-md"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido || ''}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Campo Técnico */}
            <div className="relative group">
              <label className="block text-gray-800 font-medium mb-1 flex items-center gap-2">
                <FiUser className="text-red-600 group-hover:text-red-700 transition-colors" /> 
                Técnico Responsable *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={currentUser ? `${currentUser.nombre} ${currentUser.apellido || ''}` : 'Cargando...'}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  placeholder="Usuario logueado"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    Auto-asignado
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Se asigna automáticamente al usuario logueado
              </p>
            </div>
          </div>
          
          {/* Campo Materiales */}
          <div className="relative group">
            <label className="block text-gray-800 font-medium mb-1 flex items-center gap-2">
              <FiPackage className="text-red-600 group-hover:text-red-700 transition-colors" /> 
              Materiales a utilizar *
            </label>
            <select
              name="materiasPrimasIds"
              multiple
              value={formData.materiasPrimasIds}
              onChange={handleMateriaPrimaChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white shadow-sm group-hover:shadow-md h-auto min-h-[100px]"
              required
            >
              {materiasPrimas.map(mp => (
                <option key={mp.id} value={mp.id}>
                  {mp.nombre} - {mp.cantidad} {mp.unidadMedida} (${mp.precioUnitario?.toFixed(2) || '0.00'})
                </option>
              ))}
            </select>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">
                Mantén presionado Ctrl (Windows) o ⌘ (Mac) para seleccionar múltiples
              </p>
              <p className={`text-xs font-medium ${formData.materiasPrimasIds.length > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                Seleccionados: {formData.materiasPrimasIds.length}
              </p>
            </div>
          </div>
          
          {/* Botones de acción con gradiente */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/ordenes-trabajo')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-medium rounded-lg mr-4 hover:from-gray-300 hover:to-gray-400 transition-all shadow-sm hover:shadow-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-medium rounded-lg shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl"
            >
              <FiSave />
              {submitting ? (
                <span className="flex items-center">
                  <span className="animate-pulse">Guardando...</span>
                </span>
              ) : 'Guardar Orden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrdenTrabajoForm