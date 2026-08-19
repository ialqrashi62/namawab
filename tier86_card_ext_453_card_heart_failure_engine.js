// filepath: tier86_card_ext_453_card_heart_failure_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hf_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.nyha_class, 'nyha');
  ensureNum(req.ef_pct, 'ef');
  ensureNum(req.bnp, 'bnp');
  ensureEnum(req.chf_type, 'ct', ['hfrEF','hfmrEF','hfpef','unknown','other']);
  ensureEnum(req.etiology, 'et', ['ischemic','dilated','valvular','hypertensive','alcoholic','chemo_induced','unknown','other']);
  ensureStr(req.diuretic, 'di');
  ensureStr(req.ace_inhibitor, 'ace');
  ensureStr(req.beta_blocker, 'bb');
  ensureBool(req.aldosterone_antag_started, 'aaa');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function hf_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.ef_pct, 'ef');
  ensureNum(req.bnp, 'bnp');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureEnum(req.fluid_status, 'fs', ['hypovolemic','euvolemic','mild_overload','moderate_overload','severe_overload','unknown']);
  ensureNum(req.exercise_tolerance, 'et');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureEnum(req.functional_status, 'fn', ['improving','stable','worsening','decline','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cardiomyopathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cardiomyopathy_type, 'ct', ['dilated','hypertrophic','restrictive','arrhythmogenic','takotsubo','amyloid','sarcoid','chemo_induced','peripartum','non_compaction','unknown','other']);
  ensureNum(req.ef_pct, 'ef');
  ensureEnum(req.genetic_testing, 'gt', ['pending','done','not_done','declined','unknown','other']);
  ensureBool(req.family_history, 'fh');
  ensureBool(req.biopsy_considered, 'bc');
  ensureBool(req.device_consulted, 'dc');
  ensureStr(req.medical_therapy, 'mt');
  ensureStr(req.referral_list, 'rl');
  ensureBool(req.advanced_therapy_referral, 'atr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function aldosterone_antag(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.medication, 'med');
  ensureNum(req.start_dose_mg, 'sd');
  ensureNum(req.current_dose_mg, 'cd');
  ensureNum(req.monitoring_potassium, 'mk');
  ensureNum(req.monitoring_creatinine, 'mc');
  ensureStr(req.side_effects, 'se');
  ensureEnum(req.contraindications, 'cn', ['none','hyperkalemia','renal_failure','other','unknown']);
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','unknown','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function heart_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.unos_status, 'us', ['1a','1b','2','3','7','pending','listed','unknown','other']);
  ensureNum(req.years_post_transplant, 'ypt');
  ensureEnum(req.immunosuppression, 'is', ['tacrolimus_mmf','cyclosporine','azathioprine','everolimus','sirolimus','other','combination','unknown']);
  ensureEnum(req.biopsy_results, 'br', ['grade_0','grade_1R','grade_2R','grade_3R','unknown','pending','other']);
  ensureNum(req.rejection_episodes, 're');
  ensureEnum(req.cardiac_allograft_vasculopathy, 'cav', ['none','mild','moderate','severe','unknown','other']);
  ensureBool(req.post_transplant_lymphoma_screened, 'ptl');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { hf_initial, hf_followup, cardiomyopathy, aldosterone_antag, heart_transplant }; }
module.exports = { funcs, ValidationError };