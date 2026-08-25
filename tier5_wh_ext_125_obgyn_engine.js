// filepath: tier5_wh_ext_125_obgyn_engine.js
// TIER5_WH_EXT-125: General OB/GYN Extended
'use strict';
const CITATIONS = ['ACOG_PB_2020','RCOG_GREEN_TOP'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function antenatal_visit(req){
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureNumber(req.bp_systolic, 'bp_systolic');
  ensureNumber(req.bp_diastolic, 'bp_diastolic');
  ensureNumber(req.fundal_height, 'fundal_height');
  ensureBool(req.fetal_heart_tone, 'fetal_heart_tone');
  ensureBool(req.urine_protein, 'urine_protein');
  let plan;
  if(req.bp_systolic>=160 || req.bp_diastolic>=110) plan='continue_with_severe_preeclampsia_then_reassess';
  else if(req.bp_systolic>=140 || req.bp_diastolic>=90 || req.urine_protein===true) plan='continue_with_preeclampsia_workup_then_reassess';
  else plan='continue_with_routine_then_reassess';
  return {plan};
}
function gyn_exam(req){
  ensureEnum(req.exam_type, 'exam_type', ['annual','problem','postpartum','menopause','specialty','followup','other']);
  ensureBool(req.consent, 'consent');
  ensureBool(req.chaperone_present, 'chaperone_present');
  ensureBool(req.bimanual_done, 'bimanual_done');
  ensureEnum(req.findings, 'findings', ['normal','abnormal','mass','bleeding','pain','discharge','injury','inconclusive','other','unknown']);
  ensureBool(req.followup_planned, 'followup_planned');
  let plan;
  if(req.findings==='abnormal' && req.followup_planned===false) plan='continue_with_planning_then_reassess';
  else if(req.chaperone_present===false) plan='continue_with_chaperone_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function contraception(req){
  ensureEnum(req.method, 'method', ['pill','patch','ring','iud','implant','depo','condom','natural','sterilization','emergency','none','other']);
  ensureStr(req.usmec, 'usmec');
  ensureEnum(req.usmec, 'usmec', ['1','2','3','4','unknown']);
  ensureBool(req.consent, 'consent');
  ensureBool(req.contraindications_reviewed, 'contraindications_reviewed');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.contraindications_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_initiate_then_reassess';
  return {plan};
}
function sti_screen(req){
  ensureBool(req.chlamydia, 'chlamydia');
  ensureBool(req.gonorrhea, 'gonorrhea');
  ensureBool(req.hiv, 'hiv');
  ensureBool(req.syphilis, 'syphilis');
  ensureBool(req.hep_b, 'hep_b');
  ensureBool(req.partner_notified, 'partner_notified');
  let plan;
  if(req.hiv===true && req.partner_notified===false) plan='continue_with_partner_notify_then_reassess';
  else if(req.chlamydia===true || req.gonorrhea===true) plan='continue_with_treatment_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function menopause(req){
  ensureNumber(req.age, 'age');
  ensureNumber(req.fsh, 'fsh');
  ensureEnum(req.symptoms, 'symptoms', ['none','hot_flash','mood','vaginal_dryness','sleep','libido','mixed','other']);
  ensureBool(req.ht_indicated, 'ht_indicated');
  ensureBool(req.screening_reviewed, 'screening_reviewed');
  ensureBool(req.education_done, 'education_done');
  let plan;
  if(req.ht_indicated===true && req.screening_reviewed===false) plan='continue_with_screening_then_reassess';
  else if(req.education_done===false) plan='continue_with_education_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function postpartum(req){
  ensureNumber(req.days_postpartum, 'days_postpartum');
  ensureBool(req.lochia_normal, 'lochia_normal');
  ensureBool(req.perineal_healing, 'perineal_healing');
  ensureNumber(req.depression_score, 'depression_score');
  ensureBool(req.contraception_discussed, 'contraception_discussed');
  ensureBool(req.feeding_supported, 'feeding_supported');
  let plan;
  if(req.depression_score>=15) plan='continue_with_mood_referral_then_reassess';
  else if(req.feeding_supported===false) plan='continue_with_lactation_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {antenatal_visit,gyn_exam,contraception,sti_screen,menopause,postpartum};}
module.exports = {funcs, CITATIONS, ValidationError};
