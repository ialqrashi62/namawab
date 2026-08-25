// filepath: tier9_gov_ext_103_incident_engine.js
// TIER9_GOV_EXT-103: Incident management (clinical, security, operational)
'use strict';

const CITATIONS = ['WHO_PATIENT_SAFETY_2020','NIST_INCIDENT_2024','CBAHI_INCIDENT_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function incident_report(req) {
  ensureStr(req.incident_id, 'incident_id');
  ensureEnum(req.category, 'category', ['clinical_safety','medication','falls','security_breach','data_breach','phi_exposure','unauthorized_access','phishing','malware','physical_safety','fire','equipment_failure','complaint','workplace_safety']);
  ensureEnum(req.severity, 'severity', ['near_miss','minor','moderate','major','severe','sentinel','catastrophic']);
  ensureStr(req.event_date, 'event_date');
  ensureStr(req.reporter_role, 'reporter_role');
  ensureBool(req.patient_impacted, 'patient_impacted');

  let urgency;
  if (req.severity === 'sentinel' || req.severity === 'catastrophic') urgency = 'immediate_executive_notification_within_1h';
  else if (req.severity === 'severe') urgency = 'director_notification_within_4h';
  else if (req.severity === 'major') urgency = 'manager_notification_within_24h';
  else if (req.severity === 'moderate') urgency = 'standard_review_within_72h';
  else urgency = 'routine_review_weekly';

  return { urgency, category: req.category, severity: req.severity };
}

function incident_investigate(req) {
  ensureStr(req.incident_id, 'incident_id');
  ensureStr(req.lead_investigator_role, 'lead_investigator_role');
  ensureNumber(req.team_size, 'team_size');
  ensureEnum(req.method, 'method', ['root_cause_analysis','fishbone','5_whys','fmea','swiss_cheese','tap_root','human_factors','systems_analysis','not_required']);
  ensureNumber(req.days_elapsed, 'days_elapsed');
  ensureNumber(req.target_completion_days, 'target_completion_days');

  let status;
  if (req.method === 'not_required' && (req.severity_indicator || 0) >= 4) status = 'method_required_for_high_severity';
  else if (req.team_size === 0) status = 'assemble_team_first';
  else if (req.days_elapsed > req.target_completion_days) status = 'overdue_escalate';
  else if (req.days_elapsed > req.target_completion_days * 0.7) status = 'on_track_approaching_deadline';
  else status = 'investigation_active';

  return { status, method: req.method, days: req.days_elapsed };
}

function incident_capa(req) {
  ensureStr(req.incident_id, 'incident_id');
  ensureEnum(req.capa_type, 'capa_type', ['corrective','preventive','both']);
  ensureNumber(req.action_count, 'action_count');
  ensureNumber(req.days_to_implement, 'days_to_implement');
  ensureNumber(req.verification_days, 'verification_days');
  ensureBool(req.effectiveness_verified, 'effectiveness_verified');

  let capa_status;
  if (req.action_count === 0) capa_status = 'no_actions_defined_yet';
  else if (req.effectiveness_verified) capa_status = 'verified_closed';
  else if (req.verification_days > 90) capa_status = 'long_verification_window';
  else if (req.days_to_implement > 180) capa_status = 'extended_implementation_review';
  else capa_status = 'in_progress';

  return { capa_status, capa_type: req.capa_type, actions: req.action_count };
}

function incident_notify(req) {
  ensureStr(req.incident_id, 'incident_id');
  ensureEnum(req.notification_type, 'notification_type', ['internal_team','management','executive','regulator','public','media','family_patient','legal','insurance']);
  ensureNumber(req.days_since_event, 'days_since_event');
  ensureNumber(req.regulatory_deadline_days, 'regulatory_deadline_days');
  ensureBool(req.notification_sent, 'notification_sent');

  let action_status;
  if (!req.notification_sent && req.regulatory_deadline_days > 0) action_status = 'regulator_notification_required_action_now';
  else if (!req.notification_sent && req.notification_type === 'family_patient') action_status = 'family_notification_pending_priority';
  else if (req.days_since_event > req.regulatory_deadline_days) action_status = 'overdue_regulatory_notification_high_liability';
  else if (req.notification_sent) action_status = 'sent_complete';
  else action_status = 'pending';

  return { action_status, notification: req.notification_type, deadline: req.regulatory_deadline_days };
}

function incident_learn(req) {
  ensureStr(req.incident_id, 'incident_id');
  ensureNumber(req.similar_incidents_12mo, 'similar_incidents_12mo');
  ensureBool(req.lesson_shared_org_wide, 'lesson_shared_org_wide');
  ensureEnum(req.target_audience, 'target_audience', ['frontline_staff','middle_management','executive','all_staff','department_specific','external_industry']);
  ensureStr(req.share_date, 'share_date');

  let learning_status;
  if (req.similar_incidents_12mo >= 5) learning_status = 'recurring_pattern_systemic_fix_required';
  else if (!req.lesson_shared_org_wide && req.similar_incidents_12mo >= 2) learning_status = 'pattern_emerging_share_lessons_now';
  else if (req.target_audience === 'all_staff' && req.lesson_shared_org_wide) learning_status = 'shared_org_wide_completed';
  else if (req.lesson_shared_org_wide) learning_status = 'shared_with_audience';
  else learning_status = 'prepare_lesson_for_sharing';

  return { learning_status, similar: req.similar_incidents_12mo };
}

function funcs() { return { incident_report, incident_investigate, incident_capa, incident_notify, incident_learn }; }
module.exports = { funcs, CITATIONS, ValidationError };