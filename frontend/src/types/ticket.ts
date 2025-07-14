import axios from "axios";


export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: Permission[];
  isActive: boolean;
  dpi?: string;
  fechaAlta?: string;
  fechaNacimiento?: string;
  usuario?: string;
  idEmpresa?: number;
  idDepartamento?: number;
  idPuesto?: number;
  idRol?: number;
  idAgencia?: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  attachments: string[];
  tags: string[];
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: Date;
  isInternal: boolean;
}

export type UserRole = 'admin' | 'manager' | 'agent' | 'user';
export type TicketStatus = 'abierto' | 'en progreso' | 'pendiente' | 'resuelto' | 'cerrado';
export type TicketPriority = 'bajo' | 'medio' | 'alto' | 'urgente';
export type Permission = string;

export interface PermissionConfig {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

// Interfaz para la respuesta completa de la API de permisos
export interface PermissionResponse {
  id_opcion: number;
  id_empresa: number;
  nombre: string;
  url: string;
  descripcion: string | null;
  estado: string;
}

// Interfaz para el permiso procesado
export interface PermissionData {
  id: number;
  url: string;
  label: string;
  description?: string;
  isActive: boolean;
}

// Cache para permisos
let permissionsCache: PermissionData[] | null = null;
let permissionLabelsCache: Record<string, string> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5;// * 60 * 1000; // 5 minutos

const API_BASE_URL='http://localhost:2000';

// Función para obtener permisos completos desde la BD
export async function fetchPermissionsFromDB(): Promise<PermissionData[]> {
  // Verificar cache
  if (permissionsCache && cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_DURATION) {
    return permissionsCache;
  }

  try {
    const response = await axios.get<PermissionResponse[]>(`${API_BASE_URL}/api/permisos`);

    if (!Array.isArray(response.data)) {
      throw new Error('La respuesta de la API no es un array');
    }

    const permissions = response.data
        .filter(item => item.url && item.nombre && item.estado === 'A') // Solo permisos activos
        .map(item => ({
          id: item.id_opcion,
          url: item.url,
          label: item.nombre,
          description: item.descripcion || undefined,
          isActive: item.estado === 'A'
        }));

    // Guardar en cache
    permissionsCache = permissions;
    cacheTimestamp = Date.now();

    return permissions;
  } catch (error) {
    console.error('Error al obtener permisos desde BD:', error);

    // Fallback a permisos por defecto
    const fallbackPermissions: PermissionData[] = [
      { id: 1, url: 'create_ticket', label: 'Crear tickets', isActive: true },
      { id: 2, url: 'view_all_tickets', label: 'Ver todos los tickets', isActive: true },
      { id: 3, url: 'view_own_tickets', label: 'Ver tickets propios', isActive: true },
      { id: 4, url: 'edit_all_tickets', label: 'Editar todos los tickets', isActive: true },
      { id: 5, url: 'edit_own_tickets', label: 'Editar tickets propios', isActive: true },
      { id: 6, url: 'delete_tickets', label: 'Eliminar tickets', isActive: true },
      { id: 7, url: 'assign_tickets', label: 'Asignar tickets', isActive: true },
      { id: 8, url: 'change_status', label: 'Cambiar estado', isActive: true },
      { id: 9, url: 'view_reports', label: 'Ver reportes', isActive: true },
      { id: 10, url: 'view_pases', label: 'Ver pases', isActive: true },
      { id: 11, url: 'manage_users', label: 'Gestionar usuarios', isActive: true },
      { id: 12, url: 'manage_permissions', label: 'Gestionar permisos', isActive: true },
      { id: 13, url: 'add_comments', label: 'Agregar comentarios', isActive: true },
      { id: 14, url: 'view_internal_comments', label: 'Ver comentarios internos', isActive: true }
    ];

    return fallbackPermissions;
  }
}

// Función para obtener solo las URLs de permisos (compatibilidad con código existente)
export async function fetchPermissions(): Promise<Permission[]> {
  const permissions = await fetchPermissionsFromDB();
  return permissions.map(p => p.url);
}

// Función para obtener el mapeo de etiquetas dinámico
export async function fetchPermissionLabels(): Promise<Record<string, string>> {
  const permissions = await fetchPermissionsFromDB();

  // Crear el mapeo dinámico
  const labels: Record<string, string> = {};
  permissions.forEach(permission => {
    labels[permission.url] = permission.label;
  });

  permissionLabelsCache = labels;
  return labels;
}

// Función helper mejorada que usa datos dinámicos
export async function getPermissionLabel(permission: Permission): Promise<string> {
  // Si tenemos cache, usarlo
  if (permissionLabelsCache && permissionLabelsCache[permission]) {
    return permissionLabelsCache[permission];
  }

  // Si no hay cache, obtener etiquetas
  const labels = await fetchPermissionLabels();
  return labels[permission] || permission;
}

// Función síncrona para obtener etiqueta (usa cache)
export function getPermissionLabelSync(permission: Permission): string {
  return permissionLabelsCache?.[permission] || permission;
}

// Función para limpiar cache
export function clearPermissionsCache(): void {
  permissionsCache = null;
  permissionLabelsCache = null;
  cacheTimestamp = null;
}

// Función para validar permiso
export function isValidPermission(permission: string): boolean {
  return typeof permission === 'string' && permission.trim() !== '';
}

// Función para buscar permiso por ID
export async function findPermissionById(id: number): Promise<PermissionData | undefined> {
  const permissions = await fetchPermissionsFromDB();
  return permissions.find(p => p.id === id);
}

// Función para buscar permiso por URL
export async function findPermissionByUrl(url: string): Promise<PermissionData | undefined> {
  const permissions = await fetchPermissionsFromDB();
  return permissions.find(p => p.url === url);
}