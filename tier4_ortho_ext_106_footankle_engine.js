'use strict';
// TIER4_ORTHO_EXT-106: Foot/Ankle - Achilles + plantar fasciitis + ankle sprain
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAOS_Achilles_2018', 'AAOS_Plantar_2019', 'AAOS_Ankle_2018'];

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

function achilles(req) {
  ensureBool(req.sudden_pop, 'sudden_pop');
  ensureBool(req.heel_pain, 'heel_pain');
  ensureBool(req.thompson_test_positive, 'thompson_test_positive');
  ensureBool(req.active_plantarflexion, 'active_plantarflexion');
  ensureBool(req.plantarflexion_strength, 'plantarflexion_strength');

  const rupture = req.sudden_pop && req.thompson_test_positive || !req.active_plantarflexion;
  return {
    rupture,
    surgical: rupture ? 'acute_rupture_surgical_repair_within_2_3_weeks' : 'no_surgery',
    conservative: rupture ? 'functional_rehab_with_weight_bearing_boot_or_cast' : 'no_pathology',
    recovery_time: rupture ? '6_9_months_to_full_activity' : 'variable',
    citations: CITATIONS,
  };
}

function plantar(req) {
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureBool(req.first_step_pain, 'first_step_pain');
  ensureBool(req.bmi_obese, 'bmi_obese');
  ensureBool(req.runner, 'runner');
  ensureBool(req.heel_spur, 'heel_spur');
  ensureBool(req.foot_arch_low, 'foot_arch_low');

  const severity = req.first_step_pain && req.bmi_obese ? 'severe' : req.first_step_pain ? 'moderate' : 'mild';
  const treatment = severity === 'severe' ? 'night_splints_pt_custom_orthotics_nsaid_injection_cortisone' :
    severity === 'moderate' ? 'stretching_calf_plantar_orthotics_nsaid' :
      'lifestyle_modification';
  return {
    severity,
    treatment,
    recovery: severity === 'severe' ? '6_to_12_months' : severity === 'moderate' ? '3_to_6_months' : 'weeks',
    citations: CITATIONS,
  };
}

function ankle_sprain(req) {
  ensureNumber(req.swelling, 'swelling');
  ensureBool(req.can_bear_weight, 'can_bear_weight');
  ensureBool(req.inversion_injury, 'inversion_injury');
  ensureBool(req.lateral_tenderness, 'lateral_tenderness');
  ensureBool(req.ottawa_rule_positive, 'ottawa_rule_positive');

  let grade;
  if (!req.can_bear_weight && req.lateral_tenderness) grade = 'grade_3_severe';
  else if (req.swelling >= 2 && req.can_bear_weight) grade = 'grade_2_moderate';
  else grade = 'grade_1_mild';
  const needs_imaging = req.ottawa_rule_positive || grade === 'grade_3_severe';
  return {
    grade,
    needs_xray: needs_imaging,
    treatment: grade === 'grade_3_severe' ? 'immobilization_pt_progressive_rehab_consider_mri' :
      grade === 'grade_2_moderate' ? 'air_stirrup_brace_pt_early_mobility' :
        'rice_nsaid_early_weight_bearing',
    recovery: grade === 'grade_3_severe' ? '3_to_6_months' : grade === 'grade_2_moderate' ? '6_to_12_weeks' : '2_to_4_weeks',
    citations: CITATIONS,
  };
}

module.exports = { achilles, plantar, ankle_sprain, CITATIONS, ValidationError };