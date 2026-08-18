// filepath: tier68_rx_368_rx_clinical_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function medication_reconciliation_prior_to_admission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureNum(req.medication_count, 'mc');
  ensureBool(req.high_risk_present, 'hrp');
  ensureNum(req.accuracy_pct, 'acc');
  ensureNum(req.discrepancies_resolved, 'dr');
  ensureStr(req.pharmacist, 'ph');
  ensureNum(req.time_spent_min, 'tsm');
  return { med_count: req.medication_count };
}
function medication_reconciliation_discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.discharge_meds_count, 'dmc');
  ensureNum(req.changes_from_admission, 'cfa');
  ensureBool(req.follow_up_coordinated, 'fuc');
  ensureBool(req.home_meds_reviewed, 'hmr');
  ensureBool(req.patient_education_provided, 'pep');
  ensureStr(req.pharmacist, 'ph');
  ensureNum(req.discrepancies_resolved, 'dr');
  return { discharge: req.discharge_meds_count };
}
function medication_review_high_risk(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.high_risk_meds_present, 'hrmp');
  ensureStr(req.high_risk_list, 'hrl');
  ensureBool(req.renal_dose_reviewed, 'rdr');
  ensureBool(req.hepatic_dose_reviewed, 'hdr');
  ensureBool(req.drug_interactions_checked, 'dic');
  ensureEnum(req.recommendation, 'rec', ['continue_current','dose_adjust','discontinue','switch','add','hold','monitor','refer_clinic']);
  ensureNum(req.follow_up, 'fu');
  return { high_risk: req.high_risk_meds_present };
}
function antimicrobial_stewardship(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.antibiotic, 'ab');
  ensureStr(req.indication, 'ind');
  ensureBool(req.culture_pending, 'cp');
  ensureBool(req.de_escalation_plan, 'dep');
  ensureNum(req.duration_estimate_days, 'ded');
  ensureStr(req.review_due, 'rd');
  ensureBool(req.stewardship_reviewed, 'sr');
  ensureEnum(req.recommendation, 'rec', ['continue_adjust_dose','continue_current','de_escalate','escalate','discontinue','switch','iv_to_po','continue_pending_culture','review_in_48']);
  return { antibiotic: req.antibiotic };
}
function opioid_stewardship(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.opioid, 'op');
  ensureNum(req.dose_mme, 'dm');
  ensureEnum(req.chronic_acute, 'ca', ['acute','chronic','subacute','breakthrough','maintenance','perioperative','palliative','cancer_related','recreational_use','iatrogenic']);
  ensureBool(req.naloxone_prescribed, 'np');
  ensureBool(req.pdmp_checked, 'pc');
  ensureEnum(req.pdmp_results, 'pr', ['no_other_active','prescribed_low','co_prescribed','multi_provider','concerning','multi_state','no_history','new_prescription']);
  ensureBool(req.urine_drug_screen, 'uds');
  ensureNum(req.risk_score, 'rs');
  return { opioid: req.opioid };
}

function funcs() { return { medication_reconciliation_prior_to_admission, medication_reconciliation_discharge, medication_review_high_risk, antimicrobial_stewardship, opioid_stewardship }; }
module.exports = { funcs, ValidationError };