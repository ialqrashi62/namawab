// filepath: tier91_geriatric_palliative_482_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function advance_care_planning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureBool(req.advance_directive, 'ad');
  ensureBool(req.living_will, 'lw');
  ensureBool(req.durable_poa, 'dpoa');
  ensureBool(req.health_proxy, 'hp');
  ensureEnum(req.code_status, 'cs', ['full','dnr','dnr_dni','limited','other','unknown']);
  ensureStr(req.values_beliefs, 'vb');
  ensureNum(req.family_meetings, 'fm');
  ensureNum(req.physician_orders, 'po');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function frailty_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.frailty_index, 'fi');
  ensureEnum(req.frailty_category, 'fc', ['robust','pre_frail','frail','severely_frail','unknown','other']);
  ensureNum(req.comorbidities_count, 'cc');
  ensureNum(req.weight_loss, 'wl');
  ensureNum(req.exhaustion, 'exh');
  ensureNum(req.physical_activity, 'pa');
  ensureNum(req.walking_speed, 'ws');
  ensureNum(req.grip_strength, 'gs');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function nursing_home_placement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.nh_eligible, 'ne');
  ensureEnum(req.placement_type, 'pt', ['independent','assisted','memory_care','skilled_nursing','long_term','short_term_rehab','other','unknown','none']);
  ensureNum(req.caregiver_availability, 'ca');
  ensureNum(req.financial_assessment, 'fa');
  ensureNum(req.facilities_visited, 'fv');
  ensureNum(req.family_conferences, 'fco');
  ensureNum(req.application_status, 'as');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hospice_eligibility(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.terminal_illness, 'ti');
  ensureNum(req.life_expectancy_months, 'lem');
  ensureBool(req.functional_decline, 'fd');
  ensureNum(req.weight_loss_pct, 'wlp');
  ensureNum(req.karnofsky_score, 'ks');
  ensureNum(req.palliative_performance, 'pp');
  ensureBool(req.hospice_consented, 'hc');
  ensureEnum(req.hospice_level, 'hl', ['routine','continuous','inpatient','respite','none','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function goals_care_old(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.discussion_id, 'did');
  ensureNum(req.chair_time_min, 'ctm');
  ensureNum(req.family_present, 'fp');
  ensureNum(req.shared_decisions, 'sd');
  ensureNum(req.comfort_focus, 'cf');
  ensureEnum(req.treatment_intensity, 'ti', ['aggressive','moderate','conservative','comfort_only','other','unknown']);
  ensureBool(req.trial_of_treatment, 'tot');
  ensureNum(req.revisit_interval, 'ri');
  ensureStr(req.provider, 'pr');
  return { did: req.discussion_id };
}

function funcs() { return { advance_care_planning, frailty_assessment, nursing_home_placement, hospice_eligibility, goals_care_old }; }
module.exports = { funcs, ValidationError };
