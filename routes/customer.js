import express from 'express';
import customerController from '../controllers/customerController.js';
import {verificarToken} from "../Middleware/middlewareJWT.js";

const router = express.Router();

//obtener token
router.post('/api/gentoken',customerController.generarToken);

//Gestion de usuarios
router.get('/api/users',verificarToken,customerController.usuarios);
router.get('/api/users/:id',verificarToken,customerController.usuarioID);
router.post('/api/users',verificarToken,customerController.crtusuario);
router.put('/api/users/:id',verificarToken,customerController.updusuario);
router.delete('/api/users/:id',verificarToken,customerController.delusuario);

//Areas
router.get('/api/area',verificarToken,customerController.area);
router.get('/api/area/:id',verificarToken,customerController.areaID);

//Roles
router.get('/api/roles',customerController.roles);
router.post('/api/rol/:rol',customerController.updrol);



export default router;