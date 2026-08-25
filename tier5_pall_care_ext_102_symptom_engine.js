// filepath: tier5_pall_care_ext_102_symptom_engine.js
// TIER5_PALL_CARE_EXT-102: Palliative symptom management (dyspnea, delirium, depression, anxiety, fatigue, GI)
'use strict';
const CITATIONS = ['NCCN_Palliative_2023','NHPCO_2021','Lancet_Palliative_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function dyspnea(req){
  ensureNumber(req.dyspnea_score, 'dyspnea_score');
  ensureNumber(req.spo2_pct, 'spo2_pct');
  ensureBool(req.on_oxygen, 'on_oxygen');
  ensureBool(req.anxiety_present, 'anxiety_present');
  ensureBool(req.reversible_cause_present, 'reversible_cause_present');
  ensureBool(req.opioid_tolerant, 'opioid_tolerant');
  let plan;
  if(req.dyspnea_score>=7 && req.opioid_tolerant===false) plan='continue_with_morphine_low_dose_then_reassess';
  else if(req.spo2_pct<88 && req.on_oxygen===false) plan='continue_with_oxygen_then_reassess';
  else if(req.anxiety_present) plan='continue_with_breathing_techniques_then_reassess';
  else if(req.reversible_cause_present) plan='continue_with_treat_reversible_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function delirium(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['hypoactive','hyperactive','mixed','terminal','reversible']);
  ensureNumber(req.cam_score, 'cam_score');
  ensureBool(req.reversible_cause_searched, 'reversible_cause_searched');
  ensureBool(req.reversible_cause_found, 'reversible_cause_found');
  ensureBool(req.family_at_bedside, 'family_at_bedside');
  ensureBool(req.orientation_aids, 'orientation_aids');
  let plan;
  if(req.type==='hyperactive' && req.reversible_cause_searched===false) plan='continue_with_workup_then_reassess';
  else if(req.reversible_cause_found) plan='continue_with_treat_underlying_then_reassess';
  else if(req.type==='terminal') plan='continue_with_comfort_measures_then_reassess';
  else if(req.family_at_bedside===false) plan='continue_with_family_support_then_reassess';
  else if(req.orientation_aids===false) plan='continue_with_reorientation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function depression(req){
  ensureNumber(req.phq9_score, 'phq9_score');
  ensureBool(req.past_depression, 'past_depression');
  ensureBool(req.current_treatment, 'current_treatment');
  ensureBool(req.suicidal_ideation, 'suicidal_ideation');
  ensureBool(req.functional_impairment, 'functional_impairment');
  ensureNumber(req.days_present, 'days_present');
  let plan;
  if(req.suicidal_ideation) plan='continue_with_urgent_safety_then_reassess';
  else if(req.phq9_score>=20) plan='continue_with_refer_psychiatrist_then_reassess';
  else if(req.phq9_score>=10) plan='continue_with_ssri_then_reassess';
  else if(req.days_present>=14 && req.functional_impairment) plan='continue_with_medication_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function anxiety(req){
  ensureNumber(req.gad7_score, 'gad7_score');
  ensureBool(req.panic_present, 'panic_present');
  ensureBool(req.breathing_techniques_offered, 'breathing_techniques_offered');
  ensureBool(req.benzodiazepine_tried, 'benzodiazepine_tried');
  ensureBool(req.non_pharm_tried, 'non_pharm_tried');
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  let plan;
  if(req.panic_present && req.breathing_techniques_offered===false) plan='continue_with_teach_breathing_then_reassess';
  else if(req.gad7_score>=15) plan='continue_with_ssri_then_reassess';
  else if(req.benzodiazepine_tried===false) plan='continue_with_short_term_benzo_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fatigue(req){
  ensureNumber(req.fss_score, 'fss_score');
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.tsh, 'tsh');
  ensureBool(req.sleep_disturbance, 'sleep_disturbance');
  ensureBool(req.deconditioning_present, 'deconditioning_present');
  ensureBool(req.medication_contributing, 'medication_contributing');
  let plan;
  if(req.hgb<8) plan='continue_with_transfusion_consideration_then_reassess';
  else if(req.tsh>10 || req.tsh<0.1) plan='continue_with_thyroid_review_then_reassess';
  else if(req.medication_contributing) plan='continue_with_medication_review_then_reassess';
  else if(req.deconditioning_present) plan='continue_with_energy_conservation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function gi_symptoms(req){
  ensureStr(req.symptom, 'symptom');
  ensureEnum(req.symptom, 'symptom', ['nausea','vomiting','constipation','diarrhea','anorexia','dysphagia','hiccups','ascites']);
  ensureNumber(req.severity, 'severity');
  ensureBool(req.reversible_cause, 'reversible_cause');
  ensureBool(req.first_line_tried, 'first_line_tried');
  ensureBool(req.dietary_modified, 'dietary_modified');
  ensureNumber(req.weight_loss_pct, 'weight_loss_pct');
  let plan;
  if(req.symptom==='constipation' && req.reversible_cause===false) plan='continue_with_laxative_then_reassess';
  else if(req.symptom==='vomiting' && req.first_line_tried===false) plan='continue_with_antiemetic_then_reassess';
  else if(req.weight_loss_pct>=10) plan='continue_with_nutrition_consult_then_reassess';
  else if(req.dietary_modified===false) plan='continue_with_dietary_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {dyspnea,delirium,depression,anxiety,fatigue,gi_symptoms};}
module.exports={funcs,CITATIONS,ValidationError};
