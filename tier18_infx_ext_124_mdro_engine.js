// filepath: tier18_infx_ext_124_mdro_engine.js
// TIER18_INFX_EXT-124: MDRO (MRSA, VRE, CRE, C.diff, ESBL) management
'use strict';

const CITATIONS = ['CDC_MDRO_2024','WHO_AMR_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function mdro_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.mdro_type, 'mdro_type', ['mrsa','vre','cre','esbl','c_diff','crab','cr_pa','other']);
  ensureBool(req.prior_history, 'prior_history');
  ensureBool(req.current_admission_screen_done, 'current_screen');
  ensureNumber(req.screen_day_of_admission, 'screen_day');
  ensureEnum(req.screen_site, 'screen_site', ['nares','axilla','groin','rectal','wound','stool','urine','blood','none','other']);
  ensureEnum(req.screen_result, 'screen_result', ['pending','positive','negative','indeterminate','not_collected','other']);

  let status;
  if (req.screen_result === 'pending') status = 'screen_pending_wait_for_result';
  else if (req.screen_result === 'positive') status = 'mdro_positive_initiate_isolation';
  else if (req.mdro_type === 'cre' && req.screen_result === 'negative' && req.prior_history) status = 'cre_prior_history_consider_weekly_screen';
  else if (req.screen_day_of_admission > 2) status = 'screen_over_48h_late';
  else status = 'screen_documented';
  return { status, type: req.mdro_type };
}

function mdro_decolonize(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.decolonization_protocol, 'decolonization_protocol', ['none','mupirocin_2pct_nasal','chlorhexidine_bath','phisohex','bleach_bath','combination','tea_tree','other']);
  ensureNumber(req.treatment_days, 'treatment_days');
  ensureBool(req.tolerated, 'tolerated');
  ensureNumber(req.follow_up_cultures_count, 'follow_up_cultures');
  ensureEnum(req.outcome, 'outcome', ['ongoing','cleared','failed','partial','unknown','other']);

  let status;
  if (req.outcome === 'cleared') status = 'decolonization_successful';
  else if (req.outcome === 'failed') status = 'decolonization_failed_review_regimen';
  else if (req.treatment_days > 14 && req.outcome === 'ongoing') status = 'over_14_days_review_duration';
  else if (!req.tolerated) status = 'intolerance_review_alternative';
  else if (req.follow_up_cultures_count === 0) status = 'follow_up_cultures_required';
  else status = 'decolonization_ongoing';
  return { status, outcome: req.outcome };
}

function mdro_antibiotic_steward(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.mdro_type, 'mdro_type', ['mrsa','vre','cre','esbl','c_diff','crab','cr_pa','other']);
  ensureBool(req.appropriate_antibiotic_started, 'appropriate_abx');
  ensureBool(req.broad_spectrum_empiric, 'broad_empiric');
  ensureNumber(req.days_of_antibiotic, 'days_abx');
  ensureEnum(req.antibiotic, 'antibiotic', ['vancomycin','linezolid','daptomycin','tigecycline','meropenem','cefepime','ceftazidime_avibactam','polymyxin','other']);
  ensureBool(req.de_escalation_done, 'de_escalation');

  let status;
  if (!req.appropriate_antibiotic_started) status = 'appropriate_empiric_required_for_mdro';
  else if (req.broad_spectrum_empiric && req.days_abx > 3 && !req.de_escalation_done) status = 'broad_spectrum_3d_no_de_escalation';
  else if (req.antibiotic === 'meropenem' && req.mdro_type === 'cre') status = 'cre_meropenem_check_mic_review';
  else if (req.days_abx > 14) status = 'over_14d_review_continue_or_stop';
  else status = 'antibiotic_stewardship_appropriate';
  return { status, abx: req.antibiotic };
}

function mdro_precautions(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.private_room, 'private_room');
  ensureBool(req.cohorted, 'cohorted');
  ensureBool(req.dedicated_equipment, 'dedicated_equipment');
  ensureEnum(req.mdro_type, 'mdro_type', ['mrsa','vre','cre','esbl','c_diff','crab','cr_pa','other']);
  ensureBool(req.contact_precautions, 'contact_precautions');
  ensureBool(req.chlorhexidine_bathing, 'chlorhexidine_bathing');

  let status;
  if (req.mdro_type === 'c_diff' && !req.contact_precautions) status = 'c_diff_contact_precautions_required';
  else if (req.mdro_type === 'cre' && !req.private_room && !req.cohorted) status = 'cre_private_or_cohort_required';
  else if (!req.dedicated_equipment) status = 'dedicated_equipment_required_for_mdro';
  else if (req.mdro_type === 'cre' && !req.chlorhexidine_bathing) status = 'cre_chlorhexidine_bathing_recommended';
  else status = 'precautions_appropriate';
  return { status, type: req.mdro_type };
}

function mdro_culture_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.weekly_screens_count, 'weekly_screens');
  ensureEnum(req.mdro_type, 'mdro_type', ['mrsa','vre','cre','esbl','c_diff','crab','cr_pa','other']);
  ensureNumber(req.days_since_first_positive, 'days_first_positive');
  ensureEnum(req.last_screen_status, 'last_screen_status', ['positive','negative','pending','not_done','other']);
  ensureNumber(req.consecutive_negatives, 'consecutive_negatives');

  let status;
  if (req.last_screen_status === 'pending') status = 'pending_follow_up';
  else if (req.consecutive_negatives >= 3) status = 'three_consecutive_negatives_review_dc';
  else if (req.mdro_type === 'cre' && req.consecutive_negatives === 0 && req.days_first_positive > 14) status = 'cre_over_14d_still_positive_review';
  else if (req.weekly_screens_count < 1 && req.days_first_positive > 7) status = 'weekly_screens_overdue';
  else status = 'followup_documented';
  return { status, neg: req.consecutive_negatives };
}

function funcs() { return { mdro_screen, mdro_decolonize, mdro_antibiotic_steward, mdro_precautions, mdro_culture_followup }; }
module.exports = { funcs, CITATIONS, ValidationError };