// filepath: namaweb/discharge_summary_engine.js
// Deterministic discharge summary generator.
// Server-side. Pulls: demographics + allergies + cross-dept assessments + recent vitals + labs + SOAP notes.
'use strict';

const db = require('./db_postgres');

async function generateDischargeSummary(tenantId, patientId, opts = {}) {
    const patientRes = await db.query(`
        SELECT id, name_en, name_ar, age, sex, dob, phone
        FROM patients WHERE id = $1 AND tenant_id = $2
    `, [patientId, tenantId]);
    if (patientRes.rows.length === 0) return { error: 'patient_not_found' };
    const p = patientRes.rows[0];
    const name = p.name_en || p.name_ar || `Patient ${p.id}`;

    // Active allergies
    const allergiesRes = await db.query(`
        SELECT allergen, allergen_type, reaction, severity
        FROM allergies WHERE patient_id = $1 AND tenant_id = $2 AND active = TRUE
        ORDER BY CASE severity WHEN 'anaphylaxis' THEN 1 WHEN 'severe' THEN 2 ELSE 3 END
    `, [patientId, tenantId]);
    const allergies = allergiesRes.rows;

    // Recent vitals (last 3)
    const vitalsRes = await db.query(`
        SELECT heart_rate, systolic_bp, diastolic_bp, temperature, respiratory_rate, oxygen_saturation, recorded_at
        FROM vital_signs WHERE patient_id = $1 AND tenant_id = $2
        ORDER BY recorded_at DESC LIMIT 3
    `, [patientId, tenantId]);
    const vitals = vitalsRes.rows;

    // Recent abnormal labs (last 14 days)
    const labsRes = await db.query(`
        SELECT test_name, value, unit, abnormal_flag, is_critical, reported_at
        FROM lab_results WHERE patient_id = $1 AND tenant_id = $2
          AND reported_at >= NOW() - INTERVAL '14 days'
          AND (abnormal_flag IN ('L','H','LL','HH','A') OR is_critical = 1)
        ORDER BY reported_at DESC LIMIT 30
    `, [patientId, tenantId]);
    const labs = labsRes.rows;

    // Latest assessment per dept
    const assessRes = await db.query(`
        WITH ranked AS (
            SELECT 'family_medicine' as dept, engine_name, score, risk_level, created_at,
                ROW_NUMBER() OVER (PARTITION BY 'family_medicine' ORDER BY created_at DESC) rn
            FROM family_medicine_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'cardiology', engine_name, score, risk_level, created_at,
                ROW_NUMBER() OVER (PARTITION BY 'cardiology' ORDER BY created_at DESC)
            FROM cardiology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'neurology', engine_name, score, risk_level, created_at,
                ROW_NUMBER() OVER (PARTITION BY 'neurology' ORDER BY created_at DESC)
            FROM neurology_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'surgery', engine_name, score, risk_level, created_at,
                ROW_NUMBER() OVER (PARTITION BY 'surgery' ORDER BY created_at DESC)
            FROM surgery_assessments WHERE patient_id = $1 AND tenant_id = $2
            UNION ALL
            SELECT 'oncology', engine_name, score, risk_level, created_at,
                ROW_NUMBER() OVER (PARTITION BY 'oncology' ORDER BY created_at DESC)
            FROM oncology_assessments WHERE patient_id = $1 AND tenant_id = $2
        )
        SELECT dept, engine_name, score, risk_level, created_at
        FROM ranked WHERE rn = 1 ORDER BY created_at DESC
    `, [patientId, tenantId]);
    const depts = assessRes.rows;

    // Recent SOAP notes
    const soapRes = await db.query(`
        SELECT chief_complaint, diagnosis_codes, signed_at, created_at
        FROM soap_notes WHERE patient_id = $1 AND tenant_id = $2
        ORDER BY created_at DESC LIMIT 5
    `, [patientId, tenantId]);
    const soaps = soapRes.rows;

    // Build narrative sections
    const today = new Date().toISOString().slice(0, 10);

    // Hospital course
    let course = `${name} (${p.age ? 'age ' + p.age : 'age n/a'}${p.sex ? ', ' + p.sex : ''}) `;
    course += `was admitted and evaluated across ${depts.length} department(s). `;
    if (depts.length > 0) {
        const highRisk = depts.filter(d => d.risk_level === 'high' || d.risk_level === 'very_high' || d.risk_level === 'severe');
        if (highRisk.length > 0) {
            course += `Notable findings in: ${highRisk.map(d => d.dept + ' (' + d.engine_name + ')').join(', ')}. `;
        }
        course += `Clinical course monitored and treated accordingly. `;
    } else {
        course += `No specific departmental assessments on file. `;
    }
    if (vitals.length > 0) {
        const v = vitals[0];
        const parts = [];
        if (v.heart_rate != null) parts.push(`HR ${v.heart_rate}`);
        if (v.systolic_bp != null && v.diastolic_bp != null) parts.push(`BP ${v.systolic_bp}/${v.diastolic_bp}`);
        if (v.temperature != null) parts.push(`T ${v.temperature}°C`);
        if (v.respiratory_rate != null) parts.push(`RR ${v.respiratory_rate}`);
        if (v.oxygen_saturation != null) parts.push(`SpO₂ ${v.oxygen_saturation}%`);
        course += `Vital signs at discharge: ${parts.join(', ')}. `;
    }

    // Discharge medications (empty — provider fills)
    const dischargeMeds = [];

    // Patient instructions
    let instructions = 'Activity: Resume normal activity as tolerated. Avoid strenuous activity for 1-2 weeks.\n';
    instructions += 'Diet: Return to regular diet unless otherwise specified. Adequate hydration.\n';
    instructions += 'Wound care: Keep surgical sites clean and dry. Monitor for signs of infection (redness, swelling, drainage, fever).\n';
    if (allergies.length > 0) {
        instructions += `⚠️ Allergies: ${allergies.map(a => a.allergen + ' (' + a.severity + ')').join('; ')}. Avoid these substances. Inform all healthcare providers.\n`;
    }
    if (labs.length > 0) {
        instructions += `Pending labs: ${labs.length} abnormal lab(s) requiring follow-up. See follow-up plan below.\n`;
    }
    instructions += '\nReturn to emergency department immediately if: chest pain, shortness of breath, severe bleeding, high fever (>39°C), altered consciousness, or other acute symptoms.';

    // Follow-up plan
    let followUp = '1. Follow up with primary care physician within 7-14 days.\n';
    followUp += '2. Bring all current medications to follow-up appointment.\n';
    if (depts.some(d => d.risk_level === 'high' || d.risk_level === 'very_high' || d.risk_level === 'severe')) {
        followUp += `3. Specialty follow-up required: ${depts.filter(d => d.risk_level === 'high' || d.risk_level === 'very_high').map(d => d.dept).join(', ')}.\n`;
    }
    if (labs.some(l => l.test_name === 'creatinine' || l.test_name === 'potassium' || l.test_name === 'glucose')) {
        followUp += '4. Repeat laboratory studies in 1-2 weeks for renal function, electrolytes, glucose as applicable.\n';
    }
    followUp += '\nContact clinic for questions or worsening symptoms. Use emergency services for life-threatening issues.';

    // Pending results
    let pending = '';
    if (labs.length > 0) {
        pending = labs.slice(0, 10).map(l => `- ${l.test_name}: ${l.value} ${l.unit || ''} (${l.abnormal_flag || 'flagged'}) on ${new Date(l.reported_at).toLocaleDateString()}`).join('\n');
    } else {
        pending = 'No outstanding lab results.';
    }

    // Diet/activity restrictions
    let restrictions = 'Activity: As tolerated; no heavy lifting (>5 kg) for 2 weeks if surgery was performed.';
    restrictions += '\nDiet: No specific restrictions unless specified (e.g., diabetic diet, low-sodium, cardiac diet).';
    if (allergies.some(a => a.allergen_type === 'food')) {
        restrictions += `\nFood allergies: ${allergies.filter(a => a.allergen_type === 'food').map(a => a.allergen).join(', ')}.`;
    }

    return {
        patient: p,
        discharge_date: today,
        diagnosis_primary: opts.diagnosis_primary || (soaps[0]?.chief_complaint || ''),
        diagnosis_secondary: soaps.flatMap(s => Array.isArray(s.diagnosis_codes) ? s.diagnosis_codes : []).slice(0, 10),
        procedures: [],
        hospital_course: course.trim(),
        discharge_medications: dischargeMeds,
        follow_up: followUp.trim(),
        patient_instructions: instructions.trim(),
        diet_activity_restrictions: restrictions.trim(),
        pending_results: pending.trim(),
        sources: {
            depts_assessed: depts.length,
            high_risk_count: depts.filter(d => d.risk_level === 'high' || d.risk_level === 'very_high').length,
            allergies_count: allergies.length,
            labs_abnormal_14d: labs.length,
            soap_notes: soaps.length,
            vitals_at_discharge: vitals.length > 0,
            generated_at: new Date().toISOString()
        }
    };
}

module.exports = { generateDischargeSummary };