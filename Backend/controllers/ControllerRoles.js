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
        endpoint:req.body.endpoint,
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

//Roles
controller.permisos = async (req, res) => {
    const [roles] = await poolAGT.query('select * from permiso');
    res.json(roles);
}

export default controller;