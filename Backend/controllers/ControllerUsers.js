import {poolAGT} from '../DBS/conectionBD_mysql.js';

const controller = {};

//obtener usuarios generales
controller.usuarios = async (req, res) => {
    try {
        const id_empresa = req.params.id_empresa;
        const [usuarios] = await poolAGT.query(`select usr.*,
                                                       roles.nombre      as rol,
                                                       roles.descripcion as nom_rol,
                                                       dpt.nombre        as departamento
                                                from usuario usr
                                                         left join rol roles on usr.id_rol = roles.id_rol
                                                         left join departamento dpt on dpt.id_departamento = usr.id_departamento
                                                where usr.id_empresa = ?`,[id_empresa]);
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudieron obtener los usuarios'
        });
    }
};



// Obtener usuario por ID
controller.usuarioID = async (req, res) => {
    try {
        const {usuario, contrasena,empresa} = req.body;
        const id = parseInt(req.params.id);

        // Validar que el ID sea un número válido
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                error: 'ID inválido',
                message: 'El ID debe ser un número positivo'
            });
        }

        // Consulta directa por ID en lugar de traer todos los usuarios
        const [usuarios] = await poolAGT.query(
            'SELECT * FROM usuario WHERE id_usuario = ?',
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: `No existe un usuario con ID ${id}`
            });
        }

        res.json(usuarios[0]);
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo obtener el usuario'
        });
    }
};


//crear usuarios
controller.crtusuario = async (req, res) => {
    try {
        const usuario={id_usuario: req.body.id_usuario,
            id_empresa:req.body.id_empresa,
            usuario:req.body.id_usuario,
            dpi:req.body.dpi,
            fecha_alta:req.body.fecha_alta,
            nombre_usuario:req.body.nombre_usuario,
            contrasena: req.body.contrasena,
            email: req.body.email,
            fecha_nacimiento:req.body.fecha_nacimiento,
            id_departamento:req.body.id_departamento,
            id_puesto:req.body.id_puesto,
            id_rol: req.body.id_rol,
            id_agencia: req.body.id_agencia,
            status:req.body.status,};

        const [result] = await poolAGT.query('insert into usuario set ?', [usuario]);
        if (result.affectedRows === 1) {
            res.status(201).json({
                msg: 'Usuario creado exitosamente',
                usuario: {...usuario}
            });
        } else {
            res.status(400).json({msg: 'Error al crear el usuario'});
        }
    } catch (error) {
        console.error('Error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({msg: 'El usuario ya existe'});
        } else {
            res.status(500).json({msg: 'Error en el servidor'});
        }
    }

}

// Eliminar usuario por ID
controller.delusuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Validar que el ID sea un número válido
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                error: 'ID inválido',
                message: 'El ID debe ser un número positivo'
            });
        }

        // Verificar si el usuario existe antes de eliminarlo
        const [existeUsuario] = await poolAGT.query(
            'SELECT id_usuario FROM usuario WHERE id_usuario = ?',
            [id]
        );

        if (existeUsuario.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: `No existe un usuario con ID ${id}`
            });
        }

        // Eliminar el usuario
        const [result] = await poolAGT.query(
            'DELETE FROM usuario WHERE id_usuario = ?',
            [id]
        );

        if (result.affectedRows === 1) {
            res.status(200).json({
                message: 'Usuario eliminado exitosamente',
                deletedId: id
            });
        } else {
            res.status(500).json({
                error: 'Error al eliminar',
                message: 'No se pudo eliminar el usuario'
            });
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo eliminar el usuario'
        });
    }
};

// Actualizar usuario por ID
controller.updusuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Validar que el ID sea un número válido
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                error: 'ID inválido',
                message: 'El ID debe ser un número positivo'
            });
        }

        // Verificar si el usuario existe
        const [existeUsuario] = await poolAGT.query(
            'SELECT id_usuario FROM usuario WHERE id_usuario = ?',
            [id]
        );

        if (existeUsuario.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: `No existe un usuario con ID ${id}`
            });
        }

        // Construir objeto de actualización solo con campos presentes
        const updateData = {};
        const allowedFields = ['nombre_usuario', 'contrasena', 'id_departamento', 'id_puesto', 'id_rol'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Verificar que se envió al menos un campo para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: 'Datos inválidos',
                message: 'Debe proporcionar al menos un campo para actualizar'
            });
        }

        // Construir consulta dinámica
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        const setClause = fields.map(field => `${field} = ?`).join(', ');

        const [result] = await poolAGT.query(
            `UPDATE usuario SET ${setClause} WHERE id_usuario = ?`,
            [...values, id]
        );

        if (result.affectedRows === 1) {
            res.status(200).json({
                message: 'Usuario actualizado exitosamente',
                updatedId: id,
                updatedFields: fields
            });
        } else {
            res.status(500).json({
                error: 'Error al actualizar',
                message: 'No se pudo actualizar el usuario'
            });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo actualizar el usuario'
        });
    }
};

controller.updateusr = async (req, res) => {
    try{
        const {empresa} = req.params;
        const {status,id_usuario,usuario} = req.body;


        const [updateData] = await poolAGT.query('UPDATE usuario SET status = ? WHERE id_usuario = ? and id_empresa=? and usuario=?',[status,id_usuario,empresa,usuario]);

        if (updateData.affectedRows === 1) {
            res.status(200).json({
                message: 'Usuario actualizado exitosamente'
            });
        } else {
            res.status(500).json({
                error: 'Error al actualizar',
                message: 'No se pudo actualizar el usuario'
            });
        }
    }catch(error){
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo actualizar el usuario'
        });
    }
}

controller.empresas = async (req, res) => {
    try{
        const [empresas] = await poolAGT.query('SELECT * FROM empresa WHERE STATUS=?', ['A']);
        res.json(empresas);
    }catch(error){
        res.status(500).json({error: 'Error al obtener empresas'});
    }
}

export default controller;