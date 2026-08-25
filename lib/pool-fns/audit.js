// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.
module.exports = function makePoolFns({ pool }) {
async function logAudit(userId, userName, action, module, details, ip) {
    try {
        await pool.query(
            'INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address) VALUES ($1,$2,$3,$4,$5,$6)',
            [userId, userName || '', action || '', module || '', details || '', ip || '']
        );
    } catch (e) { console.error('Audit log error:', e.message); }
}
    return { logAudit };
}
