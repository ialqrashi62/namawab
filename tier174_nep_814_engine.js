// filepath: tier174_nep_814_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ckd_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.egfr, 'eg');
  ensureNum(req.acr, 'ac'); ensureEnum(req.stage, 'st', ['I','II','IIIa','IIIb','IV','V','NA']);
  ensureNum(req.bp_control, 'bc'); ensureEnum(req.diabetes_control, 'dc', ['excellent','good','fair','poor','NA']);
  ensureBool(req.nephrotox_exposure, 'ne'); ensureNum(req.next_visit_months, 'nv');
  ensureStr(req.provider, 'pr');
  return { cf_id: `cf_${Date.now()}`, patient_id: req.patient_id, egfr: req.egfr, st: req.stage };
}

function dialysis_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.modality, 'mo', ['hemodialysis','peritoneal','home_hemo','NA']);
  ensureEnum(req.access, 'ac', ['AVF','AVG','catheter','PD_cath','NA']);
  ensureNum(req.kt_v, 'kv'); ensureNum(req.urr_pct, 'ur');
  ensureNum(req.sessions_per_week, 'sp'); ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.ed, 'ed', ['home','incenter','NA']);
  ensureStr(req.provider, 'pr');
  return { de_id: `de_${Date.now()}`, patient_id: req.patient_id, mod: req.modality, kv: req.kt_v };
}

function transplant_fup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.months_post, 'mp');
  ensureNum(req.creatinine, 'cr'); ensureNum(req.egfr, 'eg');
  ensureNum(req.tacrolimus_level, 'tl'); ensureNum(req.rejection_episode, 're');
  ensureEnum(req.complication, 'co', ['none','BK','CMV','PTLD','recurrent_disease','other','NA']);
  ensureStr(req.provider, 'pr');
  return { tf_id: `tf_${Date.now()}`, patient_id: req.patient_id, mp: req.months_post, cr: req.creatinine };
}

function renal_biopsy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.indication, 'in', ['proteinuria','hematuria','AKI','CKD','graft_dysfunction','NA']);
  ensureNum(req.cores, 'co'); ensureNum(req.glomeruli_count, 'gc');
  ensureEnum(req.pathology, 'pa', ['FSGS','MCD','IgA','MPGN','diabetic','hypertensive','normal','other','NA']);
  ensureEnum(req.diagnosis_specific, 'ds', ['tip_lesion','collapsing','cellular','membranous','focal','diffuse','NA']);
  ensureEnum(req.complication, 'co', ['none','bleeding','AVF','pneumothorax','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { rb_id: `rb_${Date.now()}`, patient_id: req.patient_id, path: req.pathology };
}

function htn_renal(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.bp_avg, 'ba');
  ensureNum(req.egfr, 'eg'); ensureNum(req.acr, 'ac');
  ensureNum(req.antihypertensive_count, 'ac2'); ensureBool(req.acei_arb, 'ar');
  ensureNum(req.sodium_g, 'so'); ensureEnum(req.lifestyle, 'ls', ['sedentary','moderate','active','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { hr_id: `hr_${Date.now()}`, patient_id: req.patient_id, bp: req.bp_avg, egfr: req.egfr };
}

function funcs() { return { ckd_follow, dialysis_eval, transplant_fup, renal_biopsy, htn_renal }; }
module.exports = { funcs, ValidationError };