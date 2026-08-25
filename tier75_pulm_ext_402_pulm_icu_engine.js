// filepath: tier75_pulm_ext_402_pulm_icu_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function mechanical_vent_setup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.setup_id, 'sid');
  ensureEnum(req.mode, 'mode', ['AC','SIMV','PSV','PRVC','VCV','PCV','HFOV','HFJV','NIV','CPAP','BiPAP','other']);
  ensureNum(req.tidal_volume_ml, 'tv');
  ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.peep_cm_h2o, 'peep');
  ensureNum(req.fio2, 'fio2');
  ensureNum(req.plateau_pressure, 'pp');
  ensureNum(req.driving_pressure, 'dp');
  ensureNum(req.compliance_ml_cm_h2o, 'compl');
  ensureNum(req.trigger_sensitivity, 'ts');
  ensureStr(req.provider, 'pr');
  ensureEnum(req.sedation_level, 'sl', ['rass_4','rass_3','rass_2','rass_1','rass_0','rass_minus_1','rass_minus_2','rass_minus_3','rass_minus_4','rass_minus_5','awake','no_sedation','other']);
  return { sid: req.setup_id };
}
function ventilator_weaning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.weaning_id, 'wid');
  ensureEnum(req.weaning_method, 'wm', ['spontaneous_breathing_trial','t_piece_trial','psv_wean','automated_weaning','protocol_driven','daily_sat','sbt_30_min','sbt_2_hour','sbt_120_min','other']);
  ensureNum(req.duration_hours, 'dh');
  ensureBool(req.tolerated, 'tol');
  ensureNum(req.rsbi_score, 'rsbi');
  ensureBool(req.passed_sbt, 'psbt');
  ensureBool(req.extubation_planned, 'ep');
  ensureEnum(req.respiratory_status, 'rs', ['adequate','marginal','inadequate','deteriorating','fluctuating','stable','other']);
  ensureBool(req.secretion_management, 'sm');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { wid: req.weaning_id };
}
function ards_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ards_id, 'aid');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unknown','other']);
  ensureNum(req.pf_ratio, 'pfr');
  ensureNum(req.tv_setting_ml, 'tv');
  ensureNum(req.plateau_pressure_limit, 'ppl');
  ensureEnum(req.peep_strategy, 'ps', ['low','moderate','high','low_peep_table','high_peep_table','lung_recruitment','other']);
  ensureBool(req.prone_positioning_used, 'ppu');
  ensureBool(req.muscle_relaxant_used, 'mru');
  ensureEnum(req.fluid_strategy, 'fs', ['conservative','liberal','balanced','dry','maintenance','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pfr: req.pf_ratio };
}
function tracheostomy_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trach_id, 'tid');
  ensureStr(req.trach_type, 'tt');
  ensureStr(req.cannula_change_date, 'ccd');
  ensureNum(req.cuff_pressure_cm_h2o, 'cpch');
  ensureEnum(req.suctioning_frequency, 'sf', ['q1h','q2h','q4h','q6h','q8h','prn','continuous','scheduled','other']);
  ensureBool(req.speaking_valve_used, 'svu');
  ensureBool(req.swallow_assessment_done, 'sad');
  ensureStr(req.next_cannula_change, 'ncc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { tid: req.trach_id };
}
function respiratory_failure_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.event_id, 'eid');
  ensureEnum(req.type, 'type', ['type_1','type_2','type_3','type_4','combined','hypercapnic','hypoxemic','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','very_severe','unknown','other']);
  ensureNum(req.ph, 'ph');
  ensureNum(req.pco2, 'pco2');
  ensureNum(req.po2, 'po2');
  ensureNum(req.o2_sat, 'o2s');
  ensureBool(req.vent_support_required, 'vsr');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response_to_treatment, 'rtt', ['improved','deteriorated','stable','no_change','partial_response','other']);
  ensureStr(req.provider, 'pr');
  ensureBool(req.monitoring_icu, 'mi');
  ensureNum(req.next_review, 'nr');
  return { eid: req.event_id };
}

function funcs() { return { mechanical_vent_setup, ventilator_weaning, ards_management, tracheostomy_care, respiratory_failure_management }; }
module.exports = { funcs, ValidationError };