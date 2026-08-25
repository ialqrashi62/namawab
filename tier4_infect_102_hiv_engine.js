'use strict';
// TIER4_INFECT-102 HIV
const CITATIONS = [
  { id: 'DHHS-HIV-2024', source: 'DHHS HIV Guidelines', year: 2024 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function artInitiation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cd4 = ensureNumber(input, 'cd4_count', 0, 3000);
  const viral_load = ensureNumber(input, 'viral_load', 0, 10000000);
  const hla_b5701 = ensureEnum(input, 'hla_b5701', ['positive', 'negative', 'pending']);
  const hepatitis_b = input.hep_b_co_infection === true;
  const pregnancy = input.pregnancy === true;
  const ready = ensureEnum(input, 'readiness', ['ready', 'ambivalent', 'unready']);
  const regimen = (hla_b5701 === 'positive') ? 'integrase_inhibitor_dolutegravir_plus_tenofovir_lamivudine' :
    (pregnancy) ? 'tenofovir_emtricitabine_dolutegravir_or_atazanavir' :
    (hepatitis_b) ? 'tenofovir_emtricitabine_dolutegravir_for_dual_active' :
    'dolutegravir_or_bictegravir_plus_tenofovir_alafenamide_emtricitabine';
  const therapy = (ready !== 'ready') ? 'counseling_then_delayed_initiation' : regimen;
  return {
    module: 'tier4_infect_102_art',
    patient_id: patientId,
    cd4,
    viral_load,
    hla_b5701,
    hepatitis_b_co_infection: hepatitis_b,
    pregnancy,
    readiness: ready,
    regimen: therapy,
    monitoring: 'q2wk_initial_q3mo_viral_load_q3mo_cd4',
    citations: CITATIONS
  };
}
function opportunisticProphylaxis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cd4 = ensureNumber(input, 'cd4_count', 0, 3000);
  const toxo_igg = ensureEnum(input, 'toxoplasma_igg', ['positive', 'negative', 'pending']);
  const prophylaxis = (cd4 < 200) ? 'tmp_smx_dapsone_or_pentamidine' :
    (cd4 < 250 && toxo_igg === 'positive') ? 'tmp_smx_for_toxoplasmosis' :
    (cd4 < 50) ? 'mac_prophylaxis_azithromycin_or_clarithromycin' :
    'no_prophylaxis_continue_art';
  return {
    module: 'tier4_infect_102_opp',
    patient_id: patientId,
    cd4,
    toxoplasma_igg: toxo_igg,
    prophylaxis,
    monitoring: 'q3mo_cd4_until_above_threshold',
    citations: CITATIONS
  };
}
module.exports = {
  artInitiation,
  opportunisticProphylaxis,
  CITATIONS,
  ValidationError
};