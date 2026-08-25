// filepath: tier5_rehab_med_ext_106_pelvic_engine.js
// TIER5_REHAB_MED_EXT-106: Pelvic floor rehab
'use strict';
const CITATIONS = ['ICI_Pelvic_2017','WOCN_Pelvic_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function incontinence(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['stress','urge','mixed','overflow','functional','fecal','flatal']);
  ensureNumber(req.episodes_per_week, 'episodes_per_week');
  ensureBool(req.pelvic_floor_awareness, 'pelvic_floor_awareness');
  ensureBool(req.kegel_practice, 'kegel_practice');
  ensureBool(req.fluid_optimized, 'fluid_optimized');
  ensureBool(req.bladder_training, 'bladder_training');
  let plan;
  if(req.pelvic_floor_awareness===false) plan='continue_with_education_then_reassess';
  else if(req.kegel_practice===false) plan='continue_with_train_then_reassess';
  else if(req.fluid_optimized===false) plan='continue_with_optimize_then_reassess';
  else if(req.episodes_per_week>=7) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pelvic_floor(req){
  ensureNumber(req.laycock_score, 'laycock_score');
  ensureNumber(req.modified_oxford, 'modified_oxford');
  ensureNumber(req.repetitions_completed, 'repetitions_completed');
  ensureNumber(req.hold_sec, 'hold_sec');
  ensureBool(req.daily_practice, 'daily_practice');
  ensureBool(req.technique_correct, 'technique_correct');
  let plan;
  if(req.technique_correct===false) plan='continue_with_cue_then_reassess';
  else if(req.daily_practice===false) plan='continue_with_schedule_then_reassess';
  else if(req.repetitions_completed<8) plan='continue_with_increase_then_reassess';
  else if(req.hold_sec<8) plan='continue_with_hold_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function biofeedback(req){
  ensureBool(req.biofeedback_sessions, 'biofeedback_sessions');
  ensureBool(req.muscle_activation_measured, 'muscle_activation_measured');
  ensureBool(req.improvement_documented, 'improvement_documented');
  ensureBool(req.home_program, 'home_program');
  ensureBool(req.insurance_covered, 'insurance_covered');
  let plan;
  if(req.biofeedback_sessions===false) plan='continue_with_introduce_then_reassess';
  else if(req.muscle_activation_measured===false) plan='continue_with_measure_then_reassess';
  else if(req.improvement_documented===false) plan='continue_with_review_then_reassess';
  else if(req.home_program===false) plan='continue_with_program_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prolapse(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['stage_0','stage_1','stage_2','stage_3','stage_4']);
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.pessary_fitted, 'pessary_fitted');
  ensureBool(req.conservative_therapy, 'conservative_therapy');
  ensureBool(req.surgery_consulted, 'surgery_consulted');
  let plan;
  if(req.stage==='stage_4' && req.symptomatic) plan='continue_with_surgery_then_reassess';
  else if(req.stage==='stage_3' && req.conservative_therapy===false) plan='continue_with_therapy_then_reassess';
  else if(req.pessary_fitted===false) plan='continue_with_pessary_then_reassess';
  else if(req.conservative_therapy===false) plan='continue_with_therapy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pelvic_pain(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.dyspareunia, 'dyspareunia');
  ensureBool(req.muscle_tension, 'muscle_tension');
  ensureBool(req.manual_therapy, 'manual_therapy');
  ensureBool(req.relaxation_techniques, 'relaxation_techniques');
  ensureBool(req.psych_consulted, 'psych_consulted');
  let plan;
  if(req.muscle_tension && req.manual_therapy===false) plan='continue_with_therapy_then_reassess';
  else if(req.dyspareunia && req.relaxation_techniques===false) plan='continue_with_relax_then_reassess';
  else if(req.pain_score>=7) plan='continue_with_review_then_reassess';
  else if(req.psych_consulted===false) plan='continue_with_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pediatric(req){
  ensureNumber(req.age_years, 'age_years');
  ensureBool(req.daytime_wetting, 'daytime_wetting');
  ensureBool(req.night_wetting, 'night_wetting');
  ensureBool(req.encopresis, 'encopresis');
  ensureBool(req.bowel_history, 'bowel_history');
  ensureBool(req.constipation_history, 'constipation_history');
  let plan;
  if(req.encopresis && req.bowel_history===false) plan='continue_with_history_then_reassess';
  else if(req.daytime_wetting && req.constipation_history) plan='continue_with_bowel_then_reassess';
  else if(req.night_wetting) plan='continue_with_alarm_then_reassess';
  else if(req.daytime_wetting) plan='continue_with_train_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {incontinence,pelvic_floor,biofeedback,prolapse,pelvic_pain,pediatric};}
module.exports={funcs,CITATIONS,ValidationError};
