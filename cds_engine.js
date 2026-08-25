// filepath: namaweb/cds_engine.js
// Clinical Decision Support (CDS) alerts engine.
// Deterministic, multi-domain: drug-allergy, drug-interaction, drug-lab,
// sepsis early warning (qSOFA), AKI (creatinine trend), electrolyte crises.
// Server-side only. Triggers alerts stored in cds_alerts table.
'use strict';

const db = require('./db_postgres');
const drugEngine = require('./drug_interaction_engine');

const ENGINE_VERSION = '1.0.0';

// ============================================================
// Rule helpers
// ============================================================
function normalizeDrug(name) {
    return (name || '').toLowerCase().trim();
}

// Drug classes for cross-sensitivity (e.g. penicillin allergy -> avoid all beta-lactams)
const DRUG_CLASSES = {
    'penicillin': ['penicillin', 'amoxicillin', 'ampicillin', 'piperacillin', 'nafcillin', 'oxacillin'],
    'cephalosporin': ['cephalexin', 'cefuroxime', 'ceftriaxone', 'cefepime', 'ceftazidime', 'cefazolin'],
    'beta_lactam': ['penicillin', 'amoxicillin', 'ampicillin', 'piperacillin', 'cephalexin', 'ceftriaxone', 'cefepime', 'meropenem', 'imipenem', 'ertapenem'],
    'nsaid': ['ibuprofen', 'naproxen', 'diclofenac', 'indomethacin', 'ketorolac', 'meloxicam', 'celecoxib', 'aspirin'],
    'sulfa': ['sulfamethoxazole', 'trimethoprim', 'sulfasalazine', 'furosemide', 'hydrochlorothiazide'],
    'opioid': ['morphine', 'oxycodone', 'hydrocodone', 'fentanyl', 'tramadol', 'codeine', 'hydromorphone']
};

function classifyDrug(name) {
    const n = normalizeDrug(name);
    for (const [cls, members] of Object.entries(DRUG_CLASSES)) {
        if (members.some(m => n.includes(m) || m.includes(n))) return cls;
    }
    return null;
}

function drugsOverlap(a, b) {
    const na = normalizeDrug(a), nb = normalizeDrug(b);
    if (!na || !nb) return false;
    if (na === nb) return true;
    if (na.includes(nb) || nb.includes(na)) return true;
    return false;
}

function drugsShareClass(a, b) {
    const ca = classifyDrug(a), cb = classifyDrug(b);
    return ca && cb && ca === cb;
}

// ============================================================
// Alert persistence
// ============================================================
async function saveAlert(tenantId, patientId, alertType, severity, title, message, details, triggeredBy, triggeredData) {
    const dedupeKey = `${alertType}:${severity}:${title}`;
    // Don't duplicate active alert with same key in last 24h
    const existing = await db.query(`
        SELECT id FROM cds_alerts
        WHERE tenant_id = $1 AND patient_id = $2
          AND alert_type = $3 AND severity = $4 AND title = $5
          AND status = 'active' AND created_at >= NOW() - INTERVAL '24 hours'
        LIMIT 1
    `, [tenantId, patientId, alertType, severity, title]);
    if (existing.rows.length > 0) {
        return { ok: true, deduplicated: true, id: existing.rows[0].id };
    }
    const result = await db.query(`
        INSERT INTO cds_alerts
            (tenant_id, patient_id, alert_type, severity, title, message, details, triggered_by, triggered_data)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
    `, [tenantId, patientId, alertType, severity, title, message,
        JSON.stringify(details || {}), triggeredBy || `cds_engine@${ENGINE_VERSION}`,
        JSON.stringify(triggeredData || {})]);
    return { ok: true, deduplicated: false, id: result.rows[0].id };
}

// ============================================================
// Rule 1: Drug-Allergy check
// ============================================================
async function checkDrugAllergy(tenantId, patientId, drugs) {
    const alerts = [];
    const allergiesRes = await db.query(`
        SELECT allergen, allergen_type, reaction, severity
        FROM allergies
        WHERE patient_id = $1 AND tenant_id = $2 AND active = TRUE
          AND allergen_type IN ('drug', 'other')
    `, [patientId, tenantId]);
    const allergies = allergiesRes.rows;
    if (allergies.length === 0) return alerts;

    for (const allergy of allergies) {
        for (const drug of drugs) {
            const directMatch = drugsOverlap(allergy.allergen, drug);
            const classMatch = drugsShareClass(allergy.allergen, drug);
            if (directMatch || classMatch) {
                const isAnaphylaxis = allergy.severity === 'anaphylaxis';
                const severity = isAnaphylaxis ? 'critical' : (allergy.severity === 'severe' ? 'high' : 'moderate');
                const title = `${isAnaphylaxis ? '🚨 CONTRAINDICATED' : '⚠️ Allergy Alert'}: ${drug} vs documented ${allergy.allergen} allergy`;
                const message = `Patient has documented ${allergy.severity} allergy to ${allergy.allergen}` +
                    (allergy.reaction ? ` (reaction: ${allergy.reaction})` : '') +
                    `. Prescribing ${drug} is ${directMatch ? 'a direct match' : 'cross-reactive (same drug class)'}.`;
                const alert = await saveAlert(tenantId, patientId, 'drug_allergy', severity, title, message,
                    { allergy, drug, match_type: directMatch ? 'direct' : 'class' },
                    `cds_engine@${ENGINE_VERSION}`, { drugs, allergies });
                alerts.push({ ...alert, alert_type: 'drug_allergy', severity, title, message });
            }
        }
    }
    return alerts;
}

// ============================================================
// Rule 2: Drug-Drug interactions
// ============================================================
async function checkDrugInteractions(tenantId, patientId, drugs) {
    const alerts = [];
    if (!drugs || drugs.length < 2) return alerts;
    const interactions = drugEngine.checkInteractions(drugs);
    for (const ix of interactions) {
        const sev = ix.severity === 'contraindicated' ? 'critical' : ix.severity;
        const title = `Drug interaction: ${ix.drug_a} + ${ix.drug_b} (${sev})`;
        const message = `${ix.mechanism}. ${ix.recommendation}`;
        const alert = await saveAlert(tenantId, patientId, 'drug_interaction', sev, title, message,
            { drug_a: ix.drug_a, drug_b: ix.drug_b, mechanism: ix.mechanism, recommendation: ix.recommendation },
            `cds_engine@${ENGINE_VERSION}`, { drugs });
        alerts.push({ ...alert, alert_type: 'drug_interaction', severity: sev, title, message });
    }
    return alerts;
}

// ============================================================
// Rule 3: Drug-Lab interactions (e.g. nephrotoxic drug + rising creatinine)
// ============================================================
const NEPHROTOXIC = ['ibuprofen', 'naproxen', 'gentamicin', 'vancomycin', 'amikacin', 'furosemide', 'lithium', 'metformin'];
const HYPERKALEMIA_CAUSING = ['spironolactone', 'lisinopril', 'enalapril', 'losartan', 'potassium', 'triamterene', 'amiloride'];
const HYPOGLYCEMIA_CAUSING = ['insulin', 'glipizide', 'glyburide', 'glimepiride', 'metformin'];

async function checkDrugLab(tenantId, patientId, drugs) {
    const alerts = [];
    if (!drugs || drugs.length === 0) return alerts;

    // Pull latest relevant labs (last 30 days)
    const labsRes = await db.query(`
        SELECT test_name, value, unit, ref_low, ref_high, abnormal_flag, is_critical, reported_at
        FROM lab_results
        WHERE tenant_id = $1 AND patient_id = $2
          AND LOWER(test_name) IN ('creatinine', 'potassium', 'glucose', 'egfr', 'inr')
          AND reported_at >= NOW() - INTERVAL '30 days'
        ORDER BY reported_at DESC
        LIMIT 30
    `, [tenantId, patientId]);
    const labs = labsRes.rows;

    const latestCr = labs.find(l => l.test_name.toLowerCase() === 'creatinine');
    const latestK = labs.find(l => l.test_name.toLowerCase() === 'potassium');
    const latestGlu = labs.find(l => l.test_name.toLowerCase() === 'glucose');

    for (const drug of drugs) {
        const dn = normalizeDrug(drug);
        // Nephrotoxic + elevated creatinine
        if (NEPHROTOXIC.some(n => dn.includes(n)) && latestCr) {
            const crVal = parseFloat(latestCr.value);
            if (Number.isFinite(crVal) && (latestCr.ref_high && crVal > parseFloat(latestCr.ref_high))) {
                const title = `Nephrotoxic drug + elevated creatinine: ${drug} (Cr ${latestCr.value} ${latestCr.unit})`;
                const message = `${drug} is nephrotoxic. Patient's creatinine is ${latestCr.value} ${latestCr.unit} (ref <${latestCr.ref_high}). Consider dose adjustment or alternative.`;
                const alert = await saveAlert(tenantId, patientId, 'drug_lab', 'high', title, message,
                    { drug, lab: latestCr }, `cds_engine@${ENGINE_VERSION}`, { drugs, labs });
                alerts.push({ ...alert, alert_type: 'drug_lab', severity: 'high', title, message });
            }
        }
        // Hyperkalemia-causing + K+ > 5.5
        if (HYPERKALEMIA_CAUSING.some(n => dn.includes(n)) && latestK) {
            const kVal = parseFloat(latestK.value);
            if (Number.isFinite(kVal) && kVal > 5.5) {
                const title = `🚨 Hyperkalemia risk: ${drug} + K+ ${latestK.value} ${latestK.unit}`;
                const message = `${drug} can elevate potassium. Patient's K+ is critically elevated at ${latestK.value} ${latestK.unit}. Consider holding drug and urgent management.`;
                const alert = await saveAlert(tenantId, patientId, 'drug_lab', 'critical', title, message,
                    { drug, lab: latestK }, `cds_engine@${ENGINE_VERSION}`, { drugs, labs });
                alerts.push({ ...alert, alert_type: 'drug_lab', severity: 'critical', title, message });
            }
        }
        // Hypoglycemia-causing + glucose < 70
        if (HYPOGLYCEMIA_CAUSING.some(n => dn.includes(n)) && latestGlu) {
            const gVal = parseFloat(latestGlu.value);
            if (Number.isFinite(gVal) && gVal < 70) {
                const title = `Hypoglycemia risk: ${drug} + glucose ${latestGlu.value}`;
                const message = `${drug} may cause hypoglycemia. Patient's glucose is ${latestGlu.value}. Consider holding or reducing dose, give carbohydrates if symptomatic.`;
                const alert = await saveAlert(tenantId, patientId, 'drug_lab', 'high', title, message,
                    { drug, lab: latestGlu }, `cds_engine@${ENGINE_VERSION}`, { drugs, labs });
                alerts.push({ ...alert, alert_type: 'drug_lab', severity: 'high', title, message });
            }
        }
    }
    return alerts;
}

// ============================================================
// Rule 4: Sepsis Early Warning (qSOFA)
// qSOFA: altered mental status (GCS <15), RR >=22, SBP <=100. Score >=2 = high risk.
// ============================================================
async function checkSepsis(tenantId, patientId) {
    const vitalsRes = await db.query(`
        SELECT heart_rate, systolic_bp, diastolic_bp, respiratory_rate, oxygen_saturation, temperature, recorded_at
        FROM vital_signs
        WHERE patient_id = $1 AND tenant_id = $2
        ORDER BY recorded_at DESC
        LIMIT 1
    `, [patientId, tenantId]);
    const v = vitalsRes.rows[0];
    if (!v) return [];

    let score = 0;
    const factors = [];
    if (v.respiratory_rate != null && v.respiratory_rate >= 22) {
        score++;
        factors.push(`RR ${v.respiratory_rate} ≥22`);
    }
    if (v.systolic_bp != null && v.systolic_bp <= 100) {
        score++;
        factors.push(`SBP ${v.systolic_bp} ≤100`);
    }
    // AMS proxy: not directly available; flag if SpO2 <90 (severe hypoxia)
    if (v.oxygen_saturation != null && parseFloat(v.oxygen_saturation) < 90) {
        score++;
        factors.push(`SpO₂ ${v.oxygen_saturation}% <90 (proxy for AMS)`);
    }
    if (score < 2) return [];

    const title = `🚨 qSOFA Score ${score} — Possible Sepsis`;
    const message = `qSOFA criteria met (≥2): ${factors.join(', ')}. Initiate sepsis bundle per protocol: lactate, blood cultures, broad-spectrum antibiotics, IV fluids, vasopressors if needed.`;
    const alert = await saveAlert(tenantId, patientId, 'sepsis', score >= 3 ? 'critical' : 'high', title, message,
        { qsofa_score: score, factors, vitals: v }, `cds_engine@${ENGINE_VERSION}`, {});
    return [{ ...alert, alert_type: 'sepsis', severity: score >= 3 ? 'critical' : 'high', title, message }];
}

// ============================================================
// Rule 5: AKI (Acute Kidney Injury) - creatinine rising
// AKIN criteria: Cr increase ≥0.3 mg/dL within 48h, or ≥1.5x baseline within 7 days
// ============================================================
async function checkAKI(tenantId, patientId) {
    const alerts = [];
    const crRes = await db.query(`
        SELECT value, unit, ref_low, ref_high, abnormal_flag, reported_at
        FROM lab_results
        WHERE tenant_id = $1 AND patient_id = $2 AND LOWER(test_name) = 'creatinine'
        ORDER BY reported_at DESC
        LIMIT 20
    `, [tenantId, patientId]);
    const crs = crRes.rows;
    if (crs.length < 2) return alerts;

    const latest = crs[0];
    const latestVal = parseFloat(latest.value);
    if (!Number.isFinite(latestVal)) return alerts;

    // Find most recent creatinine within 48h
    const cutoff48 = new Date(Date.now() - 48 * 3600 * 1000);
    const recent48 = crs.find(c => new Date(c.reported_at) >= cutoff48);
    const baseline7d = crs.find(c => new Date(c.reported_at) <= new Date(Date.now() - 7 * 86400 * 1000)) || crs[crs.length - 1];
    const baseline7dVal = parseFloat(baseline7d.value);

    let akiStage = 0;
    const factors = [];

    if (recent48) {
        const recent48Val = parseFloat(recent48.value);
        if (Number.isFinite(recent48Val) && latestVal - recent48Val >= 0.3) {
            akiStage = Math.max(akiStage, 1);
            factors.push(`ΔCr +${(latestVal - recent48Val).toFixed(2)} in 48h`);
        }
    }
    if (Number.isFinite(baseline7dVal) && baseline7dVal > 0 && latestVal / baseline7dVal >= 1.5) {
        akiStage = Math.max(akiStage, 1);
        factors.push(`Cr ×${(latestVal / baseline7dVal).toFixed(2)} baseline`);
    }
    if (Number.isFinite(baseline7dVal) && baseline7dVal > 0 && latestVal / baseline7dVal >= 2.0) {
        akiStage = Math.max(akiStage, 2);
        factors.push(`Cr ×${(latestVal / baseline7dVal).toFixed(2)} baseline (severe)`);
    }
    if (Number.isFinite(latestVal) && latestVal >= 4.0) {
        akiStage = Math.max(akiStage, 3);
        factors.push(`Cr ${latestVal} ≥4.0`);
    }

    if (akiStage === 0) return alerts;

    const title = `AKI Stage ${akiStage}: Cr ${latestVal} ${latest.unit}`;
    const message = `Acute kidney injury suspected. ${factors.join('; ')}. Consider holding nephrotoxic drugs, fluid status review, nephrology consult.`;
    const sev = akiStage >= 2 ? 'critical' : 'high';
    const alert = await saveAlert(tenantId, patientId, 'aki', sev, title, message,
        { aki_stage: akiStage, factors, latest_creatinine: latest }, `cds_engine@${ENGINE_VERSION}`, {});
    alerts.push({ ...alert, alert_type: 'aki', severity: sev, title, message });
    return alerts;
}

// ============================================================
// Master: evaluate patient across all rules
// ============================================================
async function evaluatePatient(tenantId, patientId, opts = {}) {
    const drugs = Array.isArray(opts.drugs) ? opts.drugs : [];
    const t0 = Date.now();
    const allAlerts = [];

    // Always-on rules (no drugs needed)
    allAlerts.push(...await checkSepsis(tenantId, patientId));
    allAlerts.push(...await checkAKI(tenantId, patientId));

    // Drug-context rules
    if (drugs.length > 0) {
        allAlerts.push(...await checkDrugAllergy(tenantId, patientId, drugs));
        allAlerts.push(...await checkDrugInteractions(tenantId, patientId, drugs));
        allAlerts.push(...await checkDrugLab(tenantId, patientId, drugs));
    }

    return {
        ok: true,
        patient_id: patientId,
        drugs_evaluated: drugs.length,
        alerts_generated: allAlerts.length,
        alerts: allAlerts,
        critical_count: allAlerts.filter(a => a.severity === 'critical').length,
        high_count: allAlerts.filter(a => a.severity === 'high').length,
        generation_ms: Date.now() - t0
    };
}

module.exports = {
    ENGINE_VERSION,
    evaluatePatient,
    checkDrugAllergy,
    checkDrugInteractions,
    checkDrugLab,
    checkSepsis,
    checkAKI,
    saveAlert
};