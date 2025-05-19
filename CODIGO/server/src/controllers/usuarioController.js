/**
 * Controlador de Usuarios
 * Este controlador maneja las operaciones CRUD para usuarios por parte de administradores
 */

const Usuario = require('../models/Usuario');
const { successResponse, errorResponse } = require('../utils/responses');

/**
 * Obtiene todos los usuarios del sistema
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
const obtenerUsuarios = async (req, res) => {
  try {
    // Obtener todos los usuarios excluyendo el campo password
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
    
    return successResponse(res, 200, 'Usuarios obtenidos correctamente', { 
      usuarios 
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return errorResponse(res, 500, 'Error al obtener la lista de usuarios');
  }
};


/**
 * Obtiene un usuario específico por su ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar permisos: solo el propio usuario o un administrador pueden ver los detalles
    if (req.usuario.id !== 1){
      return errorResponse(res, 403, 'No tiene permisos para ver este usuario22');
    }
    
    // Buscar usuario por ID
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!usuario) {
      return errorResponse(res, 404, 'Usuario no encontrado');
    }
    
    return successResponse(res, 200, 'Usuario obtenido correctamente', { 
      usuario 
    });
  } catch (error) {
    console.error('Error al obtener usuario por ID22:', error);
    return errorResponse(res, 500, 'Error al obtener el usuario');
  }
};


/**
 * Crea un nuevo usuario en el sistema
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password} = req.body;
    
    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return errorResponse(res, 400, 'El correo electrónico ya está en uso');
    }
    
    
    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password, // Se encriptará automáticamente en el modelo
      activo: true
    });
    
    // Retornar el usuario creado (sin la contraseña)
    const usuarioCreado = await Usuario.findByPk(nuevoUsuario.id, {
      attributes: { exclude: ['password'] }
    });
    
    return successResponse(res, 201, 'Usuario creado correctamente', { 
      usuario: usuarioCreado 
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errores = error.errors.map(err => ({
        campo: err.path,
        mensaje: err.message
      }));
      return errorResponse(res, 400, 'Error de validación', errores);
    }
    
    return errorResponse(res, 500, 'Error al crear el usuario');
  }
};


/**
 * Actualiza un usuario existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, activo } = req.body;
    
    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return errorResponse(res, 404, 'Usuario no encontrado');
    }
    
    // Verificar permisos: solo el propio usuario o un administrador pueden actualizar
    if (req.usuario.id !== 1) {
      return errorResponse(res, 403, 'No tiene permisos para actualizar este usuario');
    }
    
    
    // Si se está actualizando el email, verificar que no esté en uso
    if (email && email !== usuario.email) {
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return errorResponse(res, 400, 'El correo electrónico ya está en uso');
      }
    }
    
    
    // Actualizar el usuario
    await usuario.update({
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      email: email || usuario.email,
      password: password || undefined, // Solo actualizar si se proporciona
      activo: activo !== undefined ? activo : usuario.activo
    });
    
    // Obtener el usuario actualizado (sin la contraseña)
    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    return successResponse(res, 200, 'Usuario actualizado correctamente', { 
      usuario: usuarioActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errores = error.errors.map(err => ({
        campo: err.path,
        mensaje: err.message
      }));
      return errorResponse(res, 400, 'Error de validación', errores);
    }
    
    return errorResponse(res, 500, 'Error al actualizar el usuario');
  }
};


/**
 * Elimina un usuario (desactivación lógica)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return errorResponse(res, 404, 'Usuario no encontrado');
    }
    
    // Verifica que no se esté intentando desactivar al usuario actual
    if (parseInt(id) === req.usuario.id) {
      return errorResponse(res, 400, 'No puede desactivar su propia cuenta');
    }
    
    // Desactivar el usuario (eliminación lógica)
    await usuario.update({ activo: false });
    
    return successResponse(res, 200, 'Usuario desactivado correctamente');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return errorResponse(res, 500, 'Error al desactivar el usuario');
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
