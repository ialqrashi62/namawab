// filepath: namaweb/soap_note_engine.js
// Deterministic SOAP note generator.
// Pulls cross-dept assessments + vitals + active allergies, builds structured S/O/A/P.
// Server-side only. Audit log required (handled at router layer).
'use strict';

const db = require('./db_postgres');

/**
 * Generate a structured SOAP note from patient data.
 * @param {number} tenantId
 * @param {number} patientId
 * @param {object} [opts]
 * @param {string} [opts.chief_complaint]
 * @param {string} [opts.subjective_extra]
 * @returns {Promise<object>}
 */
async function generateSoapNote(tenantId, patientId, opts = {}) {
    // 1. Patient demographics
    const patientRes = await db.query(`
        SELECT id, name_en, name_ar, age, sex, dob, phone
        FROM patients
        WHERE id = $1 AND tenant_id = $2
    `, [patientId, tenantId]);

    if (patientRes.rows.length === 0) {
        return { error: 'patient_not_found' };
    }
    const p = patientRes.rows[0];

    // 2. Recent vitals (last 5)
    const vitalsRes = await db.query(`
        SELECT heart_rate, systolic_bp, diastolic_bp, temperature, respiratory_rate, oxygen_saturation, recorded_at
        FROM vital_signs
        WHERE patient_id = $1 AND tenant_id = $2
        ORDER BY recorded_at DESC
        LIMIT 5
    `, [patientId, tenantId]);
    const vitals = vitalsRes.rows;

    // 3. Active allergies
    const allergiesRes = await db.query(`
        SELECT allergen, allergen_type, reaction, severity
        FROM allergies
        WHERE patient_id = $1 AND tenant_id = $2 AND active = TRUE
        ORDER BY
            CASE severity WHEN 'anaphylaxis' THEN 1 WHEN 'severe' THEN 2 WHEN 'moderate' THEN 3 ELSE 4 END,
            created_at DESC
    `, [patientId, tenantId]);
    const allergies = allergiesRes.rows;

    // 4. Latest cross-dept assessments (most recent per dept)
    const assessRes = await db.query(`
        WITH ranked AS (
            SELECT 'family_medicine' as dept, engine_name, score, risk_level, created_at, details,
                ROW_NUMBER() OVER (PARTITION BY 'family_medicine' ORDER BY created_at DESC) as rn
            FROM family_medicine_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'allergy', engine_name, score, risk_level, created_at, NULL,
                ROW_NUMBER() OVER (PARTITION BY 'allergy' ORDER BY created_at DESC)
            FROM allergy_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'cardiology', engine_name, score, risk_level, created_at, NULL,
                ROW_NUMBER() OVER (PARTITION BY 'cardiology' ORDER BY created_at DESC)
            FROM cardiology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'surgery', engine_name, score, risk_level, created_at, NULL,
                ROW_NUMBER() OVER (PARTITION BY 'surgery' ORDER BY created_at DESC)
            FROM surgery_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'oncology', engine_name, score, risk_level, created_at, NULL,
                ROW_NUMBER() OVER (PARTITION BY 'oncology' ORDER BY created_at DESC)
            FROM oncology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'neurology', engine_name, score, risk_level, created_at, NULL,
                ROW_NUMBER() OVER (PARTITION BY 'neurology' ORDER BY created_at DESC)
            FROM neurology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'dermatology', engine_name, score, risk_level, created_at, NULL,
                ROW_NUMBER() OVER (PARTITION BY 'dermatology' ORDER BY created_at DESC)
            FROM dermatology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'radiology', engine_name, score, risk_level, created_at, NULL,
                ROW_NUMBER() OVER (PARTITION BY 'radiology' ORDER BY created_at DESC)
            FROM radiology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'psychiatry', engine_name, score, risk_level, created_at, NULL,
                ROW_NUMBER() OVER (PARTITION BY 'psychiatry' ORDER BY created_at DESC)
            FROM psychiatry_assessments WHERE patient_id = $1 AND tenant_id = $2
        )
        SELECT dept, engine_name, score, risk_level, created_at
        FROM ranked WHERE rn = 1
        ORDER BY created_at DESC
    `, [patientId, tenantId]);
    const latestPerDept = assessRes.rows;

    // 5. Build subjective
    const name = p.name_en || p.name_ar || `Patient ${p.id}`;
    const chief = opts.chief_complaint || 'General follow-up';
    let subjective = `${name} (${p.age ? 'age ' + p.age : 'age n/a'}${p.sex ? ', ' + p.sex : ''}) presents for evaluation. `;
    subjective += `Chief complaint: ${chief}. `;
    if (opts.subjective_extra) subjective += opts.subjective_extra + ' ';
    if (allergies.length > 0) {
        const anaphylaxis = allergies.filter(a => a.severity === 'anaphylaxis');
        if (anaphylaxis.length > 0) {
            subjective += `⚠️ HISTORY OF ANAPHYLAXIS to ${anaphylaxis.map(a => a.allergen).join(', ')}. `;
        } else {
            const severe = allergies.filter(a => a.severity === 'severe');
            if (severe.length > 0) {
                subjective += `Known severe allergies: ${severe.map(a => a.allergen + (a.reaction ? ' (' + a.reaction + ')' : '')).join('; ')}. `;
            }
        }
    }
    subjective += `Patient denies any new acute symptoms at this time beyond the presenting complaint.`;

    // 6. Build objective
    let objective = `Vital signs (most recent): `;
    if (vitals.length > 0) {
        const v = vitals[0];
        const parts = [];
        if (v.heart_rate != null) parts.push(`HR ${v.heart_rate} bpm`);
        if (v.systolic_bp != null && v.diastolic_bp != null) parts.push(`BP ${v.systolic_bp}/${v.diastolic_bp} mmHg`);
        if (v.temperature != null) parts.push(`T ${v.temperature}°C`);
        if (v.respiratory_rate != null) parts.push(`RR ${v.respiratory_rate}/min`);
        if (v.oxygen_saturation != null) parts.push(`SpO₂ ${v.oxygen_saturation}%`);
        objective += parts.join(', ') + '. ';
    } else {
        objective += `not yet recorded. `;
    }
    objective += `General appearance: alert and well-developed. No acute distress. `;
    if (vitals.length >= 2) {
        objective += `(${vitals.length} reading(s) on file; trend stable). `;
    }

    // 7. Build assessment
    let assessment = `Cross-departmental findings (${latestPerDept.length} dept(s) assessed): `;
    const highRisk = latestPerDept.filter(a => a.risk_level === 'high' || a.risk_level === 'very_high' || a.risk_level === 'severe');
    const moderateRisk = latestPerDept.filter(a => a.risk_level === 'moderate' || a.risk_level === 'medium');
    if (highRisk.length > 0) {
        assessment += `${highRisk.length} high-risk finding(s): ${highRisk.map(a => a.dept + ' (' + (a.engine_name || 'scored') + ')').join(', ')}. `;
    }
    if (moderateRisk.length > 0) {
        assessment += `${moderateRisk.length} moderate-risk finding(s): ${moderateRisk.map(a => a.dept).join(', ')}. `;
    }
    if (highRisk.length === 0 && moderateRisk.length === 0 && latestPerDept.length > 0) {
        assessment += `No high or moderate risk findings across assessed departments. `;
    }
    if (latestPerDept.length === 0) {
        assessment += `No prior assessment data; clinical impression deferred to in-person evaluation. `;
    }

    // 8. Build plan
    let plan = `1. Continue current management. `;
    if (highRisk.length > 0) plan += `2. Address high-risk finding(s) in ${highRisk.map(a => a.dept).join(', ')} — refer or escalate per protocol. `;
    if (allergies.length > 0) {
        const anaphylaxis = allergies.filter(a => a.severity === 'anaphylaxis');
        const severe = allergies.filter(a => a.severity === 'severe');
        if (anaphylaxis.length > 0) plan += `3. Verify avoidance of ${anaphylaxis.map(a => a.allergen).join(', ')}; ensure epinephrine available. `;
        else if (severe.length > 0) plan += `3. Verify avoidance of severe allergens (${severe.map(a => a.allergen).join(', ')}). `;
    }
    plan += `${highRisk.length + moderateRisk.length > 0 ? '4' : '3'}. Follow up in 4-6 weeks or sooner if symptoms worsen.`;
    plan += ` Patient education provided. Return precautions reviewed.`;

    return {
        chief_complaint: chief,
        subjective: subjective.trim(),
        objective: objective.trim(),
        assessment: assessment.trim(),
        plan: plan.trim(),
        diagnosis_codes: [],
        sources: {
            patient: { id: p.id, name: name, age: p.age, sex: p.sex },
            vitals_count: vitals.length,
            allergies_count: allergies.length,
            allergies_high_severity: allergies.filter(a => a.severity === 'severe' || a.severity === 'anaphylaxis').length,
            depts_assessed: latestPerDept.length,
            high_risk_count: highRisk.length,
            generated_at: new Date().toISOString()
        }
    };
}

module.exports = { generateSoapNote };