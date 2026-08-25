'use strict';
// TIER4_GI_EXT-103: IBS Rome IV
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['Rome_IV_2016', 'AGA_IBS_2020'];

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

function diagnose(req) {
  ensureNumber(req.abdominal_pain_days_per_month, 'abdominal_pain_days_per_month');
  ensureBool(req.pain_related_defecation, 'pain_related_defecation');
  ensureBool(req.change_stool_frequency, 'change_stool_frequency');
  ensureBool(req.change_stool_form, 'change_stool_form');
  ensureBool(req.rectal_bleeding, 'rectal_bleeding');
  ensureBool(req.weight_loss, 'weight_loss');
  ensureBool(req.anemia, 'anemia');
  ensureNumber(req.crp, 'crp');
  ensureBool(req.nocturnal_symptoms, 'nocturnal_symptoms');

  const alarm = req.rectal_bleeding || req.weight_loss || req.anemia || req.nocturnal_symptoms || req.crp > 10;
  const ibs = !alarm && req.abdominal_pain_days_per_month >= 1 && req.pain_related_defecation &&
    (req.change_stool_frequency || req.change_stool_form);
  let subtype = 'unspecified';
  if (req.change_stool_form) subtype = 'ibs_c_or_d_or_mixed';
  return {
    ibs_criteria_met: ibs,
    alarm_features: alarm,
    subtype,
    workup: alarm ? ['colonoscopy', 'labs', 'imaging_per_alarm'] : ['limited_workup_under_50'],
    citations: CITATIONS,
  };
}

function treat(req) {
  ensureStr(req.subtype, 'subtype'); // c | d | mixed | unspecified
  ensureBool(req.bloating, 'bloating');
  ensureBool(req.severe_pain, 'severe_pain');
  ensureBool(req.psychiatric_comorbidity, 'psychiatric_comorbidity');

  const first_line = req.subtype === 'c' ? 'osmotic_laxative_polyethylene_glycol' :
    req.subtype === 'd' ? 'loperamide_or_rifaximin_or_5ht3_antagonist' :
      req.bloating ? 'rifaximin_or_low_fodmap_diet' :
        'antispasmodic_loperamide_low_fodmap';
  const psychological = req.psychiatric_comorbidity || req.severe_pain ? 'cbt_or_ibs_hypnotherapy' : 'education_reassurance';
  return {
    first_line,
    dietary: req.bloating ? 'low_fodmap_4_8_weeks_then_reintroduce' : 'regular_diet',
    psychological,
    citations: CITATIONS,
  };
}

module.exports = { diagnose, treat, CITATIONS, ValidationError };