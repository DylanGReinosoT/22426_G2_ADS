import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ordenTrabajoService from '../services/OrdenTrabajoService'
import materiaprimaService from '../services/materiaPrimaService' 
import clienteService from '../services/ClienteService'
import { FiSave, FiArrowLeft, FiTruck, FiUser, FiTool, FiPackage, FiCheck, FiX } from 'react-icons/fi'

const OrdenTrabajoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [currentUser, setCurrentUser] = useState(null)
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    vehiculo: '',
    usuarioId: '',
    clienteId: '',
    materiasPrimasYCantidades: {}
  })
  
  const [materiasPrimas, setMateriasPrimas] = useState([])
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    const obtenerUsuarioLogueado = () => {
      try {
        const userData = localStorage.getItem('user') || localStorage.getItem('userData')
        if (userData) {
          const user = JSON.parse(userData)
          setCurrentUser(user)
          setFormData(prev => ({ ...prev, usuarioId: user.id }))
        } else {
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
        const [mpsRes, clientesRes] = await Promise.all([
          materiaprimaService.obtenerTodas(), // ✅ CORREGIDO: usar materiaprimaService
          clienteService.obtenerTodos(),
        ])
        
        setMateriasPrimas(mpsRes.datos.materias)
        setClientes(clientesRes.datos)
        
        if (id) {
          setIsEditMode(true)
          const ordenRes = await ordenTrabajoService.obtenerPorId(id)
          const orden = ordenRes.datos.orden

          const materiasSeleccionadas = orden.materiasPrimasYcantidades 
          ? Object.keys(orden.materiasPrimasYcantidades).map(id => id.toString())
          : []
          setFormData({
            titulo: orden.titulo,
            descripcion: orden.descripcion,
            vehiculo: orden.vehiculo || '',
            clienteId: orden.cliente.id,
            materiasPrimasYCantidades: materiasSeleccionadas
          })
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (currentUser) {
      cargarDatos()
    }
  }, [id, currentUser])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
    const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar que al menos un material esté seleccionado
    if (Object.keys(formData.materiasPrimasYCantidades).length === 0) {
      alert('Debes seleccionar al menos un material')
      return
    }
    
    // Validar que todas las cantidades sean válidas
    const invalidMaterials = Object.entries(formData.materiasPrimasYCantidades).filter(([id, cantidad]) => {
      const material = materiasPrimas.find(mp => mp.id.toString() === id)
      return !material || cantidad <= 0 || cantidad > material.cantidad
    })
    
    if (invalidMaterials.length > 0) {
      alert('Hay materiales con cantidades inválidas. Por favor revisa las cantidades.')
      return
    }
    
    setSubmitting(true)
    
    try {
      // Convertir las claves a números para el backend
      const materiasPrimasYcantidades = {}
      Object.entries(formData.materiasPrimasYCantidades).forEach(([id, cantidad]) => {
        materiasPrimasYcantidades[parseInt(id)] = parseFloat(cantidad)
      })
      
      const dataToSend = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        vehiculo: formData.vehiculo,
        usuarioId: formData.usuarioId,
        clienteId: parseInt(formData.clienteId),
        materiasPrimasYcantidades: materiasPrimasYcantidades
      }
      
      console.log('Datos a enviar:', dataToSend) // Para debug
      
      if (isEditMode) {
        await ordenTrabajoService.actualizar(id, dataToSend)
      } else {
        await ordenTrabajoService.crear(dataToSend)
      }
      
      setSuccess(true)
      setTimeout(() => navigate('/dashboard/orden'), 1500)
    } catch (error) {
      console.error('Error guardando orden:', error)
      alert('Ocurrió un error al guardar la orden: ' + (error.response?.data?.message || error.message))
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Encabezado con gradiente animado */}
      <div className="bg-gradient-to-r from-black via-red-900 to-black rounded-xl shadow-xl mb-8 overflow-hidden animate-gradient-x">
        <div className="flex justify-between items-center p-6 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>
          
          <button
            onClick={() => navigate('/dashboard/orden')}
            className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors relative z-10 group"
          >
            <FiArrowLeft className="text-red-400 group-hover:animate-pulse" /> 
            <span className="font-medium">Volver al listado</span>
          </button>
          
          <h2 className="text-3xl font-bold text-white px-4 py-2 relative z-10">
            {isEditMode ? 'Editar Orden de Trabajo' : 'Nueva Orden de Trabajo'}
          </h2>
          
          <div className="w-8"></div>
        </div>
      </div>
      
      {/* Tarjeta del formulario con fondo oscuro */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Barra superior con gradiente */}
        <div className="bg-gradient-to-r from-black via-red-900 to-black h-2"></div>
        
        {/* Encabezado del formulario */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex items-center border-b border-gray-700">
          <div className="relative">
            <FiTool className="text-red-500 mr-3 text-xl relative z-10" />
            <div className="absolute -inset-2 bg-red-500 rounded-full opacity-20 blur-sm"></div>
          </div>
          <h3 className="font-semibold text-lg text-white">Datos de la Orden</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensaje de éxito */}
          {success && (
            <div className="animate-bounce-in p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-emerald-200 rounded-lg border border-emerald-700 flex items-start backdrop-blur-sm">
              <FiCheck className="w-5 h-5 mr-2 flex-shrink-0 text-emerald-400" />
              <span>¡Orden guardada con éxito! Redirigiendo...</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Título */}
            <div className="relative group">
              <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
                <FiTool className="text-red-400 group-hover:text-red-300 transition-colors" /> 
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-700 text-white shadow-sm group-hover:shadow-md placeholder-gray-400"
                placeholder="Ej: Reparación de abolladura frontal"
                required
                minLength="5"
                maxLength="80"
              />
            </div>
            
            {/* Campo Vehículo */}
            <div className="relative group">
              <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
                <FiTruck className="text-red-400 group-hover:text-red-300 transition-colors" /> 
                Vehículo *
              </label>
              <input
                type="text"
                name="vehiculo"
                value={formData.vehiculo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-700 text-white shadow-sm group-hover:shadow-md placeholder-gray-400"
                placeholder="Ej: Mazda 5"
                required
              />
            </div>
          </div>
          
          {/* Campo Descripción */}
          <div className="relative group">
            <label className="block text-gray-300 font-medium mb-1">
              Descripción detallada *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-700 text-white shadow-sm group-hover:shadow-md placeholder-gray-400"
              rows="4"
              placeholder="Describa los trabajos a realizar..."
              required
              maxLength="500"
            ></textarea>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-400">
                Máximo 500 caracteres
              </p>
              <p className={`text-xs font-medium ${formData.descripcion.length > 450 ? 'text-red-400' : 'text-gray-400'}`}>
                {formData.descripcion.length}/500
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Cliente */}
            <div className="relative group">
              <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
                <FiUser className="text-red-400 group-hover:text-red-300 transition-colors" /> 
                Cliente *
              </label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-gray-700 text-white shadow-sm group-hover:shadow-md"
                required
              >
                <option value="" className="text-gray-400">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id} className="bg-gray-800">
                    {cliente.nombre} {cliente.apellido || ''}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Campo Técnico */}
            <div className="relative group">
              <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
                <FiUser className="text-red-400 group-hover:text-red-300 transition-colors" /> 
                Técnico Responsable *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={currentUser ? `${currentUser.nombre} ${currentUser.apellido || ''}` : 'Cargando...'}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 cursor-not-allowed"
                  placeholder="Usuario logueado"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-xs text-gray-300 bg-gray-600 px-2 py-1 rounded">
                    Auto-asignado
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Se asigna automáticamente al usuario logueado
              </p>
            </div>
          </div>
          
                    {/* Campo Materiales */}
          <div className="relative group">
            <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
              <FiPackage className="text-red-400 group-hover:text-red-300 transition-colors" /> 
              Materiales a utilizar *
            </label>
            
            <div className="border border-gray-600 rounded-lg bg-gray-700 shadow-sm max-h-80 overflow-y-auto">
              <div className="p-3 border-b border-gray-600 bg-gray-800">
                <p className="text-sm font-medium text-gray-300">Selecciona los materiales y cantidades necesarias:</p>
              </div>
              
              <div className="p-3 space-y-3">
                {materiasPrimas.length > 0 ? (
                  materiasPrimas.map(mp => (
                    <div 
                      key={mp.id} 
                      className="flex items-start gap-3 p-3 hover:bg-gray-600/50 rounded-md transition-colors border border-gray-600/50"
                    >
                      <input
                        type="checkbox"
                        id={`material-${mp.id}`}
                        checked={formData.materiasPrimasYCantidades.hasOwnProperty(mp.id)}
                        onChange={(e) => {
                          setFormData(prev => {
                            const newMaterias = { ...prev.materiasPrimasYCantidades }
                            if (e.target.checked) {
                              newMaterias[mp.id] = 1.0 // Cantidad por defecto
                            } else {
                              delete newMaterias[mp.id]
                            }
                            return { ...prev, materiasPrimasYCantidades: newMaterias }
                          })
                        }}
                        className="w-4 h-4 text-red-600 border-gray-500 rounded focus:ring-red-500 focus:ring-2 mt-2 bg-gray-600"
                      />
                      
                      <div className="flex-1">
                        <label 
                          htmlFor={`material-${mp.id}`} 
                          className="cursor-pointer block"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-100">{mp.nombre}</span>
                            <span className="text-sm font-semibold text-green-400">
                              ${mp.precioUnitario?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">
                              Stock: {mp.cantidad} {mp.unidadMedida}
                            </span>
                            {mp.cantidad <= 10 && (
                              <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded-full">
                                Stock bajo
                              </span>
                            )}
                          </div>
                        </label>
                        
                        {/* Input de cantidad cuando está seleccionado */}
                        {formData.materiasPrimasYCantidades.hasOwnProperty(mp.id) && (
                          <div className="mt-3 flex items-center gap-3">
                            <label className="text-sm text-gray-300 font-medium min-w-[70px]">
                              Cantidad:
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max={mp.cantidad}
                                step="1"
                                value={formData.materiasPrimasYCantidades[mp.id] || 1.0}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0
                                  if (value <= mp.cantidad) {
                                    setFormData(prev => ({
                                      ...prev,
                                      materiasPrimasYCantidades: {
                                        ...prev.materiasPrimasYCantidades,
                                        [mp.id]: value
                                      }
                                    }))
                                  }
                                }}
                                className="w-24 px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-400">
                                {mp.unidadMedida}
                              </span>
                            </div>
                            
                            {/* Validación de cantidad */}
                            {formData.materiasPrimasYCantidades[mp.id] > mp.cantidad && (
                              <span className="text-xs text-red-400">
                                Cantidad excede el stock disponible
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FiPackage className="mx-auto mb-2 text-3xl" />
                    <p>No hay materiales disponibles</p>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/registrar')}
                      className="mt-2 text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Registrar material
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              <p className="text-xs text-gray-400">
                Selecciona los materiales y especifica las cantidades necesarias
              </p>
              <div className="flex items-center gap-4">
                <p className={`text-xs font-medium ${Object.keys(formData.materiasPrimasYCantidades).length > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  Seleccionados: {Object.keys(formData.materiasPrimasYCantidades).length}
                </p>
                {Object.keys(formData.materiasPrimasYCantidades).length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, materiasPrimasYCantidades: {} }))}
                    className="text-xs text-gray-400 hover:text-red-400 font-medium flex items-center gap-1"
                  >
                    <FiX size={14} /> Limpiar
                  </button>
                )}
              </div>
            </div>
            
            {/* Resumen de materiales seleccionados */}
            {Object.keys(formData.materiasPrimasYCantidades).length > 0 && (
              <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Resumen de materiales:</h4>
                <div className="space-y-1">
                  {Object.entries(formData.materiasPrimasYCantidades).map(([id, cantidad]) => {
                    const material = materiasPrimas.find(mp => mp.id.toString() === id)
                    const total = material ? (cantidad * material.precioUnitario).toFixed(2) : '0.00'
                    return (
                      <div key={id} className="flex justify-between text-xs text-gray-400">
                        <span>{material?.nombre} - {cantidad} {material?.unidadMedida}</span>
                        <span>${total}</span>
                      </div>
                    )
                  })}
                  <div className="pt-1 border-t border-gray-600 font-medium text-gray-300">
                    <div className="flex justify-between">
                      <span>Total estimado:</span>
                      <span className="text-green-400">
                        ${Object.entries(formData.materiasPrimasYCantidades)
                          .reduce((total, [id, cantidad]) => {
                            const material = materiasPrimas.find(mp => mp.id.toString() === id)
                            return total + (material ? cantidad * material.precioUnitario : 0)
                          }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Validación visual */}
            {Object.keys(formData.materiasPrimasYCantidades).length === 0 && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <FiX /> Debes seleccionar al menos un material
              </p>
            )}
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/dashboard/orden')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 font-medium rounded-lg mr-4 hover:from-gray-600 hover:to-gray-500 transition-all shadow-sm hover:shadow-md hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || Object.keys(formData.materiasPrimasYCantidades).length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-medium rounded-lg shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <FiSave className="group-hover:animate-bounce" />
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