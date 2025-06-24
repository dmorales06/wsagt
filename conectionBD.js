import mysql from 'mysql2';
//connectionString= `DSN=192.168.9.83;UID=dmorales;PWD=damg0610`

// Database configuration
const dbConfigAGT = {
    host: 'localhost',
    user: 'odelcid',
    password: 'Fuerza2023',
    port: 3306,
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