'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { ahass_stroke: 'AHA/ASA Adult Stroke Rehabilitation Guidelines 2016' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function bergBalance(input) {
  ensureObj(input, 'input');
  const sitting_balance = ensureNumber(input.sitting_balance, 'sitting_balance');
  const standing_balance = ensureNumber(input.standing_balance, 'standing_balance');
  const transfers = ensureNumber(input.transfers, 'transfers');
  const reaching = ensureNumber(input.reaching, 'reaching');
  const turning = ensureNumber(input.turning, 'turning');
  const total = sitting_balance + standing_balance + transfers + reaching + turning;
  let risk;
  if (total >= 45) { risk = 'low_fall_risk'; }
  else if (total >= 35) { risk = 'moderate_fall_risk'; }
  else { risk = 'high_fall_risk'; }
  return { sitting_balance, standing_balance, transfers, reaching, turning, total, risk, citations:['ahass_stroke'] };
}

function postStrokeRecovery(input) {
  ensureObj(input, 'input');
  const days_since_stroke = ensureNumber(input.days_since_stroke, 'days_since_stroke');
  const nihss = ensureNumber(input.nihss, 'nihss');
  const motor_deficit = !!input.motor_deficit;
  const dysarthria = !!input.dysarthria;
  let fime_phase;
  if (days_since_stroke < 7) { fime_phase = 'acute_inpatient'; }
  else if (days_since_stroke < 30) { fime_phase = 'subacute_inpatient_rehab'; }
  else if (days_since_stroke < 180) { fime_phase = 'active_outpatient_rehab'; }
  else { fime_phase = 'chronic_community_reintegration'; }
  return { days_since_stroke, nihss, motor_deficit, dysarthria, fime_phase, citations:['ahass_stroke'] };
}

module.exports = { bergBalance, postStrokeRecovery, CITATIONS, ValidationError };
