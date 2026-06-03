import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ordenCompraService from '../services/ordenCompraService'
import materiaprimaService from '../services/materiaPrimaService'
import { FiArrowLeft, FiSave, FiPackage, FiTruck, FiUser, FiFileText, FiCheck, FiAlertTriangle } from 'react-icons/fi'
import { motion } from 'framer-motion'

const RegistrarOrdenCompra = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [materiasPrimas, setMateriasPrimas] = useState([])
  const [bajominimo, setBajominimo] = useState([])
  const [materiaPrimaSeleccionada, setMateriaPrimaSeleccionada] = useState(null)

  const [formData, setFormData] = useState({
    materiaPrimaId: '',
    cantidadSolicitada: '',
    proveedor: '',
    observaciones: '',
    usuarioId: '',
  })

  useEffect(() => {
    const userData = localStorage.getItem('user') || localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUser(user)
      setFormData(prev => ({ ...prev, usuarioId: user.id }))
    } else {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [mpRes, bajoRes] = await Promise.all([
          materiaprimaService.obtenerTodas(),
          materiaprimaService.obtenerBajoMinimo(),
        ])
        setMateriasPrimas(mpRes.datos?.materias || [])
        setBajominimo(bajoRes.datos || [])
      } catch {
        try {
          const mpRes = await materiaprimaService.obtenerTodas()
          setMateriasPrimas(mpRes.datos?.materias || [])
        } catch {
          setError('Error al cargar las materias primas')
        }
      } finally {
        setLoading(false)
      }
    }
    if (currentUser) cargarDatos()
  }, [currentUser])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'materiaPrimaId') {
      const mp = materiasPrimas.find(m => m.id === parseInt(value))
      setMateriaPrimaSeleccionada(mp || null)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await ordenCompraService.crear({
        materiaPrimaId: parseInt(formData.materiaPrimaId),
        cantidadSolicitada: parseFloat(formData.cantidadSolicitada),
        proveedor: formData.proveedor,
        observaciones: formData.observaciones || null,
        usuarioId: formData.usuarioId,
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard/orden-compra'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la orden de compra')
    } finally {
      setSubmitting(false)
    }
  }

  const idsBajoMinimo = new Set(bajominimo.map(m => m.id))

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"
      />
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Encabezado */}
      <div className="bg-gradient-to-r from-black via-red-900 to-black rounded-xl shadow-xl mb-8 overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <button
            onClick={() => navigate('/dashboard/orden-compra')}
            className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors group"
          >
            <FiArrowLeft className="text-red-400 group-hover:animate-pulse" />
            <span className="font-medium">Volver al listado</span>
          </button>
          <h2 className="text-2xl font-bold text-white">Nueva Orden de Compra</h2>
          <div className="w-8" />
        </div>
      </div>

      {/* Alerta materias bajo mínimo */}
      {bajominimo.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-xl text-yellow-300 text-sm"
        >
          <div className="flex items-center gap-2 font-semibold mb-2">
            <FiAlertTriangle />
            Materias primas con stock bajo mínimo ({bajominimo.length}):
          </div>
          <ul className="list-disc list-inside space-y-1 text-yellow-200">
            {bajominimo.map(m => (
              <li key={m.id}>
                <button
                  type="button"
                  className="underline hover:text-yellow-100 transition-colors"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, materiaPrimaId: String(m.id) }))
                    setMateriaPrimaSeleccionada(m)
                  }}
                >
                  {m.nombre}
                </button>
                {' — '}Stock actual: <strong>{m.cantidad} {m.unidadMedida}</strong>
                {m.cantidadMinima ? ` (mín. ${m.cantidadMinima})` : ''}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Formulario */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-black via-red-900 to-black h-2" />

        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex items-center border-b border-gray-700">
          <FiTruck className="text-red-500 mr-3 text-xl" />
          <h3 className="font-semibold text-lg text-white">Datos de la Orden</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-900/30 text-emerald-200 rounded-lg border border-emerald-700 flex items-center gap-2"
            >
              <FiCheck className="text-emerald-400" />
              ¡Orden creada correctamente! Redirigiendo...
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-900/30 text-red-300 rounded-lg border border-red-700 flex items-center gap-2"
            >
              <FiAlertTriangle className="text-red-400" />
              {error}
            </motion.div>
          )}

          {/* Materia Prima */}
          <div className="relative group">
            <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
              <FiPackage className="text-red-400" /> Materia Prima *
            </label>
            <select
              name="materiaPrimaId"
              value={formData.materiaPrimaId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none"
            >
              <option value="">Seleccionar materia prima</option>
              {materiasPrimas.map(mp => (
                <option key={mp.id} value={mp.id} className="bg-gray-800">
                  {mp.nombre}
                  {idsBajoMinimo.has(mp.id) ? ' ⚠ Stock bajo' : ''}
                  {' — '}Stock: {mp.cantidad} {mp.unidadMedida}
                </option>
              ))}
            </select>

            {/* Info de la materia seleccionada */}
            {materiaPrimaSeleccionada && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 p-3 bg-gray-700/60 rounded-lg border border-gray-600 text-sm text-gray-300 grid grid-cols-3 gap-3"
              >
                <div>
                  <p className="text-gray-400 text-xs mb-1">Stock actual</p>
                  <p className={`font-semibold ${idsBajoMinimo.has(materiaPrimaSeleccionada.id) ? 'text-yellow-400' : 'text-white'}`}>
                    {materiaPrimaSeleccionada.cantidad} {materiaPrimaSeleccionada.unidadMedida}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Precio unitario</p>
                  <p className="font-semibold text-green-400">${materiaPrimaSeleccionada.precioUnitario?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Stock mínimo</p>
                  <p className="font-semibold text-white">
                    {materiaPrimaSeleccionada.cantidadMinima ?? '—'} {materiaPrimaSeleccionada.unidadMedida}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cantidad */}
            <div className="relative group">
              <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
                <FiPackage className="text-red-400" /> Cantidad Solicitada *
              </label>
              <input
                type="number"
                name="cantidadSolicitada"
                value={formData.cantidadSolicitada}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                placeholder="Ej: 50"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
              />
              {materiaPrimaSeleccionada && formData.cantidadSolicitada && (
                <p className="mt-1 text-xs text-green-400">
                  Total estimado: ${(parseFloat(formData.cantidadSolicitada) * materiaPrimaSeleccionada.precioUnitario).toFixed(2)}
                </p>
              )}
            </div>

            {/* Proveedor */}
            <div className="relative group">
              <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
                <FiTruck className="text-red-400" /> Proveedor *
              </label>
              <input
                type="text"
                name="proveedor"
                value={formData.proveedor}
                onChange={handleChange}
                required
                maxLength="150"
                placeholder="Nombre del proveedor"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="relative group">
            <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
              <FiFileText className="text-red-400" /> Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="Notas adicionales para esta orden..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
            />
            <p className={`text-right text-xs mt-1 ${formData.observaciones.length > 450 ? 'text-red-400' : 'text-gray-500'}`}>
              {formData.observaciones.length}/500
            </p>
          </div>

          {/* Solicitante */}
          <div className="relative group">
            <label className="block text-gray-300 font-medium mb-1 flex items-center gap-2">
              <FiUser className="text-red-400" /> Solicitante
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={currentUser ? `${currentUser.nombre} ${currentUser.apellido || ''}` : 'Cargando...'}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-gray-300 bg-gray-600 px-2 py-1 rounded">Auto-asignado</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/dashboard/orden-compra')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-600 hover:text-white transition-all"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.03 }}
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-medium rounded-lg shadow-lg transition-all disabled:opacity-70"
            >
              {submitting
                ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Guardando...</>
                : <><FiSave /> Crear Orden</>}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrarOrdenCompra
