// filepath: tier5_wound_ostomy_ext_101_wound_engine.js
// TIER5_WOUND_OSTOMY_EXT-101: Wound care
'use strict';
const CITATIONS = ['NPUAP_Stages_2016','Wound_Source_2020','EWMA_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assessment(req){
  ensureNumber(req.wound_length_cm, 'wound_length_cm');
  ensureNumber(req.wound_width_cm, 'wound_width_cm');
  ensureNumber(req.wound_depth_cm, 'wound_depth_cm');
  ensureStr(req.tissue_type, 'tissue_type');
  ensureEnum(req.tissue_type, 'tissue_type', ['granulation','slough','eschar','epithelial','mixed','necrotic']);
  ensureNumber(req.exudate_amount_ml, 'exudate_amount_ml');
  ensureStr(req.exudate_type, 'exudate_type');
  ensureEnum(req.exudate_type, 'exudate_type', ['serous','sanguineous','serosanguineous','purulent','none']);
  ensureBool(req.infection_signs, 'infection_signs');
  ensureNumber(req.wound_age_days, 'wound_age_days');
  let plan;
  if(req.infection_signs && req.exudate_type==='purulent') plan='continue_with_culture_then_reassess';
  else if(req.tissue_type==='necrotic') plan='continue_with_debridement_then_reassess';
  else if(req.exudate_amount_ml>20) plan='continue_with_absorption_then_reassess';
  else if(req.wound_age_days>90) plan='continue_with_chronic_care_pathway_then_reassess';
  else plan='continue_with_standard_then_reassess';
  return {plan};
}
function staging(req){
  ensureStr(req.wound_type, 'wound_type');
  ensureEnum(req.wound_type, 'wound_type', ['pressure','diabetic','venous','arterial','surgical','traumatic','burn']);
  ensureNumber(req.length_cm, 'length_cm');
  ensureNumber(req.width_cm, 'width_cm');
  ensureNumber(req.depth_cm, 'depth_cm');
  ensureBool(req.bone_visible, 'bone_visible');
  ensureBool(req.tendon_visible, 'tendon_visible');
  ensureBool(req.skin_color_changes, 'skin_color_changes');
  ensureNumber(req.braden_score, 'braden_score');
  let plan;
  if(req.bone_visible) plan='continue_with_stage4_then_reassess';
  else if(req.tendon_visible) plan='continue_with_stage4_then_reassess';
  else if(req.depth_cm>1) plan='continue_with_stage3_then_reassess';
  else if(req.depth_cm>0.5) plan='continue_with_stage2_then_reassess';
  else plan='continue_with_stage1_then_reassess';
  return {plan};
}
function dressing(req){
  ensureStr(req.wound_type, 'wound_type');
  ensureEnum(req.wound_type, 'wound_type', ['pressure','diabetic','venous','arterial','surgical','traumatic','burn']);
  ensureStr(req.dressing_change_frequency, 'dressing_change_frequency');
  ensureEnum(req.dressing_change_frequency, 'dressing_change_frequency', ['daily','every_other_day','q3_days','weekly','twice_weekly','prn']);
  ensureBool(req.skin_sensitivity, 'skin_sensitivity');
  ensureBool(req.allergy_dressing, 'allergy_dressing');
  ensureBool(req.pain_with_change, 'pain_with_change');
  let plan;
  if(req.allergy_dressing) plan='continue_with_alternative_then_reassess';
  else if(req.pain_with_change) plan='continue_with_gentle_then_reassess';
  else if(req.skin_sensitivity) plan='continue_with_silicone_then_reassess';
  else plan='continue_with_standard_then_reassess';
  return {plan};
}
function debridement(req){
  ensureStr(req.method, 'method');
  ensureEnum(req.method, 'method', ['sharp','autolytic','enzymatic','mechanical','biological','surgical']);
  ensureStr(req.tissue_type, 'tissue_type');
  ensureEnum(req.tissue_type, 'tissue_type', ['granulation','slough','eschar','epithelial','mixed','necrotic']);
  ensureNumber(req.area_cm2, 'area_cm2');
  ensureBool(req.coagulopathy, 'coagulopathy');
  ensureBool(req.pain_tolerated, 'pain_tolerated');
  ensureBool(req.informed_consent, 'informed_consent');
  let plan;
  if(req.method==='sharp' && req.coagulopathy) plan='continue_with_alternative_then_reassess';
  else if(req.method==='surgical' && req.informed_consent===false) plan='continue_with_consent_then_reassess';
  else if(req.tissue_type==='granulation') plan='continue_with_observation_then_reassess';
  else if(req.area_cm2>100) plan='continue_with_operating_room_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function infection(req){
  ensureNumber(req.wbc_count, 'wbc_count');
  ensureNumber(req.crp_mg_l, 'crp_mg_l');
  ensureBool(req.fever, 'fever');
  ensureBool(req.local_warmth, 'local_warmth');
  ensureBool(req.purulent_drainage, 'purulent_drainage');
  ensureBool(req.increasing_pain, 'increasing_pain');
  ensureBool(req.bone_exposed, 'bone_exposed');
  let plan;
  if(req.bone_exposed) plan='continue_with_osteomyelitis_workup_then_reassess';
  else if(req.fever && req.purulent_drainage) plan='continue_with_iv_abx_then_reassess';
  else if(req.crp_mg_l>50) plan='continue_with_antibiotics_then_reassess';
  else if(req.local_warmth) plan='continue_with_topical_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function healing(req){
  ensureNumber(req.days_since_initial, 'days_since_initial');
  ensureNumber(req.initial_area_cm2, 'initial_area_cm2');
  ensureNumber(req.current_area_cm2, 'current_area_cm2');
  ensureBool(req.granulation_tissue, 'granulation_tissue');
  ensureBool(req.epithelialization, 'epithelialization');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.current_area_cm2<req.initial_area_cm2*0.5 && req.days_since_initial>=30) plan='continue_with_healing_then_reassess';
  else if(req.current_area_cm2>=req.initial_area_cm2 || req.days_since_initial<14) plan='continue_with_optimize_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assessment,staging,dressing,debridement,infection,healing};}
module.exports={funcs,CITATIONS,ValidationError};
