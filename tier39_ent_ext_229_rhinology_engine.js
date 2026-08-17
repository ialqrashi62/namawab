// filepath: tier39_ent_ext_229_rhinology_engine.js
// TIER39_ENT-229: Rhinology
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function sinusitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['acute_viral','acute_bacterial','subacute','chronic','recurrent','acute_on_chronic','other']);
  ensureNumber(req.duration_weeks, 'dur');
  ensureEnum(req.sym, 'sym', ['nasal_congestion','purulent_discharge','facial_pain','hyposmia','fever','multiple','other']);
  ensureEnum(req.antibiotic, 'abx', ['amoxicillin','amoxicillin_clavulanate','cefdinir','levofloxacin','observation','none','other']);
  ensureBool(req.ct_done, 'ct');
  let status;
  if (req.type === 'acute_bacterial' && req.antibiotic === 'observation') status = 'acute_bacterial_antibiotic_indicated';
  else if (req.type === 'chronic' && !req.ct_done) status = 'chronic_sinusitis_ct_indicated';
  else if (req.duration_weeks > 12) status = 'chronic_sinusitis_review';
  else if (req.antibiotic === 'amoxicillin_clavulanate' && req.type === 'acute_bacterial') status = 'acute_bacterial_appropriate_treatment';
  else status = 'sinusitis_review';
  return { status, t: req.type };
}

function nasal_polyps(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.grade, 'grade', ['grade_1','grade_2','grade_3','grade_4','unknown','other']);
  ensureEnum(req.side, 'side', ['left','right','bilateral','unilateral','other']);
  ensureBool(req.previous_surgery, 'sx');
  ensureBool(req.biologics_candidate, 'bio');
  ensureBool(req.asthma_comorbidity, 'asthma');
  let status;
  if (req.grade === 'grade_4' && !req.previous_surgery) status = 'grade_4_advanced_sinus_surgery_refer';
  else if (req.asthma_comorbidity && req.biologics_candidate) status = 'crswnp_aspirin_exacerbated_biologic';
  else if (req.grade >= 3 && !req.previous_surgery) status = 'grade_3_consider_surgery';
  else if (req.grade <= 2) status = 'low_grade_polyp_topical_optimize';
  else status = 'nasal_polyp_review';
  return { status, g: req.grade };
}

function epistaxis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.side, 'side', ['left','right','anterior','posterior','bilateral','unknown','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','massive','unknown']);
  ensureBool(req.initial_bleeding, 'init');
  ensureBool(req.cauterization_done, 'caut');
  ensureBool(req.anterior_pack, 'ant_pack');
  ensureEnum(req.recurrence_risk, 'rec', ['low','moderate','high','unknown','other']);
  let status;
  if (req.severity === 'massive' && !req.anterior_pack) status = 'massive_epistaxis_posterior_pack_icu';
  else if (req.cauterization_done === false) status = 'cauterization_indicated_anterior';
  else if (req.severity === 'severe' && req.recurrence_risk === 'high') status = 'severe_recurrent_embolization_evaluate';
  else if (req.severity === 'mild' && req.cauterization_done) status = 'mild_epistaxis_cauterized_resolved';
  else status = 'epistaxis_review';
  return { status, sev: req.severity };
}

function septal_deviation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['c_shaped','s_shaped','anterior','posterior','caudal','multiple','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unknown']);
  ensureBool(req.nasal_obstruction, 'obstr');
  ensureBool(req.trauma_history, 'trauma');
  ensureBool(req.surgical_candidate, 'sx');
  let status;
  if (req.severity === 'severe' && req.nasal_obstruction && req.surgical_candidate) status = 'severe_septoplasty_refer';
  else if (req.severity === 'mild' && req.nasal_obstruction) status = 'mild_septal_deviation_medical_therapy';
  else if (req.trauma_history && req.nasal_obstruction) status = 'post_trauma_deviation_refer_ent';
  else status = 'septal_review';
  return { status, t: req.type };
}

function allergic_rhinitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['seasonal','perennial','episodic','occupational','persistent','intermittent','other']);
  ensureNumber(req.ige, 'ige');
  ensureEnum(req.skin_test, 'st', ['positive_grass','positive_dust','positive_pollen','positive_pet','positive_mold','positive_food','positive_multiple','negative','pending','not_done','other']);
  ensureEnum(req.treatment, 'rx', ['antihistamine','intranasal_steroid','antihistamine_intranasal_steroid','montelukast','immunotherapy','observation','none','other']);
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','partial','poor','none','unknown']);
  let status;
  if (req.response === 'partial' && req.treatment === 'antihistamine') status = 'add_intranasal_steroid_optimize';
  else if (req.treatment === 'antihistamine_intranasal_steroid' && req.response === 'excellent') status = 'allergic_rhinitis_optimal';
  else if (req.skin_test === 'positive_multiple' && req.treatment === 'immunotherapy') status = 'immunotherapy_appropriate';
  else if (req.ige >= 100 && req.treatment === 'observation') status = 'high_ige_initiate_treatment';
  else status = 'ar_review';
  return { status, t: req.type };
}

function funcs() { return { sinusitis, nasal_polyps, epistaxis, septal_deviation, allergic_rhinitis }; }
module.exports = { funcs, ValidationError };