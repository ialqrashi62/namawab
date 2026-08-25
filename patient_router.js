// filepath: namaweb/patient_router.js
// Patient cross-dept overview endpoint
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const patientSummary = require('./patient_summary_engine');

// ============================================================
// GET /api/patient/:patientId/overview
// Cross-dept rollup of all assessments
// ============================================================
router.get('/:patientId/overview', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'owner'), async (req, res) => {
    try {
        const tid = req.tenantId;
        const pid = req.params.patientId;

        // Patient demographics
        const patient = await db.query(`
            SELECT id, name_en, name_ar, national_id, dob, age, sex, phone
            FROM patients
            WHERE id = $1 AND tenant_id = $2
        `, [pid, tid]);

        if (patient.rows.length === 0) {
            return res.status(404).json({ error: 'patient_not_found' });
        }

        // Get all assessments for this patient across all dept tables
        const assessments = await db.query(`
            SELECT 'family_medicine' as dept, 'family_medicine_assessments' as table_name, id, engine_name, score, risk_level, created_at
            FROM family_medicine_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'allergy', 'allergy_assessments', id, engine_name, score, risk_level, created_at
            FROM allergy_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'cardiology', 'cardiology_assessments', id, engine_name, score, risk_level, created_at
            FROM cardiology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'surgery', 'surgery_assessments', id, engine_name, score, risk_level, created_at
            FROM surgery_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'oncology', 'oncology_assessments', id, engine_name, score, risk_level, created_at
            FROM oncology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'neurology', 'neurology_assessments', id, engine_name, score, risk_level, created_at
            FROM neurology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'dermatology', 'dermatology_assessments', id, engine_name, score, risk_level, created_at
            FROM dermatology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'radiology', 'radiology_assessments', id, engine_name, score, risk_level, created_at
            FROM radiology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'psychiatry', 'psychiatry_assessments', id, engine_name, score, risk_level, created_at
            FROM psychiatry_assessments WHERE patient_id = $1 AND tenant_id = $2
            ORDER BY created_at DESC
            LIMIT 100
        `, [pid, tid]);

        // Group by dept for summary
        const byDept = {};
        for (const a of assessments.rows) {
            if (!byDept[a.dept]) byDept[a.dept] = [];
            byDept[a.dept].push(a);
        }

        // Calculate risk summary
        const highRisk = assessments.rows.filter(a => a.risk_level === 'high' || a.risk_level === 'very_high' || a.risk_level === 'severe');

        res.json({
            ok: true,
            patient: patient.rows[0],
            total_assessments: assessments.rows.length,
            by_dept: byDept,
            high_risk_count: highRisk.length,
            high_risk: highRisk,
            recent: assessments.rows.slice(0, 20),
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('GET /api/patient/overview', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/patient/:patientId/vitals — Latest vitals
// ============================================================
router.get('/:patientId/vitals', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT v.*, p.name_en, p.name_ar
            FROM vital_signs v
            JOIN patients p ON p.id = v.patient_id
            WHERE v.patient_id = $1 AND v.tenant_id = $2
            ORDER BY v.recorded_at DESC
            LIMIT 50
        `, [req.params.patientId, req.tenantId]);
        res.json({ ok: true, vitals: result.rows });
    } catch (err) {
        console.error('GET /api/patient/vitals', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/patient/:patientId/vitals — Record vitals
// ============================================================
router.post('/:patientId/vitals', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { heartRate, systolicBP, diastolicBP, temperature, respiratoryRate, oxygenSaturation, notes } = req.body;
        if (heartRate === undefined) {
            return res.status(400).json({ error: 'missing_heart_rate' });
        }
        const result = await db.query(`
            INSERT INTO vital_signs (tenant_id, patient_id, recorded_by, heart_rate, systolic_bp, diastolic_bp, temperature, respiratory_rate, oxygen_saturation, notes, recorded_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            RETURNING id
        `, [req.tenantId, req.params.patientId, req.userId, heartRate, systolicBP, diastolicBP, temperature, respiratoryRate, oxygenSaturation, notes || '']);
        res.status(201).json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/patient/vitals', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/patient/:patientId — Search/list patients
// ============================================================
router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'receptionist'), async (req, res) => {
    try {
        const search = req.query.q || '';
        const limit = Math.min(+req.query.limit || 50, 200);
        const result = await db.query(`
            SELECT id, name_en, name_ar, national_id, dob, age, sex, phone
            FROM patients
            WHERE tenant_id = $1
              AND ($2 = '' OR name_en ILIKE '%' || $2 || '%' OR name_ar ILIKE '%' || $2 || '%' OR national_id ILIKE '%' || $2 || '%')
            ORDER BY id DESC
            LIMIT $3
        `, [req.tenantId, search, limit]);
        res.json({ ok: true, patients: result.rows, total: result.rows.length });
    } catch (err) {
        console.error('GET /api/patient', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/patient/:patientId/ai-summary
// Deterministic AI patient summary
// ============================================================
router.get('/:patientId/ai-summary', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'owner'), async (req, res) => {
    try {
        const query = req.query.q || '';
        const result = await patientSummary.buildPatientSummary(req.tenantId, +req.params.patientId, { query });
        if (result.summary === 'Patient not found.') {
            return res.status(404).json({ error: 'patient_not_found' });
        }
        // Audit log (no PHI stored — only counts + summary hash placeholder)
        try {
            await db.query(`
                INSERT INTO patient_summary_log
                    (tenant_id, patient_id, requested_by, summary, source_count, high_risk_count, vector_hits, generation_ms)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [req.tenantId, req.params.patientId, req.userId, result.summary.slice(0, 4000),
                result.stats.source_count, result.stats.high_risk_count, result.stats.vector_hits, result.stats.generation_ms]);
        } catch (auditErr) {
            console.error('ai-summary audit log failed', auditErr.message);
        }
        res.json({ ok: true, ...result });
    } catch (err) {
        console.error('GET /api/patient/ai-summary', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/patient/:patientId/vitals/trend.svg
// Pure SVG line chart of recent vitals (HR, BP, SpO2, Temp)
// ============================================================
router.get('/:patientId/vitals/trend.svg', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT heart_rate, systolic_bp, diastolic_bp, temperature, oxygen_saturation, recorded_at
            FROM vital_signs
            WHERE patient_id = $1 AND tenant_id = $2
            ORDER BY recorded_at ASC
            LIMIT 30
        `, [req.params.patientId, req.tenantId]);
        const points = result.rows.reverse();
        res.set('Content-Type', 'image/svg+xml');
        res.set('Cache-Control', 'no-store');
        res.send(renderVitalsSvg(points));
    } catch (err) {
        console.error('GET /api/patient/vitals/trend.svg', err);
        res.status(500).send('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200"><text x="20" y="100" fill="red">Error generating chart</text></svg>');
    }
});

function renderVitalsSvg(points) {
    const W = 720, H = 280;
    const padL = 50, padR = 20, padT = 30, padB = 50;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const colors = { heart_rate: '#ef4444', systolic_bp: '#3b82f6', oxygen_saturation: '#10b981', temperature: '#f59e0b' };

    function pathFor(key, min, max) {
        const ys = points.map((p, i) => {
            const v = p[key];
            if (v == null) return null;
            const x = padL + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
            const y = padT + (1 - (v - min) / (max - min || 1)) * innerH;
            return [x, y];
        }).filter(Boolean);
        if (ys.length === 0) return '';
        return 'M ' + ys.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ');
    }

    function range(key) {
        const vs = points.map(p => p[key]).filter(v => v != null);
        if (vs.length === 0) return [0, 1];
        const min = Math.min(...vs);
        const max = Math.max(...vs);
        const pad = (max - min) * 0.1 || 1;
        return [min - pad, max + pad];
    }

    const series = [
        { key: 'heart_rate', label: 'HR (bpm)', color: colors.heart_rate, range: range('heart_rate') },
        { key: 'systolic_bp', label: 'SBP (mmHg)', color: colors.systolic_bp, range: range('systolic_bp') },
        { key: 'oxygen_saturation', label: 'SpO₂ (%)', color: colors.oxygen_saturation, range: range('oxygen_saturation') },
        { key: 'temperature', label: 'Temp (°C)', color: colors.temperature, range: range('temperature') }
    ];

    const legend = series.map((s, i) =>
        `<g transform="translate(${padL + i * 160},${H - 30})"><circle cx="0" cy="-5" r="4" fill="${s.color}"/><text x="10" y="0" font-size="11" fill="#475569">${s.label}</text></g>`
    ).join('');

    const paths = series.map(s => `<path d="${pathFor(s.key, s.range[0], s.range[1])}" fill="none" stroke="${s.color}" stroke-width="2"/>`).join('');

    const gridLines = [];
    for (let i = 0; i <= 4; i++) {
        const y = padT + (i / 4) * innerH;
        gridLines.push(`<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`);
    }

    if (points.length === 0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
            <rect width="${W}" height="${H}" fill="white"/>
            <text x="${W / 2}" y="${H / 2}" text-anchor="middle" font-size="14" fill="#94a3b8">No vitals recorded</text>
        </svg>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
        <rect width="${W}" height="${H}" fill="white"/>
        ${gridLines.join('')}
        <text x="${padL}" y="20" font-size="13" font-weight="600" fill="#0f766e">Vital Signs Trend (${points.length} reading${points.length === 1 ? '' : 's'})</text>
        ${paths}
        ${legend}
    </svg>`;
}

module.exports = router;
