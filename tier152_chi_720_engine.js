// filepath: tier152_chi_720_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chd_followup(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.diagnosis, 'dx', ['VSD','ASD','PDA','TOF','TGA','HLHS','coarctation','post_op_TOF','post_op_TGA','post_op_Norwood','post_op_Fontan','post_op_Glenn','bicuspid_aortic_valve','pulmonary_stenosis','aortic_stenosis','other','NA']);
  ensureNum(req.age_years, 'ay');
  ensureNum(req.saturation_pct, 'sa');
  ensureNum(req.lvef_pct, 'le');
  ensureEnum(req.nyha_or_equivalent, 'ny', ['I','II','III','IV','unknown','NA']);
  ensureBool(req.chest_pain, 'cp');
  ensureBool(req.exercise_intolerance, 'ei');
  ensureNum(req.last_echo_ef, 'le2');
  ensureNum(req.last_cath_days, 'lc');
  ensureEnum(req.meds, 'md', ['none','ACEI','ARB','beta_blocker','diuretic','digoxin','antiplatelet','anticoag','other','combination']);
  ensureStr(req.provider, 'pr');
  return { cf_id: `cfo_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis };
}
function adult_chd(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.diagnosis, 'dx', ['post_op_Fontan','post_op_TGA','post_op_Norwood','post_op_TOFr','post_op_coarct','repaired_TOF','repaired_AVSD','repaired_TAPVR','Eisenmenger','pulmonary_HTN','residual_VSD','residual_ASD','other','NA']);
  ensureBool(req.pregnancy_risk, 'pr');
  ensureBool(req.pregnancy_planned, 'pp');
  ensureNum(req.lvef_pct, 'le');
  ensureNum(req.rv_ef_pct, 're');
  ensureEnum(req.functional_status, 'fs', ['I','II','III','IV','unknown','NA']);
  ensureBool(req.transplant_eval, 'te');
  ensureNum(req.pulmonary_pressure, 'pp');
  ensureNum(req.saturation_pct, 'sa');
  ensureStr(req.provider, 'pr');
  return { ac_id: `acd_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis };
}
function transition(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.readiness, 'rd', ['not_ready','pre_contemplation','contemplation','preparation','action','maintenance','NA']);
  ensureBool(req.transition_clinic, 'tc');
  ensureBool(req.adult_cardiologist_identified, 'ai');
  ensureBool(req.insurance_continued, 'ic');
  ensureBool(req.self_management_skills, 'sm');
  ensureNum(req.transition_visits, 'tv');
  ensureBool(req.reproductive_counseled, 'rc');
  ensureBool(req.school_career_planning, 'sc');
  ensureStr(req.provider, 'pr');
  return { tr_id: `trn_${Date.now()}`, patient_id: req.patient_id, readiness: req.readiness };
}
function long_term_outcome(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.status, 'st', ['alive_well','alive_with_residual','alive_with_reintervention','alive_listed','transplanted','deceased','lost_to_followup','NA','unknown']);
  ensureNum(req.years_since_surgery, 'ys');
  ensureNum(req.number_of_reinterventions, 'nr');
  ensureEnum(req.function, 'fn', ['normal','mild_limitation','moderate_limitation','severe_limitation','NA','unknown']);
  ensureBool(req.employment, 'em');
  ensureBool(req.marrige_or_partner, 'ma');
  ensureBool(req.children, 'ch');
  ensureNum(req.quality_of_life_score, 'qol');
  ensureStr(req.provider, 'pr');
  return { lo_id: `lto_${Date.now()}`, patient_id: req.patient_id, status: req.status };
}
function cardiopulmonary_exercise(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.vo2_max, 'vo');
  ensureNum(req.vo2_predicted_pct, 'vp');
  ensureNum(req.work_max_watts, 'wm');
  ensureNum(req.work_predicted_pct, 'wp');
  ensureNum(req.ve_vco2_slope, 've');
  ensureNum(req.rer, 'rr');
  ensureNum(req.hr_max, 'hm');
  ensureNum(req.o2_pulse, 'op');
  ensureNum(req.saturation_min, 'sm');
  ensureEnum(req.reason_termination, 'rt', ['max_effort','dyspnea','fatigue','arrhythmia','hypoxia','leg_fatigue','other','NA']);
  ensureStr(req.provider, 'pr');
  return { ce_id: `cpx_${Date.now()}`, patient_id: req.patient_id, vo2: req.vo2_max };
}

function funcs() { return { chd_followup, adult_chd, transition, long_term_outcome, cardiopulmonary_exercise }; }
module.exports = { funcs, ValidationError };