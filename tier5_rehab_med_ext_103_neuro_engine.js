// filepath: tier5_rehab_med_ext_103_neuro_engine.js
// TIER5_REHAB_MED_EXT-103: Neurorehabilitation
'use strict';
const CITATIONS = ['AAN_NeuroRehab_2020','Stroke_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function stroke_assessment(req){
  ensureNumber(req.fugl_meyer_score, 'fugl_meyer_score');
  ensureNumber(req.days_post_stroke, 'days_post_stroke');
  ensureBool(req.upper_extremity_deficit, 'upper_extremity_deficit');
  ensureBool(req.lower_extremity_deficit, 'lower_extremity_deficit');
  ensureBool(req.speech_deficit, 'speech_deficit');
  ensureBool(req.swallowing_deficit, 'swallowing_deficit');
  let plan;
  if(req.days_post_stroke<7) plan='continue_with_early_mobility_then_reassess';
  else if(req.fugl_meyer_score<50) plan='continue_with_intensive_then_reassess';
  else if(req.upper_extremity_deficit) plan='continue_with_task_training_then_reassess';
  else if(req.lower_extremity_deficit) plan='continue_with_gait_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tbi(req){
  ensureNumber(req.days_post_tbi, 'days_post_tbi');
  ensureNumber(req.gcs, 'gcs');
  ensureBool(req.cognitive_deficit, 'cognitive_deficit');
  ensureBool(req.behavioral_changes, 'behavioral_changes');
  ensureBool(req.balance_deficit, 'balance_deficit');
  ensureBool(req.return_to_drive, 'return_to_drive');
  let plan;
  if(req.days_post_tbi<30) plan='continue_with_coma_stim_then_reassess';
  else if(req.cognitive_deficit) plan='continue_with_cog_rehab_then_reassess';
  else if(req.balance_deficit) plan='continue_with_vestibular_then_reassess';
  else if(req.return_to_drive===false) plan='continue_with_evaluation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function spinal_cord(req){
  ensureStr(req.injury_level, 'injury_level');
  ensureEnum(req.injury_level, 'injury_level', ['c1','c2','c3','c4','c5','c6','c7','c8','t1','t2','t3','t4','t5','t6','t7','t8','t9','t10','t11','t12','l1','l2','l3','l4','l5','s1','s2','s3','s4','s5']);
  ensureStr(req.ais_grade, 'ais_grade');
  ensureEnum(req.ais_grade, 'ais_grade', ['a','b','c','d']);
  ensureBool(req.pressure_injury_prevention, 'pressure_injury_prevention');
  ensureBool(req.bladder_program, 'bladder_program');
  ensureBool(req.bowel_program, 'bowel_program');
  let plan;
  if(req.injury_level.startsWith('c4') && req.pressure_injury_prevention===false) plan='continue_with_protocol_then_reassess';
  else if(req.bladder_program===false) plan='continue_with_program_then_reassess';
  else if(req.bowel_program===false) plan='continue_with_program_then_reassess';
  else if(req.pressure_injury_prevention===false) plan='continue_with_prevention_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ms(req){
  ensureStr(req.disease_type, 'disease_type');
  ensureEnum(req.disease_type, 'disease_type', ['ms','als','parkinson','huntington','myasthenia','cidp','gbs','polyneuropathy']);
  ensureNumber(req.edss_score, 'edss_score');
  ensureBool(req.ambulation_independent, 'ambulation_independent');
  ensureBool(req.fatigue_present, 'fatigue_present');
  ensureBool(req.spasticity, 'spasticity');
  ensureBool(req.disease_modifying_therapy, 'disease_modifying_therapy');
  let plan;
  if(req.ambulation_independent===false) plan='continue_with_mobility_then_reassess';
  else if(req.fatigue_present) plan='continue_with_energy_then_reassess';
  else if(req.spasticity) plan='continue_with_management_then_reassess';
  else if(req.disease_modifying_therapy===false) plan='continue_with_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cog_rehab(req){
  ensureNumber(req.mmse_score, 'mmse_score');
  ensureBool(req.attention_deficit, 'attention_deficit');
  ensureBool(req.memory_deficit, 'memory_deficit');
  ensureBool(req.executive_deficit, 'executive_deficit');
  ensureBool(req.compensatory_strategies, 'compensatory_strategies');
  ensureBool(req.family_education, 'family_education');
  let plan;
  if(req.mmse_score<20) plan='continue_with_assist_then_reassess';
  else if(req.attention_deficit) plan='continue_with_attention_then_reassess';
  else if(req.memory_deficit) plan='continue_with_memory_then_reassess';
  else if(req.compensatory_strategies===false) plan='continue_with_teach_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sw(req){
  ensureBool(req.dysphagia, 'dysphagia');
  ensureBool(req.dysphonia, 'dysphonia');
  ensureBool(req.aspiration_risk, 'aspiration_risk');
  ensureBool(req.diet_modification, 'diet_modification');
  ensureBool(req.swallowing_therapy, 'swallowing_therapy');
  ensureBool(req.speech_therapy, 'speech_therapy');
  let plan;
  if(req.aspiration_risk && req.diet_modification===false) plan='continue_with_diet_then_reassess';
  else if(req.dysphagia && req.swallowing_therapy===false) plan='continue_with_swallow_therapy_then_reassess';
  else if(req.dysphonia && req.speech_therapy===false) plan='continue_with_speech_therapy_then_reassess';
  else if(req.diet_modification===false) plan='continue_with_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {stroke_assessment,tbi,spinal_cord,ms,cog_rehab,sw};}
module.exports={funcs,CITATIONS,ValidationError};
