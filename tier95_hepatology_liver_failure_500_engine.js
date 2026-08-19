// filepath: tier95_hepatology_liver_failure_500_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function acute_liver_failure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.bilirubin, 'bil');
  ensureNum(req.inr, 'inr');
  ensureNum(req.alt, 'alt');
  ensureNum(req.ast, 'ast');
  ensureNum(req.lactate, 'lac');
  ensureNum(req.hec_grade, 'hg');
  ensureBool(req.transplant_listed, 'tl');
  ensureBool(req.king_college_criteria, 'kcc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function decompensated_cirrhosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.meld_score, 'meld');
  ensureEnum(req.child_pugh, 'cp', ['A','B','C','unknown','other']);
  ensureNum(req.albumin, 'alb');
  ensureNum(req.inr, 'inr');
  ensureEnum(req.ascites, 'as', ['none','mild','moderate','severe','refractory','other','unknown']);
  ensureEnum(req.encephalopathy, 'enc', ['none','grade_1','grade_2','grade_3','grade_4','unknown','other']);
  ensureNum(req.hospital_30d, 'h30');
  ensureNum(req.prognosis_6mo, 'p6m');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function transplant_evaluation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.evaluation_id, 'eid');
  ensureNum(req.meld_score, 'meld');
  ensureBool(req.psychosocial_eval, 'pe');
  ensureNum(req.sobriety_duration, 'sd');
  ensureBool(req.cardiac_clearance, 'cc');
  ensureEnum(req.infection_screen, 'is', ['negative','positive','pending','other','unknown']);
  ensureEnum(req.listing_status, 'ls', ['active','inactive','pending','deferred','other','unknown','none']);
  ensureNum(req.contraindications, 'cont');
  ensureStr(req.provider, 'pr');
  return { eid: req.evaluation_id };
}
function transplant_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.months_post_transplant, 'mpt');
  ensureNum(req.tacrolimus_level, 'tac');
  ensureNum(req.rejection_episodes, 're');
  ensureNum(req.bmi, 'bmi');
  ensureEnum(req.liver_function, 'lf', ['normal','mild_dysfunction','moderate_dysfunction','severe_dysfunction','other','unknown']);
  ensureEnum(req.compliance, 'comp', ['excellent','good','moderate','poor','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function liver_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.lesion_count, 'lc');
  ensureNum(req.largest_size_cm, 'lsc');
  ensureEnum(req.mri_li_rads, 'lr', ['lr_1','lr_2','lr_3','lr_4','lr_5','lr_m','unclear','other','unknown']);
  ensureNum(req.afp, 'afp');
  ensureEnum(req.bclc_stage, 'bcs', ['0','A','B','C','D','other','unknown']);
  ensureEnum(req.child_pugh, 'cp', ['A','B','C','unknown','other']);
  ensureEnum(req.treatment_plan, 'tp', ['resection','transplant','tace','ablation','systemic','supportive','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { acute_liver_failure, decompensated_cirrhosis, transplant_evaluation, transplant_followup, liver_cancer }; }
module.exports = { funcs, ValidationError };
