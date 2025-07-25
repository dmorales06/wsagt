import api from "./api";

export async function getAllUsers(){
    try {
        const response = await api.get('/users/'+1);
        console.log(response.data);
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

export const getRoleColor = (role) => {
    const colors = {
        admin: 'bg-red-100 text-red-800',
        manager: 'bg-purple-100 text-purple-800',
        agent: 'bg-blue-100 text-blue-800',
        user: 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
};


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

export async function getPermisosManagerUser(id_usuario){
    try{
        const response = await api.get('/permisosUser/' + id_usuario);
        return response.data;
    }catch(error){
        // Si es un error de red (no hay respuesta del servidor)
        if (error.message === 'Network Error') {
            console.log('Error de red: El servidor no está disponible.');
        }
        // Si el servidor responde con error 404
        else if (error.response && error.response.status === 404) {
            console.log('Usuario no cuenta con permisos.');
        }
        // Puedes manejar otros códigos específicos si lo deseas
        else if (error.response && error.response.status === 405) {
            console.log('El usuario no existe o esta inhabilitado.');
        }
        else {
            // Otro tipo de error
            console.log('Servidor no responde, favor comunicarse con soporte.');
        }
        return { success: false, error: error.message };

    }
}

export async function getNombrePermiso(permiso){
    const response = await api.get('/nompermisos');
    const nombrePermiso = response.data.find(c => c.url === permiso);


    return nombrePermiso;

}