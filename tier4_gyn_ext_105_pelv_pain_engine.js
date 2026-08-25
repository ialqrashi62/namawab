'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { acog_pelvic: 'ACOG Chronic Pelvic Pain 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function endometriosisScreen(input) {
  ensureObj(input, 'input');
  const dysmenorrhea = !!input.dysmenorrhea;
  const dyspareunia = !!input.dyspareunia;
  const chronic_pain = !!input.chronic_pain;
  const dyschezia = !!input.dyschezia;
  const infertility = !!input.infertility;
  const age = ensureNumber(input.age, 'age');
  const score = (dysmenorrhea?1:0) + (dyspareunia?1:0) + (chronic_pain?1:0) + (dyschezia?1:0) + (infertility?1:0);
  let risk;
  if (score >= 3 && age <= 40) { risk = 'high_endometriosis_suspicion'; }
  else if (score >= 2) { risk = 'moderate_consider_ultrasound'; }
  else { risk = 'low'; }
  return { dysmenorrhea, dyspareunia, chronic_pain, dyschezia, infertility, age, score, risk, citations:['acog_pelvic'] };
}

function pcosDiagnosis(input) {
  ensureObj(input, 'input');
  const oligo_ovulation = !!input.oligo_ovulation;
  const hyperandrogenism = !!input.hyperandrogenism;
  const polycystic_ovaries = !!input.polycystic_ovaries;
  const other_causes_excluded = !!input.other_causes_excluded;
  let diagnosis;
  if (other_causes_excluded && ((oligo_ovulation && hyperandrogenism) || (oligo_ovulation && polycystic_ovaries) || (hyperandrogenism && polycystic_ovaries))) { diagnosis = 'pcos_diagnosis'; }
  else if (other_causes_excluded && (oligo_ovulation || hyperandrogenism || polycystic_ovaries)) { diagnosis = 'pcos_partial'; }
  else { diagnosis = 'pcos_unlikely'; }
  return { oligo_ovulation, hyperandrogenism, polycystic_ovaries, other_causes_excluded, diagnosis };
}

module.exports = { endometriosisScreen, pcosDiagnosis, CITATIONS, ValidationError };
