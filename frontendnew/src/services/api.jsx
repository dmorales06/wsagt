import axios from "axios";


// Crear una instancia
const api = axios.create({
    //baseURL: "https://wsagt.onrender.com/api",
    baseURL: "http://localhost:2000/api",
});

// Agregar token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de respuestas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el token expiró o no es válido
        if (error.response && error.response.status === 401) {
            console.warn("Token inválido o expirado. Redirigiendo al login...");
            localStorage.removeItem("token");
            window.location.href = "/login"; // o usa useNavigate() si estás con react-router
        }
        return Promise.reject(error);
    }
);

export default api;
