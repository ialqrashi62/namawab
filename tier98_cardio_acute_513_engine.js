// filepath: tier98_cardio_acute_513_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stemi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureEnum(req.stemi_type, 'st', ['anterior','lateral','inferior','posterior','rv','lm','other','unknown']);
  ensureNum(req.systolic_bp, 'sbp');
  ensureNum(req.door_to_balloon, 'dtb');
  ensureNum(req.troponin_peak, 'tp');
  ensureNum(req.ef, 'ef');
  ensureEnum(req.reperfusion, 'rep', ['pci','thrombolysis','cabg','none','other','unknown']);
  ensureNum(req.killip_class, 'kc');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function nstemi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureEnum(req.nstemi_type, 'nt', ['nstemi','unstable_angina','other','unknown']);
  ensureNum(req.troponin_peak, 'tp');
  ensureNum(req.grace_score, 'gs');
  ensureEnum(req.treatment, 'tx', ['pci','medical','cabg','other','unknown']);
  ensureNum(req.lvef, 'lvef');
  ensureNum(req.hospital_days, 'hd');
  ensureEnum(req.complications, 'comp', ['none','cardiogenic_shock','arrhythmia','bleeding','death','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function heart_failure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.nyha_class, 'nyha', ['1','2','3','4','unknown','other']);
  ensureNum(req.ef, 'ef');
  ensureNum(req.bnp, 'bnp');
  ensureNum(req.weight_change_kg, 'wc');
  ensureNum(req.systolic_bp, 'sbp');
  ensureBool(req.diuretic_use, 'du');
  ensureNum(req.fluid_balance, 'fb');
  ensureEnum(req.phenotype, 'ph', ['hfpef','hfref','hfmr','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cardiogenic_shock(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.ci, 'ci');
  ensureNum(req.sbp, 'sbp');
  ensureNum(req.lactate, 'lac');
  ensureBool(req.vasopressors, 'vp');
  ensureNum(req.number_pressors, 'np');
  ensureBool(req.mechanical_circulatory, 'mcs');
  ensureNum(req.icu_days, 'icd');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function arrhythmia_acute(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureEnum(req.arrhythmia_type, 'at', ['afib','aflutter','vt','vfib','psvt','bradycardia','heart_block','other','unknown']);
  ensureNum(req.heart_rate, 'hr');
  ensureBool(req.hemodynamic_instability, 'hi');
  ensureNum(req.reversion_method, 'rm');
  ensureBool(req.cardioversion, 'cv');
  ensureBool(req.cpr_required, 'cpr');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}

function funcs() { return { stemi, nstemi, heart_failure, cardiogenic_shock, arrhythmia_acute }; }
module.exports = { funcs, ValidationError };
