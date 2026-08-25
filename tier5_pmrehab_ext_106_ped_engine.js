// filepath: tier5_pmrehab_ext_106_ped_engine.js
// TIER5_PMREHAB_EXT-106: Pediatric pain management
'use strict';
const CITATIONS = ['AAP_PedsPain_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assess(req){
  ensureNumber(req.age_months, 'age_months');
  ensureStr(req.scale, 'scale');
  ensureEnum(req.scale, 'scale', ['flacc','faces','numeric','wong_baker','verbal','nonverbal','unknown']);
  ensureNumber(req.score, 'score');
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['acute','chronic','procedural','postop','nociceptive','neuropathic','mixed','unknown']);
  ensureBool(req.parent_present, 'parent_present');
  let plan;
  if(req.score>=7) plan='continue_with_strong_then_reassess';
  else if(req.type==='procedural' && req.parent_present===false) plan='continue_with_family_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function family(req){
  ensureBool(req.education, 'education');
  ensureBool(req.presence, 'presence');
  ensureBool(req.preparation, 'preparation');
  ensureBool(req.coping, 'coping');
  ensureBool(req.anxiety_addressed, 'anxiety_addressed');
  let plan;
  if(req.education===false) plan='continue_with_education_then_reassess';
  else if(req.preparation===false) plan='continue_with_prepare_then_reassess';
  else if(req.anxiety_addressed===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nonpharm(req){
  ensureBool(req.distraction, 'distraction');
  ensureBool(req.imagery, 'imagery');
  ensureBool(req.music, 'music');
  ensureBool(req.cold, 'cold');
  ensureBool(req.heat, 'heat');
  ensureBool(req.massage, 'massage');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.responded===false) plan='continue_with_continue_then_reassess';
  else if(req.distraction===false) plan='continue_with_distraction_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function acute(req){
  ensureBool(req.sweet_sucrose, 'sweet_sucrose');
  ensureBool(req.swaddling, 'swaddling');
  ensureBool(req.breastfeeding, 'breastfeeding');
  ensureBool(req.analgesic, 'analgesic');
  ensureBool(req.dose_correct, 'dose_correct');
  ensureBool(req.response, 'response');
  let plan;
  if(req.age_months<12 && req.sweet_sucrose===false) plan='continue_with_sucrose_then_reassess';
  else if(req.dose_correct===false) plan='continue_with_weight_then_reassess';
  else if(req.response===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function chronic(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['juvenile_arthritis','sickle_cell','cancer','ibs','migraine','neuropathic','fibromyalgia','other','unknown']);
  ensureBool(req.function, 'function');
  ensureBool(req.school_attendance, 'school_attendance');
  ensureBool(req.multidisciplinary, 'multidisciplinary');
  ensureBool(req.biopsychosocial, 'biopsychosocial');
  let plan;
  if(req.multidisciplinary===false) plan='continue_with_team_then_reassess';
  else if(req.school_attendance===false) plan='continue_with_school_then_reassess';
  else if(req.biopsychosocial===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function school(req){
  ensureBool(req.attendance, 'attendance');
  ensureBool(req.peer_support, 'peer_support');
  ensureBool(req.activity, 'activity');
  ensureBool(req.individualized_plan, 'individualized_plan');
  ensureBool(req.staff_education, 'staff_education');
  ensureBool(req.medication_at_school, 'medication_at_school');
  let plan;
  if(req.individualized_plan===false) plan='continue_with_plan_then_reassess';
  else if(req.staff_education===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assess,family,nonpharm,acute,chronic,school};}
module.exports={funcs,CITATIONS,ValidationError};