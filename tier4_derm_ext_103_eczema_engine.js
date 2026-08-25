'use strict';
// TIER4_DERM_EXT-103: Eczema severity + treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAAAI_Eczema_2017', 'AAD_Eczema_2014'];

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

function severity(req) {
  ensureNumber(req.affected_bsa, 'affected_bsa');
  ensureNumber(req.iga_score, 'iga_score');
  ensureBool(req.intense_itch, 'intense_itch');
  ensureBool(req.sleep_disruption, 'sleep_disruption');
  ensureBool(req.infection, 'infection');
  ensureBool(req.erythrodermic, 'erythrodermic');

  let severity = 'mild';
  if (req.erythrodermic) severity = 'erythrodermic';
  else if (req.affected_bsa >= 30 || req.iga_score >= 4) severity = 'severe';
  else if (req.affected_bsa >= 10 || req.iga_score >= 3) severity = 'moderate';
  return {
    severity,
    iGA: req.iga_score,
    bsa: req.affected_bsa,
    sleep_disrupted: req.sleep_disruption,
    infection: req.infection,
    erythrodermic: req.erythrodermic,
    citations: CITATIONS,
  };
}

function treatment(req) {
  ensureStr(req.severity, 'severity');
  ensureBool(req.infection, 'infection');
  ensureBool(req.bleach_bath, 'bleach_bath');

  let first_line;
  if (req.severity === 'erythrodermic') first_line = 'urgent_referral_consider_cyclosporine_or_phototherapy';
  else if (req.severity === 'severe') first_line = 'systemic_immunosuppressant_then_dupilumab_then_jak';
  else if (req.severity === 'moderate') first_line = 'topical_steroid_with_topical_calcineurin_inhibitor_then_phototherapy';
  else first_line = 'topical_steroid_low_potency_with_emollients';

  const adjunct = req.infection ? 'oral_antibiotic_with_active_culture' :
    req.bleach_bath ? 'diluted_bleach_bath_2x_weekly' : 'no_active_infection';
  return {
    first_line,
    adjunct,
    lifestyle: ['daily_emollient_within_3_minutes_of_bath', 'avoid_known_triggers', 'avoid_hot_water'],
    monitoring: req.severity === 'severe' ? 'q4_weeks' : req.severity === 'moderate' ? 'q8_weeks' : 'q3_6_months',
    citations: CITATIONS,
  };
}

module.exports = { severity, treatment, CITATIONS, ValidationError };