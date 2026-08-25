// filepath: tier101_peds_cardiology_530_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function congenital_heart_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.chd_type, 'chd', ['vsd','asd','avsd','pda','tetralogy','transposition','coarctation','hypoplastic','other','unknown','none']);
  ensureNum(req.defect_size, 'ds');
  ensureBool(req.pulmonary_hypertension, 'ph');
  ensureBool(req.eisenmenger, 'eis');
  ensureEnum(req.treatment, 'tx', ['observation','catheter','surgical','medical','combination','other','unknown','none']);
  ensureNum(req.saturation, 'sat');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function echocardiogram_peds(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.ef, 'ef');
  ensureEnum(req.septal_defect, 'sd', ['vsd','asd','avsd','pda','none','other','unknown']);
  ensureNum(req.valve_function, 'vf');
  ensureEnum(req.shunt_direction, 'shd', ['left_right','right_left','bidirectional','none','other','unknown']);
  ensureNum(req.pressure_gradients, 'pg');
  ensureNum(req.pericardial_effusion, 'pef');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function fetal_echo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.cardiac_axis, 'ca');
  ensureEnum(req.four_chamber_view, 'fcv', ['normal','abnormal','inconclusive','not_visualized','other','unknown']);
  ensureNum(req.outflow_tracts, 'ot');
  ensureEnum(req.abnormalities, 'abn', ['none','vsd','asd','tetralogy','coarctation','other','unknown']);
  ensureNum(req.reassurance, 'rea');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function peds_arrhythmia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.arrhythmia_type, 'at', ['svt','vt','wpw','complete_avb','sick_sinus','afib','aflutter','other','unknown','none']);
  ensureNum(req.heart_rate, 'hr');
  ensureEnum(req.treatment, 'tx', ['observation','vagal','adenosine','beta_blocker','ablation','pacemaker','combination','other','unknown','none']);
  ensureBool(req.successful, 'suc');
  ensureNum(req.recurrence, 'rec');
  ensureNum(req.long_term_therapy, 'ltt');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function chd_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.surgical_repair, 'sr', ['vsd_closure','asd_closure','tga_switch','coarctation_repair','tetralogy_repair','other','none','unknown']);
  ensureNum(req.surgery_age_months, 'sam');
  ensureBool(req.residual_defect, 'rd');
  ensureNum(req.ef, 'ef');
  ensureNum(req.medications_count, 'mc');
  ensureNum(req.growth_percentile, 'gp');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}

function funcs() { return { congenital_heart_disease, echocardiogram_peds, fetal_echo, peds_arrhythmia, chd_followup }; }
module.exports = { funcs, ValidationError };
