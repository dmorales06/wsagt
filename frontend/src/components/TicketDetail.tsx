import React, { useState } from 'react';
import { Ticket, User, TicketStatus, TicketPriority } from '../types/ticket';
import { PermissionService } from '../services/permissionService';
import { TicketService } from '../services/ticketService';
import { UserService } from '../services/userService';
import { 
  Calendar, 
  User as UserIcon, 
  MessageSquare, 
  Edit3, 
  Save, 
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle as XCircleIcon
} from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  currentUser: User;
  onTicketUpdate: (ticket: Ticket) => void;
}

const statusOptions: { value: TicketStatus; label: string; color: string }[] = [
  { value: 'open', label: 'Abierto', color: 'text-blue-600' },
  { value: 'in-progress', label: 'En Progreso', color: 'text-yellow-600' },
  { value: 'pending', label: 'Pendiente', color: 'text-orange-600' },
  { value: 'resolved', label: 'Resuelto', color: 'text-green-600' },
  { value: 'closed', label: 'Cerrado', color: 'text-gray-600' }
];

const priorityOptions: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baja', color: 'text-green-600' },
  { value: 'medium', label: 'Media', color: 'text-yellow-600' },
  { value: 'high', label: 'Alta', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgente', color: 'text-red-600' }
];

export const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  currentUser,
  onTicketUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    assignedTo: ticket.assignedTo || '',
    category: ticket.category
  });
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  const canEdit = PermissionService.canEditTicket(currentUser, ticket);
  const canChangeStatus = PermissionService.hasPermission(currentUser, 'change_status');
  const canAssign = PermissionService.hasPermission(currentUser, 'assign_tickets');
  const canAddComments = PermissionService.hasPermission(currentUser, 'add_comments');
  const canViewInternalComments = PermissionService.hasPermission(currentUser, 'view_internal_comments');

  const agents = UserService.getAgents();

  const handleSave = () => {
    const updates: Partial<Ticket> = {};
    
    if (editForm.title !== ticket.title) updates.title = editForm.title;
    if (editForm.description !== ticket.description) updates.description = editForm.description;
    if (editForm.category !== ticket.category) updates.category = editForm.category;
    
    if (canChangeStatus && editForm.status !== ticket.status) {
      updates.status = editForm.status;
    }
    
    if (canAssign && editForm.assignedTo !== ticket.assignedTo) {
      updates.assignedTo = editForm.assignedTo || undefined;
    }
    
    if (editForm.priority !== ticket.priority) updates.priority = editForm.priority;

    const updatedTicket = TicketService.updateTicket(ticket.id, updates, currentUser);
    if (updatedTicket) {
      onTicketUpdate(updatedTicket);
      setIsEditing(false);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = TicketService.addComment(ticket.id, newComment, currentUser, isInternalComment);
    if (comment) {
      const updatedTicket = TicketService.getTicketById(ticket.id, currentUser);
      if (updatedTicket) {
        onTicketUpdate(updatedTicket);
      }
      setNewComment('');
      setIsInternalComment(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: TicketStatus) => {
    const icons = {
      open: <AlertCircle className="w-5 h-5 text-blue-500" />,
      'in-progress': <Clock className="w-5 h-5 text-yellow-500" />,
      pending: <Clock className="w-5 h-5 text-orange-500" />,
      resolved: <CheckCircle className="w-5 h-5 text-green-500" />,
      closed: <XCircleIcon className="w-5 h-5 text-gray-500" />
    };
    return icons[status];
  };

  const getAssignedUserName = (userId?: string) => {
    if (!userId) return 'Sin asignar';
    const user = UserService.getUserById(userId);
    return user ? user.name : 'Usuario desconocido';
  };

  const getCreatedByName = (userId: string) => {
    const user = UserService.getUserById(userId);
    return user ? user.name : 'Usuario desconocido';
  };

  const getCommentUserName = (userId: string) => {
    const user = UserService.getUserById(userId);
    return user ? user.name : 'Usuario desconocido';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent focus:outline-none flex-1 mr-4"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          )}
          
          <div className="flex items-center space-x-2">
            {canEdit && (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            {getStatusIcon(ticket.status)}
            {isEditing && canChangeStatus ? (
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as TicketStatus })}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-medium">
                {statusOptions.find(s => s.value === ticket.status)?.label}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            {isEditing ? (
              <select
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as TicketPriority })}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className={`font-medium ${priorityOptions.find(p => p.value === ticket.priority)?.color}`}>
                {priorityOptions.find(p => p.value === ticket.priority)?.label}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-gray-400" />
            {isEditing && canAssign ? (
              <select
                value={editForm.assignedTo}
                onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">Sin asignar</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-gray-600">
                {getAssignedUserName(ticket.assignedTo)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatDate(ticket.createdAt)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          ) : (
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {ticket.category}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          {isEditing ? (
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>Creado por: <span className="font-medium">{getCreatedByName(ticket.createdBy)}</span></p>
          <p>Última actualización: {formatDate(ticket.updatedAt)}</p>
        </div>
      </div>

      {/* Comentarios */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            Comentarios ({ticket.comments.length})
          </h3>
        </div>

        <div className="space-y-4 mb-6">
          {ticket.comments
            .filter(comment => !comment.isInternal || canViewInternalComments)
            .map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${
                comment.isInternal 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {getCommentUserName(comment.userId)}
                  </span>
                  {comment.isInternal && (
                    <span className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                      Interno
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>

        {canAddComments && (
          <div className="border-t border-gray-200 pt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Agregar un comentario..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />
            <div className="flex items-center justify-between">
              {canViewInternalComments && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isInternalComment}
                    onChange={(e) => setIsInternalComment(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Comentario interno</span>
                </label>
              )}
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar Comentario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};