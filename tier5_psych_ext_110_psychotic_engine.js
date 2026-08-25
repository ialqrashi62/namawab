// filepath: tier5_psych_ext_110_psychotic_engine.js
// TIER5_PSYCH_EXT-110: Psychotic Disorders (Schizophrenia)
'use strict';
const CITATIONS = ['DSM5_SCHIZ_2022','APA_SCHIZ_PRACTICE_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function first_psychosis(req){
  ensureNumber(req.dup_duration_weeks, 'dup_duration_weeks');
  ensureBool(req.hallucinations, 'hallucinations');
  ensureBool(req.delusions, 'delusions');
  ensureBool(req.disorganized, 'disorganized');
  ensureNumber(req.decline_function, 'decline_function');
  ensureBool(req.organic_excluded, 'organic_excluded');
  let plan;
  if(req.dup_duration_weeks<1 && req.organic_excluded===true) plan='continue_with_brief_psychotic_then_reassess';
  else if(req.hallucinations===true && req.decline_function>=3) plan='continue_with_first_psychosis_team_then_reassess';
  else plan='continue_with_full_workup_then_reassess';
  return {plan};
}
function antipsychotic_init(req){
  ensureEnum(req.first_line, 'first_line', ['aripiprazole','risperidone','olanzapine','quetiapine','haloperidol','paliperidone','clozapine','lurasidone','other']);
  ensureNumber(req.starting_dose_mg, 'starting_dose_mg');
  ensureBool(req.contraindications_checked, 'contraindications_checked');
  ensureBool(req.metabolic_baseline, 'metabolic_baseline');
  ensureNumber(req.titration_weeks, 'titration_weeks');
  ensureBool(req.lai_consideration, 'lai_consideration');
  let plan;
  if(req.contraindications_checked===false) plan='continue_with_review_then_reassess';
  else if(req.metabolic_baseline===false) plan='continue_with_baseline_labs_then_reassess';
  else if(req.lai_consideration===true) plan='continue_with_lai_consult_then_reassess';
  else plan='continue_with_titrate_then_reassess';
  return {plan};
}
function metabolic_monitoring(req){
  ensureNumber(req.weeks_on_med, 'weeks_on_med');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.bmi, 'bmi');
  ensureNumber(req.hba1c, 'hba1c');
  ensureNumber(req.fasting_glucose, 'fasting_glucose');
  ensureNumber(req.fasting_lipids, 'fasting_lipids');
  let plan;
  if(req.bmi>=30 || req.hba1c>=6.5) plan='continue_with_metabolic_intervention_then_reassess';
  else if(req.weeks_on_med>=4 && req.fasting_lipids>0) plan='continue_with_continue_monitoring_then_reassess';
  else plan='continue_with_recheck_then_reassess';
  return {plan};
}
function clozapine(req){
  ensureBool(req.treatment_resistant, 'treatment_resistant');
  ensureNumber(req.anc, 'anc');
  ensureEnum(req.status, 'status', ['normal','low','severe','unknown','other']);
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureEnum(req.frequency, 'frequency', ['daily','weekly','biweekly','monthly','other']);
  ensureNumber(req.serum_level_ng_ml, 'serum_level_ng_ml');
  let plan;
  if(req.anc<1500) plan='continue_with_hold_then_reassess';
  else if(req.treatment_resistant===true && req.dose_mg<300) plan='continue_with_optimize_dose_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function adherence(req){
  ensureNumber(req.adherence_pct, 'adherence_pct');
  ensureBool(req.lai_administered, 'lai_administered');
  ensureNumber(req.missed_doses, 'missed_doses');
  ensureBool(req.barriers_addressed, 'barriers_addressed');
  ensureBool(req.support_system, 'support_system');
  ensureBool(req.relapse_warning, 'relapse_warning');
  let plan;
  if(req.adherence_pct<60) plan='continue_with_lai_then_reassess';
  else if(req.relapse_warning===true) plan='continue_with_intensify_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function psych_recovery(req){
  ensureNumber(req.weeks_in_treatment, 'weeks_in_treatment');
  ensureNumber(req.symptoms_change, 'symptoms_change');
  ensureBool(req.functional_status, 'functional_status');
  ensureBool(req.work_school, 'work_school');
  ensureBool(req.social_connected, 'social_connected');
  ensureBool(req.quality_of_life, 'quality_of_life');
  let plan;
  if(req.symptoms_change>0 && req.functional_status===true) plan='continue_with_recovery_then_reassess';
  else if(req.work_school===true && req.social_connected===true) plan='continue_with_continue_then_reassess';
  else plan='continue_with_support_intensify_then_reassess';
  return {plan};
}

function funcs(){return {first_psychosis,antipsychotic_init,metabolic_monitoring,clozapine,adherence,psych_recovery};}
module.exports = {funcs, CITATIONS, ValidationError};
