'use strict';
// Wave 100 — FHIR R4 Query API + HL7 messaging + CDS alerts (standards interoperability)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_FHIR_TYPES = ['Patient','Encounter','Observation','MedicationRequest','MedicationStatement','AllergyIntolerance','Condition','Procedure','DiagnosticReport','Immunization','Coverage','Claim','Appointment'];
const VALID_HL7_TYPES = ['ADT','ORM','ORU','SIU','MDM','DFT','BAR','ACK','QRY'];
const VALID_HL7_STATUS = ['received','processing','processed','failed','retry'];
const VALID_DIRECTION = ['inbound','outbound'];
const VALID_CDS_SEVERITY = ['info','warning','critical','emergency'];
const VALID_CDS_STATUS = ['active','acknowledged','resolved','dismissed','expired'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'fhir-hl7-cds',
        endpoints: [
            'GET /fhir/resources',
            'GET /fhir/resources/:type/:id',
            'GET /fhir/resources/patient/:patientId',
            'GET /fhir/by-type',
            'GET /hl7/messages',
            'GET /hl7/messages/:id',
            'GET /hl7/failed',
            'GET /hl7/by-type',
            'GET /cds/alerts',
            'GET /cds/alerts/:id',
            'POST /cds/alerts/:id/acknowledge',
            'POST /cds/alerts/:id/resolve',
            'GET /cds/active',
            'GET /cds/critical',
            'GET /cds/by-severity',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== FHIR RESOURCES =====
router.get('/fhir/resources', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { resource_type, source_system, is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, resource_type, resource_id, version_id, source_system, source_reference, last_updated, is_active FROM fhir_resources WHERE tenant_id = $1`;
        if (resource_type) { sql += ` AND resource_type = $${params.length + 1}`; params.push(resource_type); }
        if (source_system) { sql += ` AND source_system = $${params.length + 1}`; params.push(source_system); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        sql += ` ORDER BY last_updated DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/fhir/resources/:type/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        if (!VALID_FHIR_TYPES.includes(req.params.type)) return res.status(400).json({ ok: false, error: 'invalid_fhir_resource_type', valid: VALID_FHIR_TYPES });
        const r = await db.query(
            `SELECT * FROM fhir_resources WHERE tenant_id = $1 AND resource_type = $2 AND resource_id = $3 ORDER BY version_id DESC LIMIT 1`,
            [req.tenantId, req.params.type, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'fhir_resource_not_found' });
        const row = r.rows[0];
        let json = row.resource_json;
        try { json = typeof json === 'string' ? JSON.parse(json) : json; } catch (e) { json = null; }
        res.json({ ok: true, resource_type: row.resource_type, resource_id: row.resource_id, version_id: row.version_id, last_updated: row.last_updated, resource: json, source: { system: row.source_system, reference: row.source_reference } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/fhir/resources/patient/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT id, resource_type, resource_id, version_id, source_system, last_updated FROM fhir_resources
             WHERE tenant_id = $1 AND resource_json::text LIKE $2 ORDER BY last_updated DESC LIMIT 100`,
            [req.tenantId, `%"reference":"Patient/${req.params.patientId}"%`]
        );
        const grouped = {};
        r.rows.forEach(x => { grouped[x.resource_type] = (grouped[x.resource_type] || 0) + 1; });
        res.json({ ok: true, count: r.rows.length, by_type: grouped, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/fhir/by-type', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT resource_type, COUNT(*) AS count, COUNT(DISTINCT resource_id) AS unique_resources,
                    COUNT(*) FILTER (WHERE is_active = true) AS active
             FROM fhir_resources WHERE tenant_id = $1 GROUP BY resource_type ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, types: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== HL7 MESSAGES =====
router.get('/hl7/messages', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { message_type, processing_status, direction, interface_name, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, message_type, message_control_id, sending_application, receiving_application, sending_facility, message_datetime, patient_id, processing_status, retry_count, direction, interface_name, created_at FROM hl7_messages WHERE tenant_id = $1`;
        if (message_type) { sql += ` AND message_type = $${params.length + 1}`; params.push(message_type); }
        if (processing_status) { sql += ` AND processing_status = $${params.length + 1}`; params.push(processing_status); }
        if (direction) { sql += ` AND direction = $${params.length + 1}`; params.push(direction); }
        if (interface_name) { sql += ` AND interface_name = $${params.length + 1}`; params.push(interface_name); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/hl7/messages/:id', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM hl7_messages WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'hl7_message_not_found' });
        res.json({ ok: true, message: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/hl7/failed', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT id, message_type, message_control_id, sending_application, error_message, retry_count, interface_name, created_at FROM hl7_messages
             WHERE tenant_id = $1 AND processing_status IN ('failed','retry') ORDER BY created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, action: 'Investigate failed HL7 messages. Consider re-processing after fixing root cause.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/hl7/by-type', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT message_type, direction, COUNT(*) AS count, AVG(retry_count)::NUMERIC(10,2) AS avg_retries
             FROM hl7_messages WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY message_type, direction ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, breakdown: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CDS ALERTS =====
router.get('/cds/alerts', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, alert_type, severity, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cds_alerts WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (alert_type) { sql += ` AND alert_type = $${params.length + 1}`; params.push(alert_type); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cds/alerts/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM cds_alerts WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'cds_alert_not_found' });
        let details = null, triggered = null;
        try { details = typeof r.rows[0].details === 'string' ? JSON.parse(r.rows[0].details) : r.rows[0].details; } catch (e) {}
        try { triggered = typeof r.rows[0].triggered_data === 'string' ? JSON.parse(r.rows[0].triggered_data) : r.rows[0].triggered_data; } catch (e) {}
        res.json({ ok: true, alert: { ...r.rows[0], details, triggered_data: triggered } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cds/alerts/:id/acknowledge', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE cds_alerts SET status = 'acknowledged', acknowledged_by = $3, acknowledged_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'active' RETURNING *`,
            [req.tenantId, req.params.id, req.user?.id || null]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_acknowledge' });
        res.json({ ok: true, alert: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cds/alerts/:id/resolve', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE cds_alerts SET status = 'resolved', resolved_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status IN ('active','acknowledged') RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_resolve' });
        res.json({ ok: true, alert: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cds/active', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM cds_alerts WHERE tenant_id = $1 AND status = 'active' ORDER BY severity ASC, created_at DESC LIMIT 200`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cds/critical', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM cds_alerts WHERE tenant_id = $1 AND severity IN ('critical','emergency') AND status IN ('active','acknowledged')
             ORDER BY created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, alert: 'Critical/emergency CDS alerts requiring immediate attention.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cds/by-severity', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT severity, status, COUNT(*) AS count FROM cds_alerts WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY severity, status ORDER BY severity, status`,
            [req.tenantId]
        );
        res.json({ ok: true, breakdown: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const fhir = await db.query(
            `SELECT COUNT(*) AS total_fhir, COUNT(DISTINCT resource_type) AS resource_types, COUNT(DISTINCT source_system) AS sources
             FROM fhir_resources WHERE tenant_id = $1`,
            [req.tenantId]
        );
        const hl7 = await db.query(
            `SELECT COUNT(*) AS total_hl7, COUNT(*) FILTER (WHERE processing_status = 'failed') AS failed, AVG(retry_count)::NUMERIC(10,2) AS avg_retries
             FROM hl7_messages WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const cds = await db.query(
            `SELECT COUNT(*) AS total_alerts, COUNT(*) FILTER (WHERE status = 'active') AS active,
                    COUNT(*) FILTER (WHERE severity IN ('critical','emergency')) AS critical_or_emergency
             FROM cds_alerts WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        res.json({ ok: true, fhir: fhir.rows[0], hl7_90d: hl7.rows[0], cds_90d: cds.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
