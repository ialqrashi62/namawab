// filepath: tier5_sdoh_ext_106_community_engine.js
// TIER5_SDOH_EXT-106: Community resources referral & AHA loop closure
'use strict';

const CITATIONS = [
  'AHA_PRAPARE_2019',
  'NQF_Community_Resources',
  'Pathways_Community_HUB_2019',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function resource_match(req) {
  ensureStr(req.need, 'need');
  ensureEnum(req.need, 'need', ['food_insecurity','housing_insecurity','health_insurance','childcare','employment','transportation','legal','education','language_interpretation','spiritual_care','substance_use_support','disability_services','home_health','dementia_respite','palliative_home_hospice']);
  ensureStr(req.region, 'region');
  ensureEnum(req.region, 'region', ['riyadh','jeddah','dammam','mecca','medina','gcc_other','global_other']);
  ensureBool(req.has_existing_database, 'has_existing_database');

  let database_url;
  switch (req.region) {
    case 'riyadh': database_url = 'https://www.riyadh.health/referral'; break;
    case 'jeddah': database_url = 'https://www.jeddahhealth.gov.sa/'; break;
    case 'dammam': database_url = 'https://www.ehealth.gov.sa/'; break;
    default: database_url = 'https://www.moh.gov.sa/Pages/Default.aspx';
  }
  return { database_url, pathway: req.need, region: req.region, using_clinical_inventory: req.has_existing_database };
}

function make_referral(req) {
  ensureStr(req.need, 'need');
  ensureStr(req.specific_resource, 'specific_resource');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureNumber(req.appointment_dow, 'appointment_dow');
  ensureBool(req.hand_off_done, 'hand_off_done');

  if (!req.consent_signed) return { action: 'consent_required_no_referral', recommended_action: 'document_consent_with_signatures_then_make_referral' };
  return {
    action: 'referral_made',
    resource: req.specific_resource,
    appointment_dow: req.appointment_dow,
    follow_up_with_patient: req.hand_off_done ? 'within_2_weeks' : 'in_48h_post_hand_off',
  };
}

function track_referral(req) {
  ensureNumber(req.referral_id, 'referral_id');
  ensureStr(req.status, 'status');
  ensureEnum(req.status, 'status', ['made','service_started','service_completed','declined','unable_to_reach','closed_for_other_reason']);
  ensureBool(req.service_attained, 'service_attained');
  ensureNumber(req.days_since_referral, 'days_since_referral');

  let loop_status;
  if (req.service_attained || req.status === 'service_completed') loop_status = 'closed_loop_success';
  else if (req.status === 'declined' || req.status === 'unable_to_reach') loop_status = 'closed_loop_failure_rescreen_during_next_visit';
  else if (req.days_since_referral >= 14 && req.status === 'made') loop_status = 'need_followup_call_to_provider';
  else loop_status = 'in_progress_no_action_needed';
  return { loop_status, status: req.status, days_since_referral: req.days_since_referral };
}

function privacy_consent(req) {
  ensureBool(req.hospital_consent, 'hospital_consent');
  ensureBool(req.opt_out_status, 'opt_out_status');
  ensureStr(req.referral_type, 'referral_type');
  ensureEnum(req.referral_type, 'referral_type', ['internal_workflow','external_resource','community_organization_or_church','government_or_federal_program','private_payer_program']);
  ensureBool(req.documented_anonymization_choice, 'documented_anonymization_choice');
  ensureNumber(req.records_reviewed_days, 'records_reviewed_days');

  return {
    consent_obtained: req.hospital_consent && !req.opt_out_status,
    call_external_for_help: req.referral_type === 'external_resource' || req.referral_type === 'community_organization_or_church',
    document_anonymization_choice: req.documented_anonymization_choice,
    records_reviewed_days: req.records_reviewed_days,
  };
}

function warm_handoff(req) {
  ensureNumber(req.phone_call_duration_min, 'phone_call_duration_min');
  ensureNumber(req.days_until_first_contact, 'days_until_first_contact');
  ensureBool(req.records_shared_with_resource, 'records_shared_with_resource');
  ensureBool(req.follow_up_letter_done, 'follow_up_letter_done');
  ensureNumber(req.barriers_after_referral_count, 'barriers_after_referral_count');

  let signal;
  if (req.phone_call_duration_min < 5) signal = 'warm_handoff_brief_refer_to_video_or_inperson_handoff';
  else if (req.barriers_after_referral_count >= 2) signal = 'suggest_continued_warm_handoff_with_care_plan_then_family_meeting';
  else if (req.days_until_first_contact > 7) signal = 'follow_up_team_coordination_visit_with_patient';
  else if (req.follow_up_letter_done && req.records_shared_with_resource) signal = 'optimal_warm_handoff';
  else signal = 'consider_improving_in_practice_with_1st_contact_then_records_then_letter';

  return { signal };
}

function funcs() { return { resource_match, make_referral, track_referral, privacy_consent, warm_handoff }; }
module.exports = { funcs, CITATIONS, ValidationError };
