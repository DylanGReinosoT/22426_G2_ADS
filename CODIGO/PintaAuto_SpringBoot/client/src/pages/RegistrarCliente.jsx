import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteService from '../services/ClienteService'
import { FiUser, FiUserCheck, FiCreditCard, FiCalendar, FiPhone, FiMail, FiMapPin, FiSave, FiX } from 'react-icons/fi'

const RegistrarCliente = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCliente(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!cliente.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    if (!cliente.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }
    
    if (!cliente.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida'
    } else if (!/^\d{10}$/.test(cliente.cedula)) {
      newErrors.cedula = 'La cédula debe tener 10 dígitos'
    }
    
    if (!cliente.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida'
    }
    
    if (!cliente.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (!/^\d{10}$/.test(cliente.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos'
    }
    
    if (!cliente.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
      newErrors.email = 'El email no es válido'
    }
    
    if (!cliente.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const res = await clienteService.crear(cliente)
      console.log('Cliente creado:', res)
      
      // Resetear formulario
      setCliente({
        nombre: '',
        apellido: '',
        cedula: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        direccion: ''
      })
      
      alert('Cliente registrado exitosamente')
      navigate('/dashboard/cliente')
    } catch (error) {
      console.error('Error al registrar cliente:', error)
      alert('Error al registrar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-black to-red-900 rounded-t-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FiUser className="text-red-400" />
              Registrar Nuevo Cliente
            </h2>
            <button 
              onClick={() => navigate('/dashboard/cliente')}
              className="p-2 rounded-full hover:bg-red-800 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-b-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                  <FiUser className="text-red-600 group-hover:text-red-700 transition-colors" />
                  Nombre *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ingrese el nombre"
                  />
                </div>
                {errors.nombre && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <FiX size={14} /> {errors.nombre}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                  <FiUserCheck className="text-red-600 group-hover:text-red-700 transition-colors" />
                  Apellido *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="apellido"
                    value={cliente.apellido}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                      errors.apellido ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ingrese el apellido"
                  />
                </div>
                {errors.apellido && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <FiX size={14} /> {errors.apellido}
                  </p>
                )}
              </div>
            </div>

            {/* Cédula y Fecha de Nacimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                  <FiCreditCard className="text-red-600 group-hover:text-red-700 transition-colors" />
                  Cédula *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cedula"
                    value={cliente.cedula}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                      errors.cedula ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ingrese la cédula (10 dígitos)"
                    maxLength={10}
                  />
                </div>
                {errors.cedula && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <FiX size={14} /> {errors.cedula}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                  <FiCalendar className="text-red-600 group-hover:text-red-700 transition-colors" />
                  Fecha de Nacimiento *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={cliente.fechaNacimiento}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                      errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {errors.fechaNacimiento && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <FiX size={14} /> {errors.fechaNacimiento}
                  </p>
                )}
              </div>
            </div>

            {/* Teléfono y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                  <FiPhone className="text-red-600 group-hover:text-red-700 transition-colors" />
                  Teléfono *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="telefono"
                    value={cliente.telefono}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ingrese el teléfono (10 dígitos)"
                    maxLength={10}
                  />
                </div>
                {errors.telefono && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <FiX size={14} /> {errors.telefono}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                  <FiMail className="text-red-600 group-hover:text-red-700 transition-colors" />
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={cliente.email}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ingrese el email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <FiX size={14} /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div className="group">
              <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                <FiMapPin className="text-red-600 group-hover:text-red-700 transition-colors" />
                Dirección *
              </label>
              <div className="relative">
                <textarea
                  name="direccion"
                  value={cliente.direccion}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                    errors.direccion ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Ingrese la dirección completa"
                />
              </div>
              {errors.direccion && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <FiX size={14} /> {errors.direccion}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard/cliente')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    Guardar Cliente
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistrarCliente