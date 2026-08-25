// filepath: tier5_pall_care_ext_103_spiritual_engine.js
// TIER5_PALL_CARE_EXT-103: Spiritual care / cultural
'use strict';
const CITATIONS = ['NHPCO_Spiritual_2018','CPE_Spiritual_2018','Puchalski_Spiritual_2014'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function spiritual_history(req){
  ensureStr(req.faith_tradition, 'faith_tradition');
  ensureEnum(req.faith_tradition, 'faith_tradition', ['christian','muslim','jewish','hindu','buddhist','sikh','spiritual_not_religious','agnostic','atheist','other','none']);
  ensureBool(req.spiritual_practices, 'spiritual_practices');
  ensureBool(req.community_connected, 'community_connected');
  ensureBool(req.faith_impact_on_care, 'faith_impact_on_care');
  ensureBool(req.spiritual_distress, 'spiritual_distress');
  let plan;
  if(req.spiritual_distress) plan='continue_with_refer_chaplain_then_reassess';
  else if(req.spiritual_practices===false) plan='continue_with_explore_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function spiritual_distress(req){
  ensureBool(req.questioning_meaning, 'questioning_meaning');
  ensureBool(req.feeling_abandoned, 'feeling_abandoned');
  ensureBool(req.feeling_punished, 'feeling_punished');
  ensureBool(req.unresolved_relationship, 'unresolved_relationship');
  ensureBool(req.crisis_of_faith, 'crisis_of_faith');
  ensureBool(req.chaplain_consulted, 'chaplain_consulted');
  let plan;
  if(req.crisis_of_faith && req.chaplain_consulted===false) plan='continue_with_urgent_chaplain_then_reassess';
  else if(req.feeling_punished) plan='continue_with_chaplain_then_reassess';
  else if(req.unresolved_relationship) plan='continue_with_reconciliation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cultural_practice(req){
  ensureBool(req.dietary_restrictions, 'dietary_restrictions');
  ensureBool(req.gender_of_provider_preference, 'gender_of_provider_preference');
  ensureBool(req.family_decision_making_style, 'family_decision_making_style');
  ensureBool(req.religious_observances_needed, 'religious_observances_needed');
  ensureBool(req.liturgical_practices_needed, 'liturgical_practices_needed');
  ensureBool(req.community_leader_involvement, 'community_leader_involvement');
  let plan;
  if(req.religious_observances_needed===false) plan='continue_with_observation_then_reassess';
  else if(req.community_leader_involvement) plan='continue_with_communication_then_reassess';
  else plan='continue_with_respectful_observance_then_reassess';
  return {plan};
}
function dignity_conserving(req){
  ensureBool(req.personal_narrative_explored, 'personal_narrative_explored');
  ensureBool(req.control_offered, 'control_offered');
  ensureBool(req.privacy_respected, 'privacy_respected');
  ensureBool(req.respect_maintained, 'respect_maintained');
  ensureBool(req.autonomy_maintained, 'autonomy_maintained');
  ensureBool(req.social_connectedness, 'social_connectedness');
  let plan;
  if(req.personal_narrative_explored===false) plan='continue_with_life_review_then_reassess';
  else if(req.autonomy_maintained===false) plan='continue_with_choice_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function meaning_therapy(req){
  ensureBool(req.existential_concerns, 'existential_concerns');
  ensureBool(req.logotherapy_offered, 'logotherapy_offered');
  ensureBool(req.meaning_focused_therapy, 'meaning_focused_therapy');
  ensureBool(req.legacy_work_active, 'legacy_work_active');
  ensureBool(req.dignity_therapy_done, 'dignity_therapy_done');
  let plan;
  if(req.existential_concerns && req.logotherapy_offered===false) plan='continue_with_logotherapy_then_reassess';
  else if(req.dignity_therapy_done===false) plan='continue_with_dignity_therapy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function chaplain_referral(req){
  ensureBool(req.chaplain_consult_active, 'chaplain_consult_active');
  ensureBool(req.spiritual_distress_score, 'spiritual_distress_score');
  ensureBool(req.family_meeting_needed, 'family_meeting_needed');
  ensureBool(req.death_anticipatory, 'death_anticipatory');
  ensureBool(req.code_status_discussion, 'code_status_discussion');
  ensureBool(req.ritual_or_prayer_requested, 'ritual_or_prayer_requested');
  let plan;
  if(req.ritual_or_prayer_requested && req.chaplain_consult_active===false) plan='continue_with_chaplain_then_reassess';
  else if(req.spiritual_distress_score && req.chaplain_consult_active===false) plan='continue_with_chaplain_then_reassess';
  else if(req.family_meeting_needed) plan='continue_with_chaplain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {spiritual_history,spiritual_distress,cultural_practice,dignity_conserving,meaning_therapy,chaplain_referral};}
module.exports={funcs,CITATIONS,ValidationError};
