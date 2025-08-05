import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {register, handleSubmit, formState: { errors }} = useForm();
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  //const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const errorTimeout = useRef(null);

  const showError = (msg) => {
    setError(msg);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => setError(''), 5000);
  };

  // const handleChange = (e) => {
  //   setCredentials({ ...credentials, [e.target.name]: e.target.value })
  // }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try{
      const result = await login(data.email, data.password);
      if(!result.success){
        if(result.errorType === 'email'){
          showError('Correo electronico no resgistrado')
        }else if(result.errorType === 'password'){
          showError('Contraseña incorrecta')
        }else if(result.errorType === 'both'){  
          showError('Error en el inicio de sesión')
        } else {
        showError('Error en el inicio de sesión');
        } 
      } else {
      // Login exitoso: redirige al dashboard o página principal
      navigate('/dashboard'); // Cambia '/dashboard' por la ruta que corresponda en tu app
      }
    }catch(error){
      console.error('Error en el inicio de sesión:', error);
      showError('Error en el inicio de sesión')
    }finally{
      setIsLoading(false);
    }
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   if (credentials.username === 'admin' && credentials.password === 'admin123') {
  //     navigate('/dashboard')
  //   } else {
  //     setError('Credenciales incorrectas')
  //   }
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full border border-gray-200">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">Iniciar Sesión</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
              Usuario
            </label>
            <input
              type="email"
              name="email"
              id="username"
              autoComplete="email"
              placeholder="Correo electronico"{...register('email', { 
                required: 'el correo es requerido',
              pattern:{
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'el correo no es valido'
              } })}
              //onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Contraseña
            </label>
            <input
              name="password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              {...register('password', { 
                required: 'la contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'la contraseña debe tener al menos 6 caracteres'
                }
              })}
              //value={credentials.password}
              //onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'              )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
