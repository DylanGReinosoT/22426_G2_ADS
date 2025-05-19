const Materia = require('../models/MateriaPrima');
const{successResponse, errorResponse} = require('../utils/responses');

/**
 * Obtiene toda la maeteria prima 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */

const obtenerMateria = async (req, res) => {
    try {
        const materias = await Materia.findAll();
        return successResponse(res, 200, 'Materias obtenidas correctamente', {materias});
    }catch (error) {
        console.error('Error al obtener materias:', error);
        return errorResponse(res, 500, 'Error al obtener la lista de materias');
    }
}

const obtenerMateriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar usuario por ID
        const materia = await Materia.findByPk(id);
        
        if (!materia) {
            return errorResponse(res, 404, 'Materia no encontrada');
        }
        
        return successResponse(res, 200, 'Materia obtenida correctamente', { 
            materia 
        });
    } catch (error) {
        console.error('Error al obtener materia por ID:', error);
        return errorResponse(res, 500, 'Error al obtener la materia');
    }
}

const crearMateria = async (req, res) => {
    try {
        const { nombre, cantidad, unidadMedida, precioUnitario } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!nombre || !cantidad || !unidadMedida|| !precioUnitario) {
            return errorResponse(res, 400, 'Todos los campos son obligatorios');
        }

        const materiaExistente = await Materia.findOne({ where: { nombre } });
        if (materiaExistente) {
            return errorResponse(res, 400, 'La materia prima ya existe');
        }

        // Crear nueva materia prima
        const nuevaMateria = await Materia.create({ nombre, cantidad, unidadMedida, precioUnitario });

        return successResponse(res, 201, 'Materia creada correctamente', { nuevaMateria });
    } catch (error) {
        console.error('Error al crear materia:', error);

        if (error.name === 'SequelizeValidationError') {
            return errorResponse(res, 400, 'Error de validación: ' + error.errors[0].message);
        }
        return errorResponse(res, 500, 'Error al crear la materia');
    }
}
/**
 * Actualiza una materia prima existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */

const actualizarMateria = async (req, res) => {
    try{
        const { id } = req.params;
        const { nombre, cantidad, unidadMedida, precioUnitario } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!nombre || !cantidad || !unidadMedida || !precioUnitario) {
            return errorResponse(res, 400, 'Todos los campos son obligatorios');
        }

        // Buscar materia por ID
        const materia = await Materia.findByPk(id);
        
        if (!materia) {
            return errorResponse(res, 404, 'Materia no encontrada');
        }

        if (req.usuario.id !== 1){
            return errorResponse(res, 403, 'No tienes permiso para actualizar esta materia');
        }

        // Actualizar materia
        await materia.update({ 
            nombre:nombre || materia.nombre, 
            cantidad: cantidad || materia.cantidad, 
            unidadMedida: unidadMedida || materia.unidadMedida,
            precioUnitario: precioUnitario || materia.precioUnitario});

        return successResponse(res, 200, 'Materia actualizada correctamente', { materia });

    }catch (error) {
        console.error('Error al actualizar materia:', error);
        return errorResponse(res, 500, 'Error al actualizar la materia');

    }
}

const eliminarMateria = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar materia por ID
        const materia = await Materia.findByPk(id);
        
        if (!materia) {
            return errorResponse(res, 404, 'Materia no encontrada');
        }

        if (req.usuario.id !== 1){
            return errorResponse(res, 403, 'No tienes permiso para eliminar esta materia');
        }

        // Eliminar materia
        await materia.destroy();

        return successResponse(res, 200, 'Materia eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar materia:', error);
        return errorResponse(res, 500, 'Error al eliminar la materia');
    }
}

module.exports = {
    obtenerMateria,
    obtenerMateriaPorId,
    crearMateria,
    actualizarMateria,
    eliminarMateria
}