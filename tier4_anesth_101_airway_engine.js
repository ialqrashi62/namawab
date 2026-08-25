'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { asa_dif: 'ASA Difficult Airway Algorithm 2013 (updated 2022)' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function airwayAssessment(input) {
  ensureObj(input, 'input');
  const mallampati = ensureNumber(input.mallampati, 'mallampati');
  const mouth_opening_cm = ensureNumber(input.mouth_opening_cm, 'mouth_opening_cm');
  const thyromental_distance_cm = ensureNumber(input.thyromental_distance_cm, 'thyromental_distance_cm');
  const neck_mobility = ensureEnum(input.neck_mobility, ['normal','limited','immobile'], 'neck_mobility');
  const obesity = !!input.obesity;
  const prior_difficult = !!input.prior_difficult;
  let risk;
  if (mallampati >= 4 || mouth_opening_cm < 3 || thyromental_distance_cm < 6) { risk = 'predicted_difficult'; }
  else if (mallampati === 3 || neck_mobility === 'limited' || obesity) { risk = 'potentially_difficult'; }
  else { risk = 'normal_airway'; }
  const plan = risk === 'predicted_difficult' ? 'video_laryngoscope_fiberoptic_awake' : risk === 'potentially_difficult' ? 'video_laryngoscope_backup' : 'standard_laryngoscopy';
  return { mallampati, mouth_opening_cm, thyromental_distance_cm, neck_mobility, obesity, prior_difficult, risk, plan, citations:['asa_dif'] };
}

function aspirationRisk(input) {
  ensureObj(input, 'input');
  const fasting_duration_h = ensureNumber(input.fasting_duration_h, 'fasting_duration_h');
  const prev_gi_surgery = !!input.prev_gi_surgery;
  const dm = !!input.dm;
  const obesity = !!input.obesity;
  const emergency = !!input.emergency;
  const pregnancy = !!input.pregnancy;
  let risk;
  if (fasting_duration_h < 2 || emergency) { risk = 'high_consider_rsi'; }
  else if (fasting_duration_h < 4 || prev_gi_surgery || pregnancy) { risk = 'moderate'; }
  else if (fasting_duration_h < 6 || dm || obesity) { risk = 'low_moderate'; }
  else { risk = 'low'; }
  return { fasting_duration_h, prev_gi_surgery, dm, obesity, emergency, pregnancy, risk };
}

module.exports = { airwayAssessment, aspirationRisk, CITATIONS, ValidationError };
