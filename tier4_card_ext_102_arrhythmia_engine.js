'use strict';
// TIER4_CARD_EXT-102: Arrhythmia — AF anticoagulation and VT risk
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACC_AHA_AF_2023', 'ESC_AF_2020', 'AHA_VT_2022'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureEnum(v, allowed, field) {
  if (!allowed.includes(v)) throw new ValidationError(`${field} must be one of ${allowed.join('|')}`, { [field]: v });
  return v;
}

function af(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.congestive_hf, 'congestive_hf');
  ensureBool(req.hypertension, 'hypertension');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.stroke_tia, 'stroke_tia');
  ensureBool(req.thromboembolism, 'thromboembolism');
  ensureBool(req.vascular_disease, 'vascular_disease');
  ensureBool(req.female, 'female');
  ensureBool(req.bleeding_active, 'bleeding_active');
  ensureBool(req.pregnant, 'pregnant');
  ensureNumber(req.egfr, 'egfr');

  let score = 0;
  if (req.congestive_hf) score++;
  if (req.hypertension) score++;
  if (req.age >= 75) score += 2;
  else if (req.age >= 65) score++;
  if (req.diabetes) score++;
  if (req.stroke_tia || req.thromboembolism) score += 2;
  if (req.vascular_disease) score++;
  if (req.female) score++;
  const sex_adjust = req.female ? -1 : 0;
  const cha2ds2vasc = score + (req.female ? -1 : 0); // AHA: female only counts as risk factor if >= 1 other risk
  const anticoag_indicated = (cha2ds2vasc >= 2 && req.female === false) || (cha2ds2vasc >= 3 && req.female);
  const anticoag = req.bleeding_active || req.pregnant ? 'contraindicated' :
    req.egfr >= 50 ? 'dabigatran_or_rivaroxaban_or_apixaban_or_edoxaban' :
    req.egfr >= 30 ? 'apixaban_or_rivaroxaban_renal_dose' :
    'warfarin_with_inr_monitoring';
  return {
    cha2ds2vasc: cha2ds2vasc,
    sex_adjustment: sex_adjust,
    anticoag_indicated,
    anticoag_choice: anticoag_indicated ? anticoag : 'no_anticoagulation',
    citations: CITATIONS,
  };
}

function vt(req) {
  ensureNumber(req.lvef, 'lvef');
  ensureNumber(req.age, 'age');
  ensureBool(req.syncope, 'syncope');
  ensureBool(req.nonsustained_vt, 'nonsustained_vt');
  ensureBool(req.heart_failure, 'heart_failure');
  ensureBool(req.myocardial_infarction, 'myocardial_infarction');
  ensureBool(req.family_history_scd, 'family_history_scd');

  const high_risk = req.lvef <= 35 && (req.myocardial_infarction || req.heart_failure);
  const secondary_prevention = req.lvef <= 35 && req.syncope && (req.nonsustained_vt || req.myocardial_infarction);
  const icd_indicated = high_risk && req.age >= 18 && req.age <= 80;
  return {
    lvef: req.lvef,
    high_risk,
    icd_indicated_primary: icd_indicated && !secondary_prevention,
    icd_indicated_secondary: secondary_prevention,
    recommendations: icd_indicated ? ['icd_for_scd_prevention', 'optimal_medical_therapy', 'refer_to_electrophysiology'] :
      ['medical_therapy', 'follow_up_lvef'],
    citations: CITATIONS,
  };
}

module.exports = { af, vt, CITATIONS, ValidationError };