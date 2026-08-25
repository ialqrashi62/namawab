// filepath: tier63_px_352_px_journey_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_journey_map(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.touchpoints_visited, 'tv');
  ensureNum(req.duration_days, 'dd');
  ensureStr(req.pain_points, 'pp');
  ensureStr(req.delight_moments, 'dm');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.persona, 'persona');
  return { persona: req.persona };
}
function patient_first_impression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.arrival_method, 'am', ['walking','wheelchair','ambulance','driving_dropped','public_transport','taxi']);
  ensureStr(req.entry_assistance, 'ea');
  ensureStr(req.first_interaction, 'fi');
  ensureNum(req.first_impression_score, 'fis');
  ensureStr(req.environment, 'env');
  ensureNum(req.check_in_time_min, 'cim');
  ensureStr(req.recommendation, 'rec');
  return { score: req.first_impression_score };
}
function patient_visit_summary(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.primary_provider, 'pp');
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.topics_covered, 'tc');
  ensureNum(req.patient_questions_addressed, 'pqa');
  ensureNum(req.plan_clarity_score, 'pcs');
  ensureBool(req.next_steps_clear, 'nsc');
  ensureBool(req.take_home_summary_emailed, 'thse');
  return { visit: req.visit_id };
}
function patient_discharge_journey(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.discharge_method, 'dm', ['home_with_family','home_alone','home_health','snf','rehab','hospice','ama','transfer','expired']);
  ensureBool(req.instructions_reviewed, 'ir');
  ensureBool(req.medications_reviewed, 'mr');
  ensureBool(req.follow_up_appointment_scheduled, 'fup');
  ensureBool(req.red_flags_reviewed, 'rfr');
  ensureEnum(req.patient_feelings_at_discharge, 'pfd', ['confident','anxious','unsure','disengaged','satisfied','overwhelmed','fearful']);
  ensureNum(req.satisfaction_score, 'ss');
  return { method: req.discharge_method };
}
function patient_continuity_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.continuity_care_id, 'cci');
  ensureStr(req.primary_provider, 'pp');
  ensureNum(req.visits_with_primary_pct, 'vpp');
  ensureNum(req.handoffs_needed, 'hn');
  ensureBool(req.care_plan_uptodate, 'cpy');
  ensureEnum(req.chronic_disease_control, 'cdc', ['improving','stable','worsening','variable','inconclusive','in_remission']);
  ensureNum(req.patient_satisfaction, 'ps');
  return { primary: req.primary_provider };
}

function funcs() { return { patient_journey_map, patient_first_impression, patient_visit_summary, patient_discharge_journey, patient_continuity_care }; }
module.exports = { funcs, ValidationError };