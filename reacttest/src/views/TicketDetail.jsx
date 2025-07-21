export function Ticket(){
    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4"><input type="text"
                                                                                  className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent focus:outline-none flex-1 mr-4"
                                                                                  value="Error en el sistema de login"/>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round" className="lucide lucide-save w-5 h-5">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                    <polyline points="7 3 7 8 15 8"></polyline>
                                </svg>
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round" className="lucide lucide-x w-5 h-5">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" className="lucide lucide-alert-circle w-5 h-5 text-blue-500">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" x2="12" y1="8" y2="12"></line>
                                <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                                <option value="open">Abierto</option>
                                <option value="in-progress">En Progreso</option>
                                <option value="pending">Pendiente</option>
                                <option value="resolved">Resuelto</option>
                                <option value="closed">Cerrado</option>
                            </select></div>
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" className="lucide lucide-alert-circle w-5 h-5 text-gray-400">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" x2="12" y1="8" y2="12"></line>
                                <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select></div>
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" className="lucide lucide-user w-5 h-5 text-gray-400">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                                <option value="">Sin asignar</option>
                                <option value="agent1">María Rodríguez</option>
                                <option value="agent2">Pedro Martínez</option>
                            </select></div>
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" className="lucide lucide-calendar w-5 h-5 text-gray-400">
                                <path d="M8 2v4"></path>
                                <path d="M16 2v4"></path>
                                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                <path d="M3 10h18"></path>
                            </svg>
                            <span className="text-sm text-gray-600">15/01/2024, 09:00</span></div>
                    </div>
                    <div className="mb-4"><label
                        className="block text-sm font-medium text-gray-700 mb-2">Categoría</label><input type="text"
                                                                                                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                                                                         value="Sistema"/>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label><textarea
                        rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2">Los usuarios no pueden acceder al sistema desde esta mañana</textarea>
                    </div>
                    <div className="mt-4 text-sm text-gray-500"><p>Creado por: <span className="font-medium">Laura Sánchez</span>
                    </p><p>Última actualización: 20/07/2025, 22:05</p></div>
                </div>
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-message-square w-5 h-5 text-gray-400">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900">Comentarios (0)</h3></div>
                    <div className="space-y-4 mb-6"></div>
                    <div className="border-t border-gray-200 pt-4"><textarea placeholder="Agregar un comentario..."
                                                                             rows="3"
                                                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"></textarea>
                        <div className="flex items-center justify-between"><label
                            className="flex items-center space-x-2"><input type="checkbox"
                                                                           className="rounded border-gray-300"/><span
                            className="text-sm text-gray-600">Comentario interno</span></label>
                            <button disabled=""
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Agregar
                                Comentario
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}