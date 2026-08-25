// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.
module.exports = function makePoolFns({ pool, logAudit }) {
function requireRole(...modules) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
            logAudit(null, 'Anonymous', 'BLOCKED_AUTHORIZATION', 'Auth', `Unauthenticated access to route requiring modules [${modules.join(', ')}]`, clientIp);
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const role = req.session.user.role;
        const perms = ROLE_PERMISSIONS[role];
        if (perms === '*') return next(); // Admin
        if (perms && modules.some(m => perms.includes(m))) return next();
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        logAudit(req.session.user.id, req.session.user.display_name, 'BLOCKED_AUTHORIZATION', 'Auth', `Blocked role ${role} from route requiring modules [${modules.join(', ')}]`, clientIp);
        res.status(403).json({ error: 'Access denied' });
    };
}

async function establishSession(req, user, clientIp) {
    // prevent session fixation: issue a fresh session id at successful authentication
    await new Promise((resolve, reject) => req.session.regenerate(err => (err ? reject(err) : resolve())));
    const previousSessionId = activeUserSessions.get(user.id);
    if (previousSessionId && previousSessionId !== req.sessionID) {
        req.sessionStore.destroy(previousSessionId, (err) => { if (err) console.error('Error destroying old session:', err); });
    }
    let userTenantId = null, userFacilityId = null;
    try {
        const tenantRow = (await pool.query('SELECT tenant_id FROM user_tenants WHERE user_id=$1 AND is_active=true LIMIT 1', [user.id])).rows[0];
        if (tenantRow) {
            userTenantId = tenantRow.tenant_id;
            const facRow = (await pool.query('SELECT facility_id FROM user_facilities WHERE user_id=$1 AND is_primary=true LIMIT 1', [user.id])).rows[0];
            if (facRow) userFacilityId = facRow.facility_id;
        }
    } catch (e) { console.error('Error fetching tenant/facility scope for user:', e); }
    if (!userTenantId && process.env.NODE_ENV !== 'production') { userTenantId = 1; userFacilityId = 1; }
    req.session.user = {
        id: user.id, username: user.username, name: user.display_name, display_name: user.display_name,
        role: user.role, speciality: user.speciality || '', permissions: user.permissions || '',
        tenantId: userTenantId, facilityId: userFacilityId
    };
    activeUserSessions.set(user.id, req.sessionID);
    await pool.query('UPDATE system_users SET last_ip=$1 WHERE id=$2', [clientIp, user.id]).catch(() => { });
    logAudit(user.id, user.display_name, 'LOGIN', 'Auth', `User logged in as ${user.role}`, clientIp);
}
    return { requireRole, establishSession };
}
