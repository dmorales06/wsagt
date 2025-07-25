import api from "./api";
import React from 'react';

export async function getEmpresa() {
    try {
        const response = await api.get('/empresas');

        // Guardar en cache
        localStorage.setItem('empresas', JSON.stringify(response.data));

        return response.data;
    } catch (error) {
        //console.error("Error al obtener empresas desde la API:", error.message);

        // Si hay datos en cache, úsalos
        const cachedData = localStorage.getItem('empresas');

        if (cachedData) {
            return JSON.parse(cachedData);
        } else {
            // Si tampoco hay datos en caché, lanza el error
            throw new Error("No se pudieron obtener los datos de empresas ni desde la API ni desde el cache.");
        }
    }
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
        if (onError.response) {
            // La solicitud fue hecha pero no hubo respuesta
            onError('Usuario o contraseña erróneos, favor de validar');
        } else if (onError.request) {
            onError("⚠️ Se hizo la solicitud pero no hubo respuesta del servidor:");
        } else {
            if (error.message === 'Network Error') {
                onError('Error de red: El servidor no está disponible.');
            } else {
                onError('Servidor no responde, favor comunicarse con soporte');
            }
        }

        return { success: false, error: error.message };

    }
}

export interface EmpresaSeleccionada {

}