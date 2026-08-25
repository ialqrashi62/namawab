'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { asrm_infert: 'ASRM Infertility 2019' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function infertilityWorkup(input) {
  ensureObj(input, 'input');
  const female_age = ensureNumber(input.female_age, 'female_age');
  const months_ttc = ensureNumber(input.months_ttc, 'months_ttc');
  const regular_cycles = !!input.regular_cycles;
  const male_partner_evaluation = !!input.male_partner_evaluation;
  const prior_pregnancy = !!input.prior_pregnancy;
  let action;
  if (female_age >= 35 && months_ttc >= 6) { action = 'expedited_evaluation'; }
  else if (months_ttc >= 12) { action = 'basic_workup'; }
  else if (months_ttc >= 6) { action = 'reassess_lifestyle'; }
  else { action = 'continue_attempting'; }
  return { female_age, months_ttc, regular_cycles, male_partner_evaluation, prior_pregnancy, action, citations:['asrm_infert'] };
}

function ovulationCheck(input) {
  ensureObj(input, 'input');
  const cycle_length_days = ensureNumber(input.cycle_length_days, 'cycle_length_days');
  const mid_luteal_progesterone = ensureNumber(input.mid_luteal_progesterone, 'mid_luteal_progesterone');
  const bbt_biphasic = !!input.bbt_biphasic;
  let interpretation;
  if (cycle_length_days < 21 || cycle_length_days > 35) { interpretation = 'irregular_cycles_evaluate_ovulation'; }
  else if (mid_luteal_progesterone >= 10) { interpretation = 'confirming_ovulation_normal'; }
  else if (bbt_biphasic) { interpretation = 'likely_ovulating'; }
  else { interpretation = 'consider_anovulation'; }
  return { cycle_length_days, mid_luteal_progesterone, bbt_biphasic, interpretation };
}

module.exports = { infertilityWorkup, ovulationCheck, CITATIONS, ValidationError };
