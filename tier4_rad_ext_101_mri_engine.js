'use strict';
// TIER4_RAD_EXT-101 MRI Safety
const CITATIONS = ['ACR_MRI_Safety','MRIsafety_com'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function mriSafetyScreening(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const pacemaker = !!input.pacemaker;
  const aneurysm_clip = !!input.aneurysm_clip;
  const cochlear_implant = !!input.cochlear_implant;
  const metallic_foreign_body = !!input.metallic_foreign_body;
  const pregnancy = !!input.pregnancy;
  const claustrophobia = !!input.claustrophobia;
  let safe_to_scan = !pacemaker && !metallic_foreign_body;
  let caution = [];
  if (pacemaker) caution.push('need_MRI_conditional_verification');
  if (aneurysm_clip) caution.push('verify_clip_is_MRI_conditional');
  if (cochlear_implant) caution.push('cochlear_implant_safety_check_required');
  if (claustrophobia) caution.push('consider_sedation_or_open_MRI');
  if (pregnancy) caution.push('gadolinium_avoid_in_pregnancy_first_trimester');
  return { pacemaker, aneurysm_clip, cochlear_implant, metallic_foreign_body, pregnancy, claustrophobia, safe_to_scan, caution, citations: CITATIONS };
}

function mriPacemakerSafety(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const device_model = ensureEnum(input.device_model || 'mri_conditional', ['mri_conditional','mri_unsafe','unknown'], 'device_model');
  const pacing_dependent = !!input.pacing_dependent;
  if (device_model === 'mri_conditional') return { device_model, pacing_dependent, eligible: true, requirements: 'pre_scan_device_interrogation_programmed_mri_mode_post_scan_interrogation', citations: CITATIONS };
  return { device_model, pacing_dependent, eligible: false, citations: CITATIONS };
}

module.exports = { mriSafetyScreening, mriPacemakerSafety, CITATIONS, ValidationError };