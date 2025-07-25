import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getEmpresa, getTokenUser} from "../services/serviceLogin";
import {getAllUsers} from "../services/serviceUser";
import {Eye, EyeOff, User, Building, Lock} from 'lucide-react';
import {useAlert} from '../utils/utilsAlerts';
import {logout} from '../utils/authJWT';

export function ViewLogin() {
    const {addAlert} = useAlert();
    const [empresas, setEmpresas] = useState([]);
    const [error, setError] = useState('');
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
    const [usuario, setUsuario] = useState('');

    const [contrasena, setContrasena] = useState('');

    const [mostrarContrasena, setMostrarContrasena] = useState(false);


    useEffect(() => {
        logout()
        getEmpresa()
            .then(data => {
                setEmpresas(data);
                // Seleccionar la primera empresa por defecto
                if (data.length > 0) {
                    setEmpresaSeleccionada(data[0].id_empresa); // o una por ID específica si quieres
                }
            })
            .catch(err => addAlert('error', 'Servidor no responde'));

    }, []);


    const navigate = useNavigate();


    const handleLogin = async () => {
        sessionStorage.setItem('usuario', JSON.stringify());
        if (!usuario || !contrasena || !empresaSeleccionada) {
            addAlert('warning', 'Por favor llena todos los campos');
            return;
        }
        getTokenUser(usuario, contrasena, empresaSeleccionada,
            // Callback para errores
            (errorMessage) => addAlert('error', errorMessage),
            // Callback para éxito
            (successMessage) => {
                addAlert('success', successMessage);
                navigate('/home'); // Redirección al home si login es exitoso
            }
        );
    };

    if (error) return <p>Error: {error}</p>;


    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-center">
                        <div
                            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Lock className="w-10 h-10 text-white"/>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Bienvenido</h1>
                        <p className="text-blue-100">Ingresa tus credenciales para acceder</p>
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Usuario */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Usuario</label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        type="text"
                                        required={true}
                                        value={usuario}
                                        onChange={(e) => setUsuario(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                                        placeholder="Ingresa tu usuario"
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Contraseña</label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        type={mostrarContrasena ? 'text' : 'password'}
                                        required={true}
                                        value={contrasena}
                                        onChange={(e) => setContrasena(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl"
                                        placeholder="Ingresa tu contraseña"
                                    />
                                    <button type="button"
                                            onClick={() => setMostrarContrasena((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                        {mostrarContrasena ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                    </button>
                                </div>
                            </div>

                            {/* Empresa */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Empresa</label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <select
                                        value={empresaSeleccionada}
                                        onChange={(e) => setEmpresaSeleccionada(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    >
                                        <option value="">Selecciona una empresa</option>
                                        {empresas.map((empresa) => (
                                            <option key={empresa.id_empresa} value={empresa.id_empresa}>
                                                {empresa.nombre} - {empresa.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Botón */}
                            <button
                                onClick={handleLogin}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-xl font-medium hover:scale-105 transition-all"
                            >
                                Acceder
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">¿Olvidaste tu
                                contraseña?</a>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-8 text-sm text-gray-500">
                    © 2025 Diego Morales. Todos los derechos reservados.
                </div>
            </div>
        </div>
    );
}
