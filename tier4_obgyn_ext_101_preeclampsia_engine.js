'use strict';
// TIER4_OBGYN_EXT-101: Preeclampsia - severity + Mg
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACOG_Preeclampsia_2020', 'Hypertension_Pregnancy_2017'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function severity(req) {
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.dbp, 'dbp');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.proteinuria, 'proteinuria');
  ensureBool(req.severe_features, 'severe_features');
  ensureBool(req.thrombocytopenia, 'thrombocytopenia');
  ensureNumber(req.creatinine, 'creatinine');
  ensureNumber(req.ast, 'ast');
  ensureNumber(req.alt, 'alt');
  ensureBool(req.headache, 'headache');
  ensureBool(req.visual_disturbance, 'visual_disturbance');
  ensureBool(req.epigastric_pain, 'epigastric_pain');

  const severe = req.sbp >= 160 || req.dbp >= 110 || req.thrombocytopenia || req.creatinine >= 1.1 ||
    req.ast >= 80 || req.headache || req.visual_disturbance || req.epigastric_pain;
  const eclampsia = req.severe_features && (req.headache || req.visual_disturbance);
  const onset = req.gestational_age_weeks < 34 ? 'early_onset' :
    req.gestational_age_weeks < 37 ? 'preterm' : 'term';

  return {
    onset,
    severity: severe ? 'preeclampsia_with_severe_features' : 'preeclampsia_without_severe_features',
    severe_features_present: severe,
    eclampsia_imminent: eclampsia,
    mg_sulfate_indicated: severe || onset === 'early_onset',
    delivery_timing: severe ? req.gestational_age_weeks >= 34 ? 'deliver' : 'stabilize_then_deliver_with_steroids' : 'expectant_until_37_weeks',
    citations: CITATIONS,
  };
}

function mg(req) {
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.creatinine, 'creatinine');
  ensureBool(req.severe, 'severe');
  ensureBool(req.dtr_present, 'dtr_present');
  ensureBool(req.respiratory_depression, 'respiratory_depression');

  const loading = req.severe ? '4_to_6g_iv_over_15_to_20_min' : 'consider_per_protocol';
  const maintenance = '1_to_2g_per_hour_iv_continuous';
  const monitoring = ['dtr_q1h', 'serum_mg_q4_to_6h_target_4_to_7', 'urine_output_q1h', 'respiratory_rate_q1h'];
  const toxicity_check = req.dtr_present === false ? 'absent_dtrs_assess_toxicity_risk' : 'dtrs_present_safe';
  const antidote = req.respiratory_depression ? 'iv_calcium_gluconate_1g_over_10_min' : 'no_antidote_needed';
  return {
    loading,
    maintenance,
    monitoring,
    toxicity_check,
    antidote,
    duration: '24h_post_delivery_or_24h_after_last_seizure',
    renal_adjustment: req.creatinine >= 1.1 ? 'consider_dose_reduction_per_renal_function' : 'standard_dose',
    citations: CITATIONS,
  };
}

module.exports = { severity, mg, CITATIONS, ValidationError };