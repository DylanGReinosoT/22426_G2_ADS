import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteService from '../services/ClienteService'
import { FiUser, FiUserCheck, FiCreditCard, FiCalendar, FiPhone, FiMail, FiMapPin, FiSave, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [showErrorAlert, setShowErrorAlert] = useState(false)
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
      // Si se corrigió un error, verificar si ya no hay más errores para ocultar el alert
      const updatedErrors = { ...errors, [name]: '' }
      const hasRemainingErrors = Object.values(updatedErrors).some(error => error !== '')
      if (!hasRemainingErrors) {
        setShowErrorAlert(false)
      }
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
    const hasErrors = Object.keys(newErrors).length > 0
    setShowErrorAlert(hasErrors)
    return !hasErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Animación de sacudida para errores
      const form = e.target
      form.classList.add('animate-shake')
      setTimeout(() => form.classList.remove('animate-shake'), 500)
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
      
      // Limpiar errores y ocultar alert
      setErrors({})
      setShowErrorAlert(false)
      
      // Animación de éxito
      alert('Cliente registrado exitosamente')
      navigate('/dashboard/cliente')
    } catch (error) {
      console.error('Error al registrar cliente:', error)
      
      if (error.response && error.response.data) {
        const backendData = error.response.data
        
        // Caso 1: Errores de validación (formato { "campo": "mensaje" })
        if (typeof backendData === 'object' && 
            !backendData.hasOwnProperty('success') && 
            !backendData.hasOwnProperty('mensaje') && 
            !backendData.hasOwnProperty('error')) {
          
          // Es un objeto con errores de validación directos
          setErrors(prev => ({
            ...prev,
            ...backendData
          }))
          setShowErrorAlert(true)
        } 
        // Caso 2: Respuesta ApiResponse con error
        else if (backendData.error) {
          alert('Error al registrar cliente: ' + backendData.error)
        } 
        // Caso 3: Respuesta ApiResponse con mensaje
        else if (backendData.mensaje) {
          alert('Error al registrar cliente: ' + backendData.mensaje)
        } 
        // Caso 4: String directo (mensaje de error largo)
        else if (typeof backendData === 'string') {
          // Extraer solo el mensaje importante del error largo
          const match = backendData.match(/'([^']+)'/g)
          if (match && match.length > 0) {
            // Tomar el primer mensaje entre comillas
            const cleanMessage = match[0].replace(/'/g, '')
            setErrors(prev => ({
              ...prev,
              general: cleanMessage
            }))
            setShowErrorAlert(true)
          } else {
            alert('Error al registrar cliente')
          }
        } 
        // Caso 5: Error no reconocido
        else {
          alert('Error al registrar cliente')
        }
      } else {
        // Error de red o conexión
        alert('Error de conexión. Verifique su conexión a internet.')
      }
    } finally {
      setLoading(false)
    }
  }


  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
      {/* Efecto de partículas sutiles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-red-500 opacity-10"
            style={{
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Encabezado con gradiente y efecto de brillo */}
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-t-xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-red-900 to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMCwwLDAuMDUpIj48L3JlY3Q+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+')] opacity-30"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FiUser className="text-red-400 animate-pulse" />
                Registrar Nuevo Cliente
              </h2>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/dashboard/cliente')}
                className="p-2 rounded-full hover:bg-red-800 transition-all bg-black bg-opacity-30"
              >
                <FiX size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Formulario con efecto de vidrio esmerilado */}
        <motion.div 
          variants={itemVariants}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-b-xl shadow-2xl p-8 border border-white border-opacity-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recuadro Informativo de Errores */}
            <AnimatePresence>
              {showErrorAlert && Object.keys(errors).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-red-900 bg-opacity-30 border-2 border-red-500 rounded-lg p-4 mb-6 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <FiAlertCircle className="text-red-400 text-xl mt-0.5 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-red-300 font-semibold text-lg mb-2 flex items-center gap-2">
                        <FiInfo className="text-red-400" />
                        Se encontraron los siguientes errores:
                      </h3>
                      <ul className="space-y-1">
                        {Object.entries(errors).map(([field, error]) => 
                          error && (
                            <motion.li 
                              key={field}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="text-red-200 text-sm flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                              <span className="font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span>
                              <span>{error}</span>
                            </motion.li>
                          )
                        )}
                      </ul>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-3 pt-3 border-t border-red-500 border-opacity-30"
                      >
                        <p className="text-red-300 text-xs flex items-center gap-2">
                          <FiInfo className="text-red-400" />
                          Por favor, corrija los errores marcados en rojo para continuar.
                        </p>
                      </motion.div>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowErrorAlert(false)}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-red-700 hover:bg-opacity-30 transition-all"
                    >
                      <FiX className="text-red-400 text-lg" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                variants={itemVariants}
                className="group"
              >
                <label className="flex text-gray-200 font-medium mb-2 items-center gap-2">
                  <FiUser className="text-red-400 group-hover:text-red-300 transition-all transform group-hover:scale-110" />
                  Nombre *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-300 bg-opacity-30 text-white placeholder-gray-400 ${
                      errors.nombre ? 'border-red-500 animate-pulse' : 'border-gray-600 hover:border-red-500'
                    }`}
                    placeholder="Ingrese el nombre"
                  />
                </div>
                {errors.nombre && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <FiX size={14} /> {errors.nombre}
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="group"
              >
                <label className="flex text-gray-200 font-medium mb-2 items-center gap-2">
                  <FiUserCheck className="text-red-400 group-hover:text-red-300 transition-all transform group-hover:scale-110" />
                  Apellido *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="apellido"
                    value={cliente.apellido}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-300 bg-opacity-30 text-white placeholder-gray-400 ${
                      errors.apellido ? 'border-red-500 animate-pulse' : 'border-gray-600 hover:border-red-500'
                    }`}
                    placeholder="Ingrese el apellido"
                  />
                </div>
                {errors.apellido && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <FiX size={14} /> {errors.apellido}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Cédula y Fecha de Nacimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                variants={itemVariants}
                className="group"
              >
                <label className="flex text-gray-200 font-medium mb-2 items-center gap-2">
                  <FiCreditCard className="text-red-400 group-hover:text-red-300 transition-all transform group-hover:scale-110" />
                  Cédula *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cedula"
                    value={cliente.cedula}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-300 bg-opacity-30 text-white placeholder-gray-400 ${
                      errors.cedula ? 'border-red-500 animate-pulse' : 'border-gray-600 hover:border-red-500'
                    }`}
                    placeholder="Ingrese la cédula (10 dígitos)"
                    maxLength={10}
                  />
                </div>
                {errors.cedula && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <FiX size={14} /> {errors.cedula}
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="group"
              >
                <label className="flex text-gray-200 font-medium mb-2 items-center gap-2">
                  <FiCalendar className="text-red-400 group-hover:text-red-300 transition-all transform group-hover:scale-110" />
                  Fecha de Nacimiento *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={cliente.fechaNacimiento}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-300 bg-opacity-30 text-white placeholder-gray-400 ${
                      errors.fechaNacimiento ? 'border-red-500 animate-pulse' : 'border-gray-600 hover:border-red-500'
                    }`}
                  />
                </div>
                {errors.fechaNacimiento && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <FiX size={14} /> {errors.fechaNacimiento}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Teléfono y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                variants={itemVariants}
                className="group"
              >
                <label className="flex text-gray-200 font-medium mb-2 items-center gap-2">
                  <FiPhone className="text-red-400 group-hover:text-red-300 transition-all transform group-hover:scale-110" />
                  Teléfono *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="telefono"
                    value={cliente.telefono}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-300 bg-opacity-30 text-white placeholder-gray-400 ${
                      errors.telefono ? 'border-red-500 animate-pulse' : 'border-gray-600 hover:border-red-500'
                    }`}
                    placeholder="Ingrese el teléfono (10 dígitos)"
                    maxLength={10}
                  />
                </div>
                {errors.telefono && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <FiX size={14} /> {errors.telefono}
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="group"
              >
                <label className="flex text-gray-200 font-medium mb-2 items-center gap-2">
                  <FiMail className="text-red-400 group-hover:text-red-300 transition-all transform group-hover:scale-110" />
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={cliente.email}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-300 bg-opacity-30 text-white placeholder-gray-400 ${
                      errors.email ? 'border-red-500 animate-pulse' : 'border-gray-600 hover:border-red-500'
                    }`}
                    placeholder="Ingrese el email"
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <FiX size={14} /> {errors.email}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Dirección */}
            <motion.div 
              variants={itemVariants}
              className="group"
            >
              <label className="flex text-gray-200 font-medium mb-2 items-center gap-2">
                <FiMapPin className="text-red-400 group-hover:text-red-300 transition-all transform group-hover:scale-110" />
                Dirección *
              </label>
              <div className="relative">
                <textarea
                  name="direccion"
                  value={cliente.direccion}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-4 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-300 bg-opacity-30 text-white placeholder-gray-400 ${
                    errors.direccion ? 'border-red-500 animate-pulse' : 'border-gray-600 hover:border-red-500'
                  }`}
                  placeholder="Ingrese la dirección completa"
                />
              </div>
              {errors.direccion && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1 flex items-center gap-1"
                >
                  <FiX size={14} /> {errors.direccion}
                </motion.p>
              )}
            </motion.div>

            {/* Botones */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-end space-x-4 pt-6"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard/cliente')}
                className="px-6 py-3 border-2 border-gray-600 text-gray-200 rounded-lg hover:bg-black hover:bg-opacity-30 hover:border-red-500 transition-all font-medium shadow-md"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-lg hover:from-red-700 hover:via-red-800 hover:to-red-900 transition-all shadow-lg hover:shadow-red-900/50 font-medium disabled:opacity-70 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2">
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
                      <FiSave size={18} className="transform group-hover:scale-110 transition-transform" />
                      Guardar Cliente
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      {/* Agregar estilos de animación */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.3; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  )
}

export default RegistrarCliente