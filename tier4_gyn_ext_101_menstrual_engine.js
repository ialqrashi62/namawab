'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { acog_pbleed: 'ACOG Abnormal Uterine Bleeding 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function aubPalmbCoein(input) {
  ensureObj(input, 'input');
  const structural = !!input.structural;
  const ovulatory = !!input.ovulatory;
  const endometrial = !!input.endometrial;
  const iatrogenic = !!input.iatrogenic;
  const not_yet_classified = !!input.not_yet_classified;
  const diagnosis = [];
  if (structural) { diagnosis.push('polyp'); }
  if (ovulatory) { diagnosis.push('anovulation'); }
  if (endometrial) { diagnosis.push('hyperplasia'); }
  if (iatrogenic) { diagnosis.push('iatrogenic'); }
  if (not_yet_classified) { diagnosis.push('not_yet_classified'); }
  if (diagnosis.length === 0) { diagnosis.push('normal_palmb_coein'); }
  return { structural, ovulatory, endometrial, iatrogenic, not_yet_classified, diagnosis, citations:['acog_pbleed'] };
}

function menstrual(input) {
  ensureObj(input, 'input');
  const cycle_length_days = ensureNumber(input.cycle_length_days, 'cycle_length_days');
  const bleeding_days = ensureNumber(input.bleeding_days, 'bleeding_days');
  const pad_change_per_hour = ensureNumber(input.pad_change_per_hour, 'pad_change_per_hour');
  const heavy = pad_change_per_hour >= 1 || bleeding_days >= 7;
  const oligomenorrhea = cycle_length_days > 35;
  const polymenorrhea = cycle_length_days < 21;
  let pattern;
  if (heavy) { pattern = 'menorrhagia'; }
  else if (oligomenorrhea) { pattern = 'oligomenorrhea'; }
  else if (polymenorrhea) { pattern = 'polymenorrhea'; }
  else { pattern = 'normal'; }
  return { cycle_length_days, bleeding_days, pad_change_per_hour, heavy, oligomenorrhea, polymenorrhea, pattern };
}

module.exports = { aubPalmbCoein, menstrual, CITATIONS, ValidationError };
