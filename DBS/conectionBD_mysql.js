import mysql from 'mysql2';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos
const dbConfigAGT = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectTimeout: 30000,
    connectionLimit: 10
};

// Crear pool de conexiones
const poolAGT = mysql.createPool(dbConfigAGT).promise();

// Función para probar conexiones
async function testConnections() {
    try {
        const connAGT = await poolAGT.getConnection();
        console.log('✅ Conectado a AGT');
        connAGT.release();
    } catch (err) {
        console.error('❌ Error de conexión:', err);
    }
}

// testConnections();

export { poolAGT };
