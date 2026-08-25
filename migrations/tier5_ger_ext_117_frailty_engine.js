// filepath: tier5_ger_ext_117_frailty_engine.js
// TIER5_GER_EXT-117: Frailty / Sarcopenia
'use strict';
const CITATIONS = ['FI_LP_2020','EWGSOP2_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function frailty_index(req){
  ensureNumber(req.deficits_count, 'deficits_count');
  ensureEnum(req.frailty_category, 'frailty_category', ['robust','pre_frail','frail','severely_frail','unknown']);
  ensureBool(req.functional_decline, 'functional_decline');
  ensureNumber(req.score_change, 'score_change');
  ensureBool(req.multidisciplinary, 'multidisciplinary');
  ensureBool(req.intensive_intervention, 'intensive_intervention');
  let plan;
  if(req.frailty_category==='severely_frail' && req.intensive_intervention===false) plan='continue_with_comprehensive_then_reassess';
  else if(req.frailty_category==='frail') plan='continue_with_targeted_then_reassess';
  else plan='continue_with_prevent_then_reassess';
  return {plan};
}
function sarc_screen(req){
  ensureNumber(req.grip_strength, 'grip_strength');
  ensureNumber(req.walking_speed, 'walking_speed');
  ensureNumber(req.muscle_mass_index, 'muscle_mass_index');
  ensureBool(req.physical_performance, 'physical_performance');
  ensureEnum(req.sarc_category, 'sarc_category', ['none','probable','confirmed','severe','unknown']);
  ensureBool(req.dynapenia_present, 'dynapenia_present');
  let plan;
  if(req.sarc_category==='confirmed' || req.sarc_category==='severe') plan='continue_with_intervention_then_reassess';
  else if(req.sarc_category==='probable') plan='continue_with_lifestyle_then_reassess';
  else plan='continue_with_prevent_then_reassess';
  return {plan};
}
function prehab(req){
  ensureEnum(req.modality, 'modality', ['resistance','combined','aerobic','balance','home_based','other']);
  ensureNumber(req.sessions_per_week, 'sessions_per_week');
  ensureBool(req.adherent, 'adherent');
  ensureNumber(req.intensity_documented, 'intensity_documented');
  ensureBool(req.progress_measured, 'progress_measured');
  ensureNumber(req.duration_weeks, 'duration_weeks');
  let plan;
  if(req.adherent===false) plan='continue_with_barriers_then_reassess';
  else if(req.duration_weeks<8) plan='continue_with_extend_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function frailty_med(req){
  ensureBool(req.consider_ace, 'consider_ace');
  ensureBool(req.avoid_anticholin, 'avoid_anticholin');
  ensureBool(req.deprescribing_applied, 'deprescribing_applied');
  ensureBool(req.anemia_workup, 'anemia_workup');
  ensureBool(req.vitamin_d_supplementation, 'vitamin_d_supplementation');
  ensureBool(req.immunizations_review, 'immunizations_review');
  let plan;
  if(req.deprescribing_applied===false) plan='continue_with_review_then_reassess';
  else if(req.immunizations_review===false) plan='continue_with_immunization_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function discharge(req){
  ensureBool(req.cga_completed, 'cga_completed');
  ensureBool(req.transition_called, 'transition_called');
  ensureBool(req.med_reconciled, 'med_reconciled');
  ensureBool(req.tcm_scheduled, 'tcm_scheduled');
  ensureNumber(req.readm_30d_risk, 'readm_30d_risk');
  ensureBool(req.caregiver_trained, 'caregiver_trained');
  let plan;
  if(req.tcm_scheduled===false || req.readm_30d_risk>=5) plan='continue_with_tcm_then_reassess';
  else if(req.caregiver_trained===false) plan='continue_with_train_caregiver_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function frailty_fu(req){
  ensureNumber(req.months_since_eval, 'months_since_eval');
  ensureNumber(req.deficits_change, 'deficits_change');
  ensureEnum(req.clinical_status, 'clinical_status', ['worsening','stable','improving','unknown']);
  ensureBool(req.admission_30d, 'admission_30d');
  ensureBool(req.snf_admit, 'snf_admit');
  ensureBool(req.weights_followed, 'weights_followed');
  let plan;
  if(req.clinical_status==='worsening') plan='continue_with_intensify_then_reassess';
  else if(req.admission_30d===true) plan='continue_with_tcm_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {frailty_index,sarc_screen,prehab,frailty_med,discharge,frailty_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
