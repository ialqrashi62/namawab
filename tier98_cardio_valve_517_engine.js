// filepath: tier98_cardio_valve_517_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function aortic_stenosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.peak_velocity, 'pv');
  ensureNum(req.mean_gradient, 'mg');
  ensureNum(req.aortic_valve_area, 'ava');
  ensureNum(req.dvi, 'dvi');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','critical','unknown','other']);
  ensureNum(req.ef, 'ef');
  ensureEnum(req.symptoms, 'sym', ['asymptomatic','dyspnea','syncope','angina','multiple','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function mitral_regurgitation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.etiology, 'et', ['primary','secondary','mixed','other','unknown']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','massive','unknown','other']);
  ensureNum(req.vena_contracta, 'vc');
  ensureNum(req.regurg_volume, 'rv');
  ensureNum(req.regurg_fraction, 'rf');
  ensureNum(req.ef, 'ef');
  ensureEnum(req.treatment, 'tx', ['monitoring','surgery','teer','medical','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function tricuspid_regurg(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.tr_velocity, 'trv');
  ensureNum(req.right_ventricle_size, 'rvs');
  ensureNum(req.tapse, 'tapse');
  ensureNum(req.ivc_diameter, 'ivcd');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','massive','unknown','other']);
  ensureNum(req.treatment, 'tx');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function valve_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.valve_type, 'vt', ['mechanical','bioprosthetic','repair','other','unknown']);
  ensureEnum(req.position, 'pos', ['aortic','mitral','tricuspid','pulmonary','multiple','other','unknown']);
  ensureEnum(req.approach, 'app', ['open','minimally_invasive','robotic','catheter','other','unknown']);
  ensureNum(req.pump_time, 'pt');
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function endocarditis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.diagnosis, 'dx', ['definite','probable','possible','rejected','other','unknown']);
  ensureStr(req.organism, 'org');
  ensureNum(req.blood_cultures_positive, 'bcp');
  ensureNum(req.vegetation_size, 'vs');
  ensureEnum(req.affected_valve, 'av', ['aortic','mitral','tricuspid','pulmonary','multiple','prosthetic','other','unknown']);
  ensureBool(req.surgery_needed, 'sn');
  ensureNum(req.treatment_duration_days, 'tdd');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { aortic_stenosis, mitral_regurgitation, tricuspid_regurg, valve_surgery, endocarditis }; }
module.exports = { funcs, ValidationError };
