// filepath: tier91_geriatric_polypharmacy_480_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function medication_reconciliation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.medications_total, 'mt');
  ensureNum(req.prescribed_meds, 'pm');
  ensureNum(req.otc_meds, 'otc');
  ensureNum(req.herbal_supplements, 'hs');
  ensureNum(req.discrepancies_found, 'df');
  ensureNum(req.duplications, 'dup');
  ensureNum(req.drug_interactions, 'di');
  ensureBool(req.reconciliation_completed, 'rc');
  ensureNum(req.medications_reconciled, 'mr');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function beers_criteria(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.beers_medications, 'bm');
  ensureNum(req.high_risk_medications, 'hrm');
  ensureNum(req.antianxiety_use, 'au');
  ensureNum(req.anticholinergic_burden, 'ab');
  ensureNum(req.sedative_load, 'sl');
  ensureNum(req.hypoglycemic_risk, 'hr');
  ensureNum(req.fall_risk_medications, 'frm');
  ensureBool(req.beers_compliance, 'bc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function deprescribing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureNum(req.medications_reviewed, 'mr');
  ensureNum(req.candidates_for_dc, 'cd');
  ensureNum(req.successfully_dc, 'sd');
  ensureNum(req.failed_dc, 'fd');
  ensureEnum(req.reason_dc, 'rdc', ['adverse_effect','no_indication','duplication','interaction','pill_burden','cost','patient_preference','other','unknown','none']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureNum(req.benefits_realized, 'br');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function adherence(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.morisky_score, 'mrs');
  ensureNum(req.pill_burden, 'pb');
  ensureBool(req.dose_aid_used, 'dau');
  ensureBool(req.family_supervision, 'fs');
  ensureNum(req.adherence_pct, 'ap');
  ensureNum(req.refill_compliance, 'rc');
  ensureNum(req.missed_doses_weekly, 'mdw');
  ensureNum(req.cost_barriers, 'cb');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function prescribing_principles(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.review_id, 'rid');
  ensureNum(req.start_low, 'sl');
  ensureNum(req.go_slow, 'gs');
  ensureBool(req.renal_dose_adjusted, 'rda');
  ensureBool(req.drug_drug_checked, 'ddc');
  ensureBool(req.drug_disease_checked, 'ddc2');
  ensureNum(req.beers_avoided, 'ba');
  ensureNum(req.simple_regimen, 'sr');
  ensureEnum(req.outcome, 'out', ['improved','stable','worsened','declined','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.review_id };
}

function funcs() { return { medication_reconciliation, beers_criteria, deprescribing, adherence, prescribing_principles }; }
module.exports = { funcs, ValidationError };
