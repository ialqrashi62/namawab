// filepath: tier5_psych_ext_109_anxiety_engine.js
// TIER5_PSYCH_EXT-109: Anxiety / OCD / PTSD
'use strict';
const CITATIONS = ['DSM5_ANXIETY_2022','WFSBP_ANXIETY_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function gad_screen(req){
  ensureNumber(req.gad7_score, 'gad7_score');
  ensureEnum(req.severity, 'severity', ['minimal','mild','moderate','severe','other']);
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureBool(req.functional_impairment, 'functional_impairment');
  ensureBool(req.worry_control, 'worry_control');
  ensureBool(req.comorbid_depression, 'comorbid_depression');
  let plan;
  if(req.gad7_score>=15) plan='continue_with_high_intensity_tx_then_reassess';
  else if(req.gad7_score>=10) plan='continue_with_treatment_then_reassess';
  else plan='continue_with_followup_then_reassess';
  return {plan};
}
function panic(req){
  ensureNumber(req.panic_frequency, 'panic_frequency');
  ensureBool(req.agoraphobia, 'agoraphobia');
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureBool(req.lifestyle_restricted, 'lifestyle_restricted');
  ensureEnum(req.first_line, 'first_line', ['ssri','snri','benzo_short','tca','maoi','other']);
  ensureBool(req.cognitive_components, 'cognitive_components');
  let plan;
  if(req.panic_frequency>=4 && req.agoraphobia===true) plan='continue_with_aggressive_tx_then_reassess';
  else if(req.cognitive_components===true) plan='continue_with_cbt_then_reassess';
  else plan='continue_with_treatment_then_reassess';
  return {plan};
}
function ocd(req){
  ensureNumber(req.ybocs_score, 'ybocs_score');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','extreme','other']);
  ensureEnum(req.obsessions_type, 'obsessions_type', ['contamination','harm','symmetry','hoarding','religious','sexual','misc','other']);
  ensureBool(req.compulsions_present, 'compulsions_present');
  ensureBool(req.erp_started, 'erp_started');
  ensureBool(req.ssri_high_dose, 'ssri_high_dose');
  let plan;
  if(req.ybocs_score>=30 && req.erp_started===false) plan='continue_with_erp_first_then_reassess';
  else if(req.ssri_high_dose===false && req.compulsions_present===true) plan='continue_with_ssri_optimize_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function ptsd(req){
  ensureStr(req.trauma_type, 'trauma_type');
  ensureEnum(req.trauma_type, 'trauma_type', ['combat','sexual','physical','accident','medical','natural_disaster','witnessed','other','unknown']);
  ensureNumber(req.symptoms_months, 'symptoms_months');
  ensureBool(req.re_experiencing, 're_experiencing');
  ensureBool(req.avoidance, 'avoidance');
  ensureBool(req.hyperarousal, 'hyperarousal');
  ensureBool(req.trauma_focused_therapy, 'trauma_focused_therapy');
  let plan;
  if(req.symptoms_months>=3 && req.trauma_focused_therapy===false) plan='continue_with_emdr_or_cept_then_reassess';
  else if(req.hyperarousal===true) plan='continue_with_stabilize_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function social(req){
  ensureNumber(req.lsas_score, 'lsas_score');
  ensureBool(req.functional_impairment, 'functional_impairment');
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureBool(req.avoidance_pattern, 'avoidance_pattern');
  ensureEnum(req.modality, 'modality', ['cbt','exposure','ssri','benzo','maoi','combination','other']);
  ensureBool(req.exposure_started, 'exposure_started');
  let plan;
  if(req.lsas_score>=60) plan='continue_with_intensive_exposure_then_reassess';
  else if(req.exposure_started===false && req.avoidance_pattern===true) plan='continue_with_exposure_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function anxiety_fu(req){
  ensureNumber(req.weeks_in_treatment, 'weeks_in_treatment');
  ensureNumber(req.score_change, 'score_change');
  ensureBool(req.med_adherent, 'med_adherent');
  ensureBool(req.therapy_engaged, 'therapy_engaged');
  ensureBool(req.side_effects, 'side_effects');
  ensureBool(req.remission, 'remission');
  let plan;
  if(req.score_change<-4 && req.therapy_engaged===true) plan='continue_with_response_then_reassess';
  else if(req.remission===true) plan='continue_with_maintenance_then_reassess';
  else if(req.side_effects===true) plan='continue_with_manage_se_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {gad_screen,panic,ocd,ptsd,social,anxiety_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
