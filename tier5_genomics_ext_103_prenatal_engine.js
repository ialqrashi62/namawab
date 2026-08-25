'use strict';
// TIER5_GENOMICS_EXT-103: Prenatal screening (NIPT, sequential, quad)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACOG_Screening_2016', 'ACMG_NIPT_2016', 'SMFM_NIPT_2015'];

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
  ensureNumber(req.maternal_age, 'maternal_age');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.twins, 'twins');
  ensureBool(req.previous_trisomy, 'previous_trisomy');
  ensureBool(req.high_papp_a_or_hcg, 'high_papp_a_or_hcg');
  ensureBool(req.abnormal_nt, 'abnormal_nt');
  ensureBool(req.nipt_done, 'nipt_done');
  ensureStr(req.nipt_result, 'nipt_result'); // low_risk | high_risk | inconclusive

  let screening_choice;
  if (req.maternal_age >= 35 || req.previous_trisomy || req.abnormal_nt) {
    screening_choice = 'first_trimester_screen_then_nipt_or_diagnostic_amniocentesis_or_cvs';
  } else if (req.twins) {
    screening_choice = 'first_trimester_nt_plus_serum_markers_limited_nipt_validation';
  } else {
    screening_choice = 'first_trimester_nt_plus_papp_a_hcg_then_quad_or_nipt';
  }
  const positive = req.nipt_done && req.nipt_result === 'high_risk' || req.abnormal_nt || req.high_papp_a_or_hcg;
  const next_step = positive ? 'genetic_counseling_and_offer_diagnostic_amniocentesis_or_cvs' :
    screening_choice;
  return {
    maternal_age: req.maternal_age,
    gestational_age_weeks: req.gestational_age_weeks,
    screening_choice,
    positive_screen: positive,
    next_step,
    citations: CITATIONS,
  };
}

function diagnostic(req) {
  ensureStr(req.choice, 'choice'); // cvs | amniocentesis
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.rhesus_negative, 'rhesus_negative');
  ensureBool(req.multiple_gestation, 'multiple_gestation');
  ensureBool(req.bleeding_diathesis, 'bleeding_diathesis');

  const amniocentesis_optimal = req.gestational_age_weeks >= 15 && req.gestational_age_weeks <= 22;
  const cvs_optimal = req.gestational_age_weeks >= 10 && req.gestational_age_weeks <= 13;
  const loss_rate = req.choice === 'amniocentesis' ? 0.1 : 0.2;
  const isoimmunization_risk = req.rhesus_negative ? 'killed_coombs_post_procedure_to_prevent_isoimmunization' : 'no_anti_d_needed';
  const contraindicated = req.bleeding_diathesis || req.multiple_gestation && req.choice === 'cvs';
  return {
    choice: req.choice,
    optimal_window: req.choice === 'cvs' ? cvs_optimal : amniocentesis_optimal,
    procedure_loss_rate_pct: loss_rate,
    isoimmunization_risk,
    contraindicated,
    citations: CITATIONS,
  };
}

module.exports = { screen, diagnostic, CITATIONS, ValidationError };