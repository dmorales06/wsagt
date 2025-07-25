import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Ticket,
    Plus,
    Filter,
    Users,
    BarChart3,
    User,
    LogOut,
    Settings,
    Database
} from 'lucide-react';
import {logout} from "../utils/authJWT";
import {getRoleColor} from "../services/serviceUser";
import {UserComponent} from "../components/UserComponent";

export function Inicio() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('');
    const [permisos, setPermisos] = useState([]);

    useEffect(() => {
        const checkPermisos = () => {
            const stored = sessionStorage.getItem('permisos');
            if (stored) {
                setPermisos(JSON.parse(stored));
            }
        };

        checkPermisos(); // primera lectura

        const interval = setInterval(() => {
            const stored = sessionStorage.getItem('permisos');
            if (stored) {
                setPermisos(JSON.parse(stored));
                clearInterval(interval); // detener cuando ya los tienes
            }
        }, 500); // intenta cada medio segundo

        return () => clearInterval(interval); // limpieza
    }, []);


    // Función que ejecuta logout y navegación
    const handleLogout = () => (logout(), navigate('/'), sessionStorage.clear());


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Ticket className="w-8 h-8 text-blue-600"/>
                            <h1 className="text-xl font-bold text-gray-900">Sistema de Gestiones</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <User className="w-5 h-5 text-gray-400"/>
                                <span
                                    className="text-sm text-gray-700">{JSON.parse(sessionStorage.getItem('usuario')).nombre_usuario}
                                </span>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(JSON.parse(sessionStorage.getItem('usuario')).rol)}`}>
                                    {JSON.parse(sessionStorage.getItem('usuario')).rol.toUpperCase()}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout()
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <LogOut className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {permisos.some(p => p.url === 'view_tickets') && (
                            <button
                                onClick={() => setActiveTab('tickets')}
                                className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                                    activeTab === 'tickets'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <BarChart3 className="w-4 h-4"/>
                                <span>Tickets</span>
                            </button>
                        )}

                        {permisos.some(p => p.url === 'manage_users') && (

                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                                    activeTab === 'users'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Database className="w-4 h-4"/>
                                <span>Usuarios</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'tickets' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="text-center">
                            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300"/>
                            <p className="text-gray-500">Módulo de tickets en desarrollo</p>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="text-center">
                            <UserComponent className="w-5 h-5"/>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}