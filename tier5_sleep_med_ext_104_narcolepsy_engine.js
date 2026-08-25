// filepath: tier5_sleep_med_ext_104_narcolepsy_engine.js
// TIER5_SLEEP_MED_EXT-104: Narcolepsy / hypersomnia
'use strict';
const CITATIONS = ['AASM_Narcolepsy_2021'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function diagnosis(req){
  ensureBool(req.cataplexy, 'cataplexy');
  ensureNumber(req.epworth_score, 'epworth_score');
  ensureNumber(req.sleep_latency_mslt, 'sleep_latency_mslt');
  ensureNumber(req.soremp_count, 'soremp_count');
  ensureBool(req.hypocretin_low, 'hypocretin_low');
  ensureBool(req.full_polysomnography, 'full_polysomnography');
  let plan;
  if(req.cataplexy && req.soremp_count>=2) plan='continue_with_nt1_then_reassess';
  else if(req.soremp_count>=2 && req.cataplexy===false) plan='continue_with_nt2_then_reassess';
  else if(req.sleep_latency_mslt<8) plan='continue_with_evaluate_then_reassess';
  else if(req.full_polysomnography===false) plan='continue_with_psg_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cataplexy(req){
  ensureNumber(req.episodes_per_week, 'episodes_per_week');
  ensureBool(req.emotional_trigger, 'emotional_trigger');
  ensureBool(req.impairment, 'impairment');
  ensureBool(req.sodium_oxybate, 'sodium_oxybate');
  ensureBool(req.venlafaxine, 'venlafaxine');
  ensureBool(req.safety_concerns, 'safety_concerns');
  let plan;
  if(req.impairment && req.sodium_oxybate===false) plan='continue_with_sodium_oxybate_then_reassess';
  else if(req.safety_concerns) plan='continue_with_education_then_reassess';
  else if(req.episodes_per_week>=5) plan='continue_with_treatment_then_reassess';
  else if(req.impairment) plan='continue_with_evaluate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pharmacotherapy(req){
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['modafinil','armodafinil','methylphenidate','amphetamine','sodium_oxybate','pitolisant','solriamfetol','venlafaxine']);
  ensureBool(req.response, 'response');
  ensureBool(req.side_effects, 'side_effects');
  ensureBool(req.tolerated, 'tolerated');
  ensureNumber(req.epworth_on_drug, 'epworth_on_drug');
  let plan;
  if(req.response===false) plan='continue_with_switch_then_reassess';
  else if(req.side_effects) plan='continue_with_review_then_reassess';
  else if(req.tolerated===false) plan='continue_with_alternative_then_reassess';
  else if(req.epworth_on_drug>=10) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function behavioral(req){
  ensureBool(req.scheduled_naps, 'scheduled_naps');
  ensureBool(req.sleep_consistency, 'sleep_consistency');
  ensureBool(req.avoid_alcohol, 'avoid_alcohol');
  ensureBool(req.exercise_regular, 'exercise_regular');
  ensureBool(req.driving_safety_discussed, 'driving_safety_discussed');
  ensureBool(req.employer_discussed, 'employer_discussed');
  let plan;
  if(req.scheduled_naps===false) plan='continue_with_scheduled_naps_then_reassess';
  else if(req.sleep_consistency===false) plan='continue_with_schedule_then_reassess';
  else if(req.driving_safety_discussed===false) plan='continue_with_discuss_then_reassess';
  else if(req.employer_discussed===false) plan='continue_with_discuss_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function safety(req){
  ensureBool(req.driving_history_safe, 'driving_history_safe');
  ensureBool(req.workplace_safety, 'workplace_safety');
  ensureBool(req.legal_concerns, 'legal_concerns');
  ensureBool(req.drowsy_episodes, 'drowsy_episodes');
  ensureBool(req.medication_optimized, 'medication_optimized');
  let plan;
  if(req.drowsy_episodes && req.driving_history_safe===false) plan='continue_with_disable_driving_then_reassess';
  else if(req.workplace_safety===false) plan='continue_with_review_then_reassess';
  else if(req.medication_optimized===false) plan='continue_with_optimize_then_reassess';
  else if(req.legal_concerns) plan='continue_with_legal_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureNumber(req.days_since_last, 'days_since_last');
  ensureBool(req.epworth_improved, 'epworth_improved');
  ensureBool(req.drug_adherence, 'drug_adherence');
  ensureBool(req.side_effects_review, 'side_effects_review');
  ensureBool(req.safety_clear, 'safety_clear');
  let plan;
  if(req.drug_adherence===false) plan='continue_with_adherence_then_reassess';
  else if(req.side_effects_review===false) plan='continue_with_review_then_reassess';
  else if(req.epworth_improved===false) plan='continue_with_optimize_then_reassess';
  else if(req.safety_clear===false) plan='continue_with_clear_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {diagnosis,cataplexy,pharmacotherapy,behavioral,safety,followup};}
module.exports={funcs,CITATIONS,ValidationError};
