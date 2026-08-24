// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.
module.exports = function makePoolFns({ pool, logAudit }) {
async function resultAckTableExists() {
    const r = await pool.query("SELECT to_regclass('public.result_acknowledgements') AS t");
    return !!r.rows[0].t;
}

function resultAckAuditKey(tenantId, type, resultId, userId) {
    return `ACK|tenant=${tenantId}|type=${type}|result=${resultId}|user=${userId || 'unknown'}`;
}

async function auditResultAckExists(tenantId, type, resultId, userId) {
    const key = resultAckAuditKey(tenantId, type, resultId, userId);
    const r = await pool.query(
        `SELECT id FROM audit_trail
         WHERE action='RESULT_ACK_FALLBACK' AND module='Lab' AND new_values=$1
         LIMIT 1`,
        [key]
    );
    return !!r.rows.length;
}

async function auditResultAckFallback(req, ctx, type, resultId, patientId, ack) {
    const key = resultAckAuditKey(ctx.tenantId, type, resultId, req.session.user?.id);
    if (await auditResultAckExists(ctx.tenantId, type, resultId, req.session.user?.id)) {
        return { duplicate: true };
    }
    await pool.query(
        'INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
        [
            req.session.user?.id,
            req.session.user?.display_name || '',
            'RESULT_ACK_FALLBACK',
            'Lab',
            key,
            req.ip || ''
        ]
    );
    await logAudit(req.session.user?.id, req.session.user?.display_name, 'RESULT_ACK', 'Lab',
        `Acknowledged ${type} result #${resultId} (level: ${ack.level}, patient #${patientId}, fallback=audit_trail)`, req.ip);
    return { duplicate: false, key };
}
    return { resultAckTableExists, resultAckAuditKey, auditResultAckExists, auditResultAckFallback };
}
