// filepath: tier99_icu_extended_518_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function mechanical_ventilation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.mode, 'mod', ['volume_ac','pressure_ac','pressure_support','simv','prvc','hfo','other','unknown']);
  ensureNum(req.tidal_volume, 'tv');
  ensureNum(req.peep, 'peep');
  ensureNum(req.fio2, 'fio2');
  ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.plateau_pressure, 'pp');
  ensureNum(req.driving_pressure, 'dp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function ards_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.pf_ratio, 'pfr');
  ensureEnum(req.ards_severity, 'as', ['mild','moderate','severe','unknown','other','none']);
  ensureNum(req.tidal_volume, 'tv');
  ensureNum(req.peep, 'peep');
  ensureNum(req.recruitment_maneuver, 'rm');
  ensureBool(req.prone_positioning, 'pp');
  ensureNum(req.ecmo, 'ec');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function septic_shock(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.map, 'map');
  ensureNum(req.lactate, 'lac');
  ensureNum(req.sbp, 'sbp');
  ensureBool(req.vasopressors, 'vp');
  ensureNum(req.number_pressors, 'np');
  ensureNum(req.fluid_balance, 'fb');
  ensureNum(req.antibiotic_time, 'at');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function icu_delirium(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.cam_icu_score, 'cam');
  ensureBool(req.hyperactive, 'hyp');
  ensureBool(req.hypoactive, 'hypo');
  ensureNum(req.sedation_level, 'ras');
  ensureBool(req.haloperidol, 'hal');
  ensureNum(req.physical_restraints, 'pr');
  ensureNum(req.icu_days, 'icd');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function icu_nutrition(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.route, 'rt', ['oral','enteral','parenteral','combination','other','unknown','none']);
  ensureNum(req.calories_kcal_day, 'ckd');
  ensureNum(req.protein_g_day, 'pgd');
  ensureNum(req.tube_feeding_rate, 'tfr');
  ensureNum(req.gastric_residual, 'gr');
  ensureNum(req.bowel_movements, 'bm');
  ensureBool(req.tolerance, 'tol');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { mechanical_ventilation, ards_management, septic_shock, icu_delirium, icu_nutrition }; }
module.exports = { funcs, ValidationError };
