import { User, Permission, UserRole, PermissionConfig } from '../types/ticket';

export class PermissionService {
  private static rolePermissions: PermissionConfig[] = [
    {
      role: 'admin',
      permissions: [
        'create_ticket',
        'view_all_tickets',
        'view_own_tickets',
        'edit_all_tickets',
        'edit_own_tickets',
        'delete_tickets',
        'assign_tickets',
        'change_status',
        'view_reports',
        'manage_users',
        'manage_permissions',
        'add_comments',
        'view_internal_comments',
        'view_pases'
      ],
      description: 'Acceso completo al sistema'
    },
    {
      role: 'manager',
      permissions: [
        'create_ticket',
        'view_all_tickets',
        'view_own_tickets',
        'edit_all_tickets',
        'edit_own_tickets',
        'assign_tickets',
        'change_status',
        'add_comments',
        'view_internal_comments'
      ],
      description: 'Gestión de tickets y reportes'
    },
    {
      role: 'agent',
      permissions: [
        'create_ticket',
        'view_all_tickets',
        'view_own_tickets',
        'edit_own_tickets',
        'change_status',
        'add_comments',
        'view_internal_comments'
      ],
      description: 'Atención y resolución de tickets'
    },
    {
      role: 'user',
      permissions: [
        'create_ticket',
        'view_own_tickets',
        'edit_own_tickets',
        'add_comments'
      ],
      description: 'Usuario final - crear y seguir tickets propios'
    }
  ];

  static hasPermission(user: User, permission: Permission): boolean {
    return user.permissions.includes(permission) && user.isActive;
  }

  static canViewTicket(user: User, ticket: any): boolean {
    if (!user.isActive) return false;
    
    if (this.hasPermission(user, 'view_all_tickets')) {
      return true;
    }
    
    if (this.hasPermission(user, 'view_own_tickets')) {
      return ticket.createdBy === user.id || ticket.assignedTo === user.id;
    }
    
    return false;
  }

  static canEditTicket(user: User, ticket: any): boolean {
    if (!user.isActive) return false;
    
    if (this.hasPermission(user, 'edit_all_tickets')) {
      return true;
    }
    
    if (this.hasPermission(user, 'edit_own_tickets')) {
      return ticket.createdBy === user.id || ticket.assignedTo === user.id;
    }
    
    return false;
  }

  static getPermissionsForRole(role: UserRole): Permission[] {
    const config = this.rolePermissions.find(p => p.role === role);
    return config ? config.permissions : [];
  }

  static getAllRoleConfigs(): PermissionConfig[] {
    return this.rolePermissions;
  }

  static updateUserPermissions(user: User, customPermissions?: Permission[]): User {
    const rolePermissions = this.getPermissionsForRole(user.role);
    const finalPermissions = customPermissions || rolePermissions;
    
    return {
      ...user,
      permissions: finalPermissions
    };
  }
}