import express from 'express';
import usuarios from '../controllers/ControllerUsers.js';
import token from '../controllers/ControlllerToken.js';
import roles from '../controllers/ControllerRoles.js';
import areas from '../controllers/ControllerAreas.js';
import {verificarToken} from "../Middleware/middlewareJWT.js";

const router = express.Router();

//obtener token
router.post('/api/gentoken',token.generarToken);

//Gestion de usuarios
router.get('/api/users',usuarios.usuarios);
router.get('/api/users/:id',verificarToken,usuarios.usuarioID);
router.post('/api/users',verificarToken,usuarios.crtusuario);
router.put('/api/users/:id',verificarToken,usuarios.updusuario);
router.delete('/api/users/:id',verificarToken,usuarios.delusuario);

//Areas
router.get('/api/area',verificarToken,areas.area);
router.get('/api/area/:id',verificarToken,areas.areaID);

//Roles
router.get('/api/roles',roles.roles);
router.post('/api/rol/:rol',roles.updrol);

//pemisos
router.get('/api/permisos',roles.permisos);



export default router;