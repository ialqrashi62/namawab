'use strict';
// TIER4_NEURO_EXT-103: Multiple Sclerosis (McDonald + DMT)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['McDonald_2017', 'ECTRIMS_ECTRIMS_2018'];

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

function criteria(req) {
  ensureNumber(req.attacks, 'attacks');
  ensureBool(req.mri_lesions_t2, 'mri_lesions_t2');
  ensureBool(req.mri_lesions_enhancing, 'mri_lesions_enhancing');
  ensureBool(req.csf_oligoclonal, 'csf_oligoclonal');
  ensureNumber(req.dissemination_time_months, 'dissemination_time_months');
  ensureNumber(req.dissemination_space_lesions, 'dissemination_space_lesions');

  // McDonald 2017: dissemination in time + space
  const time = req.dissemination_time_months >= 3 || req.mri_lesions_enhancing || (req.attacks >= 2 && req.dissemination_time_months >= 1);
  const space = req.dissemination_space_lesions >= 2 || (req.mri_lesions_t2 && (req.mri_lesions_enhancing || req.csf_oligoclonal));
  const ms_diagnosis = (req.attacks >= 2 && space) || (req.attacks >= 1 && space && time) || (req.attacks >= 1 && space && req.csf_oligoclonal);
  return {
    attacks: req.attacks,
    dissemination_in_space: space,
    dissemination_in_time: time,
    ms_diagnosis,
    csf_oligoclonal: req.csf_oligoclonal,
    next_step: ms_diagnosis ? 'initiate_disease_modifying_therapy' : 'repeat_mri_in_3_6_months_or_exclude_alternatives',
    citations: CITATIONS,
  };
}

function dmt(req) {
  ensureStr(req.disease_course, 'disease_course'); // rrms | spms | ppms | cis
  ensureNumber(req.age, 'age');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.highly_active, 'highly_active');
  ensureBool(req.anti_jcv_positive, 'anti_jcv_positive');

  let first_line, escalation;
  if (req.disease_course === 'rrms') {
    first_line = req.highly_active ? 'ocrelizumab_or_cladribine_or_alemtuzumab' :
      req.anti_jcv_positive ? 'dimethyl_fumarate_or_fingolimod_or_ocrelizumab' :
        'interferon_beta_or_glatiramer_or_teriflunomide';
    escalation = req.highly_active ? 'oCRElizumab_or_alemtuzumab' : 'natalizumab_or_fingolimod_or_ocrelizumab';
  } else if (req.disease_course === 'cis') {
    first_line = 'interferon_beta_or_glatiramer';
    escalation = 'no_escalation';
  } else if (req.disease_course === 'spms') {
    first_line = 'siponimod_or_mitoxantrone';
    escalation = 'individualized';
  } else if (req.disease_course === 'ppms') {
    first_line = 'ocrelizumab';
    escalation = 'none';
  } else {
    first_line = 'unspecified';
    escalation = 'unspecified';
  }
  if (req.pregnant) first_line = 'interferon_beta_or_glatiramer_safe_in_pregnancy';
  return {
    disease_course: req.disease_course,
    first_line,
    escalation,
    monitoring: first_line.includes('natalizumab') ? 'anti_jcv_every_6_months' : 'mri_q6_12_months_labs',
    citations: CITATIONS,
  };
}

module.exports = { criteria, dmt, CITATIONS, ValidationError };