import { Users, Shield, ToggleLeft, ToggleRight, Edit3, Save, X } from 'lucide-react';
import {getUsers} from '../services/serviceUser';
import {useEffect, useState} from "react";
import {useAlert} from '../utils/utilsAlerts';

export const UserManagment = ()=>{
    const {addAlert} = useAlert();
    const [usuarios, setUsuarios] = useState('');

    useEffect(()=>{
        getUsers().then((data)=>{
            setUsuarios(data);
        }).catch(err => addAlert('error', 'Servidor no responde'));
    },[])

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="space-y-4">
                        {usuarios.map((user) => (
                            <div
                                key={user.id}
                                className={`p-4 border rounded-lg ${
                                    user.isActive ? 'border-gray-200' : 'border-red-200 bg-red-50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.nombre_usuario}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <p className="text-sm text-gray-500">{user.id_departamento}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full red`}>
                      {user.role.toUpperCase()}
                    </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {canManagePermissions && (
                                            <>
                                                {editingUser === user.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSavePermissions(user.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditPermissions(user)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        <button
                                            onClick={() => handleToggleUserStatus(user.id)}
                                            className={`p-2 rounded-lg ${
                                                user.isActive
                                                    ? 'text-green-600 hover:bg-green-50'
                                                    : 'text-red-600 hover:bg-red-50'
                                            }`}
                                        >
                                            {user.isActive ? (
                                                <ToggleRight className="w-5 h-5" />
                                            ) : (
                                                <ToggleLeft className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Permisos:</h4>
                                    {editingUser === user.id ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {allPermissions.map((permission) => (
                                                <label
                                                    key={permission}
                                                    className="flex items-center space-x-2 text-sm"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={editPermissions.includes(permission)}
                                                        onChange={() => togglePermission(permission)}
                                                        className="rounded border-gray-300"
                                                    />
                                                    <span className="text-gray-700">
                            {getPermissionLabelSync(permission) || permission}
                          </span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {user.permissions.map((permission) => (
                                                <span
                                                    key={permission}
                                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                                                >
                          {getPermissionLabelSync(permission) || permission}
                        </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Roles</h3>
                    <div className="space-y-4">
                        {PermissionService.getAllRoleConfigs().map((config) => (
                            <div key={config.role} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(config.role)}`}>
                    {config.role.toUpperCase()}
                  </span>
                                    <span className="text-sm text-gray-600">
                    {config.permissions.length} permisos
                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {config.permissions.map((permission) => (
                                        <span
                                            key={permission}
                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                        >
                      {getPermissionLabelSync(permission) || permission}
                    </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}