import api from "./api";

const ordenTrabajoService = {
    obtenerTodas: async () => {
        const response = await api.get('/ordenes');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/ordenes/${id}`);
        return response.data;
    },
    crear: async (ordenTrabajo) => {
        const response = await api.post('/ordenes', ordenTrabajo);
        return response.data;
    },
    actualizar: async (id, ordenTrabajo) => {
        const response = await api.put(`/ordenes/${id}`, ordenTrabajo);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/ordenes/${id}`);
        return response.data;
    }
};

export default ordenTrabajoService;