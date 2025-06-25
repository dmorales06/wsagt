import {poolAGT} from '../DBS/conectionBD_mysql.js';
import {generarToken} from '../authenticacion/authJWT.js';

const controller = {};

//generar token
controller.generarToken = async (req, res) => {

    try {
        const {id_usuario, usuario, contrasena} = req.body;
        const [usuarios] = await poolAGT.query('select * from usuario where status=?', ['A']);
        const usuarioObtenido = usuarios.find(c => c.id_usuario === id_usuario);

        if (usuarioObtenido.id_usuario == id_usuario && usuarioObtenido.usuario == usuario && usuarioObtenido.contrasena == contrasena) {

            const token = generarToken(usuarioObtenido);
            res.json({token});
        }else{
            res.status(404).send("contraseña o usuario incorrecto");
        }
    }catch(err){
        res.status(404).send("El usuario no existe o esta inhabilitado.");
    }


}

//obtener usuarios generales
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
            res.status(201).json({msg: 'Usuario elimiado exitosamente'});
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
            res.status(201).json({msg: 'Usuario actualizado exitosamente'});
        }
    }
}

//----------------------------------------------------------------------------
//Obtener areas de empresa
controller.area = async (req, res) => {
    const [departametno] = await poolAGT.query('select * from departamento');
    res.json(departametno);
}

//Obtener area de empresa por ID
controller.areaID = async (req, res) => {
    const [areas] = await poolAGT.query('select * from departamento');
    const area = areas.find(c => c.id_departamento === parseInt(req.params.id));
    if (!area) return res.status(404).json({msg: 'Departamento no encontrado'});
    else res.json(area);
}

//----------------------------------------------------------------------------
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

export default controller;