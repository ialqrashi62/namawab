'use strict';
// TIER4_OBGYN_EXT-103: Ectopic pregnancy - diagnosis + MTX
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACOG_Ectopic_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function diagnose(req) {
  ensureNumber(req.hcg, 'hcg');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.adnexal_mass, 'adnexal_mass');
  ensureNumber(req.adnexal_mass_size_cm, 'adnexal_mass_size_cm');
  ensureBool(req.free_fluid, 'free_fluid');
  ensureBool(req.rupture_signs, 'rupture_signs');
  ensureBool(req.positive_culdocentesis, 'positive_culdocentesis');
  ensureNumber(req.progesterone, 'progesterone');

  const likely = req.adnexal_mass && (req.positive_culdocentesis || req.free_fluid && req.hcg > 1500);
  const rupture = req.rupture_signs || req.positive_culdocentesis;
  return {
    likely_ectopic: likely,
    ruptured: rupture,
    diagnostic_certainty: rupture ? 'high_immediate_surgery' : likely ? 'moderate_us_serial_hcg' : 'rule_out',
    serial_hcg: req.hcg >= 1500 && !req.adnexal_mass ? 'repeat_hcg_in_48h_expect_66pct_rise' : 'no_serial_needed',
    progesterone_assessment: req.progesterone < 5 ? 'nonviable_pregnancy' :
      req.progesterone > 25 ? 'likely_intrauterine' : 'indeterminate',
    citations: CITATIONS,
  };
}

function management(req) {
  ensureBool(req.ruptured, 'ruptured');
  ensureNumber(req.hcg, 'hcg');
  ensureNumber(req.adnexal_mass_size_cm, 'adnexal_mass_size_cm');
  ensureBool(req.fetal_heart, 'fetal_heart');
  ensureBool(req.hepar, 'hepar');
  ensureBool(req.liver_disease, 'liver_disease');
  ensureBool(req.renal_disease, 'renal_disease');
  ensureNumber(req.hgb, 'hgb');

  let treatment;
  if (req.ruptured || req.fetal_heart || req.adnexal_mass_size_cm >= 4) treatment = 'emergent_surgical_management_laparoscopy_or_laparotomy';
  else if (req.hcg < 5000 && !req.fetal_heart && req.adnexal_mass_size_cm < 3.5 && req.hgb >= 9 &&
    !req.hepar && !req.liver_disease && !req.renal_disease) treatment = 'methotrexate_single_dose_im_50mg_per_m2_then_day_4_and_7_hcg';
  else treatment = 'expectant_management_with_serial_hcg_or_surgical';
  return {
    treatment,
    mtx_eligible: treatment.startsWith('methotrexate'),
    surgery: treatment.startsWith('emergent'),
    follow_up: treatment.startsWith('methotrexate') ? 'day_1_4_7_hcg_with_decrease_15pct_required' :
      treatment.startsWith('emergent') ? 'post_op_follow_up_q1_2_weeks_then_q4_6_weeks' : 'serial_hcg_q48h',
    future_fertility: 'most_remain_fertile_with_50_percent_subsequent_iup_rate',
    citations: CITATIONS,
  };
}

module.exports = { diagnose, management, CITATIONS, ValidationError };