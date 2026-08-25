// filepath: tier18_infx_ext_125_surveillance_engine.js
// TIER18_INFX_EXT-125: NHSN surveillance (HAI, CLABSI, CAUTI, SSI, VAP)
'use strict';

const CITATIONS = ['NHSN_2024','CDC_HAI_2024','IDSA_AMS_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function infx_clabsi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.central_line_days, 'central_line_days');
  ensureEnum(req.event_type, 'event_type', ['no_event','lcbi_1','lcbi_2','lcbi_3','cvcri_1','cvcri_2','other']);
  ensureNumber(req.blood_culture_positive_count, 'blood_culture_positive_count');
  ensureEnum(req.pathogen, 'pathogen', ['none','staph_aureus','mrsa','ecoli','klebsiella','pseudomonas','candida','coag_neg_staph','enterococcus','other']);
  ensureNumber(req.days_line_in_place, 'days_line_in_place');

  let status;
  if (req.event_type === 'no_event') status = 'no_clabsi_event';
  else if (req.event_type === 'lcbi_1') status = 'lcbi_1_pathogen_identified';
  else if (req.days_line_in_place > 14 && req.event_type !== 'no_event') status = 'prolonged_line_review_removal';
  else if (req.pathogen === 'mrsa') status = 'mrsa_bacteremia_review_mupirocin_decolonization';
  else if (req.blood_culture_positive_count < 2) status = 'lcbi_2_requires_2_positive_cultures';
  else status = 'clabsi_event_classified';
  return { status, event: req.event_type };
}

function infx_cauti(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.foley_days, 'foley_days');
  ensureEnum(req.event_type, 'event_type', ['no_event','suti','abut','other']);
  ensureBool(req.indication_documented, 'indication_documented');
  ensureEnum(req.foley_indication, 'foley_indication', ['none','perioperative','critical_illness','immobility','sacral_wound','comfort_end_of_life','not_documented','other']);
  ensureNumber(req.urine_culture_count, 'urine_culture_count');
  ensureBool(req.daily_review_removal, 'daily_review_removal');

  let status;
  if (req.event_type === 'no_event') status = 'no_cauti_event';
  else if (req.foley_days > 7 && req.event_type !== 'no_event') status = 'prolonged_foley_review_removal';
  else if (!req.daily_review_removal) status = 'daily_foley_review_required';
  else if (!req.indication_documented) status = 'foley_indication_required_documented';
  else if (req.urine_culture_count < 100000) status = 'cauti_requires_over_100k_cfu_ml';
  else status = 'cauti_event_classified';
  return { status, event: req.event_type };
}

function infx_ssi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ssi_class, 'ssi_class', ['no_ssi','superficial_incisional','deep_incisional','organ_space','other']);
  ensureNumber(req.days_post_surgery, 'days_post_surgery');
  ensureEnum(req.wound_class, 'wound_class', ['clean','clean_contaminated','contaminated','dirty_infected','other']);
  ensureBool(req.purin_drainage, 'purin_drainage');
  ensureBool(req.culture_positive, 'culture_positive');
  ensureBool(req.opened_by_surgeon, 'opened_by_surgeon');

  let status;
  if (req.ssi_class === 'no_ssi') status = 'no_ssi_event';
  else if (req.ssi_class === 'organ_space' && req.days_post_surgery > 90) status = 'organ_space_late_review';
  else if (req.ssi_class === 'deep_incisional' && req.days_post_surgery > 30) status = 'deep_incisional_late_review';
  else if (req.wound_class === 'dirty_infected') status = 'dirty_infected_always_ssi_30d_surveillance';
  else if (!req.purin_drainage && !req.opened_by_surgeon) status = 'ssi_requires_drainage_or_opened';
  else status = 'ssi_event_classified';
  return { status, class: req.ssi_class };
}

function infx_vap(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.ventilator_days, 'ventilator_days');
  ensureEnum(req.event_type, 'event_type', ['no_event','pvap_1','pvap_2','ivac','other']);
  ensureNumber(req.temperature_max, 'temperature_max');
  ensureNumber(req.wbc_min, 'wbc_min');
  ensureBool(req.new_antibiotic, 'new_antibiotic');
  ensureEnum(req.oxygenation, 'oxygenation', ['stable','worsening_30pct_fio2','worsening_5_cm_peep','worsening_spontaneous_breath','not_assessed','other']);

  let status;
  if (req.event_type === 'no_event') status = 'no_vap_event';
  else if (req.event_type === 'ivac') status = 'ivac_doesnt_meet_full_pvap_yet';
  else if (!req.new_antibiotic && req.event_type !== 'no_event') status = 'vap_requires_new_antibiotic_continued';
  else if (req.temperature_max < 38 && req.wbc_min > 4000 && req.wbc_min < 12000) status = 'vap_temp_wbc_marginal_review';
  else status = 'vap_event_classified';
  return { status, event: req.event_type };
}

function infx_sir_calc(req) {
  ensureStr(req.unit_id, 'unit_id');
  ensureNumber(req.hai_count, 'hai_count');
  ensureNumber(req.device_days, 'device_days');
  ensureNumber(req.patient_days, 'patient_days');
  ensureEnum(req.hai_type, 'hai_type', ['clabsi','cauti','vap','ssi','mrsa_bact','c_diff','other']);
  ensureNumber(req.predicted_count, 'predicted_count');

  const rate = req.device_days > 0 ? (req.hai_count / req.device_days) * 1000 : 0;
  const sir = req.predicted_count > 0 ? req.hai_count / req.predicted_count : 0;
  let status;
  if (sir > 1.5 && req.hai_count > 1) status = 'sir_above_1.5_excess_review';
  else if (sir < 0.5) status = 'sir_below_0.5_better_than_predicted';
  else status = 'sir_within_expected';
  return { status, sir: Math.round(sir * 100) / 100, rate: Math.round(rate * 100) / 100 };
}

function funcs() { return { infx_clabsi, infx_cauti, infx_ssi, infx_vap, infx_sir_calc }; }
module.exports = { funcs, CITATIONS, ValidationError };