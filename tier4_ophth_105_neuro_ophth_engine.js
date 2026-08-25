'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { nnos: 'North American Neuro-Ophthalmology Society 2019' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function opticNeuritis(input) {
  ensureObj(input, 'input');
  const vision_loss_age = ensureNumber(input.vision_loss_age, 'vision_loss_age');
  const pain_on_eye_movement = !!input.pain_on_eye_movement;
  const afferent_pupil_defect = !!input.afferent_pupil_defect;
  const visual_field_defect = ensureEnum(input.visual_field_defect, ['none','central_scotoma','altitudinal','arcuate','junctional','homonymous','other'], 'visual_field_defect');
  let impression;
  if (pain_on_eye_movement && afferent_pupil_defect && visual_field_defect !== 'none') { impression = 'classic_optic_neuritis'; }
  else if (vision_loss_age < 50 && pain_on_eye_movement) { impression = 'probable_optic_neuritis'; }
  else { impression = 'atypical_consider_NMO_MOG_idiopathic_intracranial_htn'; }
  return { vision_loss_age, pain_on_eye_movement, afferent_pupil_defect, visual_field_defect, impression, workup: 'mri_brain_orbits_with_contrast_lp_oligoclonal', citations:['nnos'] };
}

function papilledema(input) {
  ensureObj(input, 'input');
  const headache = !!input.headache;
  const transient_visual_obscurations = !!input.transient_visual_obscurations;
  const pulsatile_tinnitus = !!input.pulsatile_tinnitus;
  const visual_acuity = ensureNumber(input.visual_acuity, 'visual_acuity');
  const disc_oedema = ensureEnum(input.disc_oedema, ['none','grade_1','grade_2','grade_3','grade_4','grade_5'], 'disc_oedema');
  const oct_rnfl_thickness = ensureNumber(input.oct_rnfl_thickness, 'oct_rnfl_thickness');
  if (headache && disc_oedema !== 'none') {
    return { headache, transient_visual_obscurations, pulsatile_tinnitus, visual_acuity, disc_oedema, oct_rnfl_thickness, action: 'urgent_mri_mrv_lp_opening_pressure', citations:['nnos'] };
  }
  return { headache, transient_visual_obscurations, pulsatile_tinnitus, visual_acuity, disc_oedema, oct_rnfl_thickness, action: 'consider_other_papilledema_etiology' };
}

module.exports = { opticNeuritis, papilledema, CITATIONS, ValidationError };
