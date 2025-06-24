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
        res.status(500).send("El usuario no existe o esta inhabilitado.");
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
        const usuario = {
            Emp: req.body.Emp,
            id_usuario: req.body.id_usuario,
            acnomb: req.body.acnomb,
            acdpi: parseInt(req.body.acdpi),
            acfecalt: req.body.acfecalt,
            acuser: req.body.acuser,
            acpass: req.body.acpass,
            acmail: req.body.acmail,
            acfecna: req.body.acfecna,
            acdepto: req.body.acdepto,
            acpuest: req.body.acpuest,
            acrol: req.body.acrol,
        }

        const [result] = await poolAGT.query('insert into usuario set ?', [usuario]);
        if (result.affectedRows === 1) {
            res.status(201).json({
                msg: 'Usuario creado exitosamente',
                usuario: {...usuario, id: result.insertId}
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
        acnomb: req.body.acnomb,
        acpass: req.body.acpass,
        acdepto: req.body.acdepto,
        acpuest: req.body.acpuest,
        acrol: req.body.acrol,
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