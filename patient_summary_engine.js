// filepath: namaweb/patient_summary_engine.js
// Deterministic AI Patient Summary builder.
// Pulls cross-dept assessments + recent vitals + RAG hits, returns a structured summary.
// Server-side only — never logs PHI in plain text (audit_log used instead).
'use strict';

const db = require('./db_postgres');
const vectorStore = require('./ai/vector_store');

const RISK_BUCKETS = {
    very_high: 5,
    severe: 5,
    high: 4,
    moderate: 3,
    medium: 3,
    low: 2,
    minimal: 1,
    normal: 0
};

/**
 * Build a deterministic AI patient summary.
 *
 * @param {number} tenantId
 * @param {number} patientId
 * @param {object} [opts]
 * @param {string} [opts.query] - optional RAG query (e.g. "cardiac risk factors")
 * @returns {Promise<{summary: string, sources: object, stats: object}>}
 */
async function buildPatientSummary(tenantId, patientId, opts = {}) {
    const t0 = Date.now();
    const query = (opts.query || '').trim();

    // 1. Patient demographics
    const patientRes = await db.query(`
        SELECT id, name_en, name_ar, age, sex, dob, phone
        FROM patients
        WHERE id = $1 AND tenant_id = $2
    `, [patientId, tenantId]);

    if (patientRes.rows.length === 0) {
        return { summary: 'Patient not found.', sources: {}, stats: { ms: Date.now() - t0 } };
    }
    const p = patientRes.rows[0];

    // 2. Cross-dept assessments (last 100)
    const assessRes = await db.query(`
        SELECT 'family_medicine' as dept, id, engine_name, score, risk_level, created_at, NULL::text as details
        FROM family_medicine_assessments WHERE patient_id = $1 AND tenant_id = $2
        UNION ALL
        SELECT 'allergy', id, engine_name, score, risk_level, created_at, NULL
        FROM allergy_assessments WHERE patient_id = $1 AND tenant_id = $2
        UNION ALL
        SELECT 'cardiology', id, engine_name, score, risk_level, created_at, NULL
        FROM cardiology_assessments WHERE patient_id = $1 AND tenant_id = $2
        UNION ALL
        SELECT 'surgery', id, engine_name, score, risk_level, created_at, NULL
        FROM surgery_assessments WHERE patient_id = $1 AND tenant_id = $2
        UNION ALL
        SELECT 'oncology', id, engine_name, score, risk_level, created_at, NULL
        FROM oncology_assessments WHERE patient_id = $1 AND tenant_id = $2
        UNION ALL
        SELECT 'neurology', id, engine_name, score, risk_level, created_at, NULL
        FROM neurology_assessments WHERE patient_id = $1 AND tenant_id = $2
        UNION ALL
        SELECT 'dermatology', id, engine_name, score, risk_level, created_at, NULL
        FROM dermatology_assessments WHERE patient_id = $1 AND tenant_id = $2
        UNION ALL
        SELECT 'radiology', id, engine_name, score, risk_level, created_at, NULL
        FROM radiology_assessments WHERE patient_id = $1 AND tenant_id = $2
        UNION ALL
        SELECT 'psychiatry', id, engine_name, score, risk_level, created_at, NULL
        FROM psychiatry_assessments WHERE patient_id = $1 AND tenant_id = $2
        ORDER BY created_at DESC
        LIMIT 100
    `, [patientId, tenantId]);

    // 3. Latest vitals (last 20)
    const vitalsRes = await db.query(`
        SELECT heart_rate, systolic_bp, diastolic_bp, temperature, respiratory_rate, oxygen_saturation, recorded_at
        FROM vital_signs
        WHERE patient_id = $1 AND tenant_id = $2
        ORDER BY recorded_at DESC
        LIMIT 20
    `, [patientId, tenantId]);

    const assessments = assessRes.rows;
    const vitals = vitalsRes.rows;

    // 4. Aggregate risk
    const riskCounts = { high: 0, moderate: 0, low: 0, unknown: 0 };
    for (const a of assessments) {
        const lvl = (a.risk_level || 'unknown').toLowerCase();
        if (lvl === 'high' || lvl === 'very_high' || lvl === 'severe') riskCounts.high++;
        else if (lvl === 'moderate' || lvl === 'medium') riskCounts.moderate++;
        else if (lvl === 'low' || lvl === 'minimal' || lvl === 'normal') riskCounts.low++;
        else riskCounts.unknown++;
    }

    // 5. Compute latest vitals trends (vs first reading in window)
    const latestVitals = vitals[0] || {};
    const trend = {};
    if (vitals.length >= 2) {
        const first = vitals[vitals.length - 1];
        for (const key of ['heart_rate', 'systolic_bp', 'diastolic_bp', 'temperature', 'respiratory_rate', 'oxygen_saturation']) {
            if (latestVitals[key] != null && first[key] != null) {
                const delta = latestVitals[key] - first[key];
                trend[key] = { from: first[key], to: latestVitals[key], delta: +delta.toFixed(2) };
            }
        }
    }

    // 6. RAG hits (if query provided)
    let ragHits = [];
    if (query) {
        try {
            const emb = await vectorStore.embed(query);
            ragHits = await vectorStore.search(tenantId, emb, { k: 5, minSim: 0.5 });
        } catch (e) {
            // Fail-soft: if RAG unavailable, continue without hits
            ragHits = [];
        }
    }

    // 7. Build deterministic narrative summary
    const name = p.name_en || p.name_ar || `Patient ${p.id}`;
    const deptsTouched = [...new Set(assessments.map(a => a.dept))];

    let summary = `Patient ${name} (ID ${p.id}` +
        (p.age != null ? `, age ${p.age}` : '') +
        (p.sex ? `, ${p.sex}` : '') +
        ') has ' + assessments.length + ' assessment(s) across ' + deptsTouched.length + ' department(s). ';

    if (riskCounts.high > 0) {
        summary += `⚠️ ${riskCounts.high} high-risk finding(s) flagged. `;
    } else if (riskCounts.moderate > 0) {
        summary += `${riskCounts.moderate} moderate-risk finding(s). `;
    } else if (assessments.length > 0) {
        summary += `No high-risk findings. `;
    } else {
        summary += `No assessments recorded. `;
    }

    if (vitals.length > 0) {
        summary += `Latest vitals: `;
        const parts = [];
        if (latestVitals.heart_rate != null) parts.push(`HR ${latestVitals.heart_rate}`);
        if (latestVitals.systolic_bp != null && latestVitals.diastolic_bp != null) parts.push(`BP ${latestVitals.systolic_bp}/${latestVitals.diastolic_bp}`);
        if (latestVitals.temperature != null) parts.push(`T ${latestVitals.temperature}°C`);
        if (latestVitals.respiratory_rate != null) parts.push(`RR ${latestVitals.respiratory_rate}`);
        if (latestVitals.oxygen_saturation != null) parts.push(`SpO₂ ${latestVitals.oxygen_saturation}%`);
        summary += parts.join(', ') + '. ';
    }

    if (Object.keys(trend).length > 0) {
        summary += `Trends (oldest→newest): `;
        summary += Object.entries(trend).map(([k, v]) => {
            const arrow = v.delta > 0 ? '↑' : (v.delta < 0 ? '↓' : '→');
            return `${k.replace(/_/g, ' ')} ${v.from}→${v.to} ${arrow}`;
        }).join('; ') + '. ';
    }

    if (ragHits.length > 0) {
        summary += `Relevant guideline context: ${ragHits.length} hit(s) from RAG.`;
    }

    const ms = Date.now() - t0;

    return {
        summary: summary.trim(),
        sources: {
            patient: p,
            depts_touched: deptsTouched,
            recent_assessments: assessments.slice(0, 10),
            latest_vitals: latestVitals,
            vitals_trend: trend,
            rag_hits: ragHits.slice(0, 3).map(h => ({ doc_id: h.doc_id, similarity: +h.similarity.toFixed(3), text: (h.text || '').slice(0, 200) }))
        },
        stats: {
            source_count: assessments.length,
            high_risk_count: riskCounts.high,
            risk_distribution: riskCounts,
            vector_hits: ragHits.length,
            generation_ms: ms
        }
    };
}

module.exports = { buildPatientSummary };