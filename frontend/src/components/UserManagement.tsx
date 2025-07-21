import React, { useState, useEffect } from 'react';
import {
  User,
  Permission,
  fetchPermissions, getPermissionLabelSync
} from '../types/ticket';
import { UserService } from '../services/userService';
import { PermissionService } from '../services/permissionService';
import { Users, Shield, ToggleLeft, ToggleRight, Edit3, Save, X } from 'lucide-react';

interface UserManagementProps {
  currentUser: User;
}


export const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>(UserService.getAllUsers(currentUser));
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const canManageUsers = PermissionService.hasPermission(currentUser, 'manage_users');
  const canManagePermissions = PermissionService.hasPermission(currentUser, 'manage_permissions');

  // Cargar permisos al montar el componente
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const permissions = await fetchPermissions();
        setAllPermissions(permissions);
      } catch (error) {
        console.error('Error loading permissions:', error);
        // Fallback a permisos por defecto si falla la carga
        setAllPermissions([
          'create_ticket',
          'view_all_tickets',
          'view_own_tickets',
          'edit_all_tickets',
          'edit_own_tickets',
          'delete_tickets',
          'assign_tickets',
          'change_status',
          'view_reports',
          'view_pases',
          'manage_users',
          'manage_permissions',
          'add_comments',
          'view_internal_comments'
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  if (!canManageUsers) {
    return (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No tienes permisos para gestionar usuarios</p>
        </div>
    );
  }

  if (loading) {
    return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando permisos...</p>
        </div>
    );
  }

  const handleToggleUserStatus = (userId: string) => {
    const updatedUser = UserService.toggleUserStatus(userId, currentUser);
    if (updatedUser) {
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    }
  };

  const handleEditPermissions = (user: User) => {
    setEditingUser(user.id);
    setEditPermissions([...user.permissions]);
  };

  const handleSavePermissions = (userId: string) => {
    const updatedUser = UserService.updateUserPermissions(userId, editPermissions, currentUser);
    if (updatedUser) {
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      setEditingUser(null);
      setEditPermissions([]);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditPermissions([]);
  };

  const togglePermission = (permission: Permission) => {
    if (editPermissions.includes(permission)) {
      setEditPermissions(editPermissions.filter(p => p !== permission));
    } else {
      setEditPermissions([...editPermissions, permission]);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-purple-100 text-purple-800',
      agent: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  console.log(currentUser);
  return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {users.map((user) => (
                  <div
                      key={user.id}
                      className={`p-4 border rounded-lg ${
                          user.isActive ? 'border-gray-200' : 'border-red-200 bg-red-50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.department}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(user.role)}`}>
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
};