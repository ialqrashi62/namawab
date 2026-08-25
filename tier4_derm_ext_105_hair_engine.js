'use strict';
// TIER4_DERM_EXT-105: Hair - alopecia + hirsutism
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAD_Alopecia_2018', 'Endocrine_Hirsutism_2018'];

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

function alopecia(req) {
  ensureStr(req.pattern, 'pattern'); // patchy | diffuse | frontal_fibrosing | male_pattern | female_pattern
  ensureBool(req.scalp_scar, 'scalp_scar');
  ensureBool(req.hair_pull_positive, 'hair_pull_positive');
  ensureBool(req.thyroid, 'thyroid');
  ensureBool(req.iron_low, 'iron_low');

  let type;
  if (req.scalp_scar) type = 'cicatricial_scarring_alopecia';
  else if (req.pattern === 'patchy') type = 'alopecia_areata';
  else if (req.pattern === 'diffuse' && req.hair_pull_positive) type = 'telogen_effluvium';
  else if (req.pattern === 'frontal_fibrosing') type = 'frontal_fibrosing_alopecia';
  else type = 'androgenetic_' + req.pattern;
  const treatment = type === 'alopecia_areata' ? 'topical_or_intralesional_steroid_or_jak_inhibitor_or_minoxidil' :
    type === 'telogen_effluvium' ? 'treat_underlying_cause_reassure_q3_6_months' :
      type === 'androgenetic_male_pattern' ? 'finasteride_and_minoxidil' :
        type === 'androgenetic_female_pattern' ? 'minoxidil_spironolactone' :
          'topical_or_intralesional_steroid_or_platelet_rich_plasma';
  return {
    type,
    treatment,
    labs: req.thyroid ? 'tsh_and_t4' : req.iron_low ? 'ferritin_tibc_iron' : 'baseline_if_indicated',
    biopsy: req.scalp_scar ? 'scalp_biopsy_to_determine_cicatricial_type' : 'no_biopsy',
    citations: CITATIONS,
  };
}

function hirsutism(req) {
  ensureBool(req.female, 'female');
  ensureBool(req.menstrual_irregular, 'menstrual_irregular');
  ensureBool(req.acne, 'acne');
  ensureBool(req.cushingoid, 'cushingoid');
  ensureNumber(req.ferriman_gallwey, 'ferriman_gallwey');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.pcos_clinical, 'pcos_clinical');

  const severe = req.cushingoid || req.menstrual_irregular && req.acne;
  return {
    female: req.female,
    modified_ferriman_gallwey: req.ferriman_gallwey,
    pcos_likely: req.pcos_clinical || req.menstrual_irregular && req.acne,
    workup: severe ? 'dhea_s_total_testosterone_17_oh_progesterone_dexamethasone_suppression' : 'total_testosterone_dheas',
    treatment: req.pregnant ? 'no_spironolactone_evaluate_other_causes' :
      severe ? 'spironolactone_combined_ocp_then_evaluate' :
        'cosmetic_treatment_then_evaluate_pcos',
    citations: CITATIONS,
  };
}

module.exports = { alopecia, hirsutism, CITATIONS, ValidationError };