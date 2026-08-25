'use strict';
// TIER4_GI_EXT-101: GERD severity + treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACG_GERD_2022', 'AGA_GERD'];

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

function classify(req) {
  ensureNumber(req.heartburn_frequency, 'heartburn_frequency');
  ensureBool(req.dysphagia, 'dysphagia');
  ensureBool(req.odynophagia, 'odynophagia');
  ensureBool(req.weight_loss, 'weight_loss');
  ensureBool(req.anemia, 'anemia');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.typical_response_ppi, 'typical_response_ppi');
  ensureNumber(req.duration_months, 'duration_months');

  const alarm = req.dysphagia || req.odynophagia || req.weight_loss || req.anemia || req.bleeding;
  const erosive_risk = req.duration_months >= 12 || !req.typical_response_ppi;
  const recommendation = alarm ? 'urgent_egd_within_2_weeks' :
    req.typical_response_ppi ? 'continue_ppi_lifestyle' : 'step_up_ppi_double_dose_then_egd';
  return {
    heartburn_frequency: req.heartburn_frequency,
    alarm_features: alarm,
    chronic: req.duration_months >= 12,
    erosive_risk,
    recommendation,
    citations: CITATIONS,
  };
}

function treat(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.la_grade, 'la_grade'); // los_angeles_grade_a_b_c_d
  ensureBool(req.barretts, 'barretts');
  ensureBool(req.erosive, 'erosive');
  ensureBool(req.symptoms_nightly, 'symptoms_nightly');

  const first_line = req.erosive || req.barretts ? 'ppi_bid_lifelong_or_consider_h2ra_addon' :
    req.symptoms_nightly ? 'ppi_before_dinner_h2ra_bedtime' :
      'ppi_qd_before_breakfast_lifestyle';
  const surveillance = req.barretts ? 'egd_q3_years_non_dysplasia_q1_year_low_grade_dysplasia' :
    req.erosive ? 'egd_q8_weeks_to_confirm_healing_then_q1_3_years' :
      'no_routine_surveillance';
  return {
    first_line,
    lifestyle: ['elevate_head_of_bed', 'avoid_late_meals', 'weight_loss', 'avoid_trigger_foods'],
    surveillance,
    consider_surgery: req.erosive && req.barretts ? 'consider_fundoplication' : req.erosive ? 'consider_linx_or_fundoplication' : 'no_surgery_evaluation',
    citations: CITATIONS,
  };
}

module.exports = { classify, treat, CITATIONS, ValidationError };