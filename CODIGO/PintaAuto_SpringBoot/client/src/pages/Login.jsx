import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuth from '../hooks/useAuth'
import { motion } from 'framer-motion'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const errorTimeout = useRef(null)

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(220, 38, 38, 0.3)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.98
    }
  }

  const showError = (msg) => {
    setError(msg)
    if (errorTimeout.current) clearTimeout(errorTimeout.current)
    errorTimeout.current = setTimeout(() => setError(''), 5000)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await login(data.email, data.password)
      if (!result.success) {
        if (result.errorType === 'email') {
          showError('Correo electrónico no registrado')
        } else if (result.errorType === 'password') {
          showError('Contraseña incorrecta')
        } else if (result.errorType === 'both') {
          showError('Error en el inicio de sesión')
        } else {
          showError('Error en el inicio de sesión')
        }
      } else {
        navigate('/gestiones')
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error)
      showError('Error en el inicio de sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4"
    >
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-xl p-8 max-w-md w-full border border-gray-700"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-center text-gray-300 mb-6">
            Accede a tu cuenta de <span className="text-red-500 font-semibold">PintAuto</span>
          </p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md text-center border border-red-800"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              {...register('email', { 
                required: 'El correo es requerido',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'El correo no es válido'
                } 
              })}
              className={`w-full px-4 py-3 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400 transition-colors`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-gray-300 font-medium">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              {...register('password', { 
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
              className={`w-full px-4 py-3 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400 transition-colors`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2 space-y-3">
            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center border border-red-900"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </motion.button>

            <motion.a
              href="/"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center border border-gray-600 block text-center"
            >
              Volver al Inicio
            </motion.a>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default Login