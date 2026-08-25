'use strict';
// TIER4_DERM_EXT-102: Psoriasis - PASI severity + treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAD_Psoriasis_2019', 'NICE_Psoriasis_2017'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function classify(req) {
  ensureNumber(req.pasi, 'pasi');
  ensureNumber(req.bsa, 'bsa');
  ensureBool(req.symptoms_pain, 'symptoms_pain');
  ensureBool(req.functional_impairment, 'functional_impairment');
  ensureBool(req.pustular, 'pustular');
  ensureBool(req.erythrodermic, 'erythrodermic');
  ensureBool(req.psoriatic_arthritis, 'psoriatic_arthritis');

  let severity = 'mild';
  if (req.pasi >= 12 || req.bsa >= 10) severity = 'moderate_to_severe';
  else if (req.pasi >= 7 || req.bsa >= 5) severity = 'moderate';
  if (req.pustular) severity = 'pustular_unstable';
  if (req.erythrodermic) severity = 'erythrodermic_life_threatening';
  return {
    severity,
    pasi: req.pasi,
    bsa: req.bsa,
    treatment: severity === 'mild' ? 'topical_steroid_or_vitamin_d_analogue' :
      severity === 'moderate' ? 'phototherapy_or_topical_plus_phototherapy' :
        severity === 'moderate_to_severe' ? 'systemic_methotrexate_or_cyclosporine_then_consider_biologic' :
          severity === 'pustular_unstable' ? 'urgent_acitretin_or_methotrexate' :
            'emergent_referral_to_derm_critical_care',
    biologic_candidate: severity === 'moderate_to_severe',
    psoriatic_arthritis_screening: req.psoriatic_arthritis ? 'refer_rheum_for_biologic_tnf_il12_23_il17_or_il23' : 'screen_q6_months',
    citations: CITATIONS,
  };
}

module.exports = { classify, CITATIONS, ValidationError };