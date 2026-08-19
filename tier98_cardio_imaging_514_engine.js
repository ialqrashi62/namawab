// filepath: tier98_cardio_imaging_514_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function echocardiogram(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.type, 'tp', ['ttte','tte','stress','contrast','other','unknown']);
  ensureNum(req.ef, 'ef');
  ensureNum(req.lv_diastolic_diameter, 'lvdd');
  ensureNum(req.lv_systolic_diameter, 'lvsd');
  ensureEnum(req.wall_motion, 'wm', ['normal','hypokinesia','akinesia','dyskinesia','aneurysm','mixed','other','unknown']);
  ensureNum(req.valve_disease_count, 'vdc');
  ensureNum(req.pulmonary_pressure, 'pap');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function cardiac_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.ef, 'ef');
  ensureNum(req.lv_mass, 'lvm');
  ensureNum(req.lv_volume, 'lvv');
  ensureNum(req.fibrosis_pct, 'fp');
  ensureEnum(req.lge_present, 'lge', ['present','absent','other','unknown']);
  ensureNum(req.t2_signal, 't2');
  ensureNum(req.pericardial_effusion, 'pef');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function cardiac_ct(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.type, 'tp', ['calcium_score','ccta','other','unknown']);
  ensureNum(req.calcium_score, 'cas');
  ensureNum(req.stenosis_pct, 'sp');
  ensureNum(req.plaques_count, 'pc');
  ensureNum(req.segments_involved, 'si');
  ensureNum(req.high_risk_plaques, 'hrp');
  ensureEnum(req.triple_vessel, 'tv', ['yes','no','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function stress_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.protocol, 'prc', ['exercise','dobutamine','adenosine','regadenoson','other','unknown']);
  ensureNum(req.mets_achieved, 'mets');
  ensureNum(req.max_heart_rate, 'mhr');
  ensureEnum(req.inducible_ischemia, 'ii', ['present','absent','equivocal','other','unknown']);
  ensureNum(req.st_depression_mm, 'std');
  ensureNum(req.exercise_minutes, 'exm');
  ensureEnum(req.response, 'res', ['normal','abnormal','inconclusive','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function holter_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.duration_hours, 'dur');
  ensureNum(req.min_heart_rate, 'mnhr');
  ensureNum(req.max_heart_rate, 'mxhr');
  ensureNum(req.avg_heart_rate, 'avghr');
  ensureNum(req.pvc_count, 'pvc');
  ensureNum(req.pac_count, 'pac');
  ensureNum(req.afib_burden_pct, 'afb');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}

function funcs() { return { echocardiogram, cardiac_mri, cardiac_ct, stress_test, holter_monitoring }; }
module.exports = { funcs, ValidationError };
