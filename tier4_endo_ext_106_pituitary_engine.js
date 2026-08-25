'use strict';
// TIER4_ENDO_EXT-106: Pituitary - acromegaly, prolactinoma
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AACE_Pituitary_2011', 'Endocrine_Society_Pituitary_2011'];

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

function acromegaly(req) {
  ensureNumber(req.igf1, 'igf1');
  ensureNumber(req.age, 'age');
  ensureNumber(req.growth_hormone_post_ogtt, 'growth_hormone_post_ogtt');
  ensureBool(req.hat_size_increase, 'hat_size_increase');
  ensureBool(req.frontal_bossing, 'frontal_bossing');
  ensureBool(req.diaphoresis, 'diaphoresis');
  ensureBool(req.jaw_protrusion, 'jaw_protrusion');
  ensureBool(req.visual_field_defect, 'visual_field_defect');

  const biochem = req.igf1 > 1 && req.growth_hormone_post_ogtt > 1;
  const clinical_signs = [req.hat_size_increase, req.frontal_bossing, req.diaphoresis, req.jaw_protrusion].filter(Boolean).length;
  const macroadenoma = req.visual_field_defect;
  return {
    acromegaly_diagnosis: biochem && clinical_signs >= 1,
    workup: biochem ? ['pituitary_mri', 'visual_field_test', 'echocardiogram', 'colonoscopy'] : ['repeat_igf1_after_3_months'],
    macroadenoma,
    treatment: macroadenoma ? 'transsphenoidal_surgery_first_then_medical' :
      clinical_signs >= 2 ? 'consider_surgery_vs_medical_therapy' :
        'medical_therapy_somatostatin_analog_or_peglvisomant',
    citations: CITATIONS,
  };
}

function prolactinoma(req) {
  ensureBool(req.female, 'female');
  ensureNumber(req.prolactin, 'prolactin');
  ensureBool(req.galactorrhea, 'galactorrhea');
  ensureBool(req.amenorrhea, 'amenorrhea');
  ensureBool(req.headache, 'headache');
  ensureBool(req.visual_field_defect, 'visual_field_defect');
  ensureNumber(req.tumor_size_mm, 'tumor_size_mm');
  ensureBool(req.pregnant, 'pregnant');

  const macroprolactinoma = req.tumor_size_mm >= 10;
  const dopamine_agonist = macroprolactinoma || req.prolactin > 200 ? 'cabergoline_first_line' :
    req.prolactin > 100 ? 'cabergoline_or_bromocriptine' :
      'observe_if_asymptomatic';
  const safe_in_pregnancy = req.pregnant ? 'bromocriptine_preferred_discontinue_dopamine_agonist_when_pregnancy_confirmed_for_macroprolactinoma' : '';
  return {
    prolactin: req.prolactin,
    macroprolactinoma,
    microprolactinoma: req.tumor_size_mm < 10,
    treatment: req.pregnant ? safe_in_pregnancy : dopamine_agonist,
    monitoring: req.tumor_size_mm >= 10 ? 'mri_q6_months_then_yearly' : 'prolactin_q3_6_months',
    citations: CITATIONS,
  };
}

module.exports = { acromegaly, prolactinoma, CITATIONS, ValidationError };