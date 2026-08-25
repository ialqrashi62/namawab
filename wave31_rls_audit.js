/**
 * wave31_rls_audit.js — Wave 31 RLS Query Pattern Audit
 *
 * Scans server.js (and any extra source files we point it at) for `pool.query`
 * calls that reference tables, and checks whether the WHERE clause includes
 * `tenant_id` (or an `AND tenant_id=$N` predicate). The scanner is purely
 * static (no DB connection required) so it can run in CI and in the closeout
 * smoke step.
 *
 * Design choices (defense-in-depth, zero behavior change):
 *   - READ-ONLY scanner: regex against source text, never `require()`.
 *   - Reports TWO classes of finding:
 *       (a) RISK — query references a tenant-scoped table but has NO tenant_id predicate
 *       (b) OK   — query has explicit tenant_id predicate (defense-in-depth)
 *   - Tables classified as TENANT-SCOPED come from a curated allowlist. A query
 *     that references a non-listed table (e.g. medical_services, lookup table) is
 *     reported as `INFO`, not a finding.
 *   - Emit Prometheus text + JSON summary (same surface as Wave 29 metrics).
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Curated tenant-scoped table list. Tables owned by a tenant via tenant_id column.
// Lookup/global tables (medical_services, lab_tests_catalog, etc.) are NOT in this list.
const TENANT_SCOPED_TABLES = [
    'patients', 'appointments', 'invoices', 'medical_records', 'prescriptions',
    'lab_radiology_orders', 'lab_samples', 'lab_results', 'lab_qc', 'rad_exams',
    'dicom_studies', 'rad_reports', 'consent_forms', 'medical_certificates',
    'patient_referrals', 'surgeries', 'surgery_preop_assessments', 'surgery_preop_tests',
    'surgery_anesthesia_records', 'who_surgical_checklist', 'pacu_records', 'operative_notes',
    'or_consumption', 'or_slots', 'waiting_queue', 'exam_rooms', 'nursing_vitals',
    'patient_problems', 'patient_allergies', 'patient_scores', 'patient_social_history',
    'patient_family_history', 'patient_surgical_history', 'pediatric_immunizations',
    'pediatric_growth_records', 'psychiatric_evaluations', 'dermatology_lesions',
    'audiogram_records', 'burn_assessments', 'clinical_photos_meta', 'dialysis_sessions',
    'eye_exams', 'surgical_checklists', 'surgical_time_logs', 'urodynamic_studies',
    'cpb_logs', 'pain_assessments', 'neurology_assessments', 'joint_assessments',
    'pulmonary_function_tests', 'endoscopy_reports', 'biopsy_samples', 'ecg_records',
    'cardiology_procedures', 'diabetes_glucose_logs', 'insulin_regimens', 'obgyn_pregnancies',
    'cardiology_assessments', 'orthopedic_implants', 'joint_rom_assessments',
    'admissions', 'admission_daily_rounds', 'bed_transfers', 'emergency_visits',
    'emergency_beds', 'emergency_trauma_assessments', 'wards', 'beds',
    'diet_orders', 'diet_meals', 'nutrition_assessments', 'transport_requests',
    'infection_surveillance', 'infection_outbreaks', 'employee_exposures',
    'hand_hygiene_audits', 'hai_isolation', 'ams_flags', 'quality_incidents',
    'quality_capa', 'quality_risk_register', 'quality_patient_satisfaction',
    'quality_kpis', 'incident_reports', 'insurance_companies', 'insurance_policies',
    'insurance_eligibility_checks', 'insurance_pre_authorizations', 'insurance_claims',
    'insurance_claim_lines', 'insurance_claim_denials', 'insurance_payer_pricing',
    'finance_chart_of_accounts', 'finance_journal_entries', 'finance_journal_lines',
    'finance_vouchers', 'billing_receipts', 'phi_files', 'pathology_cases',
    'path_specimens', 'telemedicine_sessions', 'social_work_cases', 'mortuary_cases',
    'cme_activities', 'cme_registrations', 'emar_orders', 'emar_administrations',
    'internal_messages', 'maintenance_work_orders', 'maintenance_equipment',
    'maintenance_pm_schedules', 'maintenance_parts', 'maintenance_requests',
    'hr_employees', 'hr_licenses', 'hr_shifts', 'hr_attendance', 'hr_leave_requests',
    'hr_payroll_slips', 'hr_competencies', 'clinical_pharmacy_reviews',
    'patient_drug_education', 'drug_interactions', 'rehab_patients', 'rehab_sessions',
    'rehab_goals', 'rehab_assessments', 'dental_records', 'dental_periodontal_exams',
    'dental_images', 'cardiology_cath_reports', 'oncology_patient_regimens',
    'audit_trail', 'template_audit', 'record_access_log', 'roi_requests',
    'emr_amendments', 'zatca_invoices', 'waitlist_followups', 'waitlist_discharges',
    'patient_referrals_queue', 'clinical_decision_log', 'billing_invoices',
    'gl_postings', 'icu_assessments', 'icu_daily_goals', 'icu_monitoring',
    'icu_ventilator', 'icu_infusions', 'icu_scores', 'icu_fluid_balance',
    'rad_reactions', 'rad_followups', 'lab_reactions', 'lab_followups',
    'antibiotic_stewardship_flags', 'icd10_codes', 'snomed_codes',
    'patient_encounters', 'discharge_summaries', 'operation_notes',
    'lab_panel_tests', 'lab_test_results', 'lab_critical_values',
    'anesthesia_records', 'surgical_safety_checklist', 'patient_premedications',
    'patient_intraoperative_records', 'patient_postop_records',
    'orthopedic_joint_replacements', 'cardiac_catheterizations', 'endoscopy_findings',
    'colonoscopy_findings', 'bronchoscopy_findings', 'sleep_study_results',
    'pft_results', 'thyroid_function_results', 'hba1c_results',
    'lipid_panel_results', 'cardiac_enzymes_results',
    'patient_instructions', 'patient_consent_forms',
    'discharge_instructions', 'medication_reconciliation', 'patient_medications',
    'blood_bank_units', 'blood_bank_donors', 'blood_bank_crossmatch',
    'blood_bank_transfusions', 'blood_bank_transfusion_reactions',
    'cssd_instrument_sets', 'cssd_sterilization_cycles', 'cssd_load_items',
    'cssd_release_records', 'cssd_quality_tests',
    'patient_insurance', 'patient_emergency_contacts', 'patient_demographics',
    'patient_visits_history', 'patient_allergy_history', 'patient_medication_history',
    'patient_problem_list', 'patient_immunization_history',
    'blood_bank_lookback', 'radiology_prior_comparisons',
    'medication_administration_records', 'pain_management_plans',
    'fall_risk_assessments', 'pressure_ulcer_assessments',
    'patient_falls', 'patient_adverse_events',
    'patient_restraint_records', 'patient_transfusion_records',
    'patient_ventilator_records', 'patient_hemodialysis_records',
    'waiting_room_queue', 'patient_feedback', 'patient_complaints',
    'patient_safety_incidents', 'patient_safety_events',
    'patient_quality_indicators', 'patient_clinical_outcomes',
    'patient_satisfaction_surveys', 'patient_experience_scores',
    'patient_referral_letters', 'patient_consultation_notes',
    'patient_discharge_planning', 'patient_followup_appointments',
    'patient_care_plans', 'patient_nursing_notes',
    'patient_physician_orders', 'patient_progress_notes',
    'patient_clinical_pathways', 'patient_protocols',
    'patient_research_studies', 'patient_consent_for_research',
    'patient_advance_directives', 'patient_dnr_orders',
];

// Match `pool.query('SELECT … FROM <table> …', [...])` (single or double quoted SQL).
// Capture: full match + first quoted SQL string + table name. We keep it deliberately
// simple — false positives are reported as INFO, not RISK, so over-reporting is safe.
const QUERY_CALL_RE = /pool\.query\s*\(\s*[`'"]([^`'"]*)[`'"]/g;
// Match table reference inside the captured SQL (FROM/JOIN/INTO/UPDATE keywords).
const TABLE_REF_RE = /\b(?:FROM|JOIN|INTO|UPDATE)\s+(?:ONLY\s+)?([a-z_][a-z0-9_]+)/gi;
// Match `tenant_id` predicate (column ref or `app.tenant_id` GUC). Both count as scoped.
const TENANT_PREDICATE_RE = /\btenant_id\b/i;
const APP_TENANT_GUC_RE = /app\.tenant_id/i;

/**
 * Audit a single source file. Returns { file, queries: N, risk: N, ok: N, info: N, findings: [...] }.
 *
 * Each finding: { line, table, hasTenant, sqlSnippet }
 */
function auditSource(source, filePath) {
    const findings = [];
    const tableRe = new RegExp(TABLE_REF_RE.source, 'gi');
    const qRe = new RegExp(QUERY_CALL_RE.source, 'g');
    let q;
    let lineOffset = 0;
    let lineStarts = null;
    function computeLine(num) {
        if (!lineStarts) {
            lineStarts = [0];
            for (let i = 0; i < source.length; i++) if (source[i] === '\n') lineStarts.push(i + 1);
        }
        let lo = 0, hi = lineStarts.length - 1, ans = 1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (lineStarts[mid] <= num) { ans = mid + 1; lo = mid + 1; } else hi = mid - 1;
        }
        return ans;
    }

    let total = 0, ok = 0, risk = 0, info = 0;
    while ((q = qRe.exec(source)) !== null) {
        total++;
        const sql = q[1];
        const offset = q.index + q[0].indexOf(sql);
        const line = computeLine(offset);
        // Find referenced tables.
        const tableRe2 = new RegExp(TABLE_REF_RE.source, 'gi');
        let t;
        const tables = new Set();
        while ((t = tableRe2.exec(sql)) !== null) tables.add(t[1].toLowerCase());
        if (!tables.size) continue;
        // A query with a tenant predicate anywhere in the SQL is OK (defense-in-depth).
        const hasTenant = TENANT_PREDICATE_RE.test(sql) || APP_TENANT_GUC_RE.test(sql);
        for (const table of tables) {
            if (!TENANT_SCOPED_TABLES.includes(table)) {
                info++;
                continue;
            }
            const f = { file: filePath, line, table, hasTenant, sqlSnippet: sql.slice(0, 140) };
            findings.push(f);
            if (hasTenant) ok++; else risk++;
        }
    }
    return { file: filePath, total, ok, risk, info, findings };
}

/**
 * Audit one or more source files.
 *
 * @param {string|string[]} files - path or array of paths
 * @returns summary object
 */
function auditFiles(files) {
    const list = Array.isArray(files) ? files : [files];
    const fileResults = [];
    for (const f of list) {
        try {
            const src = fs.readFileSync(f, 'utf8');
            fileResults.push(auditSource(src, f));
        } catch (e) {
            fileResults.push({ file: f, error: e.message });
        }
    }
    // Aggregate.
    const summary = {
        files: fileResults.length,
        total: fileResults.reduce((s, r) => s + (r.total || 0), 0),
        ok: fileResults.reduce((s, r) => s + (r.ok || 0), 0),
        risk: fileResults.reduce((s, r) => s + (r.risk || 0), 0),
        info: fileResults.reduce((s, r) => s + (r.info || 0), 0),
        findings: fileResults.flatMap(r => r.findings || []),
    };
    return { summary, files: fileResults };
}

/**
 * Emit Prometheus text-format counters for the audit summary.
 */
function toPrometheusMetrics(summary) {
    return [
        '# HELP wave31_rls_audit_total Total pool.query calls scanned',
        '# TYPE wave31_rls_audit_total counter',
        `wave31_rls_audit_total ${summary.total}`,
        '# HELP wave31_rls_audit_ok Queries with explicit tenant_id predicate',
        '# TYPE wave31_rls_audit_ok counter',
        `wave31_rls_audit_ok ${summary.ok}`,
        '# HELP wave31_rls_audit_risk Queries referencing tenant-scoped tables WITHOUT tenant_id predicate',
        '# TYPE wave31_rls_audit_risk gauge',
        `wave31_rls_audit_risk ${summary.risk}`,
        '# HELP wave31_rls_audit_info Queries referencing non-tenant-scoped tables (informational)',
        '# TYPE wave31_rls_audit_info counter',
        `wave31_rls_audit_info ${summary.info}`,
        '',
    ].join('\n');
}

/**
 * CLI: scan server.js and emit a JSON report + Prometheus text.
 */
function main() {
    const target = process.argv.slice(2);
    if (!target.length) target.push(path.join(__dirname, 'server.js'));
    const { summary, files } = auditFiles(target);
    const report = {
        scanned_at: new Date().toISOString(),
        summary,
        files: files.map(f => ({ file: f.file, total: f.total || 0, ok: f.ok || 0, risk: f.risk || 0, info: f.info || 0, error: f.error })),
        // First 20 risk findings (no PHI / no secrets — these are query snippets only).
        risk_findings_sample: summary.findings.filter(f => !f.hasTenant).slice(0, 20),
    };
    const fmt = (process.env.WAVE31_OUTPUT || 'json').toLowerCase();
    if (fmt === 'prom') {
        process.stdout.write(toPrometheusMetrics(summary));
    } else {
        process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    }
    // Exit code: non-zero if any RISK findings present (CI gate).
    process.exit(summary.risk > 0 ? 1 : 0);
}

module.exports = {
    auditSource,
    auditFiles,
    toPrometheusMetrics,
    TENANT_SCOPED_TABLES,
};

if (require.main === module) main();
