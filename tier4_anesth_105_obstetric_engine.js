'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { asa_obstetric: 'ASA Practice Guidelines for Obstetric Anesthesia 2016' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function laborAnalgesia(input) {
  ensureObj(input, 'input');
  const gestational_weeks = ensureNumber(input.gestational_weeks, 'gestational_weeks');
  const platelet = ensureNumber(input.platelet, 'platelet');
  const inr = ensureNumber(input.inr, 'inr');
  const vb_history = !!input.vb_history;
  let recommended;
  if (gestational_weeks < 34) { recommended = 'observation_immediate'; }
  else if (platelet < 80 || inr > 1.5) { recommended = 'avoid_neuraxial_consider_iv_opioid'; }
  else { recommended = 'epidural_first_line'; }
  return { gestational_weeks, platelet, inr, vb_history, recommended, citations:['asa_obstetric'] };
}

function cesareanAnesthesia(input) {
  ensureObj(input, 'input');
  const emergency = !!input.emergency;
  const platelet = ensureNumber(input.platelet, 'platelet');
  const spinal_anatomy_difficult = !!input.spinal_anatomy_difficult;
  let anesthesia;
  if (emergency) { anesthesia = 'rsi_general'; }
  else if (platelet < 80) { anesthesia = 'general_endotracheal'; }
  else if (spinal_anatomy_difficult) { anesthesia = 'consider_eps_then_c_section'; }
  else { anesthesia = 'spinal_first_line'; }
  return { emergency, platelet, spinal_anatomy_difficult, anesthesia };
}

module.exports = { laborAnalgesia, cesareanAnesthesia, CITATIONS, ValidationError };
