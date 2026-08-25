'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { acep: 'American College of Emergency Physicians 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function laceration(input) {
  ensureObj(input, 'input');
  const length_cm = ensureNumber(input.length_cm, 'length_cm');
  const depth = ensureEnum(input.depth, ['superficial','deep','muscle','tendon_or_bone'], 'depth');
  const location = ensureEnum(input.location, ['face','scalp','extremity','hand','joint','other'], 'location');
  const contamination = !!input.contamination;
  const age_hours = ensureNumber(input.age_hours, 'age_hours');
  let management;
  if (depth === 'tendon_or_bone') { management = 'or_referral_surgical_consult'; }
  else if (location === 'face' || location === 'joint' || contamination || age_hours >= 12) { management = 'irrigation_layered_closure_antibiotics'; }
  else if (depth === 'deep') { management = 'irrigation_closure_antibiotics_consider'; }
  else if (depth === 'muscle') { management = 'irrigation_transcutaneous_sutures'; }
  else { management = 'steri_strips_tissue_adhesive'; }
  return { length_cm, depth, location, contamination, age_hours, management };
}

function abscess(input) {
  ensureObj(input, 'input');
  const size_cm = ensureNumber(input.size_cm, 'size_cm');
  const fluctuant = !!input.fluctuant;
  const diabetic = !!input.diabetic;
  const immunocompromised = !!input.immunocompromised;
  const location = ensureEnum(input.location, ['skin','perianal','pilonidal','vulvovaginal','scrotal','other'], 'location');
  let therapy;
  if (fluctuant && size_cm >= 2) { therapy = 'incision_and_drainage'; }
  else if (diabetic || immunocompromised || location === 'perianal' || location === 'pilonidal') { therapy = 'i_and_d_plus_antibiotics_culture'; }
  else { therapy = 'oral_antibiotics_warm_compresses'; }
  return { size_cm, fluctuant, diabetic, immunocompromised, location, therapy };
}

module.exports = { laceration, abscess, CITATIONS, ValidationError };
