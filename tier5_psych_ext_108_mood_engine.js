// filepath: tier5_psych_ext_108_mood_engine.js
// TIER5_PSYCH_EXT-108: Mood Disorders
'use strict';
const CITATIONS = ['DSM5_MOOD_2022','WFSBP_MOOD_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function depression_screen(req){
  ensureNumber(req.phq9_score, 'phq9_score');
  ensureEnum(req.severity, 'severity', ['minimal','mild','moderate','moderately_severe','severe','other']);
  ensureBool(req.functional_impairment, 'functional_impairment');
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureBool(req.previous_episode, 'previous_episode');
  ensureBool(req.symptoms_met, 'symptoms_met');
  let plan;
  if(req.phq9_score>=20 && req.symptoms_met) plan='continue_with_aggressive_tx_then_reassess';
  else if(req.phq9_score>=10 && req.duration_weeks>=2) plan='continue_with_treatment_then_reassess';
  else plan='continue_with_followup_then_reassess';
  return {plan};
}
function bipolar_screen(req){
  ensureEnum(req.lifetime_mania, 'lifetime_mania', ['never','possible','definite','unknown','other']);
  ensureNumber(req.manic_episodes, 'manic_episodes');
  ensureNumber(req.depressive_episodes, 'depressive_episodes');
  ensureEnum(req.current_episode, 'current_episode', ['depressed','manic','hypomanic','mixed','euthymic','unknown','other']);
  ensureNumber(req.mood_chart_days, 'mood_chart_days');
  ensureBool(req.family_history, 'family_history');
  let plan;
  if(req.lifetime_mania==='definite' && req.manic_episodes>=1) plan='continue_with_bipolar_workup_then_reassess';
  else if(req.current_episode==='manic' || req.current_episode==='mixed') plan='continue_with_stabilize_then_reassess';
  else plan='continue_with_followup_then_reassess';
  return {plan};
}
function med_selection(req){
  ensureEnum(req.first_line, 'first_line', ['ssri','snri','bupropion','mirtazapine','maoi','tcas','other']);
  ensureBool(req.contraindications_reviewed, 'contraindications_reviewed');
  ensureBool(req.drug_interactions_reviewed, 'drug_interactions_reviewed');
  ensureNumber(req.target_dose_mg, 'target_dose_mg');
  ensureNumber(req.titration_weeks, 'titration_weeks');
  ensureBool(req.augmentation_needed, 'augmentation_needed');
  let plan;
  if(req.contraindications_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.target_dose_mg<=0) plan='continue_with_dose_then_reassess';
  else plan='continue_with_titrate_then_reassess';
  return {plan};
}
function lithium(req){
  ensureNumber(req.level_mmol_l, 'level_mmol_l');
  ensureEnum(req.range, 'range', ['subtherapeutic','therapeutic','narrow','toxic','high','other']);
  ensureBool(req.renal_function_ok, 'renal_function_ok');
  ensureBool(req.thyroid_ok, 'thyroid_ok');
  ensureNumber(req.weekly_monitoring, 'weekly_monitoring');
  ensureBool(req.drug_interactions, 'drug_interactions');
  let plan;
  if(req.range==='toxic') plan='continue_with_hold_and_lower_then_reassess';
  else if(req.range==='high' || req.range==='narrow') plan='continue_with_adjust_then_reassess';
  else if(req.renal_function_ok===false) plan='continue_with_renals_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function suicidality(req){
  ensureBool(req.si_present, 'si_present');
  ensureNumber(req.plan_specificity, 'plan_specificity');
  ensureNumber(req.intent, 'intent');
  ensureNumber(req.attempts_lifetime, 'attempts_lifetime');
  ensureBool(req.means_restricted, 'means_restricted');
  ensureBool(req.protective_present, 'protective_present');
  let plan;
  if(req.si_present===true && req.intent>=4 && req.plan_specificity>=4) plan='continue_with_inpatient_then_reassess';
  else if(req.attempts_lifetime>=2) plan='continue_with_safety_plan_then_reassess';
  else if(req.means_restricted===false) plan='continue_with_restrict_means_then_reassess';
  else plan='continue_with_outpatient_then_reassess';
  return {plan};
}
function followup(req){
  ensureNumber(req.weeks_in_treatment, 'weeks_in_treatment');
  ensureNumber(req.score_change, 'score_change');
  ensureBool(req.med_adherent, 'med_adherent');
  ensureBool(req.side_effects, 'side_effects');
  ensureNumber(req.remission_met, 'remission_met');
  ensureBool(req.relapse_risk, 'relapse_risk');
  let plan;
  if(req.score_change<-5 && req.med_adherent===true) plan='continue_with_response_then_reassess';
  else if(req.remission_met>=8) plan='continue_with_remission_then_reassess';
  else if(req.side_effects===true) plan='continue_with_manage_se_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {depression_screen,bipolar_screen,med_selection,lithium,suicidality,followup};}
module.exports = {funcs, CITATIONS, ValidationError};
