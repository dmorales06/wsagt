import express from 'express';
import usuarios from '../controllers/ControllerUsers.js';
import token from '../controllers/ControlllerToken.js';
import roles from '../controllers/ControllerRoles.js';
import areas from '../controllers/ControllerAreas.js';
import {verificarToken} from "../Middleware/middlewareJWT.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.json('Si esta corriendo la api AGT 2.0');
});

//obtener token
router.post('/api/gentoken',token.generarToken);

//Gestion de usuarios

router.get('/api/users/:id_empresa',verificarToken,usuarios.usuarios);
router.get('/api/users/:id',usuarios.usuarioID);
router.post('/api/users',usuarios.crtusuario);
router.put('/api/userd/:id',usuarios.updusuario);
router.put('/api/user/:empresa',usuarios.updateusr);
router.delete('/api/users/:id',usuarios.delusuario);

//Areas
router.get('/api/area',areas.area);
router.get('/api/area/:id',areas.areaID);

//Roles
router.get('/api/roles',roles.roles);
router.post('/api/rol/:rol',roles.updrol);

//pemisos
router.get('/api/permisosUser/:empresa/:id',roles.permisosUser);
router.get('/api/nompermisos/:empresa',roles.nompermisos);
router.post('/api/permisosUser',roles.updatePermisos);
router.delete('/api/permisosUser/:empresa/:id',roles.deletePermiso);

//empresas
router.get('/api/empresas',usuarios.empresas)



export default router;