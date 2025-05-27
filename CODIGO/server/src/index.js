const express = require('express');
const cors = require('cors');
const {sequelize, testDBConnection} = require('./config/database');
const routes = require('./routes');
const crearAdminInicial = require('./utils/adminInicial');

require('./models')

require('dotenv').config();
const app = express();  
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api', routes); // Rutas de la API

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Probar la conexión a la base de datos
        await testDBConnection();
        console.log('✅ Conexión a la base de datos exitosa');

        // Sincronizar los modelos con la base de datos
        await sequelize.sync({ force: false }); // Cambia a true si quieres recrear las tablas
        console.log('✅ Modelos sincronizados con la base de datos.');  

        // Crear el administrador inicial
        await crearAdminInicial();

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📚 API disponible en http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();