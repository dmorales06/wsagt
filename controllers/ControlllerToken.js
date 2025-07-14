import {poolAGT} from "../DBS/conectionBD_mysql.js";
import {generarToken} from '../authenticacion/authJWT.js';


const token = {};

//generar token
token.generarToken = async (req, res) => {


    try {
        const {id_usuario, usuario, contrasena} = req.body;
        const [usuarios] = await poolAGT.query('select * from usuario where status=?', ['A']);
        const usuarioObtenido = usuarios.find(c => c.id_usuario === id_usuario);


        if (usuarioObtenido.id_usuario == id_usuario && usuarioObtenido.usuario == usuario && usuarioObtenido.contrasena == contrasena) {

            const token = generarToken(usuarioObtenido);
            res.json({token});
        } else {
            res.status(404).send("contraseña o usuario incorrecto");
        }
    } catch (err) {
        res.status(404).send("El usuario no existe o esta inhabilitado.");
    }


}

export default token;