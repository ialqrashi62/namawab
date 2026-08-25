'use strict';
// Wave 110 — Pathology pipeline + Surgical specialty registries (spine/plastic/thoracic/vascular) + biopsy tracking
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_CASE_STATUS = ['received','grossing','processing','embedding','sectioning','staining','reporting','signed_out','cancelled','referred'];
const VALID_PRIORITY = ['routine','urgent','stat'];
const VALID_SPECIMEN = ['biopsy','resection','cytology','fluid','smear','core_needle','excisional','incisional','bone_marrow','autopsy'];
const VALID_BLOCK_STATUS = ['requested','embedded','cut','stained','archived','discarded'];
const VALID_SLIDE_STATUS = ['created','stained','scanned','reviewed','archived','discarded','broken'];
const VALID_STAIN = ['H&E','IHC','special','molecular','FISH','immunofluorescence','Gram','Ziehl_Neelsen','GMS','Congo_red'];
const VALID_GRADE = ['G1','G2','G3','G4','GX','low','intermediate','high','well_differentiated','moderately_differentiated','poorly_differentiated','undifferentiated'];
const VALID_STAGE = ['0','I','IA','IB','II','IIA','IIB','III','IIIA','IIIB','IV','IVA','IVB','T1','T2','T3','T4','N0','N1','N2','N3','M0','M1','Tx','Nx','Mx','in_situ','localized','regional','distant','unknown'];
const VALID_ASIA = ['A','B','C','D','E'];
const VALID_STABILITY = ['stable','potentially_unstable','unstable','highly_unstable'];
const VALID_LESION = ['benign','atypical','malignant_in_situ','malignant_invasive','indeterminate'];
const VALID_BIOPSY_STATUS = ['collected','in_transit','received','processing','reported','cancelled'];
const VALID_APPROACH = ['open','minimally_invasive','endoscopic','robotic','percutaneous','hybrid'];
const VALID_GRAFT = ['none','Dacron','PTFE','autologous_vein','autologous_artery','xenograft','cryopreserved','composite'];
const VALID_RISK = ['low','moderate','high','critical'];

function turnaroundTime(received, reported) {
    if (!received || !reported) return null;
    const ms = new Date(reported) - new Date(received);
    return Math.round(ms / (1000 * 60 * 60 * 24));
}

function tatClassification(days) {
    if (days === null) return null;
    if (days <= 2) return 'within_target';
    if (days <= 5) return 'acceptable';
    if (days <= 10) return 'delayed';
    return 'critically_delayed';
}

function asiaInterpretation(grade) {
    const map = { 'A': 'complete_injury', 'B': 'sensory_incomplete', 'C': 'motor_incomplete_50pct', 'D': 'motor_incomplete_50pct_plus', 'E': 'normal' };
    return map[grade] || 'unknown';
}

function stabilityIndex(stability) {
    const map = { 'stable': 1, 'potentially_unstable': 2, 'unstable': 3, 'highly_unstable': 4 };
    return map[stability] ?? null;
}

function fusionRecommendation(stability, asia) {
    if (stability === 'highly_unstable' || stability === 'unstable') return 'strongly_recommended';
    if (stability === 'potentially_unstable' && (asia === 'A' || asia === 'B')) return 'recommended';
    if (stability === 'potentially_unstable') return 'consider';
    return 'not_indicated';
}

function ihcInterpretation(score, marker) {
    if (score === undefined || score === null) return null;
    if (marker === 'Ki-67' || marker === 'Ki67') {
        if (score < 10) return 'low_proliferation';
        if (score < 30) return 'moderate_proliferation';
        return 'high_proliferation';
    }
    if (score === 0) return 'negative';
    if (score <= 2) return 'weak_positive';
    if (score <= 6) return 'moderate_positive';
    return 'strong_positive';
}

function gradeDifferentiation(grade) {
    const map = { 'G1': 'well_differentiated', 'G2': 'moderately_differentiated', 'G3': 'poorly_differentiated', 'G4': 'undifferentiated', 'GX': 'cannot_assess' };
    return map[grade] || null;
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'pathology-surgical',
        endpoints: [
            'GET /pathology/cases',
            'POST /pathology/cases',
            'GET /pathology/cases/:id',
            'GET /pathology/reports',
            'POST /pathology/reports',
            'GET /pathology/blocks',
            'POST /pathology/blocks',
            'GET /pathology/slides',
            'POST /pathology/slides',
            'GET /pathology/digital-logs',
            'POST /pathology/digital-logs',
            'GET /biopsy',
            'POST /biopsy',
            'GET /spine',
            'POST /spine',
            'GET /plastic-surgery/cases',
            'POST /plastic-surgery/cases',
            'GET /plastic-burns/logs',
            'POST /plastic-burns/logs',
            'GET /thoracic-surgery/cases',
            'POST /thoracic-surgery/cases',
            'GET /vascular-surgery/cases',
            'POST /vascular-surgery/cases',
            'GET /tat',
            'GET /asia',
            'GET /ihc',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== PATHOLOGY CASES =====
router.get('/pathology/cases', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { patient_id, status, specimen_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, p.full_name AS patient_lookup FROM pathology_cases c LEFT JOIN patients p ON p.id = c.patient_id WHERE c.tenant_id = $1`;
        if (patient_id) { sql += ` AND c.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (status) { sql += ` AND c.status = $${params.length + 1}`; params.push(status); }
        if (specimen_type) { sql += ` AND c.specimen_type = $${params.length + 1}`; params.push(specimen_type); }
        sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pathology/cases/:id', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const c = await db.query(`SELECT c.*, p.full_name AS patient_lookup FROM pathology_cases c LEFT JOIN patients p ON p.id = c.patient_id WHERE c.tenant_id = $1 AND c.id = $2`, [req.tenantId, req.params.id]);
        if (!c.rows.length) return res.status(404).json({ ok: false, error: 'case_not_found' });
        const reports = await db.query(`SELECT * FROM pathology_reports WHERE tenant_id = $1 AND patient_id = (SELECT patient_id::text FROM pathology_cases WHERE id = $2) ORDER BY created_at DESC`, [req.tenantId, req.params.id]);
        res.json({ ok: true, case: c.rows[0], reports: reports.rows, computed: { tat_days: turnaroundTime(c.rows[0].received_date, c.rows[0].report_date) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/cases', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { patient_id, patient_name, specimen_type, collection_date, received_date, pathologist, gross_description, microscopic_findings, diagnosis, icd_code, stage, grade, status, report_date, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!specimen_type) return res.status(400).json({ ok: false, error: 'specimen_type_required' });
        if (specimen_type && !VALID_SPECIMEN.includes(specimen_type)) return res.status(400).json({ ok: false, error: 'invalid_specimen_type' });
        if (status && !VALID_CASE_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (grade && !VALID_GRADE.includes(grade)) return res.status(400).json({ ok: false, error: 'invalid_grade' });
        if (stage && !VALID_STAGE.includes(stage)) return res.status(400).json({ ok: false, error: 'invalid_stage' });

        const tat = turnaroundTime(received_date, report_date);

        const r = await db.query(
            `INSERT INTO pathology_cases (tenant_id, patient_id, patient_name, specimen_type, collection_date, received_date, pathologist, gross_description, microscopic_findings, diagnosis, icd_code, stage, grade, status, report_date, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
            [req.tenantId, patient_id, patient_name || null, specimen_type, collection_date || null, received_date || null,
             pathologist || null, gross_description || null, microscopic_findings || null, diagnosis || null,
             icd_code || null, stage || null, grade || null, status || 'received', report_date || null, notes || null]
        );
        res.status(201).json({
            ok: true, case: r.rows[0],
            computed: { tat_days: tat, tat_classification: tatClassification(tat), grade_interpretation: gradeDifferentiation(grade) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY REPORTS =====
router.get('/pathology/reports', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { patient_id, specimen_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_name FROM pathology_reports r LEFT JOIN patients p ON p.id::text = r.patient_id WHERE r.tenant_id = $1`;
        if (patient_id) { sql += ` AND r.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (specimen_type) { sql += ` AND r.specimen_type = $${params.length + 1}`; params.push(specimen_type); }
        sql += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/reports', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, specimen_type, gross_findings, microscopic, diagnosis, ihc_panel, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!specimen_type) return res.status(400).json({ ok: false, error: 'specimen_type_required' });
        if (!diagnosis) return res.status(400).json({ ok: false, error: 'diagnosis_required' });

        const r = await db.query(
            `INSERT INTO pathology_reports (tenant_id, patient_id, encounter_id, specimen_type, gross_findings, microscopic, diagnosis, ihc_panel, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             specimen_type, gross_findings || null, microscopic || null, diagnosis, ihc_panel || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY BLOCKS =====
router.get('/pathology/blocks', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { specimen_id, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pathology_blocks WHERE tenant_id = $1`;
        if (specimen_id) { sql += ` AND specimen_id = $${params.length + 1}`; params.push(specimen_id); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/blocks', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { specimen_id, block_label, cassette_id, tissue_type, fixative, status, created_by } = req.body;
        if (!specimen_id) return res.status(400).json({ ok: false, error: 'specimen_id_required' });
        if (!block_label) return res.status(400).json({ ok: false, error: 'block_label_required' });
        if (status && !VALID_BLOCK_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO pathology_blocks (tenant_id, specimen_id, block_label, cassette_id, tissue_type, fixative, status, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, specimen_id, block_label, cassette_id || null, tissue_type || null, fixative || null,
             status || 'requested', created_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, block: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY SLIDES =====
router.get('/pathology/slides', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { block_id, status, stain_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pathology_slides WHERE tenant_id = $1`;
        if (block_id) { sql += ` AND block_id = $${params.length + 1}`; params.push(block_id); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (stain_type) { sql += ` AND stain_type = $${params.length + 1}`; params.push(stain_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/slides', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { block_id, slide_label, stain_type, thickness_microns, status, created_by } = req.body;
        if (!block_id) return res.status(400).json({ ok: false, error: 'block_id_required' });
        if (!slide_label) return res.status(400).json({ ok: false, error: 'slide_label_required' });
        if (stain_type && !VALID_STAIN.includes(stain_type)) return res.status(400).json({ ok: false, error: 'invalid_stain' });
        if (status && !VALID_SLIDE_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (thickness_microns !== undefined && (thickness_microns < 1 || thickness_microns > 20)) return res.status(400).json({ ok: false, error: 'thickness_out_of_range_1_20' });

        const r = await db.query(
            `INSERT INTO pathology_slides (tenant_id, block_id, slide_label, stain_type, thickness_microns, status, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, block_id, slide_label, stain_type || 'H&E', thickness_microns || 4, status || 'created', created_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, slide: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY DIGITAL LOGS (IHC + molecular + digital slides) =====
router.get('/pathology/digital-logs', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { patient_id, ihc_marker, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pathology_digital_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (ihc_marker) { sql += ` AND ihc_marker = $${params.length + 1}`; params.push(ihc_marker); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/digital-logs', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { patient_id, slide_id, ihc_marker, ihc_score, molecular_typing, digital_slide_url } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (ihc_score !== undefined && (ihc_score < 0 || ihc_score > 300)) return res.status(400).json({ ok: false, error: 'ihc_score_out_of_range_0_300' });

        const interp = ihcInterpretation(ihc_score, ihc_marker);

        const r = await db.query(
            `INSERT INTO pathology_digital_logs (tenant_id, patient_id, slide_id, ihc_marker, ihc_score, molecular_typing, digital_slide_url)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), slide_id || null, ihc_marker || null, ihc_score ?? null, molecular_typing || null, digital_slide_url || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { ihc_interpretation: interp } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BIOPSY SAMPLES =====
router.get('/biopsy', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { patient_id, status, specimen_source, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT b.*, p.full_name AS patient_name FROM biopsy_samples b LEFT JOIN patients p ON p.id = b.patient_id WHERE b.tenant_id = $1`;
        if (patient_id) { sql += ` AND b.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (status) { sql += ` AND b.status = $${params.length + 1}`; params.push(status); }
        if (specimen_source) { sql += ` AND b.specimen_source ILIKE $${params.length + 1}`; params.push(`%${specimen_source}%`); }
        sql += ` ORDER BY b.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/biopsy', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { patient_id, doctor_id, specimen_source, clinical_notes, status, result_findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!specimen_source) return res.status(400).json({ ok: false, error: 'specimen_source_required' });
        if (status && !VALID_BIOPSY_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO biopsy_samples (tenant_id, patient_id, doctor_id, specimen_source, clinical_notes, status, result_findings)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, patient_id, doctor_id || req.user?.id || null, specimen_source,
             clinical_notes || null, status || 'collected', result_findings || null]
        );
        res.status(201).json({ ok: true, biopsy: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SPINE STABILITY METRICS =====
router.get('/spine', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon'), async (req, res) => {
    try {
        const { patient_id, spinal_level, stability_grade, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name FROM spine_stability_metrics s LEFT JOIN patients p ON p.id::text = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (spinal_level) { sql += ` AND s.spinal_level = $${params.length + 1}`; params.push(spinal_level); }
        if (stability_grade) { sql += ` AND s.stability_grade = $${params.length + 1}`; params.push(stability_grade); }
        sql += ` ORDER BY s.assessment_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/spine', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon'), async (req, res) => {
    try {
        const { patient_id, assessment_date, spinal_level, asia_impairment_grade, motor_score, sensory_score, stability_grade, fusion_recommended, surgeon_id } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (spinal_level && !/^(C|T|L|S)[1-9][0-9]?$/.test(spinal_level)) return res.status(400).json({ ok: false, error: 'invalid_spinal_level_format_C1_S5' });
        if (asia_impairment_grade && !VALID_ASIA.includes(asia_impairment_grade)) return res.status(400).json({ ok: false, error: 'invalid_asia_grade' });
        if (stability_grade && !VALID_STABILITY.includes(stability_grade)) return res.status(400).json({ ok: false, error: 'invalid_stability_grade' });
        if (motor_score !== undefined && (motor_score < 0 || motor_score > 100)) return res.status(400).json({ ok: false, error: 'motor_out_of_range_0_100' });
        if (sensory_score !== undefined && (sensory_score < 0 || sensory_score > 112)) return res.status(400).json({ ok: false, error: 'sensory_out_of_range_0_112' });

        const fusion = fusion_recommended !== undefined ? !!fusion_recommended : fusionRecommendation(stability_grade, asia_impairment_grade) === 'strongly_recommended' || fusionRecommendation(stability_grade, asia_impairment_grade) === 'recommended';

        const r = await db.query(
            `INSERT INTO spine_stability_metrics (tenant_id, patient_id, assessment_date, spinal_level, asia_impairment_grade, motor_score, sensory_score, stability_grade, fusion_recommended, surgeon_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), assessment_date || new Date().toISOString(),
             spinal_level || null, asia_impairment_grade || null, motor_score ?? null, sensory_score ?? null,
             stability_grade || null, fusion, surgeon_id ? String(surgeon_id) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({
            ok: true, spine: r.rows[0],
            computed: {
                asia_interpretation: asiaInterpretation(asia_impairment_grade),
                stability_index: stabilityIndex(stability_grade),
                fusion_recommendation: fusionRecommendation(stability_grade, asia_impairment_grade)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PLASTIC SURGERY CASES =====
router.get('/plastic-surgery/cases', requireAuth, requireTenantScope, requireRole('plastic_surgeon'), async (req, res) => {
    try {
        const { patient_id, procedure, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, p.full_name AS patient_name FROM plastic_surgery_cases c LEFT JOIN patients p ON p.id::text = c.patient_id WHERE c.tenant_id = $1`;
        if (patient_id) { sql += ` AND c.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure) { sql += ` AND c.procedure ILIKE $${params.length + 1}`; params.push(`%${procedure}%`); }
        sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/plastic-surgery/cases', requireAuth, requireTenantScope, requireRole('plastic_surgeon'), async (req, res) => {
    try {
        const { patient_id, encounter_id, procedure, indication, anesthesia, duration_hours, graft_used, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure) return res.status(400).json({ ok: false, error: 'procedure_required' });
        if (duration_hours !== undefined && duration_hours < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });
        if (graft_used && !VALID_GRAFT.includes(graft_used)) return res.status(400).json({ ok: false, error: 'invalid_graft' });

        const r = await db.query(
            `INSERT INTO plastic_surgery_cases (tenant_id, patient_id, encounter_id, procedure, indication, anesthesia, duration_hours, graft_used, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             procedure, indication || null, anesthesia || null, duration_hours ?? null, graft_used || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, case: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PLASTIC/BURNS SURGICAL LOGS =====
router.get('/plastic-burns/logs', requireAuth, requireTenantScope, requireRole('plastic_surgeon'), async (req, res) => {
    try {
        const { patient_id, procedure_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM plastic_burns_surgical_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure_type) { sql += ` AND procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        sql += ` ORDER BY operation_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/plastic-burns/logs', requireAuth, requireTenantScope, requireRole('plastic_surgeon'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (approach && !VALID_APPROACH.includes(approach)) return res.status(400).json({ ok: false, error: 'invalid_approach' });
        if (duration_minutes !== undefined && duration_minutes < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });
        if (blood_loss_ml !== undefined && blood_loss_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_blood_loss' });

        const r = await db.query(
            `INSERT INTO plastic_burns_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : (req.user?.id ? String(req.user.id) : null),
             operation_date || new Date().toISOString(), procedure_type || null, approach || null,
             duration_minutes ?? null, blood_loss_ml ?? null, complications || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== THORACIC SURGERY CASES =====
router.get('/thoracic-surgery/cases', requireAuth, requireTenantScope, requireRole('thoracic_surgeon'), async (req, res) => {
    try {
        const { patient_id, procedure, lobectomy, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, p.full_name AS patient_name FROM thoracic_surgery_cases c LEFT JOIN patients p ON p.id::text = c.patient_id WHERE c.tenant_id = $1`;
        if (patient_id) { sql += ` AND c.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure) { sql += ` AND c.procedure ILIKE $${params.length + 1}`; params.push(`%${procedure}%`); }
        if (lobectomy !== undefined) { sql += ` AND c.lobectomy = $${params.length + 1}`; params.push(lobectomy === 'true'); }
        sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/thoracic-surgery/cases', requireAuth, requireTenantScope, requireRole('thoracic_surgeon'), async (req, res) => {
    try {
        const { patient_id, encounter_id, procedure, approach, lobectomy, stage, complications, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure) return res.status(400).json({ ok: false, error: 'procedure_required' });
        if (approach && !VALID_APPROACH.includes(approach)) return res.status(400).json({ ok: false, error: 'invalid_approach' });
        if (stage && !VALID_STAGE.includes(stage)) return res.status(400).json({ ok: false, error: 'invalid_stage' });

        const r = await db.query(
            `INSERT INTO thoracic_surgery_cases (tenant_id, patient_id, encounter_id, procedure, approach, lobectomy, stage, complications, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             procedure, approach || null, !!lobectomy, stage || null, complications || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, case: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== VASCULAR SURGERY CASES =====
router.get('/vascular-surgery/cases', requireAuth, requireTenantScope, requireRole('vascular_surgeon'), async (req, res) => {
    try {
        const { patient_id, procedure, vessel, bypass_used, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, p.full_name AS patient_name FROM vascular_surgery_cases c LEFT JOIN patients p ON p.id::text = c.patient_id WHERE c.tenant_id = $1`;
        if (patient_id) { sql += ` AND c.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (procedure) { sql += ` AND c.procedure ILIKE $${params.length + 1}`; params.push(`%${procedure}%`); }
        if (vessel) { sql += ` AND c.vessel ILIKE $${params.length + 1}`; params.push(`%${vessel}%`); }
        if (bypass_used !== undefined) { sql += ` AND c.bypass_used = $${params.length + 1}`; params.push(bypass_used === 'true'); }
        sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/vascular-surgery/cases', requireAuth, requireTenantScope, requireRole('vascular_surgeon'), async (req, res) => {
    try {
        const { patient_id, encounter_id, procedure, vessel, approach, bypass_used, graft_diameter, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure) return res.status(400).json({ ok: false, error: 'procedure_required' });
        if (approach && !VALID_APPROACH.includes(approach)) return res.status(400).json({ ok: false, error: 'invalid_approach' });
        if (graft_diameter !== undefined && graft_diameter <= 0) return res.status(400).json({ ok: false, error: 'invalid_graft_diameter' });

        const r = await db.query(
            `INSERT INTO vascular_surgery_cases (tenant_id, patient_id, encounter_id, procedure, vessel, approach, bypass_used, graft_diameter, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             procedure, vessel || null, approach || null, !!bypass_used, graft_diameter ?? null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, case: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/tat', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { received_date, report_date } = req.query;
        if (!received_date || !report_date) return res.status(400).json({ ok: false, error: 'received_and_report_dates_required' });
        const days = turnaroundTime(received_date, report_date);
        res.json({ ok: true, days, classification: tatClassification(days) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/asia', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { grade } = req.query;
        if (!grade) return res.status(400).json({ ok: false, error: 'grade_required' });
        res.json({ ok: true, grade, interpretation: asiaInterpretation(grade) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ihc', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { score, marker } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, score: parseInt(score), marker, interpretation: ihcInterpretation(parseInt(score), marker) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const cases = await db.query(`SELECT status, specimen_type, COUNT(*) AS count FROM pathology_cases WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY status, specimen_type ORDER BY count DESC`, [req.tenantId]);
        const spine = await db.query(`SELECT spinal_level, stability_grade, asia_impairment_grade, COUNT(*) AS count FROM spine_stability_metrics WHERE tenant_id = $1 AND assessment_date >= NOW() - INTERVAL '90 days' GROUP BY spinal_level, stability_grade, asia_impairment_grade ORDER BY count DESC`, [req.tenantId]);
        const thoracic = await db.query(`SELECT lobectomy, approach, COUNT(*) AS count FROM thoracic_surgery_cases WHERE tenant_id = $1 GROUP BY lobectomy, approach`, [req.tenantId]);
        const vascular = await db.query(`SELECT vessel, bypass_used, COUNT(*) AS count FROM vascular_surgery_cases WHERE tenant_id = $1 GROUP BY vessel, bypass_used`, [req.tenantId]);
        const ihc = await db.query(`SELECT ihc_marker, COUNT(*) AS count FROM pathology_digital_logs WHERE tenant_id = $1 GROUP BY ihc_marker ORDER BY count DESC`, [req.tenantId]);
        res.json({ ok: true, pathology_90d: cases.rows, spine_90d: spine.rows, thoracic_distribution: thoracic.rows, vascular_distribution: vascular.rows, ihc_distribution: ihc.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
