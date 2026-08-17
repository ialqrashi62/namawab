// filepath: tier41_obstetrics_ext_242_lactation_engine.js
// TIER41_OB-242: Lactation
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function latching_problem(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.postpartum_day, 'day');
  ensureEnum(req.latch_quality, 'latch', ['good','shallow','painful','inability_to_latch','asymmetric','clicking','unknown','other']);
  ensureNumber(req.feeds_per_day, 'freq');
  ensureNumber(req.feed_duration_min, 'dur');
  ensureEnum(req.recommendation, 'rec', ['positioning','latch_consultation','nipple_shield','lactation_consultant','formula_topup','other']);
  let status;
  if (req.latch_quality === 'inability_to_latch' && req.postpartum_day <= 3) status = 'inability_to_latch_lactation_consultant';
  else if (req.latch_quality === 'shallow' && req.feed_duration_min < 5) status = 'shallow_latch_positioning_review';
  else if (req.latch_quality === 'good' && req.feeds_per_day >= 8) status = 'good_latch_feeding_well';
  else if (req.latch_quality === 'painful' && req.recommendation === 'observation') status = 'painful_latch_active_assist';
  else status = 'latching_review';
  return { status, l: req.latch_quality };
}

function mastitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['lactational','non_lactational','acute','chronic','subacute','other']);
  ensureNumber(req.temperature, 'temp');
  ensureEnum(req.affected_breast, 'side', ['right','left','bilateral','none','other']);
  ensureBool(req.fluctuance, 'fluct');
  ensureEnum(req.treatment, 'rx', ['antibiotics_continue_feeding','antibiotics_pump_and_dump','incision_drainage','observation','ibuprofen_cold_compress','other']);
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','abscess_formation','unknown','other']);
  let status;
  if (req.response === 'abscess_formation' || req.fluctuance) status = 'mastitis_abscess_i_d';
  else if (req.type === 'lactational' && req.treatment === 'antibiotics_pump_and_dump') status = 'lactational_mastitis_continue_feeding';
  else if (req.temperature >= 39) status = 'high_fever_mastitis_broad_review';
  else if (req.response === 'improving') status = 'mastitis_improving_continue';
  else status = 'mastitis_review';
  return { status, t: req.type };
}

function low_milk_supply(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.feeds_per_day, 'freq');
  ensureNumber(req.wet_diapers, 'wet');
  ensureNumber(req.feed_weight_change, 'wt');
  ensureEnum(req.galactagogue, 'galact', ['none','fenugreek','domperidone','metoclopramide','herbal_combination','other']);
  ensureBool(req.supplementary_formula, 'sup');
  let status;
  if (req.feeds_per_day < 6 && req.supplementary_formula === false) status = 'low_feeds_increase_frequency';
  else if (req.feed_weight_change < 100 && req.wet_diapers < 6) status = 'inadequate_intake_pediatric_review';
  else if (req.wet_diapers >= 6 && req.feeds_per_day >= 8 && req.feed_weight_change >= 100) status = 'supply_adequate_continue';
  else if (req.supplementary_formula && req.galactagogue === 'none') status = 'supplementing_try_galact_first';
  else status = 'low_milk_review';
  return { status, w: req.wet_diapers };
}

function weaning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.child_age_months, 'age');
  ensureEnum(req.weaning_type, 'type', ['gradual','cold_turkey','partial','natural','other']);
  ensureNumber(req.feeds_dropped, 'dropped');
  ensureNumber(req.feeds_remaining, 'remaining');
  ensureEnum(req.challenge, 'chal', ['none','engorgement','mastitis','baby_distress','plugged_duct','emotional_distress','other']);
  let status;
  if (req.weaning_type === 'cold_turkey' && req.child_age_months < 12) status = 'cold_turkey_under_1_gradual';
  else if (req.challenge === 'engorgement' && req.feeds_dropped > 3) status = 'engorgement_gradual_slow_drop';
  else if (req.weaning_type === 'gradual' && req.challenge === 'none') status = 'gradual_weaning_continue';
  else if (req.challenge === 'plugged_duct') status = 'plugged_duct_lactation_review';
  else status = 'weaning_review';
  return { status, t: req.weaning_type };
}

function breastfeeding_medication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication, 'med');
  ensureEnum(req.lactation_risk, 'risk', ['compatible','caution','contraindicated','limited_data','unknown','other']);
  ensureBool(req.monitoring_required, 'monitor');
  ensureEnum(req.alternative, 'alt', ['none','change_dose','change_drug','avoid_temp','pump_dump','wait','other']);
  let status;
  if (req.lactation_risk === 'contraindicated') status = 'contraindicated_avoid_choose_alt';
  else if (req.lactation_risk === 'caution' && req.alternative === 'none') status = 'caution_drug_consider_alt';
  else if (req.lactation_risk === 'compatible') status = 'compatible_medication_continue';
  else if (req.lactation_risk === 'limited_data' && req.monitoring_required) status = 'limited_data_with_monitoring';
  else status = 'bf_medication_review';
  return { status, m: req.medication };
}

function funcs() { return { latching_problem, mastitis, low_milk_supply, weaning, breastfeeding_medication }; }
module.exports = { funcs, ValidationError };