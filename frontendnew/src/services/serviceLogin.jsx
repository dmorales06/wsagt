import api from "./api";
import React from 'react';
import {data} from "react-router-dom";
import {useAlert} from '../utils/utilsAlerts';
import {getPermisosUser} from "./serviceUser";

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

        const dataUser = response.data.usuarioObtenido;

        const token = response.data.token;

        const datosSession = {
            id_usuario:dataUser.id_usuario,
            usuario: dataUser.usuario,
            nombre_usuario:dataUser.nombre_usuario,
            status: dataUser.status === 'A' ? 'Activo' : dataUser.status,
            id_rol:dataUser.id_rol,
            id_puesto:dataUser.id_puesto,
            id_departamento:dataUser.id_departamento,
            id_empresa:dataUser.id_empresa,
            nom_rol:dataUser.nom_rol,
            rol:dataUser.rol,

        }

        getPermisosUser(datosSession.id_usuario,dataUser.id_empresa,onError)




        // Opcional: guardar en localStorage
        localStorage.setItem('token', token);
        sessionStorage.setItem('usuario', JSON.stringify(datosSession));

        // Llamar callback de éxito si existe
        if (onSuccess) {
            onSuccess('¡Login exitoso!');
        }

        return { success: true, token };
    } catch (error) {
        // Si es un error de red (no hay respuesta del servidor)
        if (error.message === 'Network Error') {
            onError('Error de red: El servidor no está disponible.');
        }
        // Si el servidor responde con error 404
        else if (error.response && error.response.status === 406) {
            onError('Usuario o contraseña erróneos, favor de validar.');
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

