// filepath: tier28_obstetrics_ext_176_neonatal_engine.js
// TIER28_OBSTETRICS-176: Neonatal: NRP, APGAR, newborn screening
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function apgar(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.hr, 'hr');
  ensureNumber(req.respiratory_effort, 'resp');
  ensureNumber(req.muscle_tone, 'tone');
  ensureNumber(req.response_to_stimulation, 'response');
  ensureNumber(req.skin_color, 'color');
  const total = req.hr + req.respiratory_effort + req.muscle_tone + req.response_to_stimulation + req.skin_color;
  let status;
  if (total >= 7) status = 'apgar_reassuring';
  else if (total >= 4) status = 'apgar_moderate_depression_observation';
  else status = 'apgar_severe_depression_resuscitation';
  return { status, total };
}

function nrp(req) {
  ensureStr(req.event_id, 'event_id');
  ensureNumber(req.heart_rate, 'hr');
  ensureBool(req.term, 'term');
  ensureEnum(req.tone, 'tone', ['good','poor','flaccid','unknown','other']);
  ensureBool(req.cry, 'cry');
  ensureNumber(req.minutes_of_life, 'min');
  ensureBool(req.cpap_or_pp, 'cpap');
  ensureBool(req.intubation, 'intubation');
  let status;
  if (req.heart_rate < 100 && !req.cpap_or_pp) status = 'hr_below_100_ppv_initiate';
  else if (req.heart_rate < 60 && !req.intubation) status = 'hr_below_60_chest_compressions_intubation';
  else if (req.heart_rate >= 100 && req.tone === 'good' && req.cry) status = 'initial_steps_successful';
  else status = 'nrp_continued';
  return { status, hr: req.heart_rate };
}

function newborn_screen(req) {
  ensureStr(req.newborn_id, 'newborn_id');
  ensureNumber(req.hours_of_life, 'hours');
  ensureBool(req.hearing_screen_done, 'hearing');
  ensureBool(req.metabolic_screen_drawn, 'metabolic');
  ensureBool(req.bilirubin_done, 'bilirubin');
  ensureBool(req.hep_b_vaccine_given, 'vaccine');
  ensureBool(req.vitamin_k_given, 'vitk');
  ensureBool(req.erythromycin_given, 'erythro');
  let status;
  if (req.hours_of_life < 24 && req.hearing_screen_done) status = 'hearing_too_early_reassess';
  else if (req.hours_of_life > 48 && !req.metabolic_screen_drawn) status = 'metabolic_screen_missing_review';
  else if (!req.vitamin_k_given) status = 'vitamin_k_required_im';
  else if (!req.erythromycin_given) status = 'erythromycin_eye_prophylaxis_required';
  else status = 'newborn_care_complete';
  return { status, hours: req.hours_of_life };
}

function thermoregulation(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.temp_c, 'temp');
  ensureNumber(req.hours_of_life, 'hours');
  ensureBool(req.skin_to_skin, 'skin');
  ensureBool(req.radiant_warmer, 'warmer');
  ensureBool(req.incubator, 'incubator');
  let status;
  if (req.temp_c < 36) status = 'hypothermia_warming_protocol';
  else if (req.temp_c > 38) status = 'hyperthermia_sepsis_evaluation';
  else if (!req.skin_to_skin && !req.radiant_warmer && !req.incubator) status = 'no_warming_method_documented';
  else status = 'thermoregulation_appropriate';
  return { status, t: req.temp_c };
}

function feeding_newborn(req) {
  ensureStr(req.feeding_id, 'feeding_id');
  ensureNumber(req.hours_of_life, 'hours');
  ensureEnum(req.method, 'method', ['breast','bottle','ng_tube','gavage','tpn','combination','none','other']);
  ensureNumber(req.feeding_volume_ml, 'volume');
  ensureBool(req.latch_established, 'latch');
  ensureBool(req.supplementation_needed, 'supplement');
  ensureNumber(req.weight_loss_pct, 'wt_loss');
  let status;
  if (req.weight_loss_pct > 10) status = 'wt_loss_over_10_lactation_consult';
  else if (req.method === 'breast' && !req.latch_established && req.hours_of_life > 48) status = 'latch_not_established_lactation_refer';
  else if (req.supplementation_needed && req.method === 'none') status = 'supplementation_required_review';
  else status = 'feeding_appropriate';
  return { status, m: req.method };
}

const CITATIONS = { NRP_2024: 'NRP 8th 2024', AAP_NEWBORN_2024: 'AAP Newborn 2024' };

function funcs() { return { apgar, nrp, newborn_screen, thermoregulation, feeding_newborn }; }
module.exports = { funcs, CITATIONS, ValidationError };