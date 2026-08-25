'use strict';
// TIER4_INFECT_EXT-102: HIV screening and ART initiation
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['DHHS_HIV_2023', 'WHO_HIV_2022'];

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

function screen(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.partner_hiv_positive, 'partner_hiv_positive');
  ensureBool(req.msm, 'msm');
  ensureBool(req.iv_drug_use, 'iv_drug_use');
  ensureBool(req.commercial_sex, 'commercial_sex');
  ensureBool(req.needle_exposure, 'needle_exposure');
  ensureBool(req.sti_now, 'sti_now');
  ensureBool(req.tb_diagnosis, 'tb_diagnosis');
  ensureBool(req.hepatitis_diagnosis, 'hepatitis_diagnosis');

  const risk_count = [
    req.partner_hiv_positive, req.msm, req.iv_drug_use, req.commercial_sex,
    req.needle_exposure, req.sti_now, req.tb_diagnosis, req.hepatitis_diagnosis,
  ].filter(Boolean).length;

  const recommendation = req.partner_hiv_positive || req.iv_drug_use || risk_count >= 2 ? 'test_now_and_every_3_months' :
    req.age >= 13 && req.age <= 64 ? 'opt_out_routine_screening_annually' :
    'consider_per_clinical_indication';

  return {
    age: req.age,
    pregnant: req.pregnant,
    risk_count,
    recommendation,
    test_type: 'fourth_generation_antigen_antibody',
    citations: CITATIONS,
  };
}

function art(req) {
  ensureNumber(req.cd4, 'cd4');
  ensureNumber(req.viral_load, 'viral_load');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.hbv_coinfection, 'hbv_coinfection');
  ensureBool(req.kidney_disease, 'kidney_disease');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.weight_kg, 'weight_kg');

  const start_art = true; // DHHS: start all HIV+ regardless of CD4
  const preferred_regimen = req.pregnant ? 'tenofovir_emtricitabine_dolutegravir' :
    req.hbv_coinfection ? 'tenofovir_emtricitabine_dolutegravir' :
    req.egfr >= 50 ? 'tenofovir_alafenamide_emtricitabine_dolutegravir' :
    'abacavir_lamivudine_dolutegravir_or_renal_dose_adjustment';

  return {
    cd4: req.cd4,
    viral_load: req.viral_load,
    pregnant: req.pregnant,
    egfr: req.egfr,
    start_art,
    preferred_regimen,
    monitoring: ['cd4_q3_6_months', 'viral_load_q3_6_months_target_undetectable', 'renal_liver_q3_months'],
    citations: CITATIONS,
  };
}

module.exports = { screen, art, CITATIONS, ValidationError };