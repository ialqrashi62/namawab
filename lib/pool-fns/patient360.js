// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.
const { getRequestTenantContext } = require('../tenant-context');
const { isOptionalReadSchemaError } = require('../read-fallback');
module.exports = function makePoolFns({ pool }) {
async function centerPatient360(req, res, tables) {
    try {
        const { tenantId, facilityId } = getRequestTenantContext(req);
        if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });
        const patientId = parseInt(req.params.patient_id, 10);
        if (!Number.isInteger(patientId)) return res.status(400).json({ error: 'Invalid patient_id' });
        // IDOR: patient must belong to this tenant.
        const pt = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId])).rows[0];
        if (!pt) return res.status(404).json({ error: 'Patient not found' });
        const tenantCheck = ` AND tenant_id = $${2}`;
        const tenantParams = [patientId, tenantId];
        const out = { patient_id: patientId, tenant_id: tenantId, records: {} };
        for (const t of tables) {
            try {
                const rows = (await pool.query(`SELECT * FROM ${t} WHERE patient_id=$1${tenantCheck} ORDER BY created_at DESC`, tenantParams)).rows;
                out.records[t] = rows;
            } catch (e) {
                if (isOptionalReadSchemaError(e)) out.records[t] = [];
                else throw e;
            }
        }
        res.json(out);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
}
    return { centerPatient360 };
}
