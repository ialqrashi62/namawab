'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { mh: 'MHAUS Malignant Hyperthermia Protocol 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function malignantHyperthermia(input) {
  ensureObj(input, 'input');
  const etco2_rising = !!input.etco2_rising;
  const muscle_rigidity = !!input.muscle_rigidity;
  const temp_rising_rate_per_hr = ensureNumber(input.temp_rising_rate_per_hr, 'temp_rising_rate_per_hr');
  const tachycardia = !!input.tachycardia;
  const family_history_mh = !!input.family_history_mh;
  let score = (etco2_rising?2:0) + (muscle_rigidity?2:0) + (temp_rising_rate_per_hr >= 2 ? 2 : temp_rising_rate_per_hr >= 1 ? 1 : 0) + (tachycardia?1:0) + (family_history_mh?1:0);
  let diagnosis;
  if (score >= 5) { diagnosis = 'high_probability_mh'; }
  else if (score >= 3) { diagnosis = 'possible_mh'; }
  else { diagnosis = 'low_probability_consider_other'; }
  const therapy = (score >= 3) ? 'discontinue_trigger_dantrolene_2_5mg_per_kg_active_cooling' : 'observe_consider_other_diagnosis';
  return { etco2_rising, muscle_rigidity, temp_rising_rate_per_hr, tachycardia, family_history_mh, score, diagnosis, therapy, citations:['mh'] };
}

function hypotensionManagement(input) {
  ensureObj(input, 'input');
  const map = ensureNumber(input.map, 'map');
  const hr = ensureNumber(input.hr, 'hr');
  const blood_loss_ml = ensureNumber(input.blood_loss_ml, 'blood_loss_ml');
  const spinal = !!input.spinal;
  const cause = ensureEnum(input.cause, ['unknown','hypovolemia','vasodilation','cardiac','septic'], 'cause');
  let intervention;
  if (blood_loss_ml >= 1000) { intervention = 'massive_transfusion_protocol'; }
  else if (spinal && cause === 'vasodilation') { intervention = 'phenylephrine_ephedrine_iv_fluid'; }
  else if (cause === 'hypovolemia') { intervention = 'crystalloid_colloid_blood'; }
  else if (cause === 'cardiac') { intervention = 'consider_inotrope_vasopressor'; }
  else { intervention = 'iv_fluid_vasopressor'; }
  return { map, hr, blood_loss_ml, spinal, cause, intervention };
}

module.exports = { malignantHyperthermia, hypotensionManagement, CITATIONS, ValidationError };
