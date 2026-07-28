<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Pure JS Engine (transplant_engine.js)

`js
'use strict';

// 1. KDPI
function kdpiScore(age, height, weight, ethnicity, htn, dm, cod, hcv, dcd, scr, cmv) {
  let s = 0;
  if (age >= 50) s += 20; else if (age >= 40) s += 10;
  if (height < 160) s += 5;
  if (weight > 90) s += 5;
  if (htn) s += 15;
  if (dm) s += 20;
  if (cod === 'CVA') s += 10;
  if (hcv) s += 5;
  if (dcd) s += 5;
  if (scr > 1.5) s += 5;
  if (cmv) s += 2;
  return { score: Math.min(s, 100), band: s < 35 ? 'high_quality' : s < 85 ? 'standard' : 'marginal' };
}

// 2. EPTS
function eptsScore(age, dialysisYears, diabetes, priorTransplant) {
  let s = 0;
  if (age >= 60) s += 40; else if (age >= 50) s += 25; else if (age >= 40) s += 10;
  if (dialysisYears >= 3) s += 20; else if (dialysisYears >= 1) s += 10;
  if (diabetes) s += 20;
  if (priorTransplant > 0) s += 10;
  return { score: Math.min(s, 100) };
}

// 3. cPRA
function praCalculation(hlaAntibodies, populationFrequencies) {
  let cpra = 0;
  for (const ab of hlaAntibodies) {
    if (ab.mfi > 8000) cpra += 5;
    else if (ab.mfi > 3000) cpra += 2;
    else if (ab.mfi > 1000) cpra += 1;
  }
  return { cpra_pct: Math.min(cpra, 100) };
}

// 4. Crossmatch
function crossmatchInterpretation(cdcT, cdcB, flowT, flowB, vXM, dsa) {
  if (cdcT === 'POS') return { decision: 'absolute_decline', absolute_block: true, reason: 'Positive CDC T-cell XM' };
  if (cdcB === 'POS' && dsa.length > 0) return { decision: 'absolute_decline', absolute_block: true };
  if (dsa.length > 0 && dsa.some(d => d.mfi > 8000)) return { decision: 'desensitize', absolute_block: false };
  if (flowT > 100) return { decision: 'caution', absolute_block: false };
  return { decision: 'proceed', absolute_block: false };
}

// 5. Trough adjuster
function immunosuppressionTroughAdjuster(drug, dose, trough, targetLow, targetHigh, scr) {
  // HARD BLOCK: trough >20 = toxic
  if (trough > 20) {
    return { block: true, action: 'escalate_to_physician', recommendation: 'HOLD dose + check Scr + refer to transplant nephrologist URGENTLY' };
  }
  let newDose = dose;
  let recommendation = 'Continue current dose';
  if (trough < targetLow) {
    newDose = dose * 1.25;
    recommendation = 'Increase dose by 25%, recheck in 3-5 days';
  } else if (trough > targetHigh) {
    newDose = dose * 0.75;
    recommendation = 'Decrease dose by 25%, recheck in 3-5 days';
  }
  return { block: false, newDose, recommendation, action: 'continue_monitoring' };
}

// 6. Banff grade
function banffGrade(light, immunofluorescence, sv40, c4d) {
  const t = light.ti || 0, i = light.i || 0, v = light.v || 0, g = light.g || 0, ptc = light.ptc || 0;
  const cg = immunofluorescence.cg || 0;
  const isAMR = (c4d > 0 || cg > 0) && ptc > 0;
  if (isAMR && g > 0) return { category: 'CAAMR' };
  if (v === 3) return { category: 'III' };
  if (v === 2) return { category: 'IIB' };
  if (v === 1) return { category: 'IIA' };
  if (i === 3) return { category: 'IB' };
  if (i === 1 || i === 2) return { category: 'IA' };
  if (t === 1 || t === 2 || i === 0) return { category: 'Borderline' };
  return { category: 'IA' };
}

// 7. Rejection risk
function rejectionRiskScore(dsaTrajectory, egfrSlope, bkPcr, cmvPcr, adherence) {
  let risk = 5; // baseline
  if (dsaTrajectory === 'rising') risk += 30;
  if (egfrSlope < -10) risk += 25;
  if (bkPcr > 10000) risk += 20;
  if (cmvPcr > 1000) risk += 10;
  if (adherence < 90) risk += 15;
  return { risk_30d_pct: Math.min(risk, 95) };
}

// 8. Infection prophylaxis
function infectionProphylaxisChecker(timePostTxDays, isRegimen, serostatus) {
  const proph = {};
  // CMV
  if (serostatus.cmv === 'D+/R-') proph.cmv_prophylaxis = 'valganciclovir_3mo';
  else if (serostatus.cmv === 'R+') proph.cmv_prophylaxis = 'valganciclovir_optional';
  // PCP
  proph.pcp_prophylaxis = timePostTxDays <= 180 ? 'tmp_smx_6mo' : 'stop';
  // HSV
  if (serostatus.hsv === 'R+') proph.hsv_prophylaxis = 'acyclovir_3mo';
  // BK
  proph.bk_monitoring = 'monthly_first_year';
  // EBV
  proph.ebv_monitoring = 'q3mo';
  return proph;
}

// 9. Donor-recipient match
function donorRecipientMatchScore(cpra, dsa, epts, bloodType, kdpi, hlaMM, ageDelta) {
  if (dsa.length > 0 && dsa.some(d => d.mfi > 8000)) return { recommendation: 'desensitize' };
  if (cpra > 80) return { recommendation: 'paired_exchange' };
  if (hlaMM > 4) return { recommendation: 'caution' };
  return { recommendation: 'proceed' };
}

// 10. Graft survival projection
function graftSurvivalProjection(donorType, donorAge, recipientAge, hlaMM, induction, dsa) {
  let baseSurvival = donorType === 'LRD' ? 95 : 90;
  if (donorAge > 60) baseSurvival -= 3;
  if (recipientAge > 65) baseSurvival -= 2;
  if (hlaMM > 4) baseSurvival -= 2;
  if (dsa.length > 0) baseSurvival -= 5;
  return { survival_1yr_pct: Math.max(baseSurvival, 70) };
}

module.exports = {
  kdpiScore, eptsScore, praCalculation, crossmatchInterpretation,
  immunosuppressionTroughAdjuster, banffGrade, rejectionRiskScore,
  infectionProphylaxisChecker, donorRecipientMatchScore, graftSurvivalProjection
};
`

---
*Section 20 of NEPH-002. L1 DRAFT.*