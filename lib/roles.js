// Extracted from server.js (behavior-preserving).
function isHrOrAdmin(user) {
    const r = user && user.role;
    if (r === 'Admin') return true;
    const perms = ROLE_PERMISSIONS[r];
    return Array.isArray(perms) && perms.includes('hr');
}

function normalizeRoleName(role) {
    return String(role || '').trim().toLowerCase();
}

function hasAnyRole(user, roles) {
    const currentRole = normalizeRoleName(user && user.role);
    return roles.map(normalizeRoleName).includes(currentRole);
}

function canReviewOvr(user) {
    return hasAnyRole(user, ['Admin', 'Quality Manager', 'Infection Control', 'Director']);
}

function canViewAdminAuditTrail(user) {
    return hasAnyRole(user, ['Admin', 'IT', 'Quality Manager', 'Director']);
}

function e17CanSeeConfidential(req) {
    const role = req.session?.user?.role;
    return role === 'Admin' || role === 'Quality Manager';
}

function isHimOrAdmin(req) {
    const role = req.session?.user?.role;
    return role === 'HIM' || role === 'Admin';
}

module.exports = { isHrOrAdmin, normalizeRoleName, hasAnyRole, canReviewOvr, canViewAdminAuditTrail, e17CanSeeConfidential, isHimOrAdmin };
