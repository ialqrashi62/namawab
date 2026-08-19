// filepath: tier116_specialty_rehab_614_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function neuro_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['gait','balance','strengthening','motor_relearning','constraint_induced','other','unknown']);
  ensureNum(req.asymmetry_pct, 'asy');
  ensureEnum(req.muscle_strength, 'ms', ['0/5','1/5','2/5','3/5','3+/5','4/5','4+/5','5/5','other','unknown']);
  ensureNum(req.balance_score, 'bs');
  ensureNum(req.functional_independence_measure, 'fim');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function cardiac_rehab_phase1(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.phase, 'ph', ['phase_1','phase_2','phase_3','phase_4','maintenance','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.exercise, 'ex', ['treadmill','bike','rowing','walking','combination','other','unknown']);
  ensureEnum(req.intensity, 'int', ['light','moderate','vigorous','other','unknown']);
  ensureNum(req.vo2_max, 'vo2');
  ensureNum(req.duration_weeks, 'dw');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function pulmonary_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.exercises, 'ex');
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.intensity, 'int', ['light','moderate','vigorous','other','unknown']);
  ensureNum(req.dyspnea_scale, 'ds');
  ensureNum(req.endurance_min, 'em');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function burn_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['mobility','strengthening','endurance','scar_management','combination','other','unknown']);
  ensureEnum(req.exercise, 'ex', ['rom','stretching','strength','functional','other','unknown']);
  ensureNum(req.rom_degrees_pct, 'rdp');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.wound_healing_status, 'whs', ['healing','healed','infected','grafting','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function lymphedema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.limb, 'limb');
  ensureNum(req.volume_ml, 'vm');
  ensureNum(req.excess_pct, 'ep');
  ensureEnum(req.compression_garment, 'cg', ['sleeve','stocking','full_sleeve','vest','other','unknown','none']);
  ensureEnum(req.lymphedema_grade, 'lg', ['mild','moderate','severe','mild_(stage1)','moderate_(stage2)','severe_(stage3)','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}

function funcs() { return { neuro_rehab, cardiac_rehab_phase1, pulmonary_rehab, burn_rehab, lymphedema }; }
module.exports = { funcs, ValidationError };