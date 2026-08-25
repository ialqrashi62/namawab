'use strict';
// TIER4_PULM_EXT-102: Asthma - GINA classification + step therapy
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['GINA_2024', 'NHLBI_EPR_4'];

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
  ensureNumber(req.fev1_pct, 'fev1_pct');
  ensureNumber(req.daytime_symptoms_per_week, 'daytime_symptoms_per_week');
  ensureNumber(req.nighttime_awakenings_per_month, 'nighttime_awakenings_per_month');
  ensureBool(req.saba_use_per_week, 'saba_use_per_week');
  ensureBool(req.interference_with_normal_activity, 'interference_with_normal_activity');

  let classification = 'intermittent';
  if (req.fev1_pct < 60 || req.daytime_symptoms_per_week > 7 || req.saba_use_per_week) {
    classification = 'severe_persistent';
  } else if (req.fev1_pct < 80 || req.daytime_symptoms_per_week > 1 || req.nighttime_awakenings_per_month > 2) {
    classification = 'moderate_persistent';
  } else if (req.daytime_symptoms_per_week >= 1 || req.nighttime_awakenings_per_month >= 1) {
    classification = 'mild_persistent';
  }
  const controlled = !req.interference_with_normal_activity && req.daytime_symptoms_per_week < 2 && req.nighttime_awakenings_per_month < 2;
  return {
    fev1_pct: req.fev1_pct,
    classification,
    controlled,
    next_action: controlled ? 'maintain_or_step_down' : 'step_up_evaluate_trigger_compliance',
    citations: CITATIONS,
  };
}

function step(req) {
  ensureNumber(req.age, 'age');
  ensureStr(req.current_step, 'current_step'); // 1..5
  ensureBool(req.controlled, 'controlled');
  ensureBool(req.exacerbation, 'exacerbation');
  ensureBool(req.pregnant, 'pregnant');

  const current = Math.max(1, Math.min(5, parseInt(req.current_step)));
  let target;
  if (req.exacerbation || !req.controlled) target = Math.min(5, current + 1);
  else if (req.controlled && current > 1) target = current - 1;
  else target = current;
  const regimen = target === 1 ? 'prn_saba_only' :
    target === 2 ? 'low_dose_ics_plus_prn_saba' :
      target === 3 ? 'low_dose_ics_laba_or_medium_ics' :
        target === 4 ? 'medium_high_ics_laba' :
          'high_ics_laba_plus_tiotropium_or_biologic_consider_omalizumab_mepolizumab_dupilumab';
  const safe_in_pregnancy = req.pregnant ? 'budesonide_preferred' : regimen;
  return {
    current_step: current,
    target_step: target,
    regimen: safe_in_pregnancy,
    monitoring: 'act_q1_month_pft_q3_months',
    citations: CITATIONS,
  };
}

module.exports = { classify, step, CITATIONS, ValidationError };