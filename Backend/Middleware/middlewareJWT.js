import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
}
