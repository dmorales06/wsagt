import express from 'express';
import customerRoutes from './routes/customer.js';  // Nota: añade la extensión .js
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Rutas
app.use('/', customerRoutes);

const port = process.env.PORT || 2000;

//Inicio de servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});