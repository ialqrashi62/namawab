// filepath: tier5_endoscopy_ext_106_ent_engine.js
// TIER5_ENDOSCOPY_EXT-106: ENT endoscopy
'use strict';
const CITATIONS = ['AAO_HNS_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function naso(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['rhinosinusitis','epistaxis','polyps','mass','anosmia','chronic_congestion','trauma','biopsy','debridement','foreign_body','other']);
  ensureBool(req.appropriate, 'appropriate');
  ensureBool(req.consent, 'consent');
  ensureBool(req.topical_anesthesia, 'topical_anesthesia');
  let plan;
  if(req.appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.topical_anesthesia===false) plan='continue_with_anesthesia_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function findings(req){
  ensureStr(req.findings, 'findings');
  ensureEnum(req.findings, 'findings', ['normal','polyps','mass','deviated_septum','turbinate_hypertrophy','crusting','bleeding','foreign_body','infection','other']);
  ensureBool(req.biopsies_taken, 'biopsies_taken');
  ensureBool(req.therapeutic_performed, 'therapeutic_performed');
  let plan;
  if(req.findings==='mass') plan='continue_with_pathology_then_reassess';
  else if(req.findings==='polyps') plan='continue_with_remove_then_reassess';
  else if(req.therapeutic_performed===false && req.findings==='bleeding') plan='continue_with_cautery_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function laryngo(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['hoarseness','dysphagia','globus','mass','airway_evaluation','vocal_cord_evaluation','reflux_workup','surveillance','other']);
  ensureBool(req.vocal_cords_seen, 'vocal_cords_seen');
  ensureBool(req.swallow_evaluation, 'swallow_evaluation');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.vocal_cords_seen===false) plan='continue_with_complete_then_reassess';
  else if(req.complications) plan='continue_with_rescue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function otoscope(req){
  ensureBool(req.tympanic_membrane_seen, 'tympanic_membrane_seen');
  ensureStr(req.findings, 'findings');
  ensureEnum(req.findings, 'findings', ['normal','effusion','perforation','retraction','cholesteatoma','infection','wax','other']);
  ensureBool(req.cerumen_removed, 'cerumen_removed');
  ensureBool(req.antibiotics_prescribed, 'antibiotics_prescribed');
  let plan;
  if(req.tympanic_membrane_seen===false) plan='continue_with_review_then_reassess';
  else if(req.findings==='perforation') plan='continue_with_refer_then_reassess';
  else if(req.findings==='infection' && req.antibiotics_prescribed===false) plan='continue_with_antibiotics_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function biopsy(req){
  ensureBool(req.tissue_sample, 'tissue_sample');
  ensureBool(req.adequate, 'adequate');
  ensureBool(req.pathology_sent, 'pathology_sent');
  ensureBool(req.followup_planned, 'followup_planned');
  let plan;
  if(req.adequate===false) plan='continue_with_repeat_then_reassess';
  else if(req.pathology_sent===false) plan='continue_with_send_then_reassess';
  else if(req.followup_planned===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function post(req){
  ensureBool(req.recovery, 'recovery');
  ensureBool(req.bleeding_controlled, 'bleeding_controlled');
  ensureBool(req.complications, 'complications');
  ensureBool(req.followup_planned, 'followup_planned');
  ensureBool(req.results_communicated, 'results_communicated');
  let plan;
  if(req.complications) plan='continue_with_rescue_then_reassess';
  else if(req.bleeding_controlled===false) plan='continue_with_cautery_then_reassess';
  else if(req.followup_planned===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {naso,findings,laryngo,otoscope,biopsy,post};}
module.exports={funcs,CITATIONS,ValidationError};