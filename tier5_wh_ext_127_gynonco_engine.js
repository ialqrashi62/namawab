// filepath: tier5_wh_ext_127_gynonco_engine.js
// TIER5_WH_EXT-127: Gyn Oncology
'use strict';
const CITATIONS = ['NCCN_GYN_2020','SGO_PB'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function gyn_cancer_staging(req){
  ensureStr(req.primary_site, 'primary_site');
  ensureEnum(req.primary_site, 'primary_site', ['ovary','endometrium','cervix','vulva','vagina','fallopian','gestational_trophoblast','other','unknown']);
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['i','ii','iii','iv','i_a','i_b','i_c','ii_a','ii_b','iii_a','iii_b','iii_c','iv_a','iv_b','unknown','other']);
  ensureBool(req.imaging_complete, 'imaging_complete');
  ensureBool(req.pathology_confirmed, 'pathology_confirmed');
  ensureBool(req.mdt_reviewed, 'mdt_reviewed');
  let plan;
  if(req.pathology_confirmed===false) plan='continue_with_pathology_then_reassess';
  else if(req.mdt_reviewed===false) plan='continue_with_mdt_then_reassess';
  else plan='continue_with_plan_then_reassess';
  return {plan};
}
function surgery_plan(req){
  ensureEnum(req.procedure, 'procedure', ['tah_bso','radical_hysterectomy','oophorectomy','lymph_node_dissection','debulking','fertility_sparing','robotic','open','lap','other','unknown']);
  ensureBool(req.surgical_fitness, 'surgical_fitness');
  ensureBool(req.consent, 'consent');
  ensureBool(req.fertility_preservation, 'fertility_preservation');
  ensureBool(req.stoma_counseled, 'stoma_counseled');
  ensureBool(req.anesthesia_clearance, 'anesthesia_clearance');
  let plan;
  if(req.surgical_fitness===false) plan='continue_with_optimize_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_schedule_then_reassess';
  return {plan};
}
function chemo(req){
  ensureEnum(req.regimen, 'regimen', ['carbo_taxol','cisplatin','capecitabine','gemcitabine','doxorubicin','bevacizumab','tamoxifen','other','unknown','none']);
  ensureNumber(req.cycle_num, 'cycle_num');
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureBool(req.premedication, 'premedication');
  ensureBool(req.toxicity_monitored, 'toxicity_monitored');
  ensureBool(req.response_evaluated, 'response_evaluated');
  let plan;
  if(req.toxicity_monitored===false) plan='continue_with_monitor_then_reassess';
  else if(req.response_evaluated===false) plan='continue_with_eval_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function radiation(req){
  ensureEnum(req.modality, 'modality', ['ebrt','brachy','imrt','sbrt','combination','none','other','unknown']);
  ensureNumber(req.total_dose, 'total_dose');
  ensureNumber(req.fractions, 'fractions');
  ensureBool(req.contoured, 'contoured');
  ensureBool(req.qa_done, 'qa_done');
  ensureBool(req.toxicity_monitored, 'toxicity_monitored');
  let plan;
  if(req.contoured===false) plan='continue_with_contour_then_reassess';
  else if(req.toxicity_monitored===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function survivorship(req){
  ensureNumber(req.weeks_since_treatment, 'weeks_since_treatment');
  ensureBool(req.surveillance_imaging, 'surveillance_imaging');
  ensureBool(req.recurrence_symptoms_reviewed, 'recurrence_symptoms_reviewed');
  ensureBool(req.qol_addressed, 'qol_addressed');
  ensureBool(req.psychosocial_support, 'psychosocial_support');
  ensureBool(req.fertility_followup, 'fertility_followup');
  let plan;
  if(req.surveillance_imaging===false) plan='continue_with_imaging_then_reassess';
  else if(req.recurrence_symptoms_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function gynonco_fu(req){
  ensureNumber(req.months_since_dx, 'months_since_dx');
  ensureBool(req.recurrence_free, 'recurrence_free');
  ensureBool(req.lymphedema, 'lymphedema');
  ensureBool(req.menopause_symptoms, 'menopause_symptoms');
  ensureBool(req.sexual_health_addressed, 'sexual_health_addressed');
  ensureBool(req.support_group_offered, 'support_group_offered');
  let plan;
  if(req.recurrence_free===false) plan='continue_with_suspicion_then_reassess';
  else if(req.lymphedema===true) plan='continue_with_lymph_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {gyn_cancer_staging,surgery_plan,chemo,radiation,survivorship,gynonco_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
