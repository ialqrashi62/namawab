// filepath: tier27_emergency_ext_171_toxicology_engine.js
// TIER27_EMERGENCY-171: Toxicology (poison, OD, antidote)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function toxidrome(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.toxidrome, 'toxidrome', ['sympathomimetic','anticholinergic','cholinergic','opioid','sedative_hypnotic','serotonin','nms','alcohol','withdrawal','mixed','unknown','other']);
  ensureNumber(req.hr, 'hr');
  ensureNumber(req.temp_c, 'temp');
  ensureNumber(req.pupil_size_mm, 'pupil');
  ensureEnum(req.muscle_tone, 'muscle_tone', ['normal','rigid','flaccid','tremor','clonus','other']);
  ensureBool(req.skin_dry, 'skin_dry');
  let status;
  if (req.toxidrome === 'opioid' && req.pupil_size_mm < 2) status = 'opioid_toxidrome_give_naloxone';
  else if (req.toxidrome === 'cholinergic') status = 'cholinergic_drying_atropine';
  else if (req.toxidrome === 'sympathomimetic' && req.temp_c > 40) status = 'sympathomimetic_hyperthermia_aggressive_cooling';
  else status = 'toxidrome_assessed';
  return { status, tox: req.toxidrome };
}

function antidote(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.antidote, 'antidote', ['naloxone','flumazenil','atropine','pralidoxime','sodium_bicarbonate','dextrose','glucagon','physostigmine','n_acetylcysteine','fomepizole','calcium','digoxin_specific_ab','vitamin_k','ffp','vitamin_b6','cyanide_kit','methylene_blue','none','other']);
  ensureNumber(req.dose, 'dose');
  ensureNumber(req.doses_given, 'doses');
  ensureBool(req.response, 'response');
  ensureEnum(req.poison, 'poison', ['opioid','benzodiazepine','organophosphate','beta_blocker','ccb','tca','mao_inhibitor','acetaminophen','methanol_ethylene_glycol','warfarin','digoxin','cyanide','co','iron','methemoglobin','other']);
  let status;
  if (req.poison === 'opioid' && req.antidote !== 'naloxone' && req.doses_given === 0) status = 'opioid_no_naloxone_give';
  else if (req.poison === 'acetaminophen' && req.antidote !== 'n_acetylcysteine') status = 'apap_nac_required';
  else if (req.response === false && req.doses_given >= 3) status = 'no_response_to_antidote_review_alternative';
  else status = 'antidote_appropriate';
  return { status, ant: req.antidote };
}

function ingest(req) {
  ensureStr(req.ingest_id, 'ingest_id');
  ensureStr(req.substance, 'substance');
  ensureNumber(req.amount, 'amount');
  ensureEnum(req.unit, 'unit', ['mg','g','ml','tablets','units','unknown','other']);
  ensureNumber(req.time_since_ingest_min, 'time');
  ensureBool(req.intentional, 'intentional');
  ensureBool(req.activated_charcoal, 'charcoal');
  let status;
  if (req.intentional) status = 'intentional_psych_eval_required';
  else if (req.time_since_ingest_min < 60 && req.amount > 0) status = 'within_1h_consider_charcoal_wlp';
  else status = 'ingestion_documented';
  return { status, substance: req.substance };
}

function withdrawal(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.substance, 'substance', ['alcohol','benzodiazepine','opioid','cocaine','methamphetamine','nicotine','other']);
  ensureNumber(req.ciwa_ar_score, 'ciwa');
  ensureNumber(req.cows_score, 'cows');
  ensureBool(req.benzodiazepine_given, 'benzo');
  ensureEnum(req.protocol, 'protocol', ['ciwa_ar','cows','none','other']);
  let status;
  if (req.substance === 'alcohol' && req.ciwa_ar_score >= 10 && !req.benzodiazepine_given) status = 'ciwa_high_benzo_required';
  else if (req.substance === 'opioid' && req.cows_score >= 8) status = 'cows_high_withdrawal_management';
  else if (req.protocol === 'none') status = 'protocol_not_assigned_review';
  else status = 'withdrawal_assessed';
  return { status, sub: req.substance };
}

function envenomation(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.type, 'type', ['snake_crotalid','snake_elapid','spider_black_widow','spider_brown_recluse','scorpion','bee_wasp','fire_ant','jellyfish','other']);
  ensureNumber(req.time_to_ed_min, 'time');
  ensureBool(req.antivenom_given, 'antivenom');
  ensureEnum(req.severity, 'severity', ['dry_bite','minimal','moderate','severe','life_threatening','other']);
  ensureBool(req.allergic_reaction, 'allergic');
  let status;
  if (req.severity === 'life_threatening' && !req.antivenom_given) status = 'life_threatening_antivenom_immediately';
  else if (req.allergic_reaction) status = 'allergic_anaphylaxis_epinephrine';
  else status = 'envenomation_managed';
  return { status, type: req.type };
}

const CITATIONS = { GOLD_FRANK_2024: 'Goldfrank Tox 2024', ACMT_2024: 'ACMT 2024' };

function funcs() { return { toxidrome, antidote, ingest, withdrawal, envenomation }; }
module.exports = { funcs, CITATIONS, ValidationError };