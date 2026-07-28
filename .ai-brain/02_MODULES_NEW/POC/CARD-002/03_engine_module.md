<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Pure JS Engine Module (cath_lab_engine.js)

## File: 
amaweb/cath_lab_engine.js (NEW, consolidates + extends existing)

`js
'use strict';

// 1. D2B
function calculateD2BTime(doorTime, balloonTime) {
  const d = new Date(doorTime), b = new Date(balloonTime);
  const min = Math.round((b - d) / 60000);
  return {
    minutes: min,
    compliant: min <= 90,
    band: min <= 60 ? 'optimal' : min <= 90 ? 'compliant' : min <= 120 ? 'borderline' : 'non_compliant',
    exception: min > 90 ? 'required' : 'not_required'
  };
}

// 2. SYNTAX
function syntaxScore(lesions) {
  let total = 0;
  for (const l of lesions) {
    let s = 0;
    if (l.stenosis >= 50 && l.stenosis < 70) s = 1;
    else if (l.stenosis >= 70 && l.stenosis < 90) s = 1;
    else if (l.stenosis >= 90) s = 2;
    if (l.total_occlusion) s *= 2;
    if (l.bifurcation) s += 1;
    if (l.calcification) s += 1;
    total += s;
  }
  return {
    score: Math.min(total, 65),
    band: total <= 22 ? 'low' : total <= 32 ? 'intermediate' : 'high'
  };
}

// 3. GRACE
function graceScore(age, hr, sbp, cr, killip, stDev, cardiacArrest) {
  let score = 0;
  score += Math.min(Math.floor(age / 10) * 10, 100);
  if (hr < 50) score += 0; else if (hr < 70) score += 3; else if (hr < 90) score += 9; else if (hr < 110) score += 15; else score += 24;
  if (sbp < 80) score += 58; else if (sbp < 100) score += 46; else if (sbp < 120) score += 34; else if (sbp < 140) score += 23; else if (sbp < 160) score += 13; else score += 0;
  score += Math.min(Math.floor(cr * 10) * 4, 28);
  score += killip * 20;
  if (stDev) score += 28;
  if (cardiacArrest) score += 43;
  return {
    score,
    in_hospital_mortality: score < 109 ? '<1%' : score < 140 ? '1-3%' : score < 170 ? '3-7%' : '≥7%'
  };
}

// 4. TIMI STEMI
function timiScoreStemi(p) {
  let s = 0;
  if (p.age >= 75) s += 3; else if (p.age >= 65) s += 2;
  if (p.dm) s += 1;
  if (p.htn) s += 1;
  if (p.angina) s += 1;
  if (p.sbp_lt_100) s += 3;
  if (p.hr_gt_100) s += 2;
  if (p.killip2to3) s += 2;
  if (p.weight_lt_67) s += 1;
  if (p.anteriorMI || p.lbbb) s += 1;
  if (p.time_to_tx_gt_4h) s += 1;
  return { score: Math.min(s, 14) };
}

// 5. CIN
function assessCINRisk(eGFR, contrastVolumeMl, age, diabetes) {
  let risk = 0;
  if (eGFR < 30) risk += 3; else if (eGFR < 45) risk += 2; else if (eGFR < 60) risk += 1;
  if (contrastVolumeMl > 3 * eGFR) risk += 3;
  if (age > 75) risk += 1;
  if (diabetes) risk += 1;
  return { score: risk, band: risk >= 4 ? 'high' : risk >= 2 ? 'moderate' : 'low' };
}

// 6. ACT
function actTargetCheck(current, targetLow = 250, targetHigh = 300) {
  return current >= targetLow && current <= targetHigh;
}

// 7. Sheath removal
function sheathRemovalChecklist(act, bpStable, hematomaChecked, distalPulseChecked) {
  return {
    ok: act < 180 && bpStable && hematomaChecked && distalPulseChecked,
    details: { act_ok: act < 180, bp_ok: bpStable, hematoma_checked: hematomaChecked, distal_pulse_ok: distalPulseChecked }
  };
}

// 8. Contrast limit
function contrastLimit(eGFR, weight) {
  const max = Math.min(3 * eGFR, 400);
  return { maxMl: max, weight_adjusted: max / weight };
}

// 9. Radiation dose alert
function radiationDoseAlert(fluoroMin, dapGyCm2, kermaMgy) {
  const alerts = [];
  if (fluoroMin > 60) alerts.push('fluoro_time_high');
  if (dapGyCm2 > 500) alerts.push('dap_high');
  if (kermaMgy > 5000) alerts.push('kerma_high');
  return { alert: alerts.length > 0, alerts, severity: alerts.length >= 2 ? 'high' : alerts.length === 1 ? 'moderate' : 'low' };
}

// 10. Stent pressure
function stentExpansionPressure(pressureAtm) {
  if (pressureAtm >= 14 && pressureAtm <= 20) return 'optimal';
  if (pressureAtm < 14) return 'under-expanded';
  return 'over-expanded';
}

module.exports = {
  calculateD2BTime, syntaxScore, graceScore, timiScoreStemi, assessCINRisk,
  actTargetCheck, sheathRemovalChecklist, contrastLimit,
  radiationDoseAlert, stentExpansionPressure
};
`

---
*Section 20 of CARD-002. SA voice. L1 DRAFT.*