'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  the_bethesda: 'Cibas ES, Ali SZ. The Bethesda System for Reporting Thyroid Cytopathology 2017',
  yok: 'Yokota M, et al. Yokohama System for Reporting Breast Cytopathology 2020'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function thyroidBethesda(input) {
  ensureObj(input, 'input');
  const category = ensureEnum(input.category, ['i_non_diag','ii_benign','iii_atypia','iv_follicular_neoplasm','v_suspicious','vi_malignant'], 'category');
  const map = {
    i_non_diag: 'repeat_us_fna_3_mo',
    ii_benign: 'clinical_followup',
    iii_atypia: 'repeat_fna_molecular_testing',
    iv_follicular_neoplasm: 'lobectomy_or_molecular_testing',
    v_suspicious: 'thyroidectomy',
    vi_malignant: 'total_thyroidectomy'
  };
  return { category, recommendation: map[category], citations:['the_bethesda'] };
}

function breastYokohama(input) {
  ensureObj(input, 'input');
  const category = ensureEnum(input.category, ['i_insufficient','ii_benign','iii_atypical','iv_suspicious','v_malignant'], 'category');
  const map = {
    i_insufficient: 'repeat_fna',
    ii_benign: 'clinical_followup_3_6mo',
    iii_atypical: 'core_biopsy',
    iv_suspicious: 'core_biopsy_or_surgical',
    v_malignant: 'treatment_planning'
  };
  return { category, recommendation: map[category], citations:['yok'] };
}

module.exports = { thyroidBethesda, breastYokohama, CITATIONS, ValidationError };
