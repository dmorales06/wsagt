import { Ticket, User, TicketStatus, TicketPriority, Comment } from '../types/ticket';
import { PermissionService } from './permissionService';

export class TicketService {
  private static tickets: Ticket[] = [
    {
      id: '1',
      title: 'Error en el sistema de login',
      description: 'Los usuarios no pueden acceder al sistema desde esta mañana',
      status: 'open',
      priority: 'high',
      category: 'Sistema',
      createdBy: 'user1',
      assignedTo: 'agent1',
      createdAt: new Date('2024-01-15T09:00:00'),
      updatedAt: new Date('2024-01-15T09:00:00'),
      comments: [],
      attachments: [],
      tags: ['login', 'urgente']
    },
    {
      id: '2',
      title: 'Solicitud de nuevo usuario',
      description: 'Necesito crear un usuario para el nuevo empleado Juan Pérez',
      status: 'in-progress',
      priority: 'medium',
      category: 'Usuarios',
      createdBy: 'user2',
      assignedTo: 'agent2',
      createdAt: new Date('2024-01-14T14:30:00'),
      updatedAt: new Date('2024-01-15T08:15:00'),
      comments: [],
      attachments: [],
      tags: ['usuario', 'nuevo']
    }
  ];

  static getAllTickets(user: User): Ticket[] {
    return this.tickets.filter(ticket => PermissionService.canViewTicket(user, ticket));
  }

  static getTicketById(id: string, user: User): Ticket | null {
    const ticket = this.tickets.find(t => t.id === id);
    if (!ticket || !PermissionService.canViewTicket(user, ticket)) {
      return null;
    }
    return ticket;
  }

  static createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>, user: User): Ticket | null {
    if (!PermissionService.hasPermission(user, 'create_ticket')) {
      return null;
    }

    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };

    this.tickets.push(newTicket);
    return newTicket;
  }

  static updateTicket(id: string, updates: Partial<Ticket>, user: User): Ticket | null {
    const ticketIndex = this.tickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) return null;

    const ticket = this.tickets[ticketIndex];
    if (!PermissionService.canEditTicket(user, ticket)) {
      return null;
    }

    // Verificar permisos específicos para ciertas actualizaciones
    if (updates.assignedTo && !PermissionService.hasPermission(user, 'assign_tickets')) {
      delete updates.assignedTo;
    }

    if (updates.status && !PermissionService.hasPermission(user, 'change_status')) {
      delete updates.status;
    }

    const updatedTicket = {
      ...ticket,
      ...updates,
      updatedAt: new Date()
    };

    this.tickets[ticketIndex] = updatedTicket;
    return updatedTicket;
  }

  static deleteTicket(id: string, user: User): boolean {
    if (!PermissionService.hasPermission(user, 'delete_tickets')) {
      return false;
    }

    const ticketIndex = this.tickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) return false;

    this.tickets.splice(ticketIndex, 1);
    return true;
  }

  static addComment(ticketId: string, content: string, user: User, isInternal: boolean = false): Comment | null {
    if (!PermissionService.hasPermission(user, 'add_comments')) {
      return null;
    }

    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket || !PermissionService.canViewTicket(user, ticket)) {
      return null;
    }

    // Solo ciertos roles pueden agregar comentarios internos
    if (isInternal && !PermissionService.hasPermission(user, 'view_internal_comments')) {
      isInternal = false;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      ticketId,
      userId: user.id,
      content,
      createdAt: new Date(),
      isInternal
    };

    ticket.comments.push(comment);
    ticket.updatedAt = new Date();

    return comment;
  }

  static getTicketsByStatus(status: TicketStatus, user: User): Ticket[] {
    return this.getAllTickets(user).filter(ticket => ticket.status === status);
  }

  static getTicketsByPriority(priority: TicketPriority, user: User): Ticket[] {
    return this.getAllTickets(user).filter(ticket => ticket.priority === priority);
  }

  static getAssignedTickets(userId: string, user: User): Ticket[] {
    return this.getAllTickets(user).filter(ticket => ticket.assignedTo === userId);
  }
}