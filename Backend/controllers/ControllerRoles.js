import {poolAGT} from '../DBS/conectionBD_mysql.js';

const controller = {};

//Roles
controller.roles = async (req, res) => {
    const [roles] = await poolAGT.query('select * from rol');
    res.json(roles);
}

//Actualizar permisos de Rol
controller.updrol = async (req, res) => {
    const [roles] = await poolAGT.query('select * from rol');
    const rol = roles.find(c => c.nombre === req.params.rol);

    const updateData = {
        endpoint: req.body.endpoint,
    }
    console.log(rol);

    if (!rol) return res.status(404).json({msg: 'Rol no encontrado'});

    else {
        const [result] = await poolAGT.query('update rol set ? where id_rol = ?', [updateData, rol.id_rol]);
        if (result.affectedRows === 1) {
            res.status(201).json({msg: 'Permisos de rol actualizados exitosamente'});
        }
    }
}

//obtener permisos por usuario
controller.permisosUser = async (req, res) => {
    try {
        const id_usuario = req.params.id;
        const [permisos] = await poolAGT.query(`select usrpermisos.id_rol,
                                                       usrpermisos.id_opcion,
                                                       permisos.nombre,
                                                       permisos.url
                                                from permiso_rol usrpermisos
                                                         join permiso permisos
                                                              on usrpermisos.id_opcion = permisos.id_opcion
                                                where id_usuario = ?
                                                  and permisos.estado = 'A'`, [id_usuario, 'A']);

        if (permisos.length === 0) {
            res.status(404).send("El usuario no tiene permisos.");
        }else{
            res.json(permisos);
        }

    } catch (err) {
        res.status(405).send("El usuario no existe o esta inhabilitado.");
    }
}


export default controller;