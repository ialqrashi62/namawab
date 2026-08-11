/**
 * NamaMedical — RBAC Policies
 *
 * 7-tier role hierarchy (Golden Access Rule):
 * - owner: absolute (full access, including audit log)
 * - admin: tenant-wide admin
 * - doctor: clinical write
 * - nurse: clinical read + limited write
 * - receptionist: appointment read/write
 * - lab_tech: lab read + write
 * - rad_tech: imaging read + write
 * - pharmacist: pharmacy read + write
 * - patient: own data only
 * - viewer: read-only
 *
 * @module auth/rbac
 */

'use strict';

const ROLES = {
  owner: {
    level: 100,
    description_ar: 'مالك النظام (صلاحيات مطلقة)',
    inherits: [],
    permissions: ['*'],
  },
  admin: {
    level: 90,
    description_ar: 'مدير النظام',
    inherits: ['doctor', 'nurse', 'receptionist', 'lab_tech', 'rad_tech', 'pharmacist'],
    permissions: [
      'tenant:*',
      'users:*',
      'audit:read',
      'reports:*',
      'settings:*',
    ],
  },
  doctor: {
    level: 80,
    description_ar: 'طبيب',
    inherits: ['nurse'],
    permissions: [
      'patients:read', 'patients:write',
      'encounters:read', 'encounters:write',
      'orders:read', 'orders:write', 'orders:sign',
      'prescriptions:read', 'prescriptions:write',
      'assessments:read', 'assessments:write',
      'notes:read', 'notes:write',
      'ai:chat',
      'reports:read',
    ],
  },
  nurse: {
    level: 70,
    description_ar: 'ممرض/ة',
    inherits: [],
    permissions: [
      'patients:read',
      'encounters:read', 'encounters:write:limited',
      'orders:read',
      'vitals:read', 'vitals:write',
      'assessments:read',
      'notes:read', 'notes:write:nursing',
      'ai:chat',
    ],
  },
  receptionist: {
    level: 60,
    description_ar: 'موظف استقبال',
    inherits: [],
    permissions: [
      'patients:read', 'patients:write:limited',
      'appointments:read', 'appointments:write',
      'billing:read',
    ],
  },
  lab_tech: {
    level: 60,
    description_ar: 'فني مختبر',
    inherits: [],
    permissions: [
      'patients:read',
      'lab:read', 'lab:write',
      'lab_orders:read', 'lab_orders:write',
      'lab_results:read', 'lab_results:write',
    ],
  },
  rad_tech: {
    level: 60,
    description_ar: 'فني أشعة',
    inherits: [],
    permissions: [
      'patients:read',
      'imaging:read', 'imaging:write',
      'imaging_orders:read', 'imaging_orders:write',
    ],
  },
  pharmacist: {
    level: 60,
    description_ar: 'صيدلي',
    inherits: [],
    permissions: [
      'patients:read',
      'prescriptions:read', 'prescriptions:dispense',
      'pharmacy:read', 'pharmacy:write',
      'drug_interactions:check',
      'ai:chat',
    ],
  },
  patient: {
    level: 10,
    description_ar: 'مريض',
    inherits: [],
    permissions: [
      'me:read',
      'me:appointments:read', 'me:appointments:write',
      'me:prescriptions:read',
      'me:labs:read',
      'me:imaging:read',
      'me:messages:read', 'me:messages:write',
      'ai:chat:limited',
    ],
  },
  viewer: {
    level: 5,
    description_ar: 'مشاهد (قراءة فقط)',
    inherits: [],
    permissions: [
      'patients:read:summary',
      'reports:read:summary',
    ],
  },
};

/**
 * Get all permissions for a role (including inherited)
 */
function getPermissions(role) {
  const r = ROLES[role];
  if (!r) return [];
  const perms = new Set([...r.permissions]);
  for (const parent of r.inherits) {
    for (const p of getPermissions(parent)) perms.add(p);
  }
  return [...perms];
}

/**
 * Check if a role has a specific permission
 */
function hasPermission(role, permission) {
  const perms = getPermissions(role);
  if (perms.includes('*')) return true;
  // Check exact match
  if (perms.includes(permission)) return true;
  // Check wildcard match (e.g., 'patients:*' matches 'patients:read')
  const [resource, action] = permission.split(':');
  if (perms.includes(`${resource}:*`)) return true;
  if (perms.includes(`${resource}:${action}:*`)) return true;
  return false;
}

/**
 * Middleware factory
 */
function rbacMiddleware(requiredPermission) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No user role' });
    }
    if (!hasPermission(userRole, requiredPermission)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Role '${userRole}' lacks permission '${requiredPermission}'`,
        required: requiredPermission,
        user_role: userRole,
        user_permissions: getPermissions(userRole).slice(0, 20), // top 20
      });
    }
    next();
  };
}

module.exports = {
  ROLES,
  getPermissions,
  hasPermission,
  rbacMiddleware,
};
