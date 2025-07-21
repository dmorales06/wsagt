export function Usuarios({nombre, apellido, correo, rol, puesto, permisos}) {
    return (
        <div className="p-4 border rounded-lg border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div><h3 className="font-semibold text-gray-900">{`${nombre} ${apellido}`}</h3><p
                        className="text-sm text-gray-600">{correo}</p><p
                        className="text-sm text-gray-500">{puesto}</p></div>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">{rol}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-pen-line w-4 h-4">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                        </svg>
                    </button>
                    <button className="p-2 rounded-lg text-green-600 hover:bg-green-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-toggle-right w-5 h-5">
                            <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                            <circle cx="16" cy="12" r="2"></circle>
                        </svg>
                    </button>
                </div>
            </div>
            <div><h4 className="text-sm font-medium text-gray-700 mb-2">Permisos:</h4>
                <div className="flex flex-wrap gap-2"><span
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{permisos}</span>

                </div>
            </div>
        </div>
    )
}