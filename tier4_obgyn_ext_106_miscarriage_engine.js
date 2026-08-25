'use strict';
// TIER4_OBGYN_EXT-106: Miscarriage + recurrent loss workup
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACOG_Miscarriage_2018', 'ASRM_RPL_2017'];

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
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.cramping, 'cramping');
  ensureBool(req.passed_tissue, 'passed_tissue');
  ensureBool(req.cervix_open, 'cervix_open');
  ensureBool(req.viable_pregnancy, 'viable_pregnancy');

  let type;
  if (req.bleeding && !req.cramping && !req.cervix_open && req.viable_pregnancy) type = 'threatened_miscarriage';
  else if (req.cervix_open && req.bleeding && req.cramping) type = 'inevitable_miscarriage';
  else if (req.passed_tissue && req.viable_pregnancy === false) type = 'incomplete_miscarriage';
  else if (req.passed_tissue && req.viable_pregnancy === false && req.bleeding === false) type = 'complete_miscarriage';
  else if (req.bleeding === false && req.cramping === false && !req.viable_pregnancy) type = 'missed_miscarriage';
  else type = 'uncertain';
  const management = type === 'threatened_miscarriage' ? 'observation_pelvic_rest_repeat_us' :
    type === 'inevitable_miscarriage' ? 'dilation_curettage_or_expectant' :
      type === 'incomplete_miscarriage' ? 'dilation_curettage_or_misoprostol_or_expectant' :
        type === 'complete_miscarriage' ? 'observation_only' :
          type === 'missed_miscarriage' ? 'expectant_or_d_and_c_or_misoprostol' :
            'further_workup_repeat_us';
  return {
    type,
    cervix_open: req.cervix_open,
    viable: req.viable_pregnancy,
    bleeding: req.bleeding,
    management,
    rhogam_needed: 'rhd_negative_unsensitized_then_rhogam_within_72h',
    citations: CITATIONS,
  };
}

function rpl_workup(req) {
  ensureNumber(req.losses, 'losses');
  ensureNumber(req.age, 'age');
  ensureBool(req.aps, 'aps');
  ensureBool(req.karyotype, 'karyotype');
  ensureBool(req.uterine_anomaly, 'uterine_anomaly');
  ensureBool(req.thrombophilia, 'thrombophilia');
  ensureBool(req.partner_karyotype, 'partner_karyotype');

  const complete = req.losses >= 2;
  return {
    recurrent_loss_diagnosis: complete,
    workup: complete ? ['parental_karyotype', 'uterine_hysterosalpingogram_or_sonohysterogram', 'aps_anticardiolipin_lupus_anticoagulant', 'thrombophilia_panel', 'tsh_and_a1c'] : 'no_full_workup_until_2_losses',
    lifestyle: ['smoking_cessation', 'limit_alcohol', 'maintain_healthy_bmi', 'folate_supplementation'],
    prognosis_with_treatment: complete && req.aps ? 'aspirin_and_lmwh_next_pregnancy' :
      complete && req.thrombophilia ? 'individualized_anticoagulation' :
        complete && req.uterine_anomaly ? 'metroplasty_then_retry' :
          'no_specific_treatment_live_birth_rate_60_percent',
    citations: CITATIONS,
  };
}

module.exports = { classify, rpl_workup, CITATIONS, ValidationError };