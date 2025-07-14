import React, { useState } from 'react';
import { User, TicketPriority } from '../types/ticket';
import { TicketService } from '../services/ticketService';
import { UserService } from '../services/userService';
import { X } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onTicketCreated: () => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTicketCreated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as TicketPriority,
    category: '',
    assignedTo: '',
    tags: ''
  });

  const agents = UserService.getAgents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ticketData = {
      title: formData.title,
      description: formData.description,
      status: 'open' as const,
      priority: formData.priority,
      category: formData.category,
      assignedTo: formData.assignedTo || undefined,
      createdBy: currentUser.id,
      attachments: [],
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    const newTicket = TicketService.createTicket(ticketData, currentUser);
    if (newTicket) {
      onTicketCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        assignedTo: '',
        tags: ''
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Ticket</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe brevemente el problema o solicitud"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Proporciona detalles adicionales sobre el problema o solicitud"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ej: Sistema, Hardware, Software"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asignar a
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sin asignar</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Separar con comas: urgente, login, sistema"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Crear Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};