'use strict';
// TIER4_RHEUM_EXT-105 Scleroderma
const CITATIONS = ['ACR_EULAR_Scleroderma','Scleroderma_Foundation'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function limitedVsDiffuseScleroderma(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const skin_spread_proximal = !!input.skin_spread_proximal;
  const skin_spread_truncal = !!input.skin_spread_truncal;
  const raynauds = !!input.raynauds;
  const digital_ulcers = !!input.digital_ulcers;
  const subtype = skin_spread_truncal ? 'diffuse' : skin_spread_proximal ? 'intermediate' : 'limited';
  let internal_screen = ['pulmonary_function_tests','echocardiogram_pulmonary_htn_screen'];
  if (subtype === 'diffuse') internal_screen.push('renal_function_close_monitoring');
  return { skin_spread_proximal, skin_spread_truncal, raynauds, digital_ulcers, subtype, internal_screen, citations: CITATIONS };
}

function raynaudsManagement(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const severity = ensureEnum(input.severity || 'mild', ['mild','moderate','severe','digital_pits','ulcers','gangrene'], 'severity');
  const primary = !!input.primary;
  let interventions = ['cold_avoidance','smoking_cessation'];
  if (severity !== 'mild') interventions.push('dihydropyridine_ccb_amlodipine_nifedipine');
  if (severity === 'severe' || severity === 'digital_pits' || severity === 'ulcers' || severity === 'gangrene') {
    interventions.push('endothelin_receptor_antagonist_consider');
    interventions.push('iloprost_iv_for_digital_crisis');
    interventions.push('sympathectomy_referral_if_refractory');
  }
  if (!primary) interventions.push('screen_for_underlying_connective_tissue_disease');
  return { severity, primary, interventions, citations: CITATIONS };
}

module.exports = { limitedVsDiffuseScleroderma, raynaudsManagement, CITATIONS, ValidationError };