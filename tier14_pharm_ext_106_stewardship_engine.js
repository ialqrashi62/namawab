// filepath: tier14_pharm_ext_106_stewardship_engine.js
// TIER14_PHARM_EXT-106: Antimicrobial & opioid stewardship
'use strict';

const CITATIONS = ['CDC_CORE_2024','WHO_STEWARDSHIP_2024','IDSA_AMS_2024','AHA_STEWARDSHIP_2023'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function abx_review(req) {
  ensureStr(req.order_id, 'order_id');
  ensureEnum(req.antibiotic_class, 'antibiotic_class', ['penicillin','cephalosporin','carbapenem','fluoroquinolone','macrolide','vancomycin_iv','vancomycin_oral','linezolid','daptomycin','tigecycline','polymyxin','aminoglycoside','tetracycline','sulfonamide','other']);
  ensureNumber(req.days_on_antibiotic, 'days_on_antibiotic');
  ensureBool(req.culture_obtained, 'culture_obtained');
  ensureBool(req.culture_results_available, 'culture_results_available');
  ensureEnum(req.indication_class, 'indication_class', ['community_pneumonia','hospital_pneumonia','uti','intra_abdominal','skin_soft_tissue','bacteremia','endocarditis','meningitis','osteomyelitis','surgical_prophylaxis','empiric','unknown','other']);
  ensureBool(req.iv_to_oral_eligible, 'iv_to_oral_eligible');
  ensureBool(req.de_escalation_opportunity, 'de_escalation_opportunity');

  let status;
  if (req.days_on_antibiotic > 7 && req.antibiotic_class === 'carbapenem') status = 'carbapenem_over_7d_review_stewardship';
  else if (req.days_on_antibiotic > 14 && !req.culture_results_available) status = 'over_14d_no_culture_review_stewardship';
  else if (req.de_escalation_opportunity) status = 'de_escalation_opportunity_recommended';
  else if (req.iv_to_oral_eligible) status = 'iv_to_oral_conversion_recommended';
  else if (!req.culture_obtained && req.indication_class === 'empiric') status = 'empiric_culture_required';
  else if (req.culture_results_available && req.antibiotic_class === 'vancomycin_iv' && req.indication_class !== 'bacteremia' && req.indication_class !== 'endocarditis') status = 'broad_spectrum_narrow_review';
  else status = 'antibiotic_review_complete';
  return { status, class: req.antibiotic_class };
}

function abx_iv_to_oral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.current_antibiotic_id, 'current_antibiotic_id');
  ensureStr(req.oral_alternative_id, 'oral_alternative_id');
  ensureBool(req.afebrile_24h, 'afebrile_24h');
  ensureBool(req.tolerating_oral_intake, 'tolerating_oral_intake');
  ensureBool(req.normal_gastrointestinal, 'normal_gastrointestinal');
  ensureBool(req.culture_specific, 'culture_specific');

  let status;
  if (!req.afebrile_24h) status = 'still_febrile_not_yet';
  else if (!req.tolerating_oral_intake) status = 'not_tolerating_po_delay';
  else if (!req.normal_gastrointestinal) status = 'gi_dysfunction_malabsorption_concern';
  else if (!req.culture_specific) status = 'empiric_broad_culture_narrow_first';
  else status = 'iv_to_oral_conversion_recommended';
  return { status, oral: req.oral_alternative_id };
}

function opioid_stewardship(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.opioid_class, 'opioid_class', ['morphine_mg_per_day','oxycodone_mg_per_day','hydromorphone_mg_per_day','fentanyl_patch','methadone','tramadol','codeine','buprenorphine','other']);
  ensureNumber(req.mme_per_day, 'mme_per_day');
  ensureNumber(req.days_on_opioid, 'days_on_opioid');
  ensureBool(req.pain_agreement_signed, 'pain_agreement_signed');
  ensureBool(req.urine_drug_screen_current, 'urine_drug_screen_current');
  ensureBool(req.pdmp_reviewed, 'pdmp_reviewed');
  ensureBool(req.naloxone_co_prescribed, 'naloxone_co_prescribed');

  let status;
  if (req.mme_per_day >= 100 && !req.naloxone_co_prescribed) status = 'high_mme_100_plus_naloxone_required';
  else if (req.days_on_opioid > 90 && req.opioid_class !== 'buprenorphine') status = 'over_90d_opioid_review_weaning';
  else if (!req.pain_agreement_signed) status = 'pain_agreement_required_for_chronic';
  else if (!req.pdmp_reviewed) status = 'pdmp_review_required_by_law';
  else if (!req.urine_drug_screen_current && req.days_on_opioid > 30) status = 'uds_overdue_30d';
  else if (req.mme_per_day >= 50) status = 'moderate_mme_review_weaning_options';
  else status = 'opioid_review_appropriate';
  return { status, mme: req.mme_per_day };
}

function stewardship_metric(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.ddot_ant, 'dd_ddot');
  ensureNumber(req.days_therapy_per_1000, 'days_therapy_per_1000');
  ensureNumber(req.iv_to_oral_conversions, 'iv_to_oral_conversions');
  ensureNumber(req.iv_to_oral_eligible_count, 'iv_to_oral_eligible_count');
  ensureNumber(req.antibiotic_cost_per_100d, 'antibiotic_cost_per_100d');

  const conversion_rate = req.iv_to_oral_eligible_count > 0 ? req.iv_to_oral_conversions / req.iv_to_oral_eligible_count : 0;
  let summary;
  if (req.days_therapy_per_1000 < 250) summary = 'low_dot_excellent';
  else if (req.days_therapy_per_1000 < 500) summary = 'within_recommended_range';
  else if (req.days_therapy_per_1000 < 800) summary = 'high_dot_review';
  else if (req.days_therapy_per_1000 >= 800) summary = 'very_high_dot_priority_intervention';
  else summary = 'metric_calculated';
  return { summary, conversion_rate: Math.round(conversion_rate * 1000) / 10, dot: req.days_therapy_per_1000 };
}

function stewardship_dashboard(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.prescriptions_total, 'prescriptions_total');
  ensureNumber(req.reviews_completed, 'reviews_completed');
  ensureNumber(req.interventions_total, 'interventions_total');
  ensureNumber(req.interventions_accepted, 'interventions_accepted');
  ensureNumber(req.antibiotic_days_saved, 'antibiotic_days_saved');
  ensureNumber(req.dollars_saved, 'dollars_saved');

  const review_rate = req.prescriptions_total > 0 ? req.reviews_completed / req.prescriptions_total : 0;
  const acceptance_rate = req.interventions_total > 0 ? req.interventions_accepted / req.interventions_total : 0;
  let summary;
  if (review_rate >= 0.5 && acceptance_rate >= 0.7) summary = 'high_performing_stewardship';
  else if (review_rate >= 0.3 && acceptance_rate >= 0.5) summary = 'moderate_performing_increase_target';
  else if (req.interventions_total === 0) summary = 'no_interventions_low_engagement';
  else summary = 'developing_program';
  return { summary, review_rate: Math.round(review_rate * 1000) / 10, acceptance_rate: Math.round(acceptance_rate * 1000) / 10 };
}

function funcs() { return { abx_review, abx_iv_to_oral, opioid_stewardship, stewardship_metric, stewardship_dashboard }; }
module.exports = { funcs, CITATIONS, ValidationError };