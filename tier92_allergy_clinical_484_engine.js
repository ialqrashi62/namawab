// filepath: tier92_allergy_clinical_484_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function allergic_rhinitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.type, 'tp', ['seasonal','perennial','episodic','mixed','other','unknown']);
  ensureNum(req.symptom_score, 'ss');
  ensureNum(req.sneezing_score, 'sn');
  ensureNum(req.congestion_score, 'cn');
  ensureNum(req.rhinorrhea_score, 'rh');
  ensureNum(req.itching_score, 'itch');
  ensureNum(req.eye_symptoms, 'eye');
  ensureBool(req.asthma_present, 'asth');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function asthma_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.control_level, 'cl', ['controlled','partly_controlled','uncontrolled','unknown','other']);
  ensureNum(req.act_score, 'act');
  ensureNum(req.fev1, 'fev1');
  ensureNum(req.fev1_fvc_ratio, 'fevfvc');
  ensureNum(req.exacerbations_12mo, 'ex12');
  ensureEnum(req.step, 'st', ['step_1','step_2','step_3','step_4','step_5','step_6','unknown','other']);
  ensureBool(req.controller_med, 'cm');
  ensureNum(req.ics_dose, 'ics');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function food_allergy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.food_allergen, 'fa');
  ensureBool(req.ige_mediated, 'ige');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','fatal','unknown','other']);
  ensureNum(req.skin_prick_mm, 'spm');
  ensureNum(req.specific_ige, 'sige');
  ensureBool(req.food_challenge, 'fc');
  ensureBool(req.anaphylaxis_history, 'ah');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function drug_allergy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.reaction_type, 'rt', ['immediate','delayed','cytotoxic','immune_complex','other','unknown']);
  ensureNum(req.time_to_symptoms_min, 'tts');
  ensureBool(req.desensitization, 'des');
  ensureEnum(req.cross_reactivity, 'cr', ['none','penicillin','nsaid','sulfa','other','unknown']);
  ensureBool(req.alternative_documented, 'alt');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function anaphylaxis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureStr(req.trigger, 'tri');
  ensureNum(req.time_to_onset_min, 'tto');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','fatal','unknown','other']);
  ensureBool(req.epinephrine_admin, 'epr');
  ensureNum(req.epinephrine_dose_mg, 'edm');
  ensureNum(req.repeat_epinephrine, 'rep');
  ensureBool(req.emergency_dept, 'ed');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}

function funcs() { return { allergic_rhinitis, asthma_management, food_allergy, drug_allergy, anaphylaxis }; }
module.exports = { funcs, ValidationError };

