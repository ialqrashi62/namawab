// filepath: tier5_cardiology_ext_103_echo_engine.js
// TIER5_CARDIOLOGY_EXT-103: Echocardiography
'use strict';
const CITATIONS = ['ASE_Echo_2018','ASE_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indications(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['hf','valvular','mi','chest_pain','dyspnea','syncope','embolic_source','endocarditis','afib_screen','cardiomyopathy','chamber_size','pulmonary_htn','pericardial','mass','preop','postop','none']);
  ensureBool(req.application_appropriate, 'application_appropriate');
  ensureBool(req.alternative_imaging, 'alternative_imaging');
  let plan;
  if(req.application_appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.alternative_imaging) plan='continue_with_consider_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tte(req){
  ensureNumber(req.lvef, 'lvef');
  ensureNumber(req.lvesd, 'lvesd');
  ensureNumber(req.lvedd, 'lvedd');
  ensureNumber(req.pasp, 'pasp');
  ensureBool(req.regional_wma, 'regional_wma');
  ensureBool(req.mild_valvular, 'mild_valvular');
  ensureBool(req.severe_valvular, 'severe_valvular');
  let plan;
  if(req.lvef<35) plan='continue_with_severe_lv_dysf_then_reassess';
  else if(req.lvef<50) plan='continue_with_hf_midrange_then_reassess';
  else if(req.pasp>=50) plan='continue_with_pulmonary_htn_then_reassess';
  else if(req.severe_valvular) plan='continue_with_surgery_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tee(req){
  ensureBool(req.laa_clot, 'laa_clot');
  ensureBool(req.valvular_vegetation, 'valvular_vegetation');
  ensureBool(req.aortic_dissection, 'aortic_dissection');
  ensureBool(req.endocarditis, 'endocarditis');
  ensureBool(req.laa_closure, 'laa_closure');
  ensureBool(req.fasting_status, 'fasting_status');
  let plan;
  if(req.laa_clot) plan='continue_with_anticoag_then_reassess';
  else if(req.aortic_dissection) plan='continue_with_urgent_surgery_then_reassess';
  else if(req.endocarditis) plan='continue_with_treat_then_reassess';
  else if(req.fasting_status===false) plan='continue_with_reschedule_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function function_eval(req){
  ensureNumber(req.lvef, 'lvef');
  ensureNumber(req.mapse, 'mapse');
  ensureNumber(req.tdi_septal, 'tdi_septal');
  ensureNumber(req.tdi_lateral, 'tdi_lateral');
  ensureBool(req.global_hypokinesis, 'global_hypokinesis');
  ensureBool(req.regional_wma, 'regional_wma');
  let plan;
  if(req.lvef<35) plan='continue_with_severe_lv_then_reassess';
  else if(req.mapse<10) plan='continue_with_evaluate_then_reassess';
  else if(req.tdi_septal<7) plan='continue_with_evaluate_then_reassess';
  else if(req.global_hypokinesis) plan='continue_with_cardiomyopathy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function valvular(req){
  ensureNumber(req.av_area, 'av_area');
  ensureNumber(req.mv_area, 'mv_area');
  ensureBool(req.severe_as, 'severe_as');
  ensureBool(req.severe_mr, 'severe_mr');
  ensureBool(req.severe_ar, 'severe_ar');
  ensureBool(req.severe_tr, 'severe_tr');
  let plan;
  if(req.severe_as) plan='continue_with_av_replacement_then_reassess';
  else if(req.severe_mr) plan='continue_with_mv_repair_then_reassess';
  else if(req.severe_ar) plan='continue_with_av_replacement_then_reassess';
  else if(req.severe_tr) plan='continue_with_tr_repair_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pericardial(req){
  ensureNumber(req.effusion_size, 'effusion_size');
  ensureBool(req.tamponade, 'tamponade');
  ensureBool(req.constriction, 'constriction');
  ensureBool(req.right_dysfunction, 'right_dysfunction');
  ensureBool(req.respiratory_variation, 'respiratory_variation');
  ensureBool(req.ivc_plethora, 'ivc_plethora');
  let plan;
  if(req.tamponade) plan='continue_with_pericardiocentesis_then_reassess';
  else if(req.constriction) plan='continue_with_pericardiectomy_then_reassess';
  else if(req.effusion_size>=20) plan='continue_with_urgent_drain_then_reassess';
  else if(req.respiratory_variation) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indications,tte,tee,function_eval,valvular,pericardial};}
module.exports={funcs,CITATIONS,ValidationError};
