
import { User } from '../types/ticket';
import { PermissionService } from './permissionService';

export class UserService {
  private static users: User[] = [
    {
      id: 'admin1',
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
      role: 'admin',
      department: 'IT',
      permissions: PermissionService.getPermissionsForRole('admin'),
      isActive: true
    },
    {
      id: 'manager1',
      name: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      role: 'manager',
      department: 'IT',
      permissions: PermissionService.getPermissionsForRole('manager'),
      isActive: true
    },
    {
      id: 'agent1',
      name: 'María Rodríguez',
      email: 'maria.rodriguez@empresa.com',
      role: 'agent',
      department: 'Soporte',
      permissions: PermissionService.getPermissionsForRole('agent'),
      isActive: true
    },
    {
      id: 'agent2',
      name: 'Pedro Martínez',
      email: 'pedro.martinez@empresa.com',
      role: 'agent',
      department: 'Soporte',
      permissions: PermissionService.getPermissionsForRole('agent'),
      isActive: true
    },
    {
      id: 'user1',
      name: 'Laura Sánchez',
      email: 'laura.sanchez@empresa.com',
      role: 'user',
      department: 'Ventas',
      permissions: PermissionService.getPermissionsForRole('user'),
      isActive: true
    },
    {
      id: 'user2',
      name: 'Roberto Torres',
      email: 'roberto.torres@empresa.com',
      role: 'user',
      department: 'Marketing',
      permissions: PermissionService.getPermissionsForRole('user'),
      isActive: true
    }
  ];

  static getAllUsers(currentUser: User): User[] {
    if (!PermissionService.hasPermission(currentUser, 'manage_users')) {
      return [];
    }
    return this.users;
  }

  static getUserById(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }

  static updateUserPermissions(userId: string, permissions: string[], currentUser: User): User | null {

    if (!PermissionService.hasPermission(currentUser, 'manage_permissions')) {
      return null;
    }

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    const user = this.users[userIndex];
    const updatedUser = {
      ...user,
      permissions: permissions as any[]
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  static toggleUserStatus(userId: string, currentUser: User): User | null {
    if (!PermissionService.hasPermission(currentUser, 'manage_users')) {
      return null;
    }

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    const user = this.users[userIndex];
    const updatedUser = {
      ...user,
      isActive: !user.isActive
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  static getAgents(): User[] {
    return this.users.filter(user => user.role === 'agent' && user.isActive);
  }
}