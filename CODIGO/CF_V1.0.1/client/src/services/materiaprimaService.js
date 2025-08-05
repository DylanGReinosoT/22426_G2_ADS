 //import { act } from "react";
import api from "./api";

const materiaprimaService = {
    obtenerTodas: async () => {
        const response = await api.get('/materia');
        return response.data;
    },
    
    obtenerPorId: async (id) => {
        const response = await api.get(`/materia/${id}`);
        return response.data;
    },

    crear: async (materiaprima) => {
        const response = await api.post('/materia', materiaprima);
        return response.data;
    },
    
    actualizar: async (id, materiaprima) => {
        const response = await api.put(`/materia/${id}`, materiaprima);
        return response.data;
    },

    eliminar: async (id) => {
        const response = await api.delete(`/materia/${id}`);
        return response.data;
    },
    // Buscar por nombre
  buscarPorNombre: (nombre) => api.get(`/materia/buscar?nombre=${nombre}`)
};

export default materiaprimaService;