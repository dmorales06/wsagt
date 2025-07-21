import express from 'express';
import customerRoutes from './routes/customer.js';  // Nota: añade la extensión .js
import cors from 'cors';
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors()); // Permite todas las conexiones

//Rutas
app.use('/', customerRoutes);

const port = 2000;

//Inicio de servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});