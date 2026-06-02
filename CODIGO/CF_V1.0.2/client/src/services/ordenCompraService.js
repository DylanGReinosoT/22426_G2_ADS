import api from './api'

const ordenCompraService = {
  obtenerTodas: async () => {
    const response = await api.get('/orden-compra')
    return response.data
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/orden-compra/${id}`)
    return response.data
  },

  crear: async (ordenCompra) => {
    const response = await api.post('/orden-compra', ordenCompra)
    return response.data
  },

  cambiarEstado: async (id, estado) => {
    const response = await api.put(`/orden-compra/${id}/estado`, { estado })
    return response.data
  },

  eliminar: async (id) => {
    const response = await api.delete(`/orden-compra/${id}`)
    return response.data
  },

  descargarPdf: async (id) => {
    const response = await api.get(`/orden-compra/${id}/pdf`, { responseType: 'blob' })
    return response.data
  },
}

export default ordenCompraService
