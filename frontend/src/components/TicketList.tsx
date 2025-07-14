import React from 'react';
import { Ticket, User } from '../types/ticket';
import { Clock, User as UserIcon, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  currentUser: User;
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicket?: Ticket;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const statusIcons = {
  open: <AlertCircle className="w-4 h-4 text-blue-500" />,
  'in-progress': <Clock className="w-4 h-4 text-yellow-500" />,
  pending: <Clock className="w-4 h-4 text-orange-500" />,
  resolved: <CheckCircle className="w-4 h-4 text-green-500" />,
  closed: <XCircle className="w-4 h-4 text-gray-500" />
};

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  currentUser,
  onTicketSelect,
  selectedTicket
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-3">
      {tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No hay tickets disponibles</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onTicketSelect(ticket)}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedTicket?.id === ticket.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {statusIcons[ticket.status]}
                <h3 className="font-semibold text-gray-900 truncate">
                  {ticket.title}
                </h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                {ticket.priority.toUpperCase()}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {ticket.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <UserIcon className="w-3 h-3" />
                  <span>#{ticket.id}</span>
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {ticket.category}
                </span>
              </div>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
            
            {ticket.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {ticket.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};