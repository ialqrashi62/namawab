'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  asco_cap: 'ASCO/CAP. Guideline for Immunohistochemistry Testing 2017',
  her2: 'ASCO/CAP. HER2 Testing in Breast Cancer 2018'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function her2Score(input) {
  ensureObj(input, 'input');
  const ihc_pattern = ensureEnum(input.ihc_pattern, ['0','1plus','2plus','3plus'], 'ihc_pattern');
  const fish_ratio = ensureNumber(input.fish_ratio || 0, 'fish_ratio');
  let ish_amplified;
  if (ihc_pattern === '3plus') { ish_amplified = 'positive_no_fish_needed'; }
  else if (ihc_pattern === '2plus') { ish_amplified = fish_ratio >= 2 ? 'positive' : 'negative'; }
  else { ish_amplified = 'negative'; }
  const therapy = ish_amplified.includes('positive') ? 'trastuzumab_eligible' : 'no_trastuzumab';
  return { ihc_pattern, fish_ratio, ish_amplified, therapy, citations:['her2'] };
}

function pdl1Tps(input) {
  ensureObj(input, 'input');
  const tps = ensureNumber(input.tps, 'tps');
  const tumor_type = ensureEnum(input.tumor_type, ['lung','head_neck','urothelial','cervical','tnbc'], 'tumor_type');
  let eligibility = 'unknown';
  if (tumor_type === 'lung') { eligibility = tps >= 50 ? 'pembrolizumab_high' : tps >= 1 ? 'pembrolizumab_or_chemo' : 'io_chemo_chemo'; }
  else if (tumor_type === 'head_neck') { eligibility = tps >= 50 ? 'pembrolizumab_HNSCC' : 'standard_chemo'; }
  else if (tumor_type === 'urothelial') { eligibility = tps >= 10 ? 'pembrolizumab' : 'chemo'; }
  else if (tumor_type === 'cervical') { eligibility = tps >= 1 ? 'pembrolizumab_chemo' : 'chemo'; }
  else if (tumor_type === 'tnbc') { eligibility = tps >= 10 ? 'pembrolizumab_chemo' : 'chemo'; }
  return { tps, tumor_type, eligibility, citations:['asco_cap'] };
}

module.exports = { her2Score, pdl1Tps, CITATIONS, ValidationError };
