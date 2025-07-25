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
        const {id,empresa} = req.params;
        const [permisos] = await poolAGT.query(`select usrpermisos.id_rol,
                                                       usrpermisos.id_opcion,
                                                       permisos.nombre,
                                                       permisos.url
                                                from permiso_rol usrpermisos
                                                         join permiso permisos
                                                              on usrpermisos.id_opcion = permisos.id_opcion
                                                where id_usuario = ?
                                                  and permisos.estado = ? and permisos.id_empresa=?`, [id, 'A',empresa]);

        if (permisos.length === 0) {
            res.status(404).send("El usuario no tiene permisos.");
        } else {
            res.json(permisos);
        }

    } catch (err) {
        res.status(405).send("El usuario no existe o esta inhabilitado.");
    }
}

controller.nompermisos = async (req, res) => {
    try {
        const {empresa} = req.params;
        const [roles] = await poolAGT.query('select id_opcion,nombre,url from permiso where estado=? and id_empresa=?', ['A',empresa]);
        if (roles.length === 0) {
            res.status(404).send("El rol ingresado no existe.");
        } else {
            res.json(roles);
        }
    } catch (err) {
        res.status(405).send("El rol ingresado no existe o esta inhabilitado.");
    }

}

controller.updatePermisos = async (req, res) => {
    const permisos = req.body;

    if (!Array.isArray(permisos)) {
        return res.status(400).json({error: 'El cuerpo debe ser un arreglo de permisos'});
    }
    try {

        for (const permiso of permisos) {
            const {id_empresa, id_opcion, id_rol, id_usuario} = permiso;

            await poolAGT.query(
                `INSERT INTO permiso_rol (id_empresa, id_opcion, id_rol, id_usuario)
                 VALUES (?, ?, ?, ?)`,
                [id_empresa, id_opcion, id_rol, id_usuario]
            );
        }

        res.status(200).json({message: 'Permisos asignados correctamente'});

    } catch (error) {
        console.error('Error al insertar permisos:', error);
        res.status(500).json({error: 'Error en el servidor'});
    }


}

controller.deletePermiso = async (req, res) => {
    try {
        const id_usuario = req.params.id;
        const [response]=await poolAGT.query('delete from permiso_rol where id_usuario = ?', [id_usuario]);

        if (response.affectedRows === 1){
            res.status(200).json({msg: 'Permisos eliminado'});
        }else{
            res.status(200).json({msg: 'El usuario no tenia permisos a eliminar'});
        }
    }catch(err) {
        console.error('Error al eliminar permisos:', error);
        res.status(500).json({error: 'Error en el servidor'});
    }
}


export default controller;