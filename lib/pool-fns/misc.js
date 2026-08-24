// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.

module.exports = function makePoolFns({ 
pool
 }) {
async function e12LoadSurgery(surgeryId, tenantId) {
    const q = tenantId
        ? 'SELECT * FROM surgeries WHERE id=$1 AND tenant_id=$2'
        : 'SELECT * FROM surgeries WHERE id=$1';
    const params = tenantId ? [surgeryId, tenantId] : [surgeryId];
    return (await pool.query(q, params)).rows[0] || null;
}
async function _himPushSource(events, sql, params, mapFn) {
    try {
        const rows = (await pool.query(sql, params)).rows;
        rows.forEach(r => { const ev = mapFn(r); if (ev) events.push(ev); });
    } catch (e) { /* table may not exist yet (E1 not landed) — degrade gracefully */ }
}
    return { 
e12LoadSurgery, _himPushSource
 };
}
