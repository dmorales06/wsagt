import { useState, useEffect } from 'react';
import { Ticket, User } from './types/ticket';
import { TicketService } from './services/ticketService';
import { UserService } from './services/userService';
import { PermissionService } from './services/permissionService';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { CreateTicketModal } from './components/CreateTicketModal';
import { UserManagement } from './components/UserManagement';
import {
  Ticket as TicketIcon,
  Plus,
  Filter,
  Users,
  BarChart3,
  User as UserIcon,
  LogOut,
  Settings, Database
} from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'users' | 'reports' |'pases'>('tickets');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Simular login con diferentes usuarios para demostrar permisos
  const [availableUsers] = useState<User[]>([
    UserService.getUserById('admin1')!,
    UserService.getUserById('manager1')!,
    UserService.getUserById('agent1')!,
    UserService.getUserById('user1')!,
      UserService.getUserById('user2')!,
  ]);

  useEffect(() => {
    if (currentUser) {
      loadTickets();
    }
  }, [currentUser, statusFilter, priorityFilter]);

  const loadTickets = () => {
    if (!currentUser) return;
    
    let filteredTickets = TicketService.getAllTickets(currentUser);
    
    if (statusFilter !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priorityFilter);
    }
    
    setTickets(filteredTickets);
  };

  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
  };

  const handleTicketCreated = () => {
    loadTickets();
  };

  const handleUserLogin = (user: User) => {
    setCurrentUser(user);
    setSelectedTicket(null);
    setActiveTab('tickets');
  };

  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'abierto').length,
      inProgress: tickets.filter(t => t.status === 'en progreso').length,
      resolved: tickets.filter(t => t.status === 'resuelto').length,
      high: tickets.filter(t => t.priority === 'alto' || t.priority === 'urgente').length
    };
    return stats;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <TicketIcon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Tickets</h1>
            <p className="text-gray-600">Selecciona un usuario para continuar</p>
          </div>
          
          <div className="space-y-3">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserLogin(user)}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.department}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = getTicketStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <TicketIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Sistema de Tickets</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{currentUser.name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  currentUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                  currentUser.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                  currentUser.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TicketIcon className="w-4 h-4" />
                <span>Tickets</span>
              </div>
            </button>
            
            {PermissionService.hasPermission(currentUser, 'manage_users') && (
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Usuarios</span>
                </div>
              </button>
            )}
            
            {PermissionService.hasPermission(currentUser, 'view_reports') && (
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Reportes</span>
                </div>
              </button>
            )}
            {PermissionService.hasPermission(currentUser, 'view_pases') && (
                <button
                    onClick={() => setActiveTab('pases')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'pases'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>Pases</span>
                  </div>
                </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tickets' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TicketIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Abiertos</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.open}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">En Progreso</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Resueltos</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Alta Prioridad</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.high}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Ticket List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Tickets</h2>
                      {PermissionService.hasPermission(currentUser, 'create_ticket') && (
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Nuevo</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Filters */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="all">Todos los estados</option>
                          <option value="open">Abierto</option>
                          <option value="in-progress">En Progreso</option>
                          <option value="pending">Pendiente</option>
                          <option value="resolved">Resuelto</option>
                          <option value="closed">Cerrado</option>
                        </select>
                      </div>
                      
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="all">Todas las prioridades</option>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <TicketList
                      tickets={tickets}
                      currentUser={currentUser}
                      onTicketSelect={setSelectedTicket}
                      selectedTicket={selectedTicket}
                    />
                  </div>
                </div>
              </div>

              {/* Ticket Detail */}
              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <TicketDetail
                    ticket={selectedTicket}
                    currentUser={currentUser}
                    onTicketUpdate={handleTicketUpdate}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="text-center">
                      <TicketIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">Selecciona un ticket para ver los detalles</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <UserManagement currentUser={currentUser} />
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Módulo de reportes en desarrollo</p>
            </div>
          </div>
        )}

        {activeTab === 'pases' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Módulo de pases en desarrollo</p>
              </div>
            </div>
        )}
      </main>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
}

export default App;