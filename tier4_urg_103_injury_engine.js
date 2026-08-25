'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { nice_trauma: 'NICE Head Injury Guidelines 2014' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function headInjury(input) {
  ensureObj(input, 'input');
  const gcs = ensureNumber(input.gcs, 'gcs');
  const loss_of_consciousness = !!input.loss_of_consciousness;
  const anticoagulation = !!input.anticoagulation;
  const vomiting = !!input.vomiting;
  const age = ensureNumber(input.age, 'age');
  const amnesia = !!input.amnesia;
  const worry = !!input.worry;
  let rule;
  if (gcs < 15) { rule = 'ct_head'; }
  else if (age >= 65 && loss_of_consciousness) { rule = 'ct_head'; }
  else if (anticoagulation && (loss_of_consciousness || vomiting)) { rule = 'ct_head'; }
  else if (amnesia || vomiting || worry) { rule = 'observe_ct_consider'; }
  else { rule = 'discharge_with_caregiver'; }
  return { gcs, loss_of_consciousness, anticoagulation, vomiting, age, amnesia, worry, rule, citations:['nice_trauma'] };
}

function fractureRisk(input) {
  ensureObj(input, 'input');
  const location = ensureEnum(input.location, ['ankle','foot','knee','wrist','hip','shoulder','elbow','spine','pelvis'], 'location');
  const deformity = !!input.deformity;
  const swelling = !!input.swelling;
  const weight_bearing = !!input.weight_bearing;
  const age = ensureNumber(input.age, 'age');
  let imaging;
  if (deformity || location === 'hip' || location === 'pelvis' || location === 'spine') { imaging = 'xray_immediate'; }
  else if (location === 'ankle' && (swelling || !weight_bearing)) { imaging = 'ottawa_xray'; }
  else if (location === 'foot' && (swelling || !weight_bearing)) { imaging = 'ottawa_xray'; }
  else if (age >= 65 && location === 'wrist' && swelling) { imaging = 'xray_immediate'; }
  else { imaging = 'clinical_assessment'; }
  return { location, deformity, swelling, weight_bearing, age, imaging };
}

module.exports = { headInjury, fractureRisk, CITATIONS, ValidationError };
