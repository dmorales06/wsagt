import mysql from 'mysql2';
import dotenv from 'dotenv';
//connectionString= `DSN=192.168.9.83;UID=dmorales;PWD=-------`


// Cargar variables de entorno
dotenv.config();

// Database configuration
const dbConfigAGT = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectTimeout: 30000,
    connectionLimit: 10
};

// Create a connection pool
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

// Ejecutar test de conexión
//testConnections();

export {poolAGT};