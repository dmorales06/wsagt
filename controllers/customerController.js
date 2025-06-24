import {poolAGT} from '../conectionBD.js';
import {generarToken} from '../auth.js';

const controller = {};

//generar token
controller.generarToken = async (req, res) => {

    try {
        const {id_usuario, usuario, contrasena} = req.body;
        const [usuarios] = await poolAGT.query('select * from usuario where status=?', ['A']);
        const usuarioObtenido = usuarios.find(c => c.id_usuario === id_usuario);

        console.log(id_usuario, usuario, contrasena);

        if (usuarioObtenido.id_usuario == id_usuario && usuarioObtenido.usuario == usuario && usuarioObtenido.contrasena == contrasena) {
            const token = generarToken(usuarioObtenido);
            res.json({token});
        }
    }catch(err){
        res.status(404).send("El usuario no existe o esta inhabilitado.");
    }


}

//usuarios generales
controller.usuarios = async (req, res) => {
    const [usuarios] = await poolAGT.query('select * from usuario');
    res.json(usuarios);
}

//usuarios por ID
controller.usuarioID = async (req, res) => {
    const [usuarios] = await poolAGT.query('select * from usuario');
    const usuario = usuarios.find(c => c.id_usuario === parseInt(req.params.id));
    if (!usuario) return res.status(404).json({msg: 'Usuario no encontrado'});
    else res.json(usuario);
}

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

//Eliminar usuarios
controller.delusuario = async (req, res) => {
    const [usuarios] = await poolAGT.query('select * from usuario');
    const usuario = usuarios.find(c => c.id_usuario === parseInt(req.params.id));
    if (!usuario) return res.status(404).json({msg: 'Usuario no encontrado'});
    else {
        const [result] = await poolAGT.query('delete from usuario where id_usuario = ?', [usuario.id_usuario]);
        if (result.affectedRows === 1) {
            res.json({msg: 'Usuario eliminado exitosamente'});
        }
    }
}

//Actualizar usuarios
controller.updusuario = async (req, res) => {
    const [usuarios] = await poolAGT.query('select * from usuario');
    const usuario = usuarios.find(c => c.id_usuario === parseInt(req.params.id));

    const updateData = {
        nombre_usuario:req.body.nombre_usuario,
        contrasena: req.body.contrasena ,
        id_departamento: req.body.id_departamento,
        id_puesto: req.body.id_puesto,
        id_rol: req.body.id_rol,
    }
    if (!usuario) return res.status(404).json({msg: 'Usuario no encontrado'});

    else {
        const [result] = await poolAGT.query('update usuario set ? where id_usuario = ?', [updateData, usuario.id_usuario]);
        if (result.affectedRows === 1) {
            res.json({msg: 'Usuario actualizado exitosamente'});
        }
    }
}


export default controller;