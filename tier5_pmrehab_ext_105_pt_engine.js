// filepath: tier5_pmrehab_ext_105_pt_engine.js
// TIER5_PMREHAB_EXT-105: Physical therapy
'use strict';
const CITATIONS = ['APTA_Guidelines_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function evaluation(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['post_surgical','stroke','parkinson','ms','spinal_cord','amputation','fracture','sports','back_pain','arthritis','other']);
  ensureNumber(req.range_motion, 'range_motion');
  ensureNumber(req.strength, 'strength');
  ensureNumber(req.balance, 'balance');
  ensureBool(req.gait, 'gait');
  ensureBool(req.function, 'function');
  let plan;
  if(req.function===false) plan='continue_with_function_then_reassess';
  else if(req.gait===false) plan='continue_with_gait_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function exercise(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['strengthening','stretching','balance','endurance','proprioceptive','aquatic','breathing','task_specific','other']);
  ensureNumber(req.frequency, 'frequency');
  ensureNumber(req.duration, 'duration');
  ensureBool(req.adherent, 'adherent');
  ensureBool(req.progressing, 'progressing');
  let plan;
  if(req.adherent===false) plan='continue_with_adherence_then_reassess';
  else if(req.progressing===false) plan='continue_with_progress_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function manual(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['mobilization','manipulation','massage','myofascial','trigger_point','lymphatic','strain_counter','other']);
  ensureBool(req.indicated, 'indicated');
  ensureBool(req.effective, 'effective');
  ensureBool(req.safe, 'safe');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.complications) plan='continue_with_review_then_reassess';
  else if(req.effective===false) plan='continue_with_stop_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function modalities(req){
  ensureBool(req.heat, 'heat');
  ensureBool(req.cold, 'cold');
  ensureBool(req.ultrasound, 'ultrasound');
  ensureBool(req.tens, 'tens');
  ensureBool(req.laser, 'laser');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.responded===false) plan='continue_with_stop_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function home_program(req){
  ensureBool(req.documented, 'documented');
  ensureBool(req.demonstrated, 'demonstrated');
  ensureBool(req.written, 'written');
  ensureBool(req.video, 'video');
  ensureBool(req.followup, 'followup');
  ensureBool(req.adherent, 'adherent');
  let plan;
  if(req.documented===false) plan='continue_with_document_then_reassess';
  else if(req.demonstrated===false) plan='continue_with_demonstrate_then_reassess';
  else if(req.adherent===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function progress(req){
  ensureNumber(req.sessions, 'sessions');
  ensureBool(req.function_improved, 'function_improved');
  ensureBool(req.pain_improved, 'pain_improved');
  ensureBool(req.rom_improved, 'rom_improved');
  ensureBool(req.strength_improved, 'strength_improved');
  ensureBool(req.continue_pt, 'continue_pt');
  let plan;
  if(req.function_improved===false && req.pain_improved===false) plan='continue_with_discharge_then_reassess';
  else if(req.continue_pt===false) plan='continue_with_discharge_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {evaluation,exercise,manual,modalities,home_program,progress};}
module.exports={funcs,CITATIONS,ValidationError};