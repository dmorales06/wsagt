import api from "./api";

export async function getAllUsers(){
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        if (error.response) {
            // La solicitud fue hecha pero no hubo respuesta
            error('Usuario no obtenidos');
        } else if (error.request) {
            error("⚠️ Se hizo la solicitud pero no hubo respuesta del servidor:");
        } else {
            if (error.message === 'Network Error') {
                error('Error de red: El servidor no está disponible.');
            } else {
                error('Servidor no responde, favor comunicarse con soporte');
            }
        }
    }
}