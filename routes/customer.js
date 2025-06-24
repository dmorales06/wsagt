import express from 'express';
import customerController from '../controllers/customerController.js';
import {verificarToken} from "../middleware.js";

const router = express.Router();

//obtener token
router.post('/api/gentoken',customerController.generarToken);

//Gestion de usuarios
router.get('/api/users',verificarToken,customerController.usuarios);
router.get('/api/users/:id',customerController.usuarioID);
router.post('/api/users',customerController.crtusuario);
router.put('/api/users/:id',customerController.updusuario);
router.delete('/api/users/:id',customerController.delusuario);



export default router;