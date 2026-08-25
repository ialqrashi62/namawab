// filepath: tier5_endoscopy_ext_101_egd_engine.js
// TIER5_ENDOSCOPY_EXT-101: Upper GI endoscopy (EGD)
'use strict';
const CITATIONS = ['ASGE_EGD_2014'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indications(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['dysphagia','upper_gi_bleed','refractory_gerd','peptic_ulcer','barretts','variceal_screening','weight_loss','anemia_workup','mass','stricture','foreign_body','malabsorption','other']);
  ensureBool(req.alternative, 'alternative');
  ensureBool(req.recent_barium, 'recent_barium');
  let plan;
  if(req.indication==='foreign_body') plan='continue_with_urgent_then_reassess';
  else if(req.indication==='upper_gi_bleed') plan='continue_with_emergent_then_reassess';
  else if(req.recent_barium) plan='continue_with_repeat_then_reassess';
  else if(req.alternative) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sedation(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['none','moderate','deep','general','propofol','topical_only']);
  ensureBool(req.aspir, 'aspir');
  ensureBool(req.airway_compromised, 'airway_compromised');
  ensureBool(req.monitoring, 'monitoring');
  ensureBool(req.consent, 'consent');
  let plan;
  if(req.airway_compromised && req.type==='deep') plan='continue_with_protect_then_reassess';
  else if(req.monitoring===false) plan='continue_with_monitor_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function findings(req){
  ensureStr(req.esophagus, 'esophagus');
  ensureEnum(req.esophagus, 'esophagus', ['normal','esophagitis_a','esophagitis_b','esophagitis_c','esophagitis_d','barretts','varices','stricture','mass','ulcer','other','unknown']);
  ensureStr(req.stomach, 'stomach');
  ensureEnum(req.stomach, 'stomach', ['normal','gastritis','ulcer','mass','gastric_varices','gastropathy','other','unknown']);
  ensureStr(req.duodenum, 'duodenum');
  ensureEnum(req.duodenum, 'duodenum', ['normal','ulcer','mass','celiac','angiodysplasia','malabsorption','other','unknown']);
  ensureBool(req.biopsy, 'biopsy');
  let plan;
  if(req.esophagus==='barretts' && req.biopsy===false) plan='continue_with_biopsy_then_reassess';
  else if(req.stomach==='ulcer' && req.biopsy===false) plan='continue_with_biopsy_then_reassess';
  else if(req.duodenum==='celiac') plan='continue_with_biopsy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function intervention(req){
  ensureBool(req.biopsies, 'biopsies');
  ensureBool(req.bleed_managed, 'bleed_managed');
  ensureBool(req.dilation, 'dilation');
  ensureBool(req.clip_placement, 'clip_placement');
  ensureBool(req.banding, 'banding');
  ensureBool(req.success, 'success');
  let plan;
  if(req.success===false) plan='continue_with_alternative_then_reassess';
  else if(req.bleed_managed===false) plan='continue_with_treat_then_reassess';
  else if(req.banding===false && req.esophagus==='varices') plan='continue_with_band_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.aspiration, 'aspiration');
  ensureBool(req.cardiorespiratory, 'cardiorespiratory');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.perforation) plan='continue_with_surgery_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_treat_then_reassess';
  else if(req.aspiration) plan='continue_with_aspiration_protocol_then_reassess';
  else if(req.cardiorespiratory) plan='continue_with_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function recovery(req){
  ensureBool(req.vital_signs_stable, 'vital_signs_stable');
  ensureBool(req.driving_companion, 'driving_companion');
  ensureBool(req.discharge_instructions, 'discharge_instructions');
  ensureBool(req.diet_advanced, 'diet_advanced');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.vital_signs_stable===false) plan='continue_with_extend_then_reassess';
  else if(req.driving_companion===false) plan='continue_with_companion_then_reassess';
  else if(req.discharge_instructions===false) plan='continue_with_instructions_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indications,sedation,findings,intervention,complications,recovery};}
module.exports={funcs,CITATIONS,ValidationError};