import {useEffect, useState} from "react";
import { Users, Shield, ToggleLeft, ToggleRight, Edit3, Save, X, Search, Plus } from 'lucide-react'; // Import Plus icon
import {
    getAllUsers,
    getNombrePermiso,
    getPermisosManagerUser,
    getPermisosUser,
    getRoleColor
} from '../services/serviceUser';
import {useAlert} from '../utils/utilsAlerts';

export const UserComponent = ()=>{
    const {addAlert} = useAlert();
    const [usuarios, setUsuarios] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [userPermissions, setUserPermissions] = useState({});
    const [searchTerm, setSearchTerm] = useState('');



    useEffect(()=>{
        getAllUsers(sessionStorage.getItem('empresa')).then((data)=>{
            setAllUsers(data);
            setUsuarios(data);
            loadAllUserPermissions(data);
        }).catch(err => addAlert('error', 'Servidor no responde'));

        const stored = sessionStorage.getItem('permisos');
        if (stored) {
            setPermisos(JSON.parse(stored));
        }
    },[]);

    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredUsers = allUsers.filter(user =>
            user.nombre_usuario.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.departamento.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setUsuarios(filteredUsers);
    }, [searchTerm, allUsers]);


    const loadAllUserPermissions = async (users) => {
        const permissionsMap = {};

        for (const user of users) {
            try {
                const permissions = await getPermisosManagerUser(user.id_usuario);
                if (permissions && Array.isArray(permissions)) {
                    const permissionsWithNames = await Promise.all(
                        permissions.map(async (permission) => {
                            try {
                                const nameData = await getNombrePermiso(permission.url);
                                return {
                                    ...permission,
                                    displayName: nameData?.nombre || permission.url
                                };
                            } catch (error) {
                                return {
                                    ...permission,
                                    displayName: permission.url
                                };
                            }
                        })
                    );
                    permissionsMap[user.id_usuario] = permissionsWithNames;
                } else {
                    permissionsMap[user.id_usuario] = [];
                }
            } catch (error) {
                console.error(`Error loading permissions for user ${user.id_usuario}:`, error);
                permissionsMap[user.id_usuario] = [];
            }
        }

        setUserPermissions(permissionsMap);
    };

    // Placeholder function for handling new user creation
    const handleAddUser = () => {
        addAlert('info', 'Funcionalidad para añadir usuario (próximamente)');
        // In a real application, you would typically:
        // 1. Open a modal or navigate to a new form
        // 2. Collect user details (name, email, etc.)
        // 3. Send a request to your backend to create the new user
        // 4. Re-fetch the user list or add the new user to state directly
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6"> {/* Changed to justify-between */}
                <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                </div>
                {/* Add User Button */}
                <button
                    onClick={handleAddUser}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Añadir Usuario
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o departamento..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>


            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="space-y-4">
                        {usuarios.length > 0 ? (
                            usuarios.map((user) => (
                                <div
                                    key={user.id_usuario}
                                    className={`p-4 border rounded-lg ${
                                        user.status ? 'border-gray-200' : 'border-red-200 bg-red-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-left">
                                                <h3 className="font-semibold text-gray-900">{user.nombre_usuario}</h3>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                                <p className="text-sm text-gray-500">{user.departamento}</p>
                                            </div>
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(user.rol)}`}>
                                                {user.rol.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {permisos.some(p => p.url === 'manage_users') && (
                                                <>
                                                    {editingUser === user.id_usuario ? (
                                                        <>
                                                            <button
                                                                //onClick={() => handleSavePermissions(user.id)}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                //onClick={handleCancelEdit}
                                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            //onClick={() => handleEditPermissions(user)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            <button
                                                //onClick={() => handleToggleUserStatus(user.id)}
                                                className={`p-2 rounded-lg ${
                                                    user.status
                                                        ? 'text-green-600 hover:bg-green-50'
                                                        : 'text-red-600 hover:bg-red-50'
                                                }`}
                                            >
                                                {user.status ? (
                                                    <ToggleRight className="w-5 h-5" />
                                                ) : (
                                                    <ToggleLeft className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2 text-left">Permisos:</h4>
                                        {editingUser === user.id_usuario ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {userPermissions[user.id_usuario]?.map((permission) => (
                                                    <label
                                                        key={permission.url}
                                                        className="flex items-center space-x-2 text-sm"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            //checked={editPermissions.includes(permission)}
                                                            //onChange={() => togglePermission(permission)}
                                                            className="rounded border-gray-300"
                                                        />
                                                        <span className="text-gray-700">
                                                            {permission.displayName}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {userPermissions[user.id_usuario]?.map((permission) => (
                                                    <span
                                                        key={permission.url}
                                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                                                    >
                                                        {permission.displayName}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No se encontraron usuarios.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}