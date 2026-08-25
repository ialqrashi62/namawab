// filepath: tier5_ent_ext_102_laryn_engine.js
// TIER5_ENT_EXT-102: Laryngology & voice
'use strict';
const CITATIONS = ['AAO_Voice_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function dysphonia(req){
  ensureNumber(req.duration_days, 'duration_days');
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['functional','organic','neurologic','behavioral','other','none']);
  ensureBool(req.stroboscopy, 'stroboscopy');
  ensureBool(req.therapy, 'therapy');
  ensureBool(req.improvement, 'improvement');
  let plan;
  if(req.duration_days>=14 && req.stroboscopy===false) plan='continue_with_stroboscopy_then_reassess';
  else if(req.therapy===false) plan='continue_with_therapy_then_reassess';
  else if(req.improvement===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vocal_cord_paralysis(req){
  ensureStr(req.side, 'side');
  ensureEnum(req.side, 'side', ['left','right','both','unknown']);
  ensureStr(req.cause, 'cause');
  ensureEnum(req.cause, 'cause', ['surgical','tumor','trauma','idiopathic','viral','other','unknown']);
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.speech_therapy, 'speech_therapy');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.imaging===false) plan='continue_with_imaging_then_reassess';
  else if(req.surgery_planned===false && req.cause==='surgical') plan='continue_with_injection_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nodules(req){
  ensureBool(req.singer, 'singer');
  ensureBool(req.teacher, 'teacher');
  ensureBool(req.reflux_treated, 'reflux_treated');
  ensureBool(req.voice_therapy, 'voice_therapy');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.voice_therapy===false) plan='continue_with_therapy_then_reassess';
  else if(req.reflux_treated===false) plan='continue_with_ppi_then_reassess';
  else if(req.surgery_planned) plan='continue_with_reassess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function reflux(req){
  ensureBool(req.typical, 'typical');
  ensureBool(req.atypical, 'atypical');
  ensureBool(req.ppi_trial, 'ppi_trial');
  ensureBool(req.impedance, 'impedance');
  ensureBool(req.responded, 'responded');
  ensureBool(req.egj_dysfunction, 'egj_dysfunction');
  let plan;
  if(req.atypical && req.impedance===false) plan='continue_with_impedance_then_reassess';
  else if(req.ppi_trial===false) plan='continue_with_ppi_then_reassess';
  else if(req.responded===false) plan='continue_with_escalate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cancer(req){
  ensureStr(req.site, 'site');
  ensureEnum(req.site, 'site', ['glottic','supraglottic','subglottic','oral','pharyngeal','sinonasal','salivary','other','unknown']);
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['i','ii','iii','iva','ivb','ivc','cis','unknown']);
  ensureBool(req.mdt_reviewed, 'mdt_reviewed');
  ensureBool(req.consent, 'consent');
  ensureBool(req.treatment_started, 'treatment_started');
  let plan;
  if(req.mdt_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.treatment_started===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function stenosis(req){
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['subglottic','tracheal','glottic','supraglottic','other','unknown']);
  ensureNumber(req.grade, 'grade');
  ensureStr(req.cause, 'cause');
  ensureEnum(req.cause, 'cause', ['intubation','trauma','idiopathic','tumor','other','unknown']);
  ensureBool(req.dilation, 'dilation');
  ensureBool(req.tracheostomy, 'tracheostomy');
  let plan;
  if(req.grade>=3 && req.tracheostomy===false) plan='continue_with_airway_then_reassess';
  else if(req.dilation===false) plan='continue_with_dilation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {dysphonia,vocal_cord_paralysis,nodules,reflux,cancer,stenosis};}
module.exports={funcs,CITATIONS,ValidationError};