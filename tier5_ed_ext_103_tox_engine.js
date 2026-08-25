// filepath: tier5_ed_ext_103_tox_engine.js
// TIER5_ED_EXT-103: Toxicology (overdose, envenomation, antidote, withdrawal)
'use strict';

const CITATIONS = [
  'Goldfrank_Toxicology_2022',
  'AACT_Exposures_2023',
  'WHO_Envenomation_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function overdose(req) {
  ensureStr(req.toxin, 'toxin');
  ensureEnum(req.toxin, 'toxin', ['acetaminophen','opioid','benzodiazepine','tricyclic_antidepressant','beta_blocker','calcium_channel_blocker','methanol','ethylene_glycol','salicylate','digoxin','lithium','theophylline','cyanide','carbon_monoxide','organophosphate']);
  ensureNumber(req.ingestion_amount_g, 'ingestion_amount_g');
  ensureNumber(req.hours_post_ingestion, 'hours_post_ingestion');
  ensureBool(req.intentional, 'intentional');
  ensureBool(req.symptomatic, 'symptomatic');

  let action;
  if (req.toxin === 'opioid' && req.symptomatic) action = 'continue_with_naloxone_review';
  else if (req.toxin === 'acetaminophen' && req.ingestion_amount_g >= 10) action = 'continue_with_n_acetylcysteine_review';
  else if (req.toxin === 'methanol' || req.toxin === 'ethylene_glycol') action = 'continue_with_fomepizole_or_ethanol_review';
  else if (req.toxin === 'tricyclic_antidepressant' && req.symptomatic) action = 'continue_with_sodium_bicarbonate_review';
  else if (req.toxin === 'organophosphate') action = 'continue_with_atropine_then_2pam_review';
  else if (req.toxin === 'cyanide') action = 'continue_with_hydroxocobalamin_or_cyanide_antidote_review';
  else if (req.intentional) action = 'continue_with_psychiatric_review';
  else action = 'continue_with_standard_review';
  return { action };
}

function antidote(req) {
  ensureStr(req.toxin, 'toxin');
  ensureEnum(req.toxin, 'toxin', ['acetaminophen','opioid','benzodiazepine','warfarin','digoxin','atropine','organophosphate','methemoglobinemia','carbon_monoxide','cyanide','iron','isoniazid','methanol','ethylene_glycol']);
  ensureBool(req.antidote_required, 'antidote_required');
  ensureBool(req.antidote_available, 'antidote_available');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.activated_charcoal_recent_ingestion, 'activated_charcoal_recent_ingestion');

  let plan;
  if (!req.antidote_required) plan = 'no_antidote_then_continue_with_supportive_care';
  else if (!req.antidote_available) plan = 'continue_with_immediate_supply_review';
  else if (req.activated_charcoal_recent_ingestion) plan = 'continue_with_charcoal_then_antidote';
  else plan = 'continue_with_immediate_antidote_review';
  return { plan };
}

function envenomation(req) {
  ensureStr(req.envenomation_type, 'envenomation_type');
  ensureEnum(req.envenomation_type, 'envenomation_type', ['snake_viper','snake_elapid','snake_sea','scorpion','spider_widow','spider_recluse','bee_wasp','fire_ant','tick','mosquito','jellyfish']);
  ensureBool(req.local_signs_only, 'local_signs_only');
  ensureBool(req.systemic_signs, 'systemic_signs');
  ensureNumber(req.minutes_since_envenomation, 'minutes_since_envenomation');
  ensureBool(req.antivenom_available, 'antivenom_available');

  let plan;
  if (req.systemic_signs && req.antivenom_available) plan = 'continue_with_immediate_antivenom_review';
  else if (req.systemic_signs && !req.antivenom_available) plan = 'continue_with_resuscitation_then_transfer';
  else if (req.local_signs_only) plan = 'continue_with_local_care_then_observation';
  else if (req.minutes_since_envenomation > 60) plan = 'continue_with_observation';
  else plan = 'continue_with_observation_review';
  return { plan };
}

function withdrawal(req) {
  ensureStr(req.substance, 'substance');
  ensureEnum(req.substance, 'substance', ['alcohol','benzodiazepine','opioid','cocaine','methamphetamine','cannabis','nicotine','gaba_analog']);
  ensureNumber(req.last_use_hours, 'last_use_hours');
  ensureNumber(req.ciwa_ar_score, 'ciwa_ar_score');
  ensureNumber(req.cows_score, 'cows_score');
  ensureBool(req.symptomatic_treatment_given, 'symptomatic_treatment_given');

  let plan;
  if (req.substance === 'alcohol' && req.ciwa_ar_score >= 8) plan = 'continue_with_benzodiazepine_review';
  else if (req.substance === 'opioid' && req.cows_score >= 8) plan = 'continue_with_buprenorphine_or_methadone_review';
  else if (req.substance === 'benzodiazepine' && req.last_use_hours >= 24) plan = 'continue_with_long_acting_benzodiazepine_review';
  else if (!req.symptomatic_treatment_given) plan = 'continue_with_symptomatic_treatment';
  else plan = 'continue_with_review';
  return { plan };
}

function toxidrome(req) {
  ensureStr(req.syndrome, 'syndrome');
  ensureEnum(req.syndrome, 'syndrome', ['sympathomimetic','anticholinergic','cholinergic','opioid','sedative_hypnotic','serotonin','neuroleptic_malignant','malignant_hyperthermia','alcohol_intoxication']);
  ensureNumber(req.heart_rate_bpm, 'heart_rate_bpm');
  ensureNumber(req.temperature_c, 'temperature_c');
  ensureBool(req.clonus_present, 'clonus_present');
  ensureBool(req.lead_pipe_rigidity, 'lead_pipe_rigidity');

  let advice;
  if (req.syndrome === 'sympathomimetic' && req.heart_rate_bpm >= 130) advice = 'continue_with_benzodiazepine_then_observation';
  else if (req.syndrome === 'anticholinergic') advice = 'continue_with_physostigmine_then_review';
  else if (req.syndrome === 'cholinergic') advice = 'continue_with_atropine_review';
  else if (req.syndrome === 'serotonin' && req.clonus_present) advice = 'continue_with_cyproheptadine_review';
  else if (req.syndrome === 'neuroleptic_malignant' && req.lead_pipe_rigidity) advice = 'continue_with_dantrolene_review';
  else advice = 'continue_with_review';
  return { advice };
}

function poison_center(req) {
  ensureStr(req.toxin_class, 'toxin_class');
  ensureEnum(req.toxin_class, 'toxin_class', ['analgesic','cardiovascular','psychotropic','substance_of_abuse','household','industrial','pesticide','plant','mushroom','marine','envenomation']);
  ensureBool(req.united_states_call, 'united_states_call');
  ensureBool(req.local_poison_center_reached, 'local_poison_center_reached');
  ensureBool(req.exposure_recommendation_documented, 'exposure_recommendation_documented');

  let action;
  if (!req.local_poison_center_reached) action = 'continue_with_immediate_call_then_protocol';
  else if (!req.exposure_recommendation_documented) action = 'continue_with_exposure_recommendation_documented';
  else action = 'continue_with_standard_review';
  return { action };
}

function funcs() { return { overdose, antidote, envenomation, withdrawal, toxidrome, poison_center }; }
module.exports = { funcs, CITATIONS, ValidationError };
