// filepath: tier84_psych_ext_443_psych_general_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function psych_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureEnum(req.referral_source, 'rs', ['self','primary_care','emergency','court','family','specialist','school','employee_assistance','crisis','other']);
  ensureStr(req.chief_complaint, 'cc');
  ensureStr(req.presenting_symptoms, 'ps');
  ensureNum(req.duration_months, 'dur');
  ensureStr(req.family_history, 'fh');
  ensureStr(req.substance_use, 'su');
  ensureStr(req.risk_assessment, 'ra');
  ensureEnum(req.diagnosis, 'dx', ['depression','anxiety','bipolar','ptsd','psychosis','substance_use','ocd','adjustment','other','none_yet','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureEnum(req.gender, 'g', ['male','female','transgender','non_binary','other','declined','unknown']);
  ensureEnum(req.marital_status, 'ms', ['single','married','divorced','widowed','partnered','separated','other','unknown']);
  ensureNum(req.children_count, 'cc');
  ensureStr(req.occupation, 'occ');
  ensureStr(req.education, 'edu');
  ensureBool(req.substance_use_history, 'suh');
  ensureBool(req.psychiatric_history, 'ph');
  ensureStr(req.medical_history, 'mh');
  ensureStr(req.family_psychiatric_history, 'fph');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function med_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.medication, 'med', ['ssri','snri','tca','maoi','mood_stabilizer','antipsychotic','benzodiazepine','stimulant','sedative','other','combination','unknown']);
  ensureStr(req.medication_name, 'mn');
  ensureNum(req.dosage_mg, 'dose');
  ensureEnum(req.frequency, 'freq', ['qd','bid','tid','qid','prn','hs','other']);
  ensureBool(req.adherence, 'adh');
  ensureEnum(req.side_effects, 'se', ['none','weight_gain','sexual','gi','sedation','insomnia','akathisia','metabolic','cardiac','other','unknown']);
  ensureNum(req.phq9_score, 'phq');
  ensureStr(req.response, 'resp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function psychotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.modality, 'mod', ['cbt','dbt','act','psychodynamic','interpersonal','supportive','family','couples','group','emdr','other','unknown']);
  ensureNum(req.session_count, 'sc');
  ensureNum(req.session_duration_min, 'sdm');
  ensureStr(req.topics_covered, 'tc');
  ensureNum(req.progress_score, 'ps');
  ensureBool(req.homework_assigned, 'ha');
  ensureBool(req.risk_issues, 'ri');
  ensureNum(req.next_session_weeks, 'nsw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.treatment_duration_weeks, 'tdw');
  ensureEnum(req.discharge_reason, 'dr', ['completed','patient_choice','non_adherence','relocation','provider_referral','safety_concern','insurance','death','other','unknown']);
  ensureEnum(req.discharge_status, 'dst', ['recovered','improved','stable','worse','referred','transferred','other','unknown']);
  ensureBool(req.relapse_prevention_plan, 'rpp');
  ensureBool(req.safety_plan_provided, 'spp');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureBool(req.communication_with_pcp, 'cwp');
  ensureStr(req.recommendations, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { psych_eval, intake, med_management, psychotherapy, discharge }; }
module.exports = { funcs, ValidationError };