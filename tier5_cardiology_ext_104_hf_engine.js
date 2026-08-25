// filepath: tier5_cardiology_ext_104_hf_engine.js
// TIER5_CARDIOLOGY_EXT-104: Heart failure
'use strict';
const CITATIONS = ['ACC_AHA_HF_2022','ESC_HF_2021'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function diagnosis(req){
  ensureBool(req.dyspnea, 'dyspnea');
  ensureBool(req.fatigue, 'fatigue');
  ensureBool(req.elevated_jvp, 'elevated_jvp');
  ensureBool(req.rales, 'rales');
  ensureBool(req.s3_gallop, 's3_gallop');
  ensureBool(req.edema, 'edema');
  ensureBool(req.echo_confirmed, 'echo_confirmed');
  ensureBool(req.ntprobnp_elevated, 'ntprobnp_elevated');
  let plan;
  if(req.echo_confirmed===false) plan='continue_with_echo_then_reassess';
  else if(req.ntprobnp_elevated===false) plan='continue_with_check_then_reassess';
  else if(req.elevated_jvp && req.rales) plan='continue_with_confirm_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function phenotyping(req){
  ensureNumber(req.lvef, 'lvef');
  ensureStr(req.phenotype, 'phenotype');
  ensureEnum(req.phenotype, 'phenotype', ['hfref','hfmidrange','hfpef','unclassified','transitional','recovered']);
  ensureBool(req.echocardiographic_documented, 'echocardiographic_documented');
  ensureBool(req.cardiac_mri, 'cardiac_mri');
  ensureBool(req.amyloid_screened, 'amyloid_screened');
  let plan;
  if(req.echocardiographic_documented===false) plan='continue_with_echo_then_reassess';
  else if(req.amyloid_screened===false && req.phenotype==='hfpef') plan='continue_with_screen_then_reassess';
  else if(req.cardiac_mri===false) plan='continue_with_consider_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function gdgmt(req){
  ensureBool(req.acei_or_arni, 'acei_or_arni');
  ensureBool(req.beta_blocker, 'beta_blocker');
  ensureBool(req.mra, 'mra');
  ensureBool(req.sglt2i, 'sglt2i');
  ensureBool(req.dose_optimized, 'dose_optimized');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.acei_or_arni===false) plan='continue_with_acei_or_arni_then_reassess';
  else if(req.beta_blocker===false) plan='continue_with_beta_blocker_then_reassess';
  else if(req.mra===false) plan='continue_with_mra_then_reassess';
  else if(req.sglt2i===false) plan='continue_with_sglt2i_then_reassess';
  else if(req.dose_optimized===false) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function decompensation(req){
  ensureBool(req.dyspnea_increase, 'dyspnea_increase');
  ensureBool(req.weight_gain, 'weight_gain');
  ensureNumber(req.weight_change_lb, 'weight_change_lb');
  ensureBool(req.edema_increase, 'edema_increase');
  ensureBool(req.orthopnea, 'orthopnea');
  ensureBool(req.pnd, 'pnd');
  let plan;
  if(req.orthopnea && req.pnd) plan='continue_with_admit_then_reassess';
  else if(req.weight_change_lb>=5) plan='continue_with_diuresis_then_reassess';
  else if(req.dyspnea_increase && req.edema_increase) plan='continue_with_diuresis_then_reassess';
  else if(req.weight_gain) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function advanced(req){
  ensureBool(req.lvad_evaluated, 'lvad_evaluated');
  ensureBool(req.heart_transplant_evaluated, 'heart_transplant_evaluated');
  ensureBool(req.crt_indicated, 'crt_indicated');
  ensureBool(req.advanced_referred, 'advanced_referred');
  ensureBool(req.palliative_consult, 'palliative_consult');
  let plan;
  if(req.lvad_evaluated===false) plan='continue_with_evaluate_then_reassess';
  else if(req.heart_transplant_evaluated===false) plan='continue_with_evaluate_then_reassess';
  else if(req.crt_indicated) plan='continue_with_crt_then_reassess';
  else if(req.palliative_consult===false) plan='continue_with_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function monitoring(req){
  ensureBool(req.daily_weights, 'daily_weights');
  ensureBool(req.diet_sodium_compliant, 'diet_sodium_compliant');
  ensureBool(req.fluid_intake_compliant, 'fluid_intake_compliant');
  ensureBool(req.medication_adherence, 'medication_adherence');
  ensureBool(req.symptom_recognition, 'symptom_recognition');
  ensureBool(req.zone_protocol, 'zone_protocol');
  let plan;
  if(req.daily_weights===false) plan='continue_with_daily_weights_then_reassess';
  else if(req.diet_sodium_compliant===false) plan='continue_with_education_then_reassess';
  else if(req.medication_adherence===false) plan='continue_with_address_then_reassess';
  else if(req.zone_protocol===false) plan='continue_with_zone_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {diagnosis,phenotyping,gdgmt,decompensation,advanced,monitoring};}
module.exports={funcs,CITATIONS,ValidationError};
