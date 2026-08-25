// filepath: tier5_oph_ext_133_glaucoma_engine.js
// TIER5_OPH_EXT-133: Glaucoma
'use strict';
const CITATIONS = ['AAO_PPP_GLAUCOMA_2020','EGS_PB'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function screen(req){
  ensureNumber(req.iop, 'iop');
  ensureNumber(req.cct, 'cct');
  ensureBool(req.family_history, 'family_history');
  ensureBool(req.disc_asymmetry, 'disc_asymmetry');
  ensureEnum(req.risk, 'risk', ['low','moderate','high','suspect','unknown','other']);
  ensureBool(req.followup_planned, 'followup_planned');
  let plan;
  if(req.iop>=30) plan='continue_with_immediate_then_reassess';
  else if(req.disc_asymmetry===true || req.family_history===true) plan='continue_with_full_exam_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function diagnose(req){
  ensureEnum(req.type, 'type', ['poag','angle_closure','secondary','normal_tension','juvenile','congenital','other','unknown']);
  ensureNumber(req.md, 'md');
  ensureNumber(req.vfi, 'vfi');
  ensureBool(req.progression_detected, 'progression_detected');
  ensureBool(req.target_iop_set, 'target_iop_set');
  ensureBool(req.structural_capture, 'structural_capture');
  let plan;
  if(req.type==='angle_closure') plan='continue_with_laser_pi_then_reassess';
  else if(req.target_iop_set===false) plan='continue_with_target_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function med(req){
  ensureEnum(req.medication, 'medication', ['pga','beta_blocker','alpha_agonist','cai','combination','none','other','unknown']);
  ensureNumber(req.target_iop, 'target_iop');
  ensureNumber(req.current_iop, 'current_iop');
  ensureBool(req.adherent, 'adherent');
  ensureBool(req.side_effects, 'side_effects');
  ensureBool(req.escalation_considered, 'escalation_considered');
  let plan;
  if(req.current_iop>req.target_iop && req.adherent===false) plan='continue_with_adherence_then_reassess';
  else if(req.current_iop>req.target_iop && req.escalation_considered===false) plan='continue_with_escalate_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function laser(req){
  ensureEnum(req.procedure, 'procedure', ['slt','alt','pi','cyclophoto','iridotomy','other','unknown']);
  ensureBool(req.consent, 'consent');
  ensureBool(req.target_doc, 'target_doc');
  ensureBool(req.topical_anesthetic, 'topical_anesthetic');
  ensureBool(req.iop_checked_post, 'iop_checked_post');
  ensureBool(req.drops_post, 'drops_post');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.iop_checked_post===false) plan='continue_with_iop_check_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function surgery(req){
  ensureEnum(req.procedure, 'procedure', ['trab','tube','migs','cyclodestruction','goniotomy','other','unknown']);
  ensureBool(req.consent, 'consent');
  ensureNumber(req.target_iop, 'target_iop');
  ensureBool(req.escalation_indicates, 'escalation_indicates');
  ensureEnum(req.recovery_plan, 'recovery_plan', ['standard','intensive','other','unknown']);
  ensureBool(req.implant_checked, 'implant_checked');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.escalation_indicates===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function glaucoma_fu(req){
  ensureNumber(req.months_since_dx, 'months_since_dx');
  ensureNumber(req.current_iop, 'current_iop');
  ensureNumber(req.target_iop, 'target_iop');
  ensureBool(req.progression_checked, 'progression_checked');
  ensureBool(req.fields_frequent, 'fields_frequent');
  ensureEnum(req.status, 'status', ['stable','worsening','improving','unknown']);
  let plan;
  if(req.status==='worsening') plan='continue_with_intensify_then_reassess';
  else if(req.fields_frequent===false) plan='continue_with_testing_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {screen,diagnose,med,laser,surgery,glaucoma_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
