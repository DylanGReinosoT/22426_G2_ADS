import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ordenCompraService from '../services/ordenCompraService'
import { FiEye, FiTrash2, FiPlus, FiDownload, FiRefreshCw, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const ESTADOS_LABEL = {
  PENDIENTE: { label: 'Pendiente',  cls: 'bg-gray-700 text-gray-200' },
  APROBADA:  { label: 'Aprobada',   cls: 'bg-yellow-900/60 text-yellow-300' },
  RECIBIDA:  { label: 'Recibida',   cls: 'bg-green-900/60 text-green-300' },
  CANCELADA: { label: 'Cancelada',  cls: 'bg-red-900/60 text-red-300' },
}

const TRANSICIONES = {
  PENDIENTE: ['APROBADA', 'CANCELADA'],
  APROBADA:  ['RECIBIDA', 'CANCELADA'],
  RECIBIDA:  [],
  CANCELADA: [],
}

const OrdenCompra = () => {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [descargando, setDescargando] = useState(null)
  const [showDetalle, setShowDetalle] = useState(false)
  const [showEstado, setShowEstado] = useState(false)
  const [ordenActual, setOrdenActual] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState('')
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  const [notif, setNotif] = useState({ show: false, tipo: '', msg: '' })
  const navigate = useNavigate()

  const mostrarNotif = (tipo, msg) => {
    setNotif({ show: true, tipo, msg })
    setTimeout(() => setNotif({ show: false, tipo: '', msg: '' }), 4000)
  }

  const cargarOrdenes = async () => {
    try {
      const res = await ordenCompraService.obtenerTodas()
      setOrdenes(res.datos || [])
    } catch {
      mostrarNotif('error', 'Error al cargar las órdenes de compra')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarOrdenes() }, [])

  const abrirDetalle = (orden) => {
    setOrdenActual(orden)
    setShowDetalle(true)
  }

  const abrirCambioEstado = (orden) => {
    setOrdenActual(orden)
    setNuevoEstado(TRANSICIONES[orden.estado]?.[0] || '')
    setShowEstado(true)
  }

  const handleCambiarEstado = async () => {
    if (!nuevoEstado) return
    setCambiandoEstado(true)
    try {
      const res = await ordenCompraService.cambiarEstado(ordenActual.id, nuevoEstado)
      setOrdenes(prev => prev.map(o => o.id === ordenActual.id ? res.datos : o))
      mostrarNotif('success', `Estado actualizado a ${ESTADOS_LABEL[nuevoEstado]?.label}`)
      setShowEstado(false)
    } catch (e) {
      mostrarNotif('error', e.response?.data?.error || 'Error al cambiar estado')
    } finally {
      setCambiandoEstado(false)
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta orden de compra?')) return
    try {
      await ordenCompraService.eliminar(id)
      setOrdenes(prev => prev.filter(o => o.id !== id))
      mostrarNotif('success', 'Orden eliminada correctamente')
    } catch (e) {
      mostrarNotif('error', e.response?.data?.error || 'No se puede eliminar esta orden')
    }
  }

  const handleDescargarPdf = async (id) => {
    setDescargando(id)
    try {
      const blob = await ordenCompraService.descargarPdf(id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `orden-compra-${id}.pdf`
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      mostrarNotif('success', 'PDF descargado correctamente')
    } catch {
      mostrarNotif('error', 'Error al generar el PDF')
    } finally {
      setDescargando(null)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black to-red-900">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"
      />
    </div>
  )

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800">

      {/* Notificación */}
      <AnimatePresence>
        {notif.show && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-white text-sm font-medium
              ${notif.tipo === 'success' ? 'bg-green-700' : 'bg-red-700'}`}
          >
            {notif.tipo === 'success'
              ? <FiCheckCircle className="text-lg flex-shrink-0" />
              : <FiAlertCircle className="text-lg flex-shrink-0" />}
            {notif.msg}
            <button onClick={() => setNotif({ show: false, tipo: '', msg: '' })}>
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-white"
        >
          Órdenes de Compra
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/orden-compra/crear')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg shadow-lg hover:shadow-red-500/30 transition-all"
        >
          <FiPlus className="text-lg" />
          Nueva Orden
        </motion.button>
      </div>

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gradient-to-r from-black to-red-900">
              <tr>
                {['ID', 'Materia Prima', 'Proveedor', 'Cantidad', 'Precio Total', 'Estado', 'Fecha', 'Acciones'].map(col => (
                  <th key={col} className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {ordenes.length > 0 ? ordenes.map(orden => (
                <motion.tr
                  key={orden.id}
                  whileHover={{ backgroundColor: 'rgba(127,29,29,0.1)', transition: { duration: 0.2 } }}
                  className="bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-300">{orden.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{orden.materiaPrima?.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{orden.proveedor}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {orden.cantidadSolicitada} <span className="text-gray-500 text-xs">{orden.materiaPrima?.unidadMedida}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-400">
                    ${orden.precioTotal?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ESTADOS_LABEL[orden.estado]?.cls}`}>
                      {ESTADOS_LABEL[orden.estado]?.label || orden.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                    {orden.fechaCreacion
                      ? new Date(orden.fechaCreacion).toLocaleDateString('es-EC')
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      {/* Ver detalles */}
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => abrirDetalle(orden)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 transition-all"
                        title="Ver detalles"
                      >
                        <FiEye />
                      </motion.button>

                      {/* Cambiar estado */}
                      {TRANSICIONES[orden.estado]?.length > 0 && (
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => abrirCambioEstado(orden)}
                          className="p-2 bg-gray-700 rounded-lg hover:bg-yellow-600/30 text-yellow-400 hover:text-yellow-300 transition-all"
                          title="Cambiar estado"
                        >
                          <FiRefreshCw />
                        </motion.button>
                      )}

                      {/* Descargar PDF */}
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handleDescargarPdf(orden.id)}
                        disabled={descargando === orden.id}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 transition-all disabled:opacity-50"
                        title="Descargar PDF"
                      >
                        {descargando === orden.id
                          ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full" />
                          : <FiDownload />}
                      </motion.button>

                      {/* Eliminar */}
                      {(orden.estado === 'PENDIENTE' || orden.estado === 'CANCELADA') && (
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleEliminar(orden.id)}
                          className="p-2 bg-gray-700 rounded-lg hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all"
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    No hay órdenes de compra registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Modal Detalle ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showDetalle && ordenActual && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  Orden de Compra #{ordenActual.id}
                </h3>
                <motion.button whileHover={{ rotate: 90, scale: 1.1 }} onClick={() => setShowDetalle(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >✕</motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-red-500">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300"><span className="font-medium text-white">Proveedor:</span> {ordenActual.proveedor}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Estado:</span>{' '}
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADOS_LABEL[ordenActual.estado]?.cls}`}>
                        {ESTADOS_LABEL[ordenActual.estado]?.label}
                      </span>
                    </p>
                    <p className="text-gray-300"><span className="font-medium text-white">Fecha creación:</span>{' '}
                      {ordenActual.fechaCreacion ? new Date(ordenActual.fechaCreacion).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </p>
                    <p className="text-gray-300"><span className="font-medium text-white">Solicitado por:</span>{' '}
                      {ordenActual.usuario?.nombre} {ordenActual.usuario?.apellido}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-red-500">Material Solicitado</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300"><span className="font-medium text-white">Material:</span> {ordenActual.materiaPrima?.nombre}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Cantidad:</span> {ordenActual.cantidadSolicitada} {ordenActual.materiaPrima?.unidadMedida}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Precio unitario:</span> ${ordenActual.materiaPrima?.precioUnitario?.toFixed(2)}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Precio total:</span>{' '}
                      <span className="text-green-400 font-semibold">${ordenActual.precioTotal?.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {ordenActual.observaciones && (
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-2 text-red-500">Observaciones</h4>
                  <p className="text-gray-300 text-sm bg-gray-700/50 rounded-lg p-3">{ordenActual.observaciones}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleDescargarPdf(ordenActual.id)}
                  disabled={descargando === ordenActual.id}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-lg transition-all disabled:opacity-50"
                >
                  <FiDownload /> Descargar PDF
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetalle(false)}
                  className="px-5 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:border-red-500 transition-all"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Cambio de Estado ─────────────────────────────────── */}
      <AnimatePresence>
        {showEstado && ordenActual && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Cambiar Estado</h3>
                <motion.button whileHover={{ rotate: 90, scale: 1.1 }} onClick={() => setShowEstado(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >✕</motion.button>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Estado actual:{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADOS_LABEL[ordenActual.estado]?.cls}`}>
                  {ESTADOS_LABEL[ordenActual.estado]?.label}
                </span>
              </p>

              <label className="block text-gray-300 font-medium mb-2">Nuevo estado</label>
              <select
                value={nuevoEstado}
                onChange={e => setNuevoEstado(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
              >
                {TRANSICIONES[ordenActual.estado]?.map(estado => (
                  <option key={estado} value={estado} className="bg-gray-800">
                    {ESTADOS_LABEL[estado]?.label}
                  </option>
                ))}
              </select>

              {nuevoEstado === 'RECIBIDA' && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300 text-sm">
                  Al marcar como <strong>Recibida</strong>, el stock de <strong>{ordenActual.materiaPrima?.nombre}</strong> aumentará automáticamente en <strong>{ordenActual.cantidadSolicitada} {ordenActual.materiaPrima?.unidadMedida}</strong>.
                </div>
              )}

              <div className="flex justify-end gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEstado(false)}
                  className="px-5 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleCambiarEstado}
                  disabled={cambiandoEstado || !nuevoEstado}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg disabled:opacity-50 transition-all"
                >
                  {cambiandoEstado
                    ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Guardando...</>
                    : <><FiRefreshCw /> Confirmar</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrdenCompra
