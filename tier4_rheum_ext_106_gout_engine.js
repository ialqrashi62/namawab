'use strict';
// TIER4_RHEUM_EXT-106 Gout
const CITATIONS = ['ACR_Gout_2020','EULAR_Gout_Recommendations'];
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

function acuteGoutTreatment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const renal_failure = !!input.renal_failure;
  const gi_bleed = !!input.gi_bleed;
  const on_warfarin = !!input.on_warfarin;
  let first_line = 'nsaids_indomethacin_or_naproxen_with_ppi';
  let alternative = null;
  if (renal_failure || age > 65) {
    first_line = 'colchicine_1_2_then_0_6_one_hour_later_then_0_6_12_hourly';
    alternative = 'corticosteroids_prednisone_30_to_40mg_5_days';
  }
  if (gi_bleed || on_warfarin) {
    first_line = 'corticosteroids_intraarticular_or_oral';
    alternative = 'colchicine_consider';
  }
  return { age, renal_failure, gi_bleed, on_warfarin, first_line, alternative, citations: CITATIONS };
}

function chronicUrateLoweringTherapy(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const serum_urate = ensureNumber(input.serum_urate, 'serum_urate');
  const tophi_present = !!input.tophi_present;
  const frequent_flares = ensureNumber(input.frequent_flares || 0, 'frequent_flares');
  const age = ensureNumber(input.age || 60, 'age');
  const renal_failure = !!input.renal_failure;
  const indication = tophi_present || frequent_flares >= 2 || serum_urate >= 9 || (serum_urate >= 6 && frequent_flares >= 1);
  let medication = 'allopurinol_100_to_300_daily';
  if (renal_failure || age > 60) medication = 'allopurinol_50_to_100_daily_with_renal_dosing';
  const target_urate = tophi_present ? 'less_than_5' : 'less_than_6';
  return { serum_urate, tophi_present, frequent_flares, indication, medication, target_urate, citations: CITATIONS };
}

module.exports = { acuteGoutTreatment, chronicUrateLoweringTherapy, CITATIONS, ValidationError };