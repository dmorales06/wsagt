import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generarToken(usuario) {
    return jwt.sign({ id: usuario.id_usuario, nombre: usuario.usuario }, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token válido por 1 hora
    });
}
