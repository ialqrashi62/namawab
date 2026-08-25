// filepath: tier5_wh_ext_129_fetal_engine.js
// TIER5_WH_EXT-129: Fetal Medicine / Prenatal Diagnosis
'use strict';
const CITATIONS = ['ISUOG_PB_2020','SMFM_PRENATAL_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function first_trimester(req){
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureNumber(req.crl, 'crl');
  ensureEnum(req.nuchal_risk, 'nuchal_risk', ['low','intermediate','high','unknown','other']);
  ensureEnum(req.cf_dna, 'cf_dna', ['low_risk','high_risk','no_result','not_done','unknown','other']);
  ensureBool(req.counseling_done, 'counseling_done');
  ensureBool(req.followup_planned, 'followup_planned');
  let plan;
  if(req.nuchal_risk==='high' || req.cf_dna==='high_risk') plan='continue_with_cvs_amnio_then_reassess';
  else if(req.counseling_done===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function anatomy_scan(req){
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureBool(req.anatomy_complete, 'anatomy_complete');
  ensureBool(req.growth_normal, 'growth_normal');
  ensureBool(req.placenta_reviewed, 'placenta_reviewed');
  ensureEnum(req.findings, 'findings', ['normal','soft_marker','major_anomaly','multiple','unknown','other']);
  ensureBool(req.followup_imaging, 'followup_imaging');
  let plan;
  if(req.findings==='major_anomaly') plan='continue_with_genetic_then_reassess';
  else if(req.followup_imaging===false && req.findings==='soft_marker') plan='continue_with_followup_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function amnio_cvs(req){
  ensureEnum(req.method, 'method', ['amniocentesis','cvs','fetal_blood','other','unknown']);
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureBool(req.consent, 'consent');
  ensureBool(req.karyotype_done, 'karyotype_done');
  ensureBool(req.microarray_done, 'microarray_done');
  ensureBool(req.pretest_counseling, 'pretest_counseling');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.pretest_counseling===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_proceed_then_reassess';
  return {plan};
}
function genetic_counsel(req){
  ensureBool(req.suspected_diagnosis, 'suspected_diagnosis');
  ensureNumber(req.recurrence_risk, 'recurrence_risk');
  ensureBool(req.testing_offered, 'testing_offered');
  ensureBool(req.family_screened, 'family_screened');
  ensureBool(req.options_explored, 'options_explored');
  ensureBool(req.psych_support, 'psych_support');
  let plan;
  if(req.options_explored===false) plan='continue_with_options_then_reassess';
  else if(req.psych_support===false && req.suspected_diagnosis===true) plan='continue_with_support_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function anomalies(req){
  ensureEnum(req.category, 'category', ['cardiac','cns','renal','skeletal','facial','gi','respiratory','genetic','multiple','unknown','other']);
  ensureBool(req.subspecialty_referred, 'subspecialty_referred');
  ensureBool(req.mdt_review, 'mdt_review');
  ensureBool(req.delivery_planning_initiated, 'delivery_planning_initiated');
  ensureBool(req.mgmt_options_offered, 'mgmt_options_offered');
  ensureBool(req.continuity_planned, 'continuity_planned');
  let plan;
  if(req.mdt_review===false) plan='continue_with_mdt_then_reassess';
  else if(req.delivery_planning_initiated===false) plan='continue_with_planning_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function fetal_fu(req){
  ensureNumber(req.weeks_in_care, 'weeks_in_care');
  ensureBool(req.surveillance_continued, 'surveillance_continued');
  ensureBool(req.delivery_planned, 'delivery_planned');
  ensureBool(req.neonatal_team_notified, 'neonatal_team_notified');
  ensureBool(req.counseling_ongoing, 'counseling_ongoing');
  ensureBool(req.parental_wishes_documented, 'parental_wishes_documented');
  let plan;
  if(req.surveillance_continued===false) plan='continue_with_surveillance_then_reassess';
  else if(req.counseling_ongoing===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {first_trimester,anatomy_scan,amnio_cvs,genetic_counsel,anomalies,fetal_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
