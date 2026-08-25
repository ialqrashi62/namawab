// filepath: tier5_sleep_med_ext_103_osa_engine.js
// TIER5_SLEEP_MED_EXT-103: Obstructive Sleep Apnea
'use strict';
const CITATIONS = ['AASM_Adult_2021','ATS_2013'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function severity(req){
  ensureNumber(req.aahi, 'aahi');
  ensureNumber(req.odi, 'odi');
  ensureNumber(req.min_sao2, 'min_sao2');
  ensureNumber(req.tsa90, 'tsa90');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.comorbidities, 'comorbidities');
  let plan;
  if(req.aahi>=30) plan='continue_with_severe_then_reassess';
  else if(req.aahi>=15) plan='continue_with_moderate_then_reassess';
  else if(req.aahi>=5) plan='continue_with_mild_then_reassess';
  else if(req.min_sao2<70) plan='continue_with_oxygen_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function treatment(req){
  ensureNumber(req.aahi, 'aahi');
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.pap_initiated, 'pap_initiated');
  ensureBool(req.weight_loss_recommended, 'weight_loss_recommended');
  ensureBool(req.position_therapy, 'position_therapy');
  ensureBool(req.surgery_consulted, 'surgery_consulted');
  let plan;
  if(req.aahi>=30 && req.pap_initiated===false) plan='continue_with_pap_then_reassess';
  else if(req.bmi>=35 && req.weight_loss_recommended===false) plan='continue_with_referral_then_reassess';
  else if(req.pap_initiated===false) plan='continue_with_pap_then_reassess';
  else if(req.surgery_consulted===false && req.pap_initiated===false) plan='continue_with_surgery_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function surgery(req){
  ensureStr(req.procedure, 'procedure');
  ensureEnum(req.procedure, 'procedure', ['uppp','tongue_base_suspension','genioglossus_advancement','mmr','tracheostomy','bariatric','naso_pharyngeal_surgery','inspire','remodeling']);
  ensureNumber(req.aahi_baseline, 'aahi_baseline');
  ensureNumber(req.aahi_post, 'aahi_post');
  ensureBool(req.symptom_improvement, 'symptom_improvement');
  ensureBool(req.pap_discontinued, 'pap_discontinued');
  let plan;
  if(req.aahi_post<15 && req.pap_discontinued === true) plan='continue_with_observation_then_reassess';
  else if(req.aahi_post>=15 && req.symptom_improvement) plan='continue_with_review_then_reassess';
  else if(req.aahi_post>=15 && req.symptom_improvement===false) plan='continue_with_resume_pap_then_reassess';
  else if(req.pap_discontinued===false) plan='continue_with_continue_pap_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function perioperative(req){
  ensureStr(req.asa, 'asa');
  ensureEnum(req.asa, 'asa', ['asa1','asa2','asa3','asa4','asa5']);
  ensureStr(req.sedation_type, 'sedation_type');
  ensureEnum(req.sedation_type, 'sedation_type', ['general','spinal','epidural','regional','moderate','deep','minimal']);
  ensureBool(req.pap_brought_in, 'pap_brought_in');
  ensureBool(req.opioid_warning, 'opioid_warning');
  ensureBool(req.sleep_medicine_consulted, 'sleep_medicine_consulted');
  let plan;
  if(req.pap_brought_in===false) plan='continue_with_bring_pap_then_reassess';
  else if(req.opioid_warning===false) plan='continue_with_warn_team_then_reassess';
  else if(req.sedation_type==='general' && req.sleep_medicine_consulted===false) plan='continue_with_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pediatric(req){
  ensureNumber(req.age_years, 'age_years');
  ensureStr(req.adenoid_size, 'adenoid_size');
  ensureEnum(req.adenoid_size, 'adenoid_size', ['grade_1','grade_2','grade_3','grade_4']);
  ensureStr(req.tonil_size, 'tonil_size');
  ensureEnum(req.tonil_size, 'tonil_size', ['grade_1','grade_2','grade_3','grade_4']);
  ensureBool(req.ad_t_done, 'ad_t_done');
  ensureBool(req.pap_used, 'pap_used');
  ensureNumber(req.ohrql_score, 'ohrql_score');
  let plan;
  if(req.tonil_size==='grade_3' || req.tonil_size==='grade_4') plan='continue_with_tonsillectomy_then_reassess';
  else if(req.ad_t_done===false) plan='continue_with_ad_t_then_reassess';
  else if(req.pap_used===false) plan='continue_with_pap_then_reassess';
  else if(req.ohrql_score<40) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureNumber(req.days_since_treatment, 'days_since_treatment');
  ensureBool(req.symptom_improvement, 'symptom_improvement');
  ensureBool(req.pap_downloading, 'pap_downloading');
  ensureBool(req.weight_follow_up, 'weight_follow_up');
  ensureBool(req.co_morbidities_reviewed, 'co_morbidities_reviewed');
  let plan;
  if(req.days_since_treatment<30) plan='continue_with_early_followup_then_reassess';
  else if(req.symptom_improvement===false) plan='continue_with_review_then_reassess';
  else if(req.pap_downloading===false) plan='continue_with_review_then_reassess';
  else if(req.co_morbidities_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {severity,treatment,surgery,perioperative,pediatric,followup};}
module.exports={funcs,CITATIONS,ValidationError};
