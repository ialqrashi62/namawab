'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { uspstf_smoking: 'USPSTF Tobacco Cessation 2015' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function fiveAs(input) {
  ensureObj(input, 'input');
  const ask = !!input.ask;
  const advise = !!input.advise;
  const assess = !!input.assess;
  const assist = !!input.assist;
  const arrange = !!input.arrange;
  const completed = (ask?1:0) + (advise?1:0) + (assess?1:0) + (assist?1:0) + (arrange?1:0);
  const score = completed;
  let quality;
  if (score >= 5) { quality = 'complete'; }
  else if (score >= 3) { quality = 'partial'; }
  else { quality = 'incomplete'; }
  return { ask, advise, assess, assist, arrange, score, quality, citations:['uspstf_smoking'] };
}

function quitSmokingPlan(input) {
  ensureObj(input, 'input');
  const cigarettes_per_day = ensureNumber(input.cigarettes_per_day, 'cigarettes_per_day');
  const years_smoking = ensureNumber(input.years_smoking, 'years_smoking');
  const first_30_days = !!input.first_30_days;
  const nicotine_dependence = cigarettes_per_day >= 20;
  const pack_years = (cigarettes_per_day / 20) * years_smoking;
  const pharmacotherapy = nicotine_dependence ? 'combination_nrt_varenicline' : 'nrt_patch_consider_bupropion';
  const behavioral = first_30_days ? 'quitline_call_2_5_days' : 'counseling_brief_intervention';
  return { cigarettes_per_day, years_smoking, first_30_days, nicotine_dependence, pack_years: Math.round(pack_years*10)/10, pharmacotherapy, behavioral };
}

module.exports = { fiveAs, quitSmokingPlan, CITATIONS, ValidationError };
