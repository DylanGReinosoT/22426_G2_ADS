const {DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const bycrypt = require('bcrypt');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'El nombre no puede estar vacío'
            },
            len: {
                args: [3, 50],
                msg: 'El nombre debe tener entre 3 y 50 caracteres'
            }
        }
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'El apellido no puede estar vacío'
            },
            len: {
                args: [3, 50],
                msg: 'El apellido debe tener entre 3 y 50 caracteres'
            }
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'El correo electrónico ya está registrado'
        },
        validate:{
            isEmail: {
                msg: 'El formato del correo electrónico es inválido'
            },
            notEmpty: {
                msg: 'El correo electrónico no puede estar vacío'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            },
            len: {
                args: [6, 100],
                msg: 'La contraseña debe tener entre 6 y 100 caracteres'
            }
        }
    },
    activo:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks:{
        beforeCreate: async (usuario) => {
            const salt = await bycrypt.genSalt(10);
            usuario.password = await bycrypt.hash(usuario.password, salt);
        },
        // Hash de la contraseña antes de actualizar, si esta ha cambiado
        beforeUpdate: async (usuario) => {
            if(usuario.changed('password')){
                const salt = await bycrypt.genSalt(10);
                usuario.password = await bycrypt.hash(usuario.password, salt);
            }
        }
    }
});

// Método para verificar si una contraseña coincide con el hash almacenado
Usuario.prototype.verificarPassword = async function(password) {
    return await bycrypt.compare(password, this.password);
}

module.exports = Usuario;