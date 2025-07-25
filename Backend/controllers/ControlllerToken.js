import {poolAGT} from "../DBS/conectionBD_mysql.js";
import {generarToken} from '../authenticacion/authJWT.js';
import bcryptjs from 'bcryptjs';


const token = {};

//generar token
token.generarToken = async (req, res) => {


    try {
        const {usuario, contrasena,empresa} = req.body;
        const [usuarios] = await poolAGT.query(`select usr.*, roles.nombre as rol, roles.descripcion as nom_rol
                                                from usuario usr
                                                         left join rol roles on usr.id_rol = roles.id_rol
                                                where usr.status = ?
                                                  and usr.id_empresa = ?`, ['A',empresa]);
        const usuarioObtenido = usuarios.find(c => c.usuario === usuario);


        if (usuarioObtenido.id_empresa == empresa && usuarioObtenido.usuario == usuario &&  (await bcryptjs.compare(contrasena, usuarioObtenido.contrasena))) {

            const token = generarToken(usuarioObtenido);
            res.json({token,usuarioObtenido});
        } else {
            res.status(406).send("contraseña o usuario incorrecto");
        }
    } catch (err) {
        res.status(405).send("El usuario no existe o esta inhabilitado.");
    }


}

export default token;