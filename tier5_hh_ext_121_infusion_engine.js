// filepath: tier5_hh_ext_121_infusion_engine.js
// TIER5_HH_EXT-121: Home Infusion Pharmacy
'use strict';
const CITATIONS = ['ASHP_HOMEFUSION_2020','NHIA_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function infusion_order(req){
  ensureEnum(req.drug, 'drug', ['abx','ivig','chemo','biological','antifungal','antiviral','pain','iv','im','sc','intrathecal','other','known','unknown']);
  ensureStr(req.dose, 'dose');
  ensureStr(req.frequency, 'frequency');
  ensureNumber(req.duration_days, 'duration_days');
  ensureEnum(req.route, 'route', ['iv','im','sc','intrathecal','other']);
  ensureBool(req.physician_orders, 'physician_orders');
  let plan;
  if(req.physician_orders===false) plan='continue_with_orders_then_reassess';
  else if(req.duration_days<2) plan='continue_with_review_then_reassess';
  else plan='continue_with_dispense_then_reassess';
  return {plan};
}
function vascular_access(req){
  ensureEnum(req.device, 'device', ['picc','port','midline','tunneled','other','unknown']);
  ensureNumber(req.days_in_place, 'days_in_place');
  ensureEnum(req.site_status, 'site_status', ['clean','exudate','erythema','pain','infiltration','other','unknown']);
  ensureBool(req.dressing_changed, 'dressing_changed');
  ensureBool(req.aspiration_ok, 'aspiration_ok');
  ensureBool(req.lock_appropriate, 'lock_appropriate');
  let plan;
  if(req.site_status==='erythema' || req.site_status==='exudate' || req.site_status==='pain') plan='continue_with_culture_then_reassess';
  else if(req.dressing_changed===false) plan='continue_with_change_dressing_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function infusion_admin(req){
  ensureEnum(req.drug, 'drug', ['abx','ivig','chemo','biological','antifungal','antiviral','pain','iv','im','sc','intrathecal','other','known','unknown']);
  ensureStr(req.dose, 'dose');
  ensureStr(req.frequency, 'frequency');
  ensureNumber(req.duration_min, 'duration_min');
  ensureBool(req.premedication, 'premedication');
  ensureBool(req.reactions_monitored, 'reactions_monitored');
  let plan;
  if(req.reactions_monitored===false) plan='continue_with_hold_then_reassess';
  else if(req.duration_min>240) plan='continue_with_split_dose_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function lab_drug(req){
  ensureEnum(req.lab_type, 'lab_type', ['peak','trough','anca','random','blood','other','unknown']);
  ensureNumber(req.days_on_drug, 'days_on_drug');
  ensureBool(req.lab_drawn, 'lab_drawn');
  ensureBool(req.level_reviewed, 'level_reviewed');
  ensureBool(req.dose_adjusted, 'dose_adjusted');
  ensureBool(req.toxicity_screen, 'toxicity_screen');
  let plan;
  if(req.level_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.dose_adjusted===false && req.lab_type!=='other') plan='continue_with_adjust_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function adr(req){
  ensureEnum(req.reaction_type, 'reaction_type', ['allergic','infusion','neuro','toxic','organ','drug_interaction','other','unknown']);
  ensureNumber(req.severity_grade, 'severity_grade');
  ensureBool(req.premed_given, 'premed_given');
  ensureBool(req.drug_held, 'drug_held');
  ensureBool(req.alternative_planned, 'alternative_planned');
  ensureBool(req.rechallenge_indicated, 'rechallenge_indicated');
  let plan;
  if(req.severity_grade>=4) plan='continue_with_dc_then_reassess';
  else if(req.severity_grade>=2 && req.rechallenge_indicated===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function infusion_fu(req){
  ensureNumber(req.days_treated, 'days_treated');
  ensureBool(req.responded, 'responded');
  ensureBool(req.line_issues, 'line_issues');
  ensureBool(req.completion_documented, 'completion_documented');
  ensureBool(req.dc_summary, 'dc_summary');
  ensureBool(req.continuity_planned, 'continuity_planned');
  let plan;
  if(req.completion_documented===true && req.dc_summary===true) plan='continue_with_close_then_reassess';
  else if(req.line_issues===true) plan='continue_with_line_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {infusion_order,vascular_access,infusion_admin,lab_drug,adr,infusion_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
