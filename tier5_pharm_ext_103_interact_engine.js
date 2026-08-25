// filepath: tier5_pharm_ext_103_interact_engine.js
// TIER5_PHARMACOLOGY_EXT-103: Drug interactions
'use strict';
const CITATIONS = ['FDA_Interactions','Lexi_Interact'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function classify(req){
  ensureStr(req.severity, 'severity');
  ensureEnum(req.severity, 'severity', ['contraindicated','major','moderate','minor','unknown']);
  ensureBool(req.likelihood, 'likelihood');
  ensureStr(req.evidence, 'evidence');
  ensureEnum(req.evidence, 'evidence', ['established','probable','suspected','possible','unlikely','unknown']);
  ensureBool(req.reviewed, 'reviewed');
  let plan;
  if(req.severity==='contraindicated') plan='continue_with_aversion_then_reassess';
  else if(req.severity==='major' && req.reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.evidence==='suspected') plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pk_interactions(req){
  ensureStr(req.affected, 'affected');
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['absorption','distribution','metabolism_inducer','metabolism_inhibitor','excretion','other','none']);
  ensureBool(req.level_monitoring, 'level_monitoring');
  ensureBool(req.dose_adjustment, 'dose_adjustment');
  let plan;
  if(req.type==='metabolism_inducer' && req.dose_adjustment===false) plan='continue_with_increase_then_reassess';
  else if(req.type==='metabolism_inhibitor' && req.dose_adjustment===false) plan='continue_with_decrease_then_reassess';
  else if(req.level_monitoring===false) plan='continue_with_monitoring_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pd_interactions(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['synergistic','antagonistic','additive','none','other']);
  ensureBool(req.adversed_documented, 'adversed_documented');
  ensureBool(req.synergy_utilized, 'synergy_utilized');
  ensureBool(req.antagonism_avoided, 'antagonism_avoided');
  let plan;
  if(req.type==='antagonistic' && req.antagonism_avoided===false) plan='continue_with_separate_then_reassess';
  else if(req.type==='synergistic' && req.synergy_utilized===false) plan='continue_with_utilize_then_reassess';
  else if(req.adversed_documented) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function qt(req){
  ensureNumber(req.qt_prolonging_count, 'qt_prolonging_count');
  ensureBool(req.ecg_planned, 'ecg_planned');
  ensureBool(req.k_replaced, 'k_replaced');
  ensureBool(req.mag_replaced, 'mag_replaced');
  ensureBool(req.monitoring_done, 'monitoring_done');
  let plan;
  if(req.qt_prolonging_count>=2 && req.ecg_planned===false) plan='continue_with_ecg_then_reassess';
  else if(req.k_replaced===false) plan='continue_with_replete_then_reassess';
  else if(req.mag_replaced===false) plan='continue_with_mag_then_reassess';
  else if(req.monitoring_done===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function allergy(req){
  ensureStr(req.allergen, 'allergen');
  ensureBool(req.previous_reaction, 'previous_reaction');
  ensureBool(req.cross_reactive, 'cross_reactive');
  ensureBool(req.substituted, 'substituted');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.cross_reactive && req.substituted===false) plan='continue_with_substitute_then_reassess';
  else if(req.previous_reaction && req.documented===false) plan='continue_with_document_then_reassess';
  else if(req.substituted===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function renal_hepatic(req){
  ensureNumber(req.crcl, 'crcl');
  ensureNumber(req.alt, 'alt');
  ensureBool(req.renal_dose, 'renal_dose');
  ensureBool(req.hepatic_dose, 'hepatic_dose');
  ensureBool(req.contraindicated, 'contraindicated');
  let plan;
  if(req.contraindicated) plan='continue_with_aversion_then_reassess';
  else if(req.crcl<30 && req.renal_dose===false) plan='continue_with_renal_then_reassess';
  else if(req.alt>5 && req.hepatic_dose===false) plan='continue_with_hepatic_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {classify,pk_interactions,pd_interactions,qt,allergy,renal_hepatic};}
module.exports={funcs,CITATIONS,ValidationError};