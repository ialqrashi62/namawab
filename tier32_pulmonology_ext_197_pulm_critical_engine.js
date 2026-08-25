// filepath: tier32_pulmonology_ext_197_pulm_critical_engine.js
// TIER32_PULMONOLOGY-197: Pulmonary critical care
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ventilator_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.mode, 'mode', ['pressure_control','volume_control','pressure_support','simv_prvc','hfov','other']);
  ensureNumber(req.peep, 'peep');
  ensureNumber(req.fio2, 'fio2');
  ensureNumber(req.tidal_volume, 'tv');
  ensureNumber(req.plateau_pressure, 'plateau');
  ensureNumber(req.oxygenation_index, 'oi');
  let status;
  if (req.plateau_pressure > 30) status = 'plateau_high_review_lung_protective';
  else if (req.tidal_volume > 8) status = 'tv_high_lung_injury_risk_reduce';
  else if (req.fio2 >= 60 && req.peep < 10) status = 'high_fio2_low_peep_recruit';
  else if (req.oxygenation_index >= 200) status = 'severe_ards_expert_review';
  else status = 'ventilator_appropriate';
  return { status, mode: req.mode };
}

function weaning_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.rsbi, 'rsbi');
  ensureBool(req.spontaneous_breathing_trial, 'sbt');
  ensureNumber(req.trial_duration_min, 'dur');
  ensureBool(req.passed_sbt, 'pass');
  ensureBool(req.extubation_planned, 'extubation');
  let status;
  if (req.rsbi > 105) status = 'rsbi_high_wean_likely_failure';
  else if (!req.spontaneous_breathing_trial) status = 'sbt_initiate_protocol';
  else if (req.passed_sbt && req.extubation_planned) status = 'weaning_passed_extubate';
  else if (req.trial_duration_min < 30) status = 'sbt_duration_too_short_extend';
  else if (!req.passed_sbt) status = 'sbt_failed_reassess_tomorrow';
  else status = 'weaning_review';
  return { status, rsbi: req.rsbi };
}

function ards_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ards_severity, 'sev', ['mild','moderate','severe','other']);
  ensureNumber(req.peep, 'peep');
  ensureNumber(req.tidal_volume, 'tv');
  ensureNumber(req.plateau, 'plat');
  ensureNumber(req.driving_pressure, 'dp');
  ensureBool(req.prone_positioning, 'prone');
  let status;
  if (req.ards_severity === 'severe' && req.driving_pressure > 15) status = 'severe_ards_high_dp_optimize';
  else if (req.ards_severity === 'severe' && !req.prone_positioning) status = 'severe_ards_prone_indicated';
  else if (req.tidal_volume > 6) status = 'tv_above_ardsnet_review';
  else if (req.plateau > 30) status = 'plateau_high_pressure_control';
  else status = 'ards_protocol_appropriate';
  return { status, sev: req.ards_severity };
}

function tracheostomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.trach_day, 'day');
  ensureEnum(req.indication, 'ind', ['prolonged_ventilation','airway_protection','secretion_management','upper_airway_obstruction','other']);
  ensureEnum(req.trach_type, 'type', ['percutaneous','open_surgical','ciaglia_blue_dolphin','fantoni','other']);
  ensureBool(req.speaking_valve_trials, 'svt');
  ensureEnum(req.swallowing_assessment, 'swal', ['passed','pending','failed','not_indicated','other']);
  let status;
  if (req.trach_day < 7 && req.indication === 'prolonged_ventilation') status = 'early_trach_protocol_continue';
  else if (req.swallowing_assessment === 'pending' && req.trach_day > 7) status = 'swallow_assess_complete_allow_diet';
  else if (!req.speaking_valve_trials && req.trach_day > 7) status = 'speaking_valve_trials_initiate';
  else if (req.swallowing_assessment === 'passed') status = 'trach_swallow_passed_continue_weaning';
  else status = 'tracheostomy_review_appropriate';
  return { status, day: req.trach_day };
}

function icu_bronchoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.indication, 'ind', ['secretion_clearance','hemoptysis','atelectasis','infection_workup','airway_evaluation','other']);
  ensureEnum(req.findings, 'find', ['normal','thick_secretions','blood','mucus_plug','mass','airway_edema','other']);
  ensureBool(req.lavage_done, 'lavage');
  ensureEnum(req.bal_results, 'bal', ['negative','positive_bacteria','positive_fungal','positive_viral','pending','inconclusive','other']);
  ensureEnum(req.complication, 'comp', ['none','desaturation','bleeding','arrhythmia','pneumothorax','other']);
  let status;
  if (req.complication === 'pneumothorax') status = 'pneumothorax_chest_tube';
  else if (req.complication === 'bleeding') status = 'bleeding_intervention_review';
  else if (req.bal_results === 'positive_fungal' && req.lavage_done) status = 'fungal_pathogen_antifungal_review';
  else if (req.findings === 'mucus_plug') status = 'mucus_plug_clearance_improvement_review';
  else status = 'bronchoscopy_appropriate';
  return { status, find: req.findings };
}

function funcs() { return { ventilator_management, weaning_protocol, ards_protocol, tracheostomy, icu_bronchoscopy }; }
module.exports = { funcs, ValidationError };