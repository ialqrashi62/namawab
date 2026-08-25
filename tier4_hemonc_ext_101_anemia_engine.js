'use strict';
// TIER4_HEMONC_EXT-101: Anemia classification + workup
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ASH_Anemia_2019'];

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
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.mcv, 'mcv');
  ensureNumber(req.retic, 'retic');
  ensureBool(req.iron_low, 'iron_low');
  ensureBool(req.b12_low, 'b12_low');
  ensureBool(req.ferritin_low, 'ferritin_low');
  ensureBool(req.haptoglobin_low, 'haptoglobin_low');
  ensureBool(req.ldh_high, 'ldh_high');

  const severity = req.hgb < 7 ? 'severe' : req.hgb < 10 ? 'moderate' : 'mild';
  let type = 'unknown';
  if (req.mcv < 80 && (req.iron_low || req.ferritin_low)) type = 'iron_deficiency_microcytic';
  else if (req.mcv > 100 && req.b12_low) type = 'b12_or_folate_deficiency_megaloblastic';
  else if (req.mcv >= 80 && req.mcv <= 100 && req.retic > 2) type = 'hemolytic_normocytic';
  else if (req.mcv >= 80 && req.mcv <= 100 && req.retic < 1) type = 'anemia_of_chronic_disease_or_aplastic';
  else if (req.mcv < 80) type = 'thalassemia_or_chronic_iron_deficiency';
  else if (req.mcv > 100) type = 'macrocytic_other';
  else type = 'normocytic_other';
  const hemolytic = req.haptoglobin_low || req.ldh_high;
  return {
    hgb: req.hgb,
    severity,
    type,
    mcv: req.mcv,
    hemolytic_markers: hemolytic,
    workup_next: type === 'iron_deficiency_microcytic' ? 'iron_studies_then_endoscopy_if_adult' :
      type.includes('b12') ? 'methylmalonic_acid_homocysteine_then_empirical_treatment' :
        type.includes('hemolytic') ? 'coombs_peripheral_smear_lactate_dehydrogenase' :
          'basic_workup_if_no_response_in_4_weeks_refer_hematology',
    citations: CITATIONS,
  };
}

function workup(req) {
  ensureNumber(req.hgb, 'hgb');
  ensureBool(req.male, 'male');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.heavy_menses, 'heavy_menses');
  ensureBool(req.gi_bleeding_history, 'gi_bleeding_history');
  ensureNumber(req.bun, 'bun');

  let workup = ['cbc_with_differential', 'iron_studies_ferritin_tibc', 'b12_folate'];
  if (!req.pregnant && req.hgb < 10) {
    if ((req.male || req.post_menopausal_female) && req.gi_bleeding_history || req.heavy_menses) {
      workup.push('colonoscopy_or_endoscopy_per_indication');
    } else if (!req.pregnant) {
      workup.push('colonoscopy_at_45_plus_per_guidelines');
    }
  }
  if (req.pregnant) workup.push('repeat_each_trimester_iron_studies');
  return {
    workup,
    urgent_referral: req.hgb < 7 || req.hgb < 10 && req.male && req.bun > 30,
    citations: CITATIONS,
  };
}

module.exports = { classify, workup, CITATIONS, ValidationError };