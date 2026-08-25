// filepath: tier62_spec_care_ext_345_sp_home_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function home_health_intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.referral_source, 'rs', ['hospital_discharge','pcp','specialist','family','patient_self','insurance','skilled_nursing_facility','rehab_facility']);
  ensureStr(req.skilled_needs, 'sn');
  ensureBool(req.homebound, 'hb');
  ensureStr(req.caregiver_availability, 'ca');
  ensureBool(req.environment_safe, 'es');
  ensureBool(req.initial_visit_48h, 'iv48');
  ensureStr(req.plan_of_care, 'poc');
  return { refer: req.referral_source };
}
function home_health_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.visit_type, 'vt', ['skilled_nursing','physical_therapy','occupational_therapy','speech_therapy','social_worker','home_health_aide','physician']);
  ensureBool(req.vitals_taken, 'vt2');
  ensureBool(req.wound_assessed, 'wa');
  ensureBool(req.medication_reviewed, 'mr');
  ensureBool(req.patient_education, 'pe');
  ensureStr(req.next_visit_eta, 'nve');
  ensureNum(req.travel_time_min, 'ttm');
  return { visit: req.visit_type };
}
function home_health_discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.length_of_service_days, 'losd');
  ensureEnum(req.outcomes, 'out', ['goals_met','goals_partially_met','goals_not_met','patient_refused','transferred','deceased','moved_away']);
  ensureEnum(req.patient_status, 'ps', ['improved','stable','declined','rehospitalized','deceased']);
  ensureEnum(req.discharge_reason, 'dr', ['goals_met','goals_partially_met','patient_refused','rehospitalized','moved_away','insurance_terminated','deceased']);
  ensureBool(req.follow_up_pcp_2w, 'fup');
  ensureBool(req.patient_satisfied, 'ps2');
  return { status: req.patient_status };
}
function wound_care_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.wound_type, 'wt', ['surgical_diabetic','pressure_injury','venous_arterial','traumatic','burn','post_op','skin_tear','dehisced','fistula','other']);
  ensureStr(req.stage, 'stage');
  ensureNum(req.size_cm, 'sc');
  ensureEnum(req.exudate, 'ex', ['none','minimal','moderate','heavy','purulent','serous','sanguineous']);
  ensureBool(req.dressing_changed, 'dc');
  ensureEnum(req.healing_progress, 'hp', ['healing_well','improving','stalled','worsening','infected','chronic']);
  ensureBool(req.patient_compliance, 'pc');
  return { stage: req.stage };
}
function infusion_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg, 'dose');
  ensureEnum(req.frequency, 'freq', ['q4h','q6h','q8h','q12h','q24h','q48h','continuous','weekly','biweekly','monthly']);
  ensureEnum(req.line_type, 'lt', ['picc','central','port','midline','peripheral','tunneled','implanted']);
  ensureStr(req.line_care, 'lc');
  ensureBool(req.labs_drawn, 'ld');
  ensureBool(req.reaction_observed, 'ro');
  ensureStr(req.next_dose_due, 'ndd');
  return { med: req.medication };
}

function funcs() { return { home_health_intake, home_health_visit, home_health_discharge, wound_care_visit, infusion_visit }; }
module.exports = { funcs, ValidationError };