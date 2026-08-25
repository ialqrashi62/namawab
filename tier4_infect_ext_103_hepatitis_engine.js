'use strict';
// TIER4_INFECT_EXT-103: Hepatitis B and C screening/treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AASLD_HBV_2018', 'AASLD_HCV_2023', 'CDC_Hep_2023'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function hepb(req) {
  ensureStr(req.hbsag, 'hbsag'); // positive | negative | unknown
  ensureStr(req.anti_hbc, 'anti_hbc'); // positive | negative | unknown
  ensureStr(req.anti_hbs_titer, 'anti_hbs_titer'); // positive | negative | unknown
  ensureNumber(req.age, 'age');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.immunocompromised, 'immunocompromised');
  ensureBool(req.hiv_positive, 'hiv_positive');
  ensureBool(req.dialysis, 'dialysis');

  let interpretation, recommendation;
  if (req.hbsag === 'positive') {
    interpretation = 'active_infection';
    recommendation = 'confirm_with_hbeag_hbeab_hbvdna_lft_refer_to_specialist';
  } else if (req.anti_hbc === 'positive' && req.anti_hbs_titer === 'negative') {
    interpretation = 'resolved_infection_with_occult_or_false_positive';
    recommendation = 'check_hbv_dna_if_immunocompromised_or_chemotherapy_planned';
  } else if (req.hbsag === 'negative' && req.anti_hbs_titer === 'negative') {
    interpretation = 'susceptible';
    recommendation = (req.pregnant || req.hiv_positive || req.dialysis || req.immunocompromised) ?
      'vaccinate_3_dose_series_with_post_vaccination_titer' : 'vaccinate_if_risk_factors';
  } else if (req.hbsag === 'negative' && req.anti_hbs_titer === 'positive') {
    interpretation = 'immune_vaccination_or_past_infection';
    recommendation = 'no_vaccine_needed';
  } else {
    interpretation = 'incomplete_serology';
    recommendation = 'repeat_serology_with_complete_panel';
  }
  return {
    hbsag: req.hbsag,
    anti_hbc: req.anti_hbc,
    anti_hbs_titer: req.anti_hbs_titer,
    interpretation,
    recommendation,
    citations: CITATIONS,
  };
}

function hepc(req) {
  ensureStr(req.hcv_ab, 'hcv_ab'); // positive | negative | unknown
  ensureNumber(req.age, 'age');
  ensureBool(req.born_1945_1965, 'born_1945_1965');
  ensureBool(req.iv_drug_use, 'iv_drug_use');
  ensureBool(req.pregnant, 'pregnant');
  ensureNumber(req.alp, 'alp');
  ensureNumber(req.alt, 'alt');

  let recommendation;
  if (req.hcv_ab === 'negative') {
    recommendation = (req.iv_drug_use || req.born_1945_1965 || req.pregnant) ?
      'test_annually_until_no_risk' : 'no_routine_retest_unless_new_exposure';
  } else if (req.hcv_ab === 'positive') {
    recommendation = 'confirm_with_hcv_rna_quantitative_and_genotype_refer_to_specialist';
  } else {
    recommendation = 'complete_hcv_antibody_test';
  }
  const liver_injury = req.alp > 120 || req.alt > 80;
  return {
    hcv_ab: req.hcv_ab,
    age: req.age,
    recommendation,
    liver_injury_suspected: liver_injury,
    citations: CITATIONS,
  };
}

module.exports = { hepb, hepc, CITATIONS, ValidationError };