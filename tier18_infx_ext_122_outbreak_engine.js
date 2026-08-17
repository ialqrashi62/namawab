// filepath: tier18_infx_ext_122_outbreak_engine.js
// TIER18_INFX_EXT-122: Outbreak detection, cluster analysis
'use strict';

const CITATIONS = ['CDC_OUTBREAK_2024','WHO_OUTBREAK_2024','IDSA_AMS_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function outbreak_detect(req) {
  ensureStr(req.unit_id, 'unit_id');
  ensureNumber(req.cases_count, 'cases_count');
  ensureNumber(req.baseline_count, 'baseline_count');
  ensureNumber(req.days_window, 'days_window');
  ensureEnum(req.pathogen, 'pathogen', ['none','sars_cov_2','influenza','rsv','norovirus','mrsa','vre','c_diff','cdiff','acinetobacter','other']);
  ensureBool(req.identical_strain, 'identical_strain');
  ensureNumber(req.geo_link, 'geo_link');

  let status;
  const ratio = req.baseline_count > 0 ? req.cases_count / req.baseline_count : 0;
  if (ratio >= 3 && req.identical_strain) status = 'confirmed_outbreak_activate_response';
  else if (ratio >= 2) status = 'potential_outbreak_investigate';
  else if (req.pathogen === 'sars_cov_2' && req.cases_count > 2) status = 'covid_cluster_review';
  else if (ratio < 1.5) status = 'no_outbreak_threshold';
  else status = 'elevated_review';
  return { status, ratio: Math.round(ratio * 10) / 10 };
}

function outbreak_organism(req) {
  ensureStr(req.outbreak_id, 'outbreak_id');
  ensureEnum(req.organism_type, 'organism_type', ['bacterial','viral','fungal','parasitic','mixed','other']);
  ensureEnum(req.organism, 'organism', ['sars_cov_2','influenza_a','influenza_b','rsv','norovirus','mrsa','vre','c_difficile','ecoli','salmonella','listeria','acinetobacter','other']);
  ensureBool(req.antibiotic_resistance, 'antibiotic_resistance');
  ensureNumber(req.affected_count, 'affected_count');
  ensureNumber(req.symptom_onset_hours, 'symptom_onset_hours');
  ensureBool(req.healthcare_associated, 'healthcare_associated');

  let status;
  if (req.organism === 'c_difficile' && req.healthcare_associated) status = 'c_diff_healthcare_associated_isolation_contact';
  else if (req.organism === 'sars_cov_2' && req.symptom_onset_hours < 24) status = 'covid_acute_cluster';
  else if (req.antibiotic_resistance) status = 'mdro_cluster_enhanced_isolation';
  else if (req.organism_type === 'viral' && req.affected_count > 5) status = 'viral_cluster_droplet_precautions';
  else if (req.organism === 'listeria') status = 'listeria_urgent_foodborne_investigation';
  else status = 'outbreak_organism_classified';
  return { status, organism: req.organism };
}

function outbreak_exposure(req) {
  ensureStr(req.outbreak_id, 'outbreak_id');
  ensureEnum(req.exposure_type, 'exposure_type', ['food_water','airborne','droplet','contact_direct','contact_indirect','bloodborne','vector','environmental','common_source','unknown','other']);
  ensureBool(req.common_source_identified, 'common_source_identified');
  ensureStr(req.exposure_source, 'exposure_source');
  ensureNumber(req.exposed_count, 'exposed_count');
  ensureNumber(req.lab_confirmed_count, 'lab_confirmed_count');
  ensureBool(req.line_list_active, 'line_list_active');

  let status;
  if (req.exposure_type === 'common_source' && req.common_source_identified) status = 'common_source_identified_remove_and_test';
  else if (req.exposure_type === 'food_water' && req.lab_confirmed_count > 2) status = 'food_water_cluster_immediate_culture';
  else if (!req.line_list_active) status = 'line_list_required_for_active_outbreak';
  else if (req.lab_confirmed_count / Math.max(req.exposed_count, 1) < 0.1) status = 'low_attack_rate_review_diagnosis';
  else status = 'exposure_review_ongoing';
  return { status, exposure: req.exposure_type };
}

function outbreak_response(req) {
  ensureStr(req.outbreak_id, 'outbreak_id');
  ensureBool(req.ic_team_activated, 'ic_team_activated');
  ensureBool(req.administration_notified, 'administration_notified');
  ensureBool(req.public_health_notified, 'public_health_notified');
  ensureBool(req.enhanced_surveillance, 'enhanced_surveillance');
  ensureBool(req.environmental_cultures_done, 'environmental_cultures');
  ensureBool(req.policies_reviewed, 'policies_reviewed');
  ensureNumber(req.cases_recent_24h, 'cases_recent_24h');

  let status;
  if (!req.ic_team_activated) status = 'ic_team_activation_required';
  else if (req.cases_recent_24h > 3 && !req.administration_notified) status = 'admin_notification_over_3_cases_24h';
  else if (req.cases_recent_24h > 5 && !req.public_health_notified) status = 'public_health_notifiable_over_5_cases';
  else if (!req.enhanced_surveillance) status = 'enhanced_surveillance_required_during_outbreak';
  else if (!req.environmental_cultures_done) status = 'environmental_cultures_required';
  else status = 'response_activated';
  return { status, ic: req.ic_team_activated };
}

function outbreak_close(req) {
  ensureStr(req.outbreak_id, 'outbreak_id');
  ensureNumber(req.days_since_last_case, 'days_since_last_case');
  ensureNumber(req.attack_rate_pct, 'attack_rate_pct');
  ensureEnum(req.closure_status, 'closure_status', ['ongoing','no_new_cases_2_incu','no_new_cases_2x_max_incubation','closed_review_only','closed_failed','closed_controlled','other']);
  ensureNumber(req.total_cases, 'total_cases');
  ensureNumber(req.total_deaths, 'total_deaths');

  let status;
  if (req.days_since_last_case < 14 && req.closure_status === 'closed_review_only') status = 'too_early_to_close_review';
  else if (req.total_deaths > 0 && req.closure_status === 'closed_failed') status = 'closed_failure_mortality_review';
  else if (req.attack_rate_pct < 5 && req.closure_status === 'closed_controlled') status = 'low_attack_rate_close_success';
  else status = 'closure_documented';
  return { status, closed: req.closure_status };
}

function funcs() { return { outbreak_detect, outbreak_organism, outbreak_exposure, outbreak_response, outbreak_close }; }
module.exports = { funcs, CITATIONS, ValidationError };