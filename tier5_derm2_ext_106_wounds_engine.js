// filepath: tier5_derm2_ext_106_wounds_engine.js
// TIER5_DERM2_EXT-106: Wound care (classify, braden, dressing, healing, HBOT)
'use strict';

const CITATIONS = [
  'NPUAP_Pressure_Injury_2016',
  'Braden_1987_Validation',
  'WUWHS_Wound_Dressing_2019',
  'Undersea_Hyperbaric_Society_2020',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function wound_class(req) {
  ensureStr(req.wound_type, 'wound_type');
  ensureEnum(req.wound_type, 'wound_type', ['pressure_injury','surgical_wound','venous_insufficiency','arterial_insufficiency','neuropathic_diabetic','traumatic_laceration','burn_thermal','burn_chemical','burn_radiation','other']);
  ensureNumber(req.days_since_onset, 'days_since_onset');
  ensureNumber(req.size_cm2, 'size_cm2');
  ensureStr(req.exudate_amount, 'exudate_amount');
  ensureEnum(req.exudate_amount, 'exudate_amount', ['none','minimal','moderate','heavy']);
  ensureBool(req.infection_signs, 'infection_signs');

  let expected_healing_weeks;
  if (req.wound_type === 'pressure_injury') expected_healing_weeks = 6;
  else if (req.wound_type === 'venous_insufficiency') expected_healing_weeks = 12;
  else if (req.wound_type === 'arterial_insufficiency') expected_healing_weeks = 16;
  else if (req.wound_type === 'neuropathic_diabetic') expected_healing_weeks = 16;
  else if (req.wound_type === 'burn_thermal') expected_healing_weeks = 8;
  else expected_healing_weeks = 6;

  if (req.size_cm2 > 50) expected_healing_weeks += 8;
  if (req.infection_signs) expected_healing_weeks += 4;

  return {
    wound_type: req.wound_type,
    expected_healing_weeks,
    infection_signs_present: req.infection_signs,
    exudate_volume_band: req.exudate_amount,
    citation: CITATIONS[0],
  };
}

function braden_scale(req) {
  const items = ['sensory_perception','moisture','activity','mobility','nutrition','friction_shear'];
  const max = [4, 4, 4, 4, 4, 3];
  let total = 0;
  for (const it of items) {
    const v = req[it];
    if (!Number.isInteger(v) || v < 1 || v > max[items.indexOf(it)]) throw new ValidationError(`${it} 1..${max[items.indexOf(it)]}`, it);
    total += v;
  }
  let risk;
  if (total >= 19) risk = 'low_risk';
  else if (total >= 15) risk = 'mild_risk';
  else if (total >= 13) risk = 'moderate_risk';
  else if (total >= 10) risk = 'high_risk';
  else risk = 'very_high_risk';

  return { total_score: total, risk_band: risk, action: total < 15 ? 'implement_full_pressure_injury_prevention_protocol' : 'continue_prevention' };
}

function dressing_choice(req) {
  ensureStr(req.wound_type, 'wound_type');
  ensureEnum(req.wound_type, 'wound_type', ['pressure_injury','surgical_wound','venous_insufficiency','arterial_insufficiency','neuropathic_diabetic','traumatic_laceration','burn_thermal','burn_chemical','burn_radiation','other']);
  ensureStr(req.exudate_amount, 'exudate_amount');
  ensureEnum(req.exudate_amount, 'exudate_amount', ['none','minimal','moderate','heavy']);
  ensureBool(req.infection_signs, 'infection_signs');
  ensureBool(req.depth_or_tunneling, 'depth_or_tunneling');

  let dressing;
  let change_frequency;
  if (req.wound_type === 'pressure_injury' && req.exudate_amount === 'none') dressing = 'transparent_film_or_hydrocolloid';
  else if (req.wound_type === 'pressure_injury' && req.exudate_amount === 'minimal') dressing = 'hydrocolloid';
  else if (req.wound_type === 'pressure_injury' && req.exudate_amount === 'moderate') dressing = 'hydrofiber_or_foam_dressing';
  else if (req.wound_type === 'pressure_injury' && req.exudate_amount === 'heavy') dressing = 'absorptive_foam_dressing_then_negative_pressure_wound_therapy';
  else if (req.wound_type === 'venous_insufficiency') dressing = 'compression_bandaging_with_foam_plus_3M';
  else if (req.wound_type === 'arterial_insufficiency') dressing = 'non_occlusive_hydrocolloid_or_alginate_do_not_compress';
  else if (req.wound_type === 'neuropathic_diabetic') dressing = 'alginate_or_hydrofiber_then_off_loading_with_total_contact_cast';
  else if (req.wound_type === 'burn_thermal') dressing = 'silver_sulfadiazine_or_nanocrystalline_silver_dressing';
  else dressing = 'non_adherent_contact_layer_then_fluff_gauze';

  if (req.infection_signs) dressing = 'silver_dressing_or_iodosorb_then_reassess';

  if (req.exudate_amount === 'heavy') change_frequency = 'every_2_3_days';
  else if (req.exudate_amount === 'moderate') change_frequency = 'every_3_4_days';
  else if (req.exudate_amount === 'minimal') change_frequency = 'every_5_7_days';
  else change_frequency = 'every_7_10_days';

  return { wound_type: req.wound_type, dressing, change_frequency, tunneling: req.depth_or_tunneling, citation: CITATIONS[2] };
}

function healing_check(req) {
  ensureNumber(req.area_now_cm2, 'area_now_cm2');
  ensureNumber(req.area_initial_cm2, 'area_initial_cm2');
  ensureNumber(req.weeks_elapsed, 'weeks_elapsed');
  ensureStr(req.exudate_now, 'exudate_now');
  ensureEnum(req.exudate_now, 'exudate_now', ['none','minimal','moderate','heavy']);
  ensureStr(req.tissue_now, 'tissue_now');
  ensureEnum(req.tissue_now, 'tissue_now', ['granulation','slough','necrotic','mixed']);
  ensureBool(req.smell_or_erythema, 'smell_or_erythema');

  const heal_pct = ((req.area_initial_cm2 - req.area_now_cm2) / Math.max(0.01, req.area_initial_cm2)) * 100;
  const weekly_heal_pct = heal_pct / Math.max(0.01, req.weeks_elapsed);

  let verdict;
  if (weekly_heal_pct >= 20) verdict = 'healing_on_track';
  else if (weekly_heal_pct >= 10) verdict = 'slow_healing_review_compression_pressure_dm_status';
  else if (weekly_heal_pct >= 5) verdict = 'stagnating_reassess_compression_dm_o2_optimize_dressing';
  else verdict = 'not_healing_investigate_biopsy_or_imaging_then_specialty_referral';

  if (req.tissue_now === 'necrotic' || req.smell_or_erythema) verdict = 'review_for_infection_pursue_biopsy_for_debridement';

  return { weekly_heal_pct: Math.round(weekly_heal_pct * 10) / 10, verdict, exudate_now: req.exudate_now, tissue_now: req.tissue_now };
}

function hb_pet(req) {
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['diabetic_wound_chronic','radionecrosis_soft_tissue','crush_injury_compartment','necrotizing_fasciitis_post_debridement','carbon_monoxide','gas_gangrene','bone_radionecrosis','central_retinal_artery_occlusion','none_indicated']);
  ensureNumber(req.minutes_per_session, 'minutes_per_session');
  ensureBool(req.documented_failure_of_conventional, 'documented_failure_of_conventional');
  ensureNumber(req.tc_po2_in_chamber, 'tc_po2_in_chamber');

  if (req.indication === 'none_indicated' || !req.documented_failure_of_conventional) return { verdict: 'not_indicated_for_hyperbaric_oxygen', referral: false };
  if (req.tc_po2_in_chamber < 200) return { verdict: 'ineligible_oxygen_does_not_reach_target_dose_consider_alternative_or_explore_compression', referral: false };
  return { verdict: 'refer_to_hyperbaric_center_for_2_4_weeks', referral: true, treatment_minutes: req.minutes_per_session || 90, citation: CITATIONS[3] };
}

function funcs() {
  return { wound_class, braden_scale, dressing_choice, healing_check, hb_pet };
}

module.exports = { funcs, CITATIONS, ValidationError };
