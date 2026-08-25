'use strict';
// TIER4_REPRO-103 Recurrent Pregnancy Loss
const CITATIONS = ['ASRM_RPL','ESHRE_RPL_2022'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function recurrentLossWorkup(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const losses = ensureNumber(input.losses, 'losses');
  const karyotype_done = !!input.karyotype_done;
  const antiphospholipid_evaluated = !!input.antiphospholipid_evaluated;
  const uterine_evaluation_done = !!input.uterine_evaluation_done;
  const thyroid_done = !!input.thyroid_done;
  const recommendations = [];
  if (losses < 2) {
    recommendations.push('recurrent_loss_defined_as_2_or_more_losses');
    return { losses, recommendations, citations: CITATIONS };
  }
  if (!karyotype_done) recommendations.push('parental_karyotype');
  if (!antiphospholipid_evaluated) recommendations.push('anticardiolipin_lupus_anticoagulant_anti_beta2_glycoprotein');
  if (!uterine_evaluation_done) recommendations.push('saline_sonohysterogram_or_hysteroscopy');
  if (!thyroid_done) recommendations.push('tsh_tpo_antibodies');
  recommendations.push('progesterone_in_subsequent_pregnancy_if_short_luteal_phase');
  return { losses, recommendations, citations: CITATIONS };
}

function antiphospholipidSyndromeCriteria(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const clinical_event = ensureEnum(input.clinical_event || 'vte', ['vte','arterial_thrombosis','recurrent_loss','late_loss','placental_insufficiency'], 'clinical_event');
  const antiphospholipid_positive = !!input.antiphospholipid_positive;
  const on_two_occasions_12_weeks_apart = !!input.on_two_occasions_12_weeks_apart;
  const classified = (clinical_event !== 'vte' || clinical_event !== 'arterial_thrombosis') && antiphospholipid_positive && on_two_occasions_12_weeks_apart;
  return { clinical_event, antiphospholipid_positive, on_two_occasions_12_weeks_apart, classified, citations: CITATIONS };
}

module.exports = { recurrentLossWorkup, antiphospholipidSyndromeCriteria, CITATIONS, ValidationError };