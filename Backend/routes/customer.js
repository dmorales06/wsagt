import express from 'express';
import usuarios from '../controllers/ControllerUsers.js';
import token from '../controllers/ControlllerToken.js';
import roles from '../controllers/ControllerRoles.js';
import areas from '../controllers/ControllerAreas.js';
import {verificarToken} from "../Middleware/middlewareJWT.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('Si esta corriendo la api');
});

//obtener token
router.post('/api/gentoken',token.generarToken);

//Gestion de usuarios
router.get('/api/users',usuarios.usuarios);
router.get('/api/users/:id',usuarios.usuarioID);
router.post('/api/users',usuarios.crtusuario);
router.put('/api/users/:id',usuarios.updusuario);
router.delete('/api/users/:id',usuarios.delusuario);

//Areas
router.get('/api/area',areas.area);
router.get('/api/area/:id',areas.areaID);

//Roles
router.get('/api/roles',roles.roles);
router.post('/api/rol/:rol',roles.updrol);

//pemisos
router.get('/api/permisos',roles.permisos);



export default router;