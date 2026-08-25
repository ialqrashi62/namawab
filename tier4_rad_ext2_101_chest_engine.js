'use strict';
// TIER4_RAD_EXT2-101: Chest - CXR pattern recognition + nodule + PE
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACR_Chest_2017', 'Fleischner_Nodule_2017', 'RSNA_Pneumonia_2019'];

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

function cxr_interpret(req) {
  ensureBool(req.consolidation, 'consolidation');
  ensureBool(req.pleural_effusion, 'pleural_effusion');
  ensureBool(req.pneumothorax, 'pneumothorax');
  ensureBool(req.cardiomegaly, 'cardiomegaly');
  ensureBool(req.mass, 'mass');
  ensureBool(req.pulmonary_edema, 'pulmonary_edema');
  ensureNumber(req.age, 'age');

  const findings = [];
  if (req.consolidation) findings.push('consolidation');
  if (req.pleural_effusion) findings.push('pleural_effusion');
  if (req.pneumothorax) findings.push('pneumothorax');
  if (req.cardiomegaly) findings.push('cardiomegaly');
  if (req.mass) findings.push('mass');
  if (req.pulmonary_edema) findings.push('pulmonary_edema');
  return {
    findings,
    recommendation: req.pneumothorax ? 'tension_check_chest_tube' :
      req.mass ? 'urgent_ct_chest_with_contrast_then_oncology' :
        req.consolidation ? 'pneumonia_treatment_per_severity' :
          req.pulmonary_edema ? 'diuresis_and_echocardiogram' :
            'clinical_correlation',
    citations: CITATIONS,
  };
}

function nodule(req) {
  ensureNumber(req.size_mm, 'size_mm');
  ensureBool(req.spiculation, 'spiculation');
  ensureNumber(req.age, 'age');
  ensureBool(req.smoker, 'smoker');

  let risk;
  if (req.spiculation) risk = 'high_suspicion_for_malignancy';
  else if (req.size_mm >= 8) risk = req.smoker ? 'intermediate_to_high' : 'low_to_intermediate';
  else risk = 'low';
  const followup = req.size_mm < 6 ? 'no_followup_or_optional_q12_months' :
    req.size_mm < 8 && !req.spiculation ? 'ct_q6_12_months' :
      'ct_q3_months_then_q12_months_or_consider_biopsy_pet_ct';
  return {
    size_mm: req.size_mm,
    risk,
    followup,
    citations: CITATIONS,
  };
}

function pe(req) {
  ensureNumber(req.wells, 'wells');
  ensureNumber(req.ddimer, 'ddimer');
  ensureNumber(req.spo2, 'spo2');
  ensureBool(req.pregnant, 'pregnant');
  ensureNumber(req.doppler_legs_positive, 'doppler_legs_positive');

  let strategy;
  if (req.pregnant) strategy = 'bilateral_compression_us_then_q_vq_scan_or_ctpa_with_breast_shielding';
  else if (req.ddimer > 500 || req.wells >= 4) strategy = 'ctpa';
  else if (req.doppler_legs_positive === 1) strategy = 'treat_dvt_then_ctpa_or_vq_scan';
  else strategy = 'no_imaging_d_dimer_imaging_per_clinical_suspicion';
  return {
    wells: req.wells,
    ddimer: req.ddimer,
    strategy,
    pretreatment_check: 'creatinine_pregnancy_then_imaging',
    citations: CITATIONS,
  };
}

module.exports = { cxr_interpret, nodule, pe, CITATIONS, ValidationError };