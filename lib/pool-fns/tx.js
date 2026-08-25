// Extracted from server.js (behavior-preserving). Pool-bound tx helpers.
module.exports = function makeTx({ pool }) {
async function e14PatientInTenant(patientId, tenantId) {
    const pid = e14IntId(patientId);
    if (pid === null) return null;
    const row = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];
    return row ? pid : null;
}

async function e14PregnancyInTenant(pregnancyId, tenantId) {
    const id = e14IntId(pregnancyId);
    if (id === null) return null;
    const row = (await pool.query('SELECT * FROM obgyn_pregnancies WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];
    return row || null;
}

async function getPatientActiveMeds(patientId, tenantId) {
    // I2: FAIL-CLOSED. Refuse to run unscoped — a falsy tenantId previously fell back to a cross-tenant query
    // that returned meds across ALL tenants. Both callers run behind requireTenantScope, so this is
    // defense-in-depth (the throw is treated FAIL-SAFE by callers, surfacing a warning, never a silent skip).
    if (!tenantId) throw new Error('tenantId required for getPatientActiveMeds');
    const meds = [];
    // 1) Pharmacy queue (not dispensed / cancelled)
    const qSql = "SELECT medication_name FROM pharmacy_prescriptions_queue WHERE patient_id=$1 AND tenant_id=$2 AND COALESCE(status,'') NOT IN ('Dispensed','Cancelled','Rejected')";
    const qParams = [patientId, tenantId];
    for (const r of (await pool.query(qSql, qParams)).rows) {
        if (r.medication_name) meds.push(String(r.medication_name));
    }
    // 2) Active/pending med-type orders (E-X orders/order_items). Best-effort: a missing orders table
    //    must not break the gate — but a real query error propagates so the caller fails SAFE (warns).
    try {
        const oSql = "SELECT oi.catalog_ref FROM order_items oi JOIN orders o ON oi.order_id=o.id WHERE o.patient_id=$1 AND o.tenant_id=$2 AND o.type='med' AND o.status IN ('pending','active')";
        const oParams = [patientId, tenantId];
        for (const r of (await pool.query(oSql, oParams)).rows) {
            if (r.catalog_ref) meds.push(String(r.catalog_ref));
        }
    } catch (e) {
        // orders table may be absent in some deployments; the queue source above still applies.
        // Do NOT swallow into a silent pass at the caller — but a missing-relation here is tolerated.
        if (!/relation .* does not exist/i.test(e.message || '')) throw e;
    }
    // de-duplicate (case-insensitive)
    const seen = new Set();
    return meds.filter(m => { const k = m.trim().toLowerCase(); if (!k || seen.has(k)) return false; seen.add(k); return true; });
}

async function e18BeginTenantTx(tenantId) {
    const client = await pool.connect();
    await client.query('BEGIN');
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tenantId)]);
    return client;
}

async function withPharmacyTx(tenantId, fn) {
    const client = await pool.connect();
    try {
        await client.query("SELECT set_config('app.tenant_id', $1, false)", [tenantId ? String(tenantId) : '']);
        await client.query('BEGIN');
        const out = await fn(client);
        await client.query('COMMIT');
        return out;
    } catch (e) {
        try { await client.query('ROLLBACK'); } catch (_) { /* best-effort */ }
        throw e;
    } finally {
        try { await client.query("SELECT set_config('app.tenant_id', '', false)"); } catch (_) { /* reset best-effort */ }
        client.release();
    }
}
    return { e14PatientInTenant, e14PregnancyInTenant, getPatientActiveMeds, e18BeginTenantTx, withPharmacyTx };
}
