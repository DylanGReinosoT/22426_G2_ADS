const Usuario = require('../models/Usuario');
//const bcrypt = require('bcryptjs');
require('dotenv').config();

const crearAdminInicial = async () => {
  try {
    // Verificar si ya existe algún usuario con rol de administrador
    const adminExistente = await Usuario.findOne({
      where: { email: 'admin@pintauto.com' }
    });

    // Si ya existe un administrador, terminar la función
    if (adminExistente) {
      console.log('✅ Usuario administrador ya existe en el sistema');
      return;
    }

    // Datos del administrador por defecto
    // En un entorno de producción, estos datos deberían venir de variables de entorno
    const adminData = {
      nombre: process.env.ADMIN_NOMBRE || 'Admin',
      apellido: process.env.ADMIN_APELLIDO || 'System',
      email: process.env.ADMIN_EMAIL || 'admin@pintauto.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      activo: true
    };

    // Crear el usuario administrador
    await Usuario.create(adminData);

    console.log('✅ Usuario administrador creado exitosamente');
    console.log(`📧 Email: ${adminData.email}`);
    console.log('🔑 Contraseña: (definida en variables de entorno o valor por defecto)');

  } catch (error) {
    console.error('❌ Error al crear el administrador inicial:', error);
  }
};

module.exports = crearAdminInicial;