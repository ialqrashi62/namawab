// filepath: tier5_ops_ext_105_incident_engine.js
// TIER5_OPS_EXT-105: Incident reporting & event classification (WHO ICPS)
'use strict';

const CITATIONS = [
  'WHO_ICPS_International_Classification_Patient_Safety_2009',
  'Joint_Commission_Sentinel_Event_Policy_2021',
  'IHI_Global_Trigger_Tool_2019',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function classify_event(req) {
  ensureStr(req.incident_type, 'incident_type');
  ensureEnum(req.incident_type, 'incident_type', ['medication','fall','pressure_injury','surgery','transfusion','device','diagnostic','behavioral','other']);
  ensureStr(req.harm_level, 'harm_level');
  ensureEnum(req.harm_level, 'harm_level', ['none','mild','moderate','severe','death']);
  ensureStr(req.unit, 'unit');
  ensureNumber(req.time_of_day_hour, 'time_of_day_hour');

  const harm_score = { none: 0, mild: 10, moderate: 25, severe: 50, death: 100 }[req.harm_level];
  let escalation;
  if (req.harm_level === 'death' || req.harm_level === 'severe') escalation = 'sentinel_event_full_rca';
  else if (req.harm_level === 'moderate') escalation = 'rca_required';
  else if (req.harm_level === 'mild') escalation = 'committee_review';
  else escalation = 'aggregate_review';

  return {
    incident_type: req.incident_type,
    harm_level: req.harm_level,
    unit: req.unit,
    hour_of_day: req.time_of_day_hour,
    harm_score,
    escalation,
    icps_category: req.incident_type + '_' + req.harm_level,
    citations: CITATIONS,
  };
}

function trigger_review(req) {
  ensureStr(req.event_class, 'event_class');
  ensureEnum(req.event_class, 'event_class', ['never_event','sentinel','serious_incident','near_miss','hazard']);
  ensureStr(req.related_chapter, 'related_chapter'); // e.g. medication/falls/surgery

  const required_team = [];
  if (req.event_class === 'never_event' || req.event_class === 'sentinel') required_team.push('executive_sponsor','legal','ciso','risk_manager','cmso','ccoo','subject_matter_expert');
  else if (req.event_class === 'serious_incident') required_team.push('department_head','cmso','ccoo','risk_manager','quality_officer');
  else if (req.event_class === 'near_miss') required_team.push('department_head','quality_officer');
  else required_team.push('unit_supervisor');

  return {
    event_class: req.event_class,
    related_chapter: req.related_chapter,
    required_team,
    reporting_deadline_days: req.event_class === 'never_event' ? 1 : req.event_class === 'sentinel' ? 2 : 7,
    citations: CITATIONS,
  };
}

function trend_incidences(req) {
  ensureNumber(req.last_period_count, 'last_period_count');
  ensureNumber(req.current_period_count, 'current_period_count');
  ensureNumber(req.last_period_patient_days, 'last_period_patient_days');
  ensureNumber(req.current_period_patient_days, 'current_period_patient_days');
  if (req.last_period_patient_days <= 0) throw new ValidationError('last_period_patient_days >0', 'last_period_patient_days');
  if (req.current_period_patient_days <= 0) throw new ValidationError('current_period_patient_days >0', 'current_period_patient_days');

  const prev_rate = req.last_period_count / req.last_period_patient_days * 1000;
  const curr_rate = req.current_period_count / req.current_period_patient_days * 1000;
  const ratio = curr_rate / Math.max(0.0001, prev_rate);
  let signal;
  if (ratio >= 1.5) signal = 'spike_in_incident_rate_investigate';
  else if (ratio >= 1.2) signal = 'increase_trend_watch';
  else if (ratio <= 0.8) signal = 'decrease_positive_verify_reporting';
  else signal = 'stable';

  return {
    prev_rate_per_1000: Math.round(prev_rate * 100) / 100,
    curr_rate_per_1000: Math.round(curr_rate * 100) / 100,
    ratio: Math.round(ratio * 100) / 100,
    signal,
    citations: CITATIONS,
  };
}

function disclosure_support(req) {
  ensureStr(req.event_type, 'event_type');
  ensureEnum(req.event_type, 'event_type', ['never_event','sentinel','serious_incident']);
  ensureNumber(req.days_since_event, 'days_since_event');
  ensureBool(req.family_aware, 'family_aware');
  ensureStr(req.clinician_role, 'clinician_role');
  ensureStr(req.patient_state, 'patient_state');
  ensureEnum(req.patient_state, 'patient_state', ['stable','guarded','critical','deceased']);

  const steps = [
    'confirm_what_is_known',
    'designate_executive_sponsor_and_clinician_lead',
    'schedule_in_person_disclosure_within_24_48h',
    'document_disclosure_in_chart_with_signatures',
    'offer_empathy_apology_without_admitting_causation_outside_RM_review',
    'continue_supportive_followup_referrals',
  ];

  return {
    event_type: req.event_type,
    days_since_event: req.days_since_event,
    family_aware: req.family_aware,
    patient_state: req.patient_state,
    disclosure_steps: steps,
    recommended_venue: 'private_quiet_room_with_care_team',
    citations: CITATIONS,
  };
}

function near_miss_culture(req) {
  ensureNumber(req.incidents_reported_quarter, 'incidents_reported_quarter');
  ensureNumber(req.near_miss_reported_quarter, 'near_miss_reported_quarter');
  ensureNumber(req.staff_on_unit, 'staff_on_unit');
  if (req.staff_on_unit <= 0) throw new ValidationError('staff_on_unit >0', 'staff_on_unit');
  const nm_to_incident_ratio = req.incidents_reported_quarter > 0 ? req.near_miss_reported_quarter / req.incidents_reported_quarter : 0;
  const per_staff_report_rate = (req.incidents_reported_quarter + req.near_miss_reported_quarter) / req.staff_on_unit;
  return {
    nm_to_incident_ratio: Math.round(nm_to_incident_ratio * 100) / 100,
    reports_per_staff: Math.round(per_staff_report_rate * 100) / 100,
    safety_culture_signal: nm_to_incident_ratio >= 4 ? 'reporting_culture_strong' : nm_to_incident_ratio >= 1 ? 'adequate' : 'underreporting_investigate_barriers',
    citations: CITATIONS,
  };
}

function funcs() {
  return { classify_event, trigger_review, trend_incidences, disclosure_support, near_miss_culture };
}

module.exports = { funcs, CITATIONS, ValidationError };
