// filepath: tier5_pmrehab_ext_103_neurop_engine.js
// TIER5_PMREHAB_EXT-103: Neuropathic pain
'use strict';
const CITATIONS = ['IASP_Neuropathic_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assessment(req){
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['diabetic_peripheral','post_herpetic','trigeminal','central_post_stroke','spinal_cord','phantom_limb','complex_regional','peripheral_neuropathy','sciatica','other','unknown']);
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.allodynia, 'allodynia');
  ensureBool(req.hyperalgesia, 'hyperalgesia');
  ensureBool(req.qol_impact, 'qol_impact');
  let plan;
  if(req.pain_score>=7) plan='continue_with_strong_then_reassess';
  else if(req.qol_impact) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function first_line(req){
  ensureBool(req.gabapentin, 'gabapentin');
  ensureBool(req.pregabalin, 'pregabalin');
  ensureBool(req.duloxetine, 'duloxetine');
  ensureBool(req.tca, 'tca');
  ensureBool(req.responded, 'responded');
  ensureBool(req.side_effects, 'side_effects');
  let plan;
  if(req.responded===false && req.side_effects) plan='continue_with_switch_then_reassess';
  else if(req.gabapentin===false && req.pregabalin===false && req.duloxetine===false && req.tca===false) plan='continue_with_start_then_reassess';
  else if(req.responded) plan='continue_with_observation_then_reassess';
  else plan='continue_with_up_then_reassess';
  return {plan};
}
function opioids(req){
  ensureBool(req.indicated, 'indicated');
  ensureNumber(req.daily_mme, 'daily_mme');
  ensureBool(req.reasonable, 'reasonable');
  ensureBool(req.function_improved, 'function_improved');
  ensureBool(req.pain_improved, 'pain_improved');
  ensureBool(req.dependence_risk, 'dependence_risk');
  ensureBool(req.consent, 'consent');
  ensureBool(req.pmp_checked, 'pmp_checked');
  ensureBool(req.udt_done, 'udt_done');
  let plan;
  if(req.daily_mme>=50 && req.function_improved===false) plan='continue_with_taper_then_reassess';
  else if(req.indicated && req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.indicated && req.pmp_checked===false) plan='continue_with_pmp_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function topical(req){
  ensureBool(req.lidocaine, 'lidocaine');
  ensureBool(req.capsaicin, 'capsaicin');
  ensureBool(req.diclofenac, 'diclofenac');
  ensureBool(req.compound, 'compound');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.compound===false && req.diagnosis==='complex_regional') plan='continue_with_compound_then_reassess';
  else if(req.responded===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function procedures(req){
  ensureBool(req.nerve_block, 'nerve_block');
  ensureBool(req.sympathetic_block, 'sympathetic_block');
  ensureBool(req.radiofrequency, 'radiofrequency');
  ensureBool(req.spinal_cord_stim, 'spinal_cord_stim');
  ensureBool(req.successful, 'successful');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.spinal_cord_stim && req.documented===false) plan='continue_with_doc_then_reassess';
  else if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function monitoring(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.function, 'function');
  ensureBool(req.mood, 'mood');
  ensureBool(req.sleep, 'sleep');
  ensureBool(req.adverse, 'adverse');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.adverse) plan='continue_with_review_then_reassess';
  else if(req.mood===false) plan='continue_with_screen_then_reassess';
  else if(req.followup===false) plan='continue_with_fu_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assessment,first_line,opioids,topical,procedures,monitoring};}
module.exports={funcs,CITATIONS,ValidationError};