import api from "./api";

export async function getEmpresa(){
    const response = await api.get('/empresas');
    return response.data;
}

export async function getTokenUser(usuario, contrasena,empresaSeleccionada,onError, onSuccess){
    try {

        const response = await api.post('/gentoken', {
            usuario,
            contrasena,
            empresa: empresaSeleccionada
        });

        const token = response.data.token;

        // Opcional: guardar en localStorage
        localStorage.setItem('token', token);

        // Llamar callback de éxito si existe
        if (onSuccess) {
            onSuccess('¡Login exitoso!');
        }

        return { success: true, token };
    } catch (error) {
        // Llamar callback de error si existe
        if (onError) {
            onError('Usuario o contraseña erróneos, favor de validar');
        }

        return { success: false, error: error.message };

    }
}