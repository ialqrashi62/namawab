'use strict';
// TIER4_RHEUM_EXT-103 Vasculitis
const CITATIONS = ['CHCC_2012_Vasculitis','EULAR_Vasculitis_2024'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function ancaScreening(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const pattern = ensureEnum(input.pattern || 'negative', ['negative','p_anca_mpo','c_anca_pr3','atypical'], 'pattern');
  const clinical_suspicion = ensureEnum(input.clinical_suspicion || 'none', ['gpa','mpa','egpa','iga_vasculitis','cryoglobulinemia','none'], 'clinical_suspicion');
  const anca = pattern === 'negative' ? 'negative' : pattern;
  let diagnosis_match = false;
  if ((clinical_suspicion === 'gpa' && pattern === 'c_anca_pr3') || (clinical_suspicion === 'mpa' && pattern === 'p_anca_mpo') || (clinical_suspicion === 'egpa' && pattern === 'p_anca_mpo')) {
    diagnosis_match = true;
  }
  return { pattern, clinical_suspicion, anca, diagnosis_match, citations: CITATIONS };
}

function giantCellArteritis(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_over_50 = !!input.age_over_50;
  const new_headache = !!input.new_headache;
  const temporal_artery_abnormality = !!input.temporal_artery_abnormality;
  const elevated_esr = !!input.elevated_esr;
  const biopsy_abnormality = !!input.biopsy_abnormality;
  let score = 0;
  if (age_over_50) score += 3;
  if (new_headache) score += 2;
  if (temporal_artery_abnormality) score += 3;
  if (elevated_esr >= 50) score += 3;
  if (biopsy_abnormality) score += 5;
  let diagnosis = 'no_gca';
  if (score >= 6) diagnosis = 'high_probability_gca';
  else if (score >= 3) diagnosis = 'intermediate_probability_gca';
  const treat_urgent = age_over_50 && (new_headache || temporal_artery_abnormality);
  return { age_over_50, new_headache, temporal_artery_abnormality, elevated_esr, biopsy_abnormality, score, diagnosis, treat_urgent_prednisone_1mg_kg: treat_urgent, citations: CITATIONS };
}

module.exports = { ancaScreening, giantCellArteritis, CITATIONS, ValidationError };