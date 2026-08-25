// filepath: namaweb/quality_metrics_engine.js
// Quality / KPI metrics engine for hospital operations dashboards.
// Read-only over existing tables. No new schema.
'use strict';

const db = require('./db_postgres');

async function getOverview(tenantId, days = 30) {
    const sinceDate = days;

    // Active CDS alerts
    const cdsRes = await db.query(`
        SELECT severity, COUNT(*) as cnt FROM cds_alerts
        WHERE tenant_id = $1 AND status = 'active'
        GROUP BY severity
    `, [tenantId]);
    const cds = { critical: 0, high: 0, moderate: 0, low: 0, info: 0, total: 0 };
    for (const r of cdsRes.rows) { cds[r.severity] = +r.cnt; cds.total += +r.cnt; }

    // SOAP notes signed
    const soapRes = await db.query(`
        SELECT COUNT(*) as total,
               COUNT(*) FILTER (WHERE signed_at IS NOT NULL) as signed,
               COUNT(*) FILTER (WHERE created_at >= NOW() - ($2 || ' days')::interval) as recent
        FROM soap_notes WHERE tenant_id = $1
    `, [tenantId, sinceDate]);

    // Vitals recorded
    const vitalsRes = await db.query(`
        SELECT COUNT(*) as total,
               COUNT(DISTINCT patient_id) as unique_patients,
               COUNT(*) FILTER (WHERE recorded_at >= NOW() - ($2 || ' days')::interval) as recent
        FROM vital_signs WHERE tenant_id = $1
    `, [tenantId, sinceDate]);

    // Lab results
    const labsRes = await db.query(`
        SELECT COUNT(*) as total,
               COUNT(*) FILTER (WHERE abnormal_flag IN ('L','H','LL','HH','A') OR is_critical = 1) as abnormal,
               COUNT(*) FILTER (WHERE is_critical = 1) as critical,
               COUNT(*) FILTER (WHERE reported_at >= NOW() - ($2 || ' days')::interval) as recent
        FROM lab_results WHERE tenant_id = $1
    `, [tenantId, sinceDate]);

    // Imaging studies
    const imagingRes = await db.query(`
        SELECT status, COUNT(*) as cnt FROM imaging_studies
        WHERE tenant_id = $1 GROUP BY status
    `, [tenantId]);
    const imaging = { scheduled: 0, in_progress: 0, completed: 0, cancelled: 0, total: 0 };
    for (const r of imagingRes.rows) { imaging[r.status] = +r.cnt; imaging.total += +r.cnt; }

    // Discharge summaries
    const disRes = await db.query(`
        SELECT COUNT(*) as total,
               COUNT(*) FILTER (WHERE signed_at IS NOT NULL) as signed,
               COUNT(*) FILTER (WHERE discharge_date >= CURRENT_DATE - $2) as recent
        FROM discharge_summaries WHERE tenant_id = $1
    `, [tenantId, sinceDate]);

    // Care plans
    const cpRes = await db.query(`
        SELECT status, COUNT(*) as cnt FROM care_plans WHERE tenant_id = $1 GROUP BY status
    `, [tenantId]);
    const carePlans = { active: 0, completed: 0, cancelled: 0, total: 0 };
    for (const r of cpRes.rows) { carePlans[r.status] = +r.cnt; carePlans.total += +r.cnt; }

    // Pathway instances
    const pwRes = await db.query(`
        SELECT status, COUNT(*) as cnt FROM clinical_pathway_instances
        WHERE tenant_id = $1 AND started_at >= NOW() - ($2 || ' days')::interval
        GROUP BY status
    `, [tenantId, sinceDate]);
    const pathways = { active: 0, completed: 0, paused: 0, abandoned: 0, total: 0 };
    for (const r of pwRes.rows) { pathways[r.status] = +r.cnt; pathways.total += +r.cnt; }

    // Drug interaction checks
    const diRes = await db.query(`
        SELECT COUNT(*) as total,
               COUNT(*) FILTER (WHERE high_severity_count > 0) as high_risk,
               SUM(high_severity_count) as total_high
        FROM drug_interaction_checks WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
    `, [tenantId, sinceDate]);

    // Allergies tracked
    const allergRes = await db.query(`
        SELECT severity, COUNT(*) as cnt FROM allergies WHERE tenant_id = $1 AND active = TRUE GROUP BY severity
    `, [tenantId]);
    const allergies = { mild: 0, moderate: 0, severe: 0, anaphylaxis: 0, total: 0 };
    for (const r of allergRes.rows) { allergies[r.severity] = +r.cnt; allergies.total += +r.cnt; }

    // Compute ratios
    const soapTotal = +soapRes.rows[0].total;
    const soapSigned = +soapRes.rows[0].signed;
    const soapCompletionRate = soapTotal > 0 ? +(soapSigned / soapTotal * 100).toFixed(1) : 0;

    const labsTotal = +labsRes.rows[0].total;
    const labsAbnormal = +labsRes.rows[0].abnormal;
    const abnormalRate = labsTotal > 0 ? +(labsAbnormal / labsTotal * 100).toFixed(1) : 0;

    const disTotal = +disRes.rows[0].total;
    const disSigned = +disRes.rows[0].signed;
    const disCompletionRate = disTotal > 0 ? +(disSigned / disTotal * 100).toFixed(1) : 0;

    return {
        period_days: sinceDate,
        timestamp: new Date().toISOString(),
        cds_alerts_active: cds,
        soap_notes: { total: soapTotal, signed: soapSigned, recent_30d: +soapRes.rows[0].recent, completion_rate_pct: soapCompletionRate },
        vital_signs: { total: +vitalsRes.rows[0].total, unique_patients: +vitalsRes.rows[0].unique_patients, recent_30d: +vitalsRes.rows[0].recent },
        labs: { total: labsTotal, abnormal: labsAbnormal, critical: +labsRes.rows[0].critical, recent_30d: +labsRes.rows[0].recent, abnormal_rate_pct: abnormalRate },
        imaging: imaging,
        discharge_summaries: { total: disTotal, signed: disSigned, recent_30d: +disRes.rows[0].recent, completion_rate_pct: disCompletionRate },
        care_plans: carePlans,
        pathways_recent_30d: pathways,
        drug_interactions_recent_30d: { checks: +diRes.rows[0].total, high_risk_checks: +diRes.rows[0].high_risk, total_high_findings: +(diRes.rows[0].total_high || 0) },
        allergies_active: allergies
    };
}

async function getDeptStats(tenantId, days = 30) {
    const res = await db.query(`
        SELECT dept_code, COUNT(*) as assessment_count, COUNT(DISTINCT patient_id) as unique_patients,
               COUNT(*) FILTER (WHERE risk_level IN ('high','very_high','severe')) as high_risk_count,
               MAX(created_at) as last_activity
        FROM (
            SELECT 'family_medicine' as dept_code, patient_id, risk_level, created_at FROM family_medicine_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            UNION ALL
            SELECT 'cardiology', patient_id, risk_level, created_at FROM cardiology_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            UNION ALL
            SELECT 'surgery', patient_id, risk_level, created_at FROM surgery_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            UNION ALL
            SELECT 'oncology', patient_id, risk_level, created_at FROM oncology_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            UNION ALL
            SELECT 'neurology', patient_id, risk_level, created_at FROM neurology_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            UNION ALL
            SELECT 'dermatology', patient_id, risk_level, created_at FROM dermatology_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            UNION ALL
            SELECT 'psychiatry', patient_id, risk_level, created_at FROM psychiatry_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            UNION ALL
            SELECT 'allergy', patient_id, risk_level, created_at FROM allergy_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            UNION ALL
            SELECT 'radiology', patient_id, risk_level, created_at FROM radiology_assessments WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
        ) all_assess
        GROUP BY dept_code
        ORDER BY assessment_count DESC
    `, [tenantId, days]);
    return { period_days: days, total_depts: res.rows.length, departments: res.rows };
}

module.exports = { getOverview, getDeptStats };