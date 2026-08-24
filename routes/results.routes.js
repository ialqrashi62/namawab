const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeResultsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, auditResultAckFallback, lisRequireTenant, resultAckTableExists, resultLoop }) {
    const router = express.Router();
router.post('/api/results/:type/:id/acknowledge', requireAuth, requireRole('doctor', 'patients', 'prescriptions'), requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const type = req.params.type;

        if (type !== 'lab' && type !== 'rad') return res.status(404).json({ error: 'Unknown result type' });

        const ackTableReady = await resultAckTableExists();

        const resultId = parseInt(req.params.id, 10);

        if (!Number.isInteger(resultId)) return res.status(404).json({ error: 'Result not found' });



        let patientId, ack;

        if (type === 'lab') {

            const r = (await pool.query(

                `SELECT lr.id, lr.is_critical, lr.abnormal_flag, lr.status, o.patient_id

                 FROM lab_results lr

                 LEFT JOIN lab_samples s ON lr.lab_sample_id = s.id AND s.tenant_id = lr.tenant_id

                 LEFT JOIN lab_radiology_orders o ON COALESCE(lr.order_id, s.order_id) = o.id AND (o.tenant_id = lr.tenant_id OR o.tenant_id IS NULL)

                 WHERE lr.id=$1 AND lr.tenant_id=$2`, [resultId, ctx.tenantId])).rows[0];

            if (!r) return res.status(404).json({ error: 'Result not found' });

            if (r.status !== 'verified') return res.status(409).json({ error: 'Only verified results can be acknowledged' });

            patientId = r.patient_id;

            ack = resultLoop.ackRequirement(r);

        } else {

            const r = (await pool.query(

                `SELECT rr.id, rr.is_critical, rr.status, e.patient_id

                 FROM rad_reports rr JOIN rad_exams e ON rr.rad_exam_id = e.id AND e.tenant_id = rr.tenant_id

                 WHERE rr.id=$1 AND rr.tenant_id=$2`, [resultId, ctx.tenantId])).rows[0];

            if (!r) return res.status(404).json({ error: 'Report not found' });

            if (r.status !== 'Signed') return res.status(409).json({ error: 'Only signed reports can be acknowledged' });

            patientId = r.patient_id;

            ack = resultLoop.ackRequirement({ is_critical: r.is_critical, abnormal_flag: r.is_critical ? 'HH' : 'N', status: r.status });

        }

        if (!patientId) return res.status(409).json({ error: 'Result has no resolvable patient — cannot acknowledge' });



        if (!ackTableReady) {

            const fallback = await auditResultAckFallback(req, ctx, type, resultId, patientId, ack);

            if (fallback.duplicate) return res.status(409).json({ error: 'Already acknowledged by this clinician' });

            return res.json({ success: true, id: null, level: ack.level, storage: 'audit_trail_fallback' });

        }



        const ins = await pool.query(

            `INSERT INTO result_acknowledgements (tenant_id, facility_id, result_type, result_id, patient_id, ack_level, acknowledged_by, acknowledged_by_name, note)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)

             ON CONFLICT ON CONSTRAINT uq_result_ack DO NOTHING RETURNING id`,

            [ctx.tenantId, ctx.facilityId || null, type, resultId, patientId,

             ack.required ? ack.level : 'unknown',

             req.session.user?.id, req.session.user?.display_name || '', (req.body && req.body.note) || '']);

        if (ins.rows.length === 0) return res.status(409).json({ error: 'Already acknowledged by this clinician' });

        logAudit(req.session.user?.id, req.session.user?.display_name, 'RESULT_ACK', 'Lab',

            `Acknowledged ${type} result #${resultId} (level: ${ack.level})`, req.ip);

        res.json({ success: true, id: ins.rows[0].id, level: ack.level });

    } catch (e) {

        console.error('[Result Ack Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/results/unacknowledged', requireAuth, requireRole('doctor', 'patients', 'prescriptions'), requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const ackTableReady = await resultAckTableExists();

        // fail-closed filter: a NULL/unknown abnormal_flag is INCLUDED in the worklist

        // (an unclassified result must never silently skip physician review).

        const ackJoin = ackTableReady

            ? `LEFT JOIN result_acknowledgements ra

                    ON ra.result_type = 'lab' AND ra.result_id = lr.id AND ra.tenant_id = lr.tenant_id`

            : `LEFT JOIN audit_trail ra

                    ON ra.action = 'RESULT_ACK_FALLBACK'

                   AND ra.module = 'Lab'

                   AND ra.new_values LIKE ('ACK|tenant=' || lr.tenant_id || '|type=lab|result=' || lr.id || '|user=%')`;

        const rows = (await pool.query(

            `SELECT lr.id, lr.loinc, lr.test_name, lr.value, lr.unit, lr.abnormal_flag, lr.is_critical, lr.verified_at,

                    o.patient_id, s.barcode, COALESCE(NULLIF(p.name_ar, ''), p.name_en) AS patient_name

             FROM lab_results lr

             LEFT JOIN lab_samples s ON lr.lab_sample_id = s.id AND s.tenant_id = lr.tenant_id

             LEFT JOIN lab_radiology_orders o ON COALESCE(lr.order_id, s.order_id) = o.id AND (o.tenant_id = lr.tenant_id OR o.tenant_id IS NULL)

             LEFT JOIN patients p ON p.id = o.patient_id AND p.tenant_id = lr.tenant_id

             ${ackJoin}

             WHERE lr.tenant_id = $1 AND lr.status = 'verified' AND ra.id IS NULL

               AND (lr.is_critical = 1 OR lr.abnormal_flag IS NULL OR lr.abnormal_flag <> 'N')

             ORDER BY lr.is_critical DESC, lr.verified_at ASC NULLS LAST

             LIMIT 200`, [ctx.tenantId])).rows;

        res.json({ storage: ackTableReady ? 'result_acknowledgements' : 'audit_trail_fallback', results: rows });

    } catch (e) {

        console.error('[Unacked Results Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
