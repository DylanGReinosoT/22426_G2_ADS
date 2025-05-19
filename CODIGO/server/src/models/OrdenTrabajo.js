const {Sequelize} = require('sequelize');


const OrdenTrabajo = sequelize.define('OrdenTrabajo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    titulo:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El título no puede estar vacío'
            },
            len: {
                args: [3, 100],
                msg: 'El título debe tener entre 3 y 100 caracteres'
            }
        }
    },
    descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La descripción no puede estar vacía'
            },
            len: {
                args: [10, 255],
                msg: 'La descripción debe tener entre 10 y 255 caracteres'
            }
        }
    },
    fechaCreacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    horaCreacion: {
        type: Sequelize.TIME,
        defaultValue: Sequelize.literal('CURRENT_TIME')
    },
    fechaEntrega: {
        type: Sequelize.DATE,
        allowNull: true
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false
    },
    clienteId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'orden_trabajo',
    timestamps: false
});

module.exports = OrdenTrabajo;