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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiUser className="text-blue-600" />
            Registrar Cliente
          </h2>
         
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={cliente.nombre}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el nombre"
                />
              </div>
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
              )}
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
                  value={cliente.apellido}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el apellido"
                />
              </div>
              {errors.apellido && (
                <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>
              )}
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
                  value={cliente.cedula}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cedula ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese la cédula (10 dígitos)"
                  maxLength={10}
                />
              </div>
              {errors.cedula && (
                <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>
              )}
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
                  value={cliente.fechaNacimiento}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.fechaNacimiento && (
                <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento}</p>
              )}
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
                  value={cliente.telefono}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el teléfono (10 dígitos)"
                  maxLength={10}
                />
              </div>
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
              )}
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
                  value={cliente.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
                value={cliente.direccion}
                onChange={handleChange}
                rows={3}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.direccion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingrese la dirección completa"
              />
            </div>
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/cliente')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <FiSave size={18} />
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrarCliente