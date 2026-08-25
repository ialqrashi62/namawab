'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aao: 'American Academy of Ophthalmology Glaucoma Preferred Practice Pattern 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function glaucomaRisk(input) {
  ensureObj(input, 'input');
  const iop = ensureNumber(input.iop, 'iop');
  const cct = ensureNumber(input.cct, 'cct');
  const cdr = ensureNumber(input.cdr, 'cdr');
  const family_history = !!input.family_history;
  const age = ensureNumber(input.age, 'age');
  let risk;
  if (iop >= 30) { risk = 'high_risk_immediate_treatment'; }
  else if (iop >= 22 && cdr >= 0.6) { risk = 'high_risk'; }
  else if (iop >= 22 || cdr >= 0.5) { risk = 'moderate_risk'; }
  else if (family_history && age >= 50) { risk = 'moderate_risk'; }
  else { risk = 'low_risk'; }
  const cct_adjusted_iop = iop - (600 - cct) * 0.04;
  return { iop, cct, cdr, family_history, age, cct_adjusted_iop: Math.round(cct_adjusted_iop*10)/10, risk, citations:['aao'] };
}

function angleClosure(input) {
  ensureObj(input, 'input');
  const eye_pain = !!input.eye_pain;
  const halos = !!input.halos;
  const nausea_vomiting = !!input.nausea_vomiting;
  const mid_dilated_pupil = !!input.mid_dilated_pupil;
  const steamy_cornea = !!input.steamy_cornea;
  const iop = ensureNumber(input.iop, 'iop');
  let action;
  if (eye_pain && halos && nausea_vomiting && mid_dilated_pupil && iop > 40) { action = 'acute_angle_closure_emergency'; }
  else if (eye_pain && halos) { action = 'urgent_ophthalmology_consultation'; }
  else { action = 'elective_anterior_segment_exam'; }
  return { eye_pain, halos, nausea_vomiting, mid_dilated_pupil, steamy_cornea, iop, action };
}

module.exports = { glaucomaRisk, angleClosure, CITATIONS, ValidationError };
