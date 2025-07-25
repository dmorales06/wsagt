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

export async function getPermisosUser(id_usuario,onError){
    try{
        const response = await api.get('/permisosUser/' + id_usuario);
        sessionStorage.setItem('permisos', JSON.stringify(response.data));
        return response.data;


    }catch(error){
        // Si es un error de red (no hay respuesta del servidor)
        if (error.message === 'Network Error') {
            onError('Error de red: El servidor no está disponible.');
        }
        // Si el servidor responde con error 404
        else if (error.response && error.response.status === 404) {
            onError('Usuario no cuenta con permisos.');
        }
        // Puedes manejar otros códigos específicos si lo deseas
        else if (error.response && error.response.status === 405) {
            onError('El usuario no existe o esta inhabilitado.');
        }
        else {
            // Otro tipo de error
            onError('Servidor no responde, favor comunicarse con soporte.');
        }
        return { success: false, error: error.message };

    }
}