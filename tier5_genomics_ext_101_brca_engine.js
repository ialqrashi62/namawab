'use strict';
// TIER5_GENOMICS_EXT-101: BRCA screening + risk management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['NCCN_BRCA_2023', 'ACOG_BreastCancer_2019'];

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
  ensureBool(req.female, 'female');
  ensureNumber(req.first_degree_relatives_breast_ovarian, 'first_degree_relatives_breast_ovarian');
  ensureNumber(req.second_degree_relatives_breast_ovarian, 'second_degree_relatives_breast_ovarian');
  ensureBool(req.ashkenazi_jewish, 'ashkenazi_jewish');
  ensureBool(req.male_breast_cancer_relative, 'male_breast_cancer_relative');
  ensureBool(req.early_onset_relative_lt_50, 'early_onset_relative_lt_50');
  ensureBool(req.triple_negative_breast_relative_lt_60, 'triple_negative_breast_relative_lt_60');
  ensureBool(req.personal_history_breast_cancer, 'personal_history_breast_cancer');
  ensureBool(req.personal_history_ovarian_cancer, 'personal_history_ovarian_cancer');

  const meets = req.personal_history_breast_cancer || req.personal_history_ovarian_cancer ||
    req.first_degree_relatives_breast_ovarian >= 1 && (req.male_breast_cancer_relative || req.early_onset_relative_lt_50 || req.triple_negative_breast_relative_lt_60) ||
    req.first_degree_relatives_breast_ovarian >= 2 && !req.male_breast_cancer_relative ||
    req.second_degree_relatives_breast_ovarian >= 2 && req.early_onset_relative_lt_50 ||
    req.ashkenazi_jewish && req.first_degree_relatives_breast_ovarian >= 1;
  const high = req.first_degree_relatives_breast_ovarian >= 3 || req.second_degree_relatives_breast_ovarian >= 4;
  return {
    meets_test_criteria: meets,
    high_risk: high,
    panel: meets ? 'brca1_brca2_with_maybe_palb2_chek2_atm_rad51c_rad51d' : 'no_testing',
    risk_management: high ? 'mri_breast_annual_from_25_then_add_mammography_at_30_plus_rrm_discussion' :
      meets ? 'breast_awareness_mri_or_mammography_per_age' : 'average_risk_screening',
    citations: CITATIONS,
  };
}

function manage(req) {
  ensureStr(req.variant, 'variant'); // brca1 | brca2 | palb2 | chek2 | atm | rad51c | rad51d | vus | negative
  ensureNumber(req.age, 'age');
  ensureBool(req.female, 'female');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.completed_childbearing, 'completed_childbearing');
  ensureBool(req.personal_history_breast_cancer, 'personal_history_breast_cancer');

  let risk_reduction = '';
  if (req.variant === 'brca1' || req.variant === 'brca2') {
    if (req.female) {
      risk_reduction = req.completed_childbearing ? 'rrm_with_so_recommended_30_40_brca1_40_50_brca2' :
        'rrm_with_so_deferred_to_35_40_brca1_40_45_brca2_oophorectomy_at_35_40';
    } else {
      risk_reduction = req.variant === 'brca2' ? 'prostate_screening_annual_mp_mri_psa_40_plus' :
        'prostate_screening_consider_brca1';
    }
  } else if (req.variant === 'palb2' || req.variant === 'chek2' || req.variant === 'atm') {
    risk_reduction = 'enhanced_breast_screening_mri_annually_mammography';
  } else {
    risk_reduction = 'average_risk_screening';
  }
  const surveillance = req.variant === 'negative' ? 'average_risk' :
    req.female ? 'breast_mri_annually_25_plus_mammography_30_plus_or_10_years_before_first_relative' :
      'prostate_screening_if_brca2_40_plus';
  const chemo_prevention = req.female && req.variant !== 'negative' ? 'consider_tamoxifen_or_aromatase_inhibitor' : 'not_typically';
  return {
    variant: req.variant,
    risk_reduction,
    surveillance,
    chemo_prevention,
    family_testing: req.variant !== 'negative' && req.variant !== 'vus' ? 'cascade_testing_first_degree_relatives' : 'consider_family_testing_per_history',
    citations: CITATIONS,
  };
}

module.exports = { screen, manage, CITATIONS, ValidationError };