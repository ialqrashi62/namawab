'use strict';
// TIER4_INFECT_EXT-104: TB screening and IGRA/TST
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['CDC_TB_2022', 'WHO_TB_2023', 'NTCA_TB_2017'];

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
  ensureBool(req.born_high_prevalence, 'born_high_prevalence');
  ensureBool(req.hiv_positive, 'hiv_positive');
  ensureBool(req.immunosuppressed, 'immunosuppressed');
  ensureBool(req.tnf_inhibitor, 'tnf_inhibitor');
  ensureBool(req.dialysis, 'dialysis');
  ensureBool(req.solid_organ_transplant, 'solid_organ_transplant');
  ensureBool(req.silicosis, 'silicosis');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.tb_contact, 'tb_contact');
  ensureBool(req.homeless, 'homeless');
  ensureBool(req.iv_drug_use, 'iv_drug_use');
  ensureBool(req.healthcare_worker, 'healthcare_worker');
  ensureBool(req.cough, 'cough');
  ensureBool(req.fever, 'fever');
  ensureBool(req.night_sweats, 'night_sweats');
  ensureBool(req.weight_loss, 'weight_loss');

  const high_risk = req.hiv_positive || req.tnf_inhibitor || req.solid_organ_transplant || req.born_high_prevalence || req.tb_contact;
  const symptoms = [req.cough, req.fever, req.night_sweats, req.weight_loss].filter(Boolean).length;

  let recommendation;
  if (symptoms >= 1 && (req.cough >= 3 || (req.fever && req.weight_loss))) {
    recommendation = 'active_tb_workup_chest_xray_sputum_afb_and_NAAT_respiratory_isolation';
  } else if (high_risk) {
    recommendation = 'igra_or_tst_screen_even_if_asymptomatic_annual_repeat_if_hiv_or_high_risk';
  } else if (req.healthcare_worker) {
    recommendation = 'baseline_igra_or_tst_per_occupational_health';
  } else {
    recommendation = 'no_routine_screening';
  }
  return {
    age: req.age,
    high_risk,
    symptoms_count: symptoms,
    recommendation,
    test_preferred: req.age < 5 ? 'tst' : 'igra',
    citations: CITATIONS,
  };
}

function interpret(req) {
  ensureStr(req.test_type, 'test_type'); // igra | tst
  ensureNumber(req.tst_mm, 'tst_mm');
  ensureStr(req.igra_result, 'igra_result'); // positive | negative | indeterminate
  ensureBool(req.hiv_positive, 'hiv_positive');
  ensureBool(req.tb_contact, 'tb_contact');
  ensureBool(req.immunosuppressed, 'immunosuppressed');

  let positive;
  if (req.test_type === 'tst') {
    positive = req.hiv_positive || req.tb_contact ? req.tst_mm >= 5 :
      req.immunosuppressed ? req.tst_mm >= 10 :
        req.tst_mm >= 15;
  } else {
    positive = req.igra_result === 'positive';
  }
  return {
    test_type: req.test_type,
    result: positive ? 'positive' : 'negative',
    indeterminate: req.test_type === 'igra' && req.igra_result === 'indeterminate',
    next: positive ? 'chest_xray_and_clinical_evaluation_latent_tb_treatment_if_no_active_disease' :
      req.test_type === 'igra' && req.igra_result === 'indeterminate' ? 'repeat_test_in_2_4_weeks_or_use_tst' :
        'no_tb_evidence_repeat_per_risk',
    citations: CITATIONS,
  };
}

module.exports = { screen, interpret, CITATIONS, ValidationError };