// filepath: tier87_neph_ext_458_neph_general_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function neph_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.primary_diagnosis, 'pd');
  ensureEnum(req.visit_type, 'vt', ['new','followup','urgent','tele','other']);
  ensureStr(req.consulting_provider, 'cp');
  ensureStr(req.symptoms, 'sym');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.gfr, 'gfr');
  ensureNum(req.potassium, 'k');
  ensureStr(req.medications, 'meds');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function ckd_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureEnum(req.ckd_etiology, 'et', ['diabetes','hypertension','glomerulonephritis','pknd','autoimmune','unknown','other']);
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.gfr_calculated, 'gfr_calc');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.urine_acr, 'acr');
  ensureBool(req.ultrasound_done, 'usd');
  ensureEnum(req.kidney_size, 'ks', ['normal','enlarged','small','asymmetric','unknown']);
  ensureBool(req.cyst_present, 'cp');
  ensureStr(req.family_history, 'fh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function ckd_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.gfr, 'gfr');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.urine_acr, 'acr');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureNum(req.potassium, 'k');
  ensureBool(req.ace_inhibitor, 'ace');
  ensureBool(req.statin, 'stat');
  ensureNum(req.bicarbonate, 'bicar');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function glomerulonephritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.biopsy_done, 'bd');
  ensureEnum(req.biopsy_diagnosis, 'dx', ['minimal_change','focal_segmental','membranous','iga','membranoproliferative','crescentic','diabetic','hypertensive','amyloid','lupus','other','unknown']);
  ensureNum(req.proteinuria_g, 'pgn');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.gfr, 'gfr');
  ensureBool(req.hematuria_present, 'hp');
  ensureBool(req.complement_low, 'cl');
  ensureBool(req.steroids_started, 'ss');
  ensureStr(req.immunosuppression, 'is');
  ensureEnum(req.prognosis, 'pg', ['good','moderate','poor','relapsing','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function polycystic_kidney(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.family_history, 'fh');
  ensureEnum(req.disease_stage, 'st', ['crisp_1','crisp_2','crisp_3','crisp_4','crisp_5','unknown','other']);
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.gfr, 'gfr');
  ensureNum(req.kidney_size_l, 'ksl');
  ensureNum(req.kidney_size_r, 'ksr');
  ensureNum(req.cyst_count_left, 'ccl');
  ensureNum(req.cyst_count_right, 'ccr');
  ensureBool(req.liver_cysts, 'lc');
  ensureBool(req.intracranial_aneurysm_screened, 'ias');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { neph_clinic, ckd_eval, ckd_followup, glomerulonephritis, polycystic_kidney }; }
module.exports = { funcs, ValidationError };