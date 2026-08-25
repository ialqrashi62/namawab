// filepath: namaweb/cds_ext_router.js
// Clinical decision support extensions — drug interactions, reconciliation, patient education.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.post('/drug-interactions', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist', 'nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, drugs, checked_by } = req.body;
        if (!patient_id || !Array.isArray(drugs) || drugs.length < 2) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'drugs (array, min 2)'] });
        // Check known interaction pairs
        const found = [];
        for (let i = 0; i < drugs.length; i++) {
            for (let j = i + 1; j < drugs.length; j++) {
                const da = String(drugs[i] || '').toLowerCase();
                const db_ = String(drugs[j] || '').toLowerCase();
                const m = await db.query(`
                    SELECT severity, description, clinical_action FROM drug_interactions
                    WHERE (LOWER(drug_a) = $1 AND LOWER(drug_b) = $2) OR (LOWER(drug_a) = $2 AND LOWER(drug_b) = $1) LIMIT 1
                `, [da, db_]);
                if (m.rows.length > 0) {
                    found.push({ pair: [drugs[i], drugs[j]], ...m.rows[0] });
                }
            }
        }
        // Compute highest severity
        const sev_rank = { minor: 1, moderate: 2, major: 3, severe: 4, contraindicated: 5 };
        const highest = found.reduce((max, c) => sev_rank[c.severity] > sev_rank[max] ? c.severity : max, 'minor');
        // Log the check
        const r = await db.query(`
            INSERT INTO drug_interaction_checks (tenant_id, patient_id, encounter_id, checked_by, drugs, interactions_json, highest_severity)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, checked_by || req.userName || req.userId, drugs, JSON.stringify(found), highest]);
        res.json({ ok: true, check_id: r.rows[0].id, drugs_checked: drugs.length, interactions_found: found.length, highest_severity: highest, interactions: found });
    } catch (err) { console.error('POST /api/cds-ext/drug-interactions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/drug-interactions/history/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, drugs, interactions_json, highest_severity, checked_by, created_at
            FROM drug_interaction_checks WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, history: r.rows });
    } catch (err) { console.error('GET /api/cds-ext/drug-interactions/history', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/drug-interactions/catalog', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist'), async (req, res) => {
    try {
        const { q, severity } = req.query;
        const conditions = ['1=1'];
        const params = [];
        if (q) { params.push(`%${q}%`); conditions.push(`(LOWER(drug_a) LIKE LOWER($${params.length}) OR LOWER(drug_b) LIKE LOWER($${params.length}))`); }
        if (severity) { params.push(severity); conditions.push(`severity = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, drug_a, drug_b, interaction_type, severity, description, clinical_action
            FROM drug_interactions WHERE ${conditions.join(' AND ')} ORDER BY severity LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, interactions: r.rows });
    } catch (err) { console.error('GET /api/cds-ext/drug-interactions/catalog', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/medication-reconciliation', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, admission_id, reconciliation_type, performed_by_name, performed_at, status,
                   home_medications, hospital_medications, discrepancies, allergy_verified, high_alert_checked, patient_counselled, notes
            FROM medication_reconciliations WHERE ${conditions.join(' AND ')}
            ORDER BY performed_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, reconciliations: r.rows });
    } catch (err) { console.error('GET /api/cds-ext/reconciliation', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/medication-reconciliation', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist', 'nurse'), async (req, res) => {
    try {
        const { patient_id, admission_id, reconciliation_type, home_medications, hospital_medications, discrepancies, allergy_verified, high_alert_checked, patient_counselled, notes } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required', required: ['patient_id'] });
        const r = await db.query(`
            INSERT INTO medication_reconciliations (tenant_id, patient_id, admission_id, reconciliation_type, performed_by, performed_by_name, performed_at, status, home_medications, hospital_medications, discrepancies, allergy_verified, high_alert_checked, patient_counselled, notes)
            VALUES ($1,$2,$3,$4,$5,$6,NOW(),'completed',$7,$8,$9,$10,$11,$12,$13) RETURNING id
        `, [req.tenantId, patient_id, admission_id || null, reconciliation_type || 'admission', req.userId, req.userName || req.userId, JSON.stringify(home_medications || []), JSON.stringify(hospital_medications || []), JSON.stringify(discrepancies || []), allergy_verified || false, high_alert_checked || false, patient_counselled || false, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cds-ext/reconciliation', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/drug-education/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, medication, instructions, side_effects, precautions, educated_by, created_at
            FROM patient_drug_education WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, educations: r.rows });
    } catch (err) { console.error('GET /api/cds-ext/drug-education', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/drug-education', requireAuth, requireTenantScope, requireRole('doctor', 'pharmacist', 'nurse'), async (req, res) => {
    try {
        const { patient_id, medication, instructions, side_effects, precautions } = req.body;
        if (!patient_id || !medication) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO patient_drug_education (tenant_id, patient_id, medication, instructions, side_effects, precautions, educated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [req.tenantId, patient_id, medication, instructions || '', side_effects || '', precautions || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cds-ext/drug-education', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'pharmacist'), async (req, res) => {
    try {
        const ic = await db.query(`
            SELECT COUNT(*) as checks_30d,
                   COUNT(*) FILTER (WHERE highest_severity IN ('major','severe','contraindicated')) as high_severity_30d
            FROM drug_interaction_checks WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        const re = await db.query(`
            SELECT COUNT(*) as total_reconciliations,
                   COUNT(*) FILTER (WHERE status = 'completed' AND allergy_verified AND high_alert_checked AND patient_counselled) as fully_completed
            FROM medication_reconciliations WHERE tenant_id = $1
        `, [req.tenantId]);
        const ed = await db.query(`
            SELECT COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as education_7d
            FROM patient_drug_education WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, drug_interactions: ic.rows[0], reconciliations: re.rows[0], education: ed.rows[0] });
    } catch (err) { console.error('GET /api/cds-ext/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['drug-interactions', 'catalog', 'reconciliation', 'drug-education', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
