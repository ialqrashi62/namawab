// filepath: tier55_triage_ext_312_triage_disp_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function discharge_instructions(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.diagnosis, 'dx');
  ensureStr(req.instructions, 'ins');
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.return_precautions, 'rp');
  ensureStr(req.language, 'lang');
  return { diagnosis: req.diagnosis };
}
function referral_placement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_type, 'rt');
  ensureStr(req.reason, 'reason');
  ensureNum(req.appointment_within_weeks, 'aw');
  ensureStr(req.accepting_provider, 'ap');
  ensureBool(req.patient_acknowledged, 'pa');
  return { appointment_weeks: req.appointment_within_weeks };
}
function follow_up_appointment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specialty, 'spec');
  ensureStr(req.timeframe, 'tf');
  ensureEnum(req.scheduling_done, 'sd', ['before_discharge','within_24h','within_48h','patient_self_schedule','pending']);
  ensureStr(req.barriers_to_followup, 'bf');
  ensureStr(req.contact_phone, 'cp');
  return { specialty: req.specialty };
}
function return_precaution(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.reviewed, 'rev');
  ensureBool(req.verbalized, 'verb');
  ensureStr(req.specific_warnings, 'sw');
  ensureBool(req.language_understood, 'lu');
  ensureEnum(req.literacy_level, 'll', ['adequate','limited','low','unable_to_assess']);
  return { reviewed: req.reviewed };
}
function community_resources(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.social_work_consult, 'sw');
  ensureBool(req.home_health_referral, 'hh');
  ensureBool(req.transportation_assistance, 'ta');
  ensureBool(req.medication_assistance_program, 'map');
  ensureBool(req.fall_prevention_program, 'fpp');
  return { social_work: req.social_work_consult };
}

function funcs() { return { discharge_instructions, referral_placement, follow_up_appointment, return_precaution, community_resources }; }
module.exports = { funcs, ValidationError };