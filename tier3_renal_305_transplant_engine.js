/**
 * TIER3_RENAL-305 Renal Transplant Engine
 * KDPI + EPTS + immunological risk + rejection detection + immunosuppression monitoring + SCOT linkage
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDIGO_TX: 'KDIGO Transplant 2020', SCOT: 'Saudi Center for Organ Transplant' };

function donorKDPI(input) {
  const { age, height_cm, weight_kg, ethnicity, htn, dm, cva_cause, serum_creatinine, hcv, dcd } = input;
  const score = (age >= 60 ? 50 : age * 0.5)
    + (htn ? 5 : 0)
    + (dm ? 8 : 0)
    + (cva_cause === 'cva' ? 10 : 0)
    + (creatinine > 1.5 ? 5 : 0)
    + (hcv ? 8 : 0)
    + (dcd ? 5 : 0)
    + (weight_kg / height_cm < 0.02 ? 4 : 0);
  return {
    kdpi_pct: Math.min(100, Math.round(score)),
    quality: score < 35 ? 'high' : score < 85 ? 'medium' : 'low',
    citation: CITATIONS.KDIGO_TX,
  };
}

function recipientEPTS(input) {
  const { age, dialysis_years, prior_organ_transplant, diabetes } = input;
  const score = (age < 30 ? 1 : age >= 60 ? 3 : 2) + (dialysis_years || 0) + (prior_organ_transplant ? 2 : 0) + (diabetes ? 1 : 0);
  return {
    epts: Math.round(score * 10) / 10,
    longevity: score <= 2 ? 'high' : score <= 4 ? 'medium' : 'low',
    citation: CITATIONS.KDIGO_TX,
  };
}

function immunologicalRisk(input) {
  const { pra_pct, donor_specific_antibody, abo_compatible, hla_mismatch } = input;
  let risk = 'low';
  if (pra_pct > 80 || donor_specific_antibody) risk = 'high';
  else if (pra_pct > 20 || hla_mismatch > 4) risk = 'moderate';
  return {
    risk_level: risk,
    desensitization_needed: pra_pct > 50 || donor_specific_antibody,
    abo_incompatible: !abo_compatible,
    induction_immunosuppression: risk === 'high' ? 'ATG_or_rituximab_high_dose' : 'basiliximab_standard',
  };
}

function rejectionDetection(input) {
  const { creatinine_baseline, creatinine_current, donor_specific_antibody_new, donor_specific_antibody_pre, days_post_transplant, fever, tenderness } = input;
  const ratio = creatinine_current / creatinine_baseline;
  const new_dsa = donor_specific_antibody_new && !donor_specific_antibody_pre;
  let type = 'no_rejection';
  if (ratio >= 1.5 && days_post_transplant < 90) type = 'acute_rejection_suspected';
  else if (ratio >= 1.3 && days_post_transplant < 365) type = 'subacute_suspicion';
  else if (new_dsa) type = 'chronic_antibody_rejection_suspected';
  return { type, recommended_action: type === 'no_rejection' ? 'monitor' : 'biopsy_to_confirm', biopsy_indicated: type !== 'no_rejection' };
}

function immunosuppressionMonitoring(input) {
  const { drug, level, time_post_transplant } = input;
  const targets = {
    Tacrolimus: time_post_transplant < 90 ? { low: 8, high: 12 } : time_post_transplant < 365 ? { low: 6, high: 10 } : { low: 4, high: 8 },
    Cyclosporine: time_post_transplant < 90 ? { low: 150, high: 250 } : { low: 100, high: 200 },
    Sirolimus: { low: 5, high: 10 },
    MMF: { low: 1.5, high: 4.0 },
  };
  const target = targets[drug];
  return {
    drug,
    level,
    in_range: target ? level >= target.low && level <= target.high : false,
    adjustment: target ? (level < target.low ? 'increase_dose' : level > target.high ? 'decrease_dose' : 'maintain') : 'unknown_drug',
    citation: CITATIONS.KDIGO_TX,
  };
}

function scotLinkage(input) {
  const { scot_id, donor_id, recipient_id } = input;
  return {
    scot_id,
    donor_id,
    recipient_id,
    registration_status: 'PENDING',  // production: actual SCOT API
    cit_action: 'verify_in_scot_portal',
    citation: CITATIONS.SCOT,
  };
}

module.exports = { donorKDPI, recipientEPTS, immunologicalRisk, rejectionDetection, immunosuppressionMonitoring, scotLinkage, CITATIONS, ValidationError };