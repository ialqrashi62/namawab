// filepath: tier68_rx_371_rx_clinical_pharm_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pharmacokinetics_dosing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drug, 'drug');
  ensureStr(req.patient_id_field, 'pif');
  ensureNum(req.drug_level_mg_l, 'dll');
  ensureBool(req.trough, 'tr');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.last_dose, 'ld');
  ensureEnum(req.renal_function, 'rf', ['normal','mild_impairment','moderate_impairment','severe_impairment','esrd','dialysis','crrt','unknown']);
  ensureBool(req.am_pop_calculation_required, 'apcr');
  ensureStr(req.next_dose_date, 'ndd');
  return { drug: req.drug };
}
function renal_dosing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drug, 'drug');
  ensureNum(req.egfr, 'egfr');
  ensureEnum(req.renal_function, 'rf', ['normal','mild_impairment','moderate_impairment','severe_impairment','esrd','dialysis','crrt','unknown']);
  ensureNum(req.standard_dose_mg, 'sdm');
  ensureNum(req.recommended_dose_mg, 'rdm');
  ensureEnum(req.frequency, 'freq', ['q4h','q6h','q8h','q12h','q24h','q48h','q72h','daily','twice_daily','three_times_daily','four_times_daily','single_dose','after_dialysis','continuous','scheduled','other']);
  ensureEnum(req.adjustment_reason, 'ar', ['crcl_below_50','crcl_below_30','crcl_below_10','dialysis','rhabdo','dehydration','advanced_age','low_bmi','multiple_organs','other']);
  ensureStr(req.reviewed_by, 'rb');
  ensureNum(req.next_review, 'nr');
  return { drug: req.drug };
}
function hepatic_dosing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.liver_function, 'lf', ['normal','mild_impairment','moderate_impairment','severe_impairment','cirrhosis','acute_liver_failure','unknown']);
  ensureNum(req.child_pugh, 'cp');
  ensureEnum(req.standard_dose, 'sd', ['standard','half','quarter','double','two_thirds','three_quarters','one_third','half_dose','reduced','reduced_dose','not_applicable','other']);
  ensureEnum(req.recommended_dose, 'rd', ['standard','half','quarter','double','two_thirds','three_quarters','one_third','half_dose','reduced','reduced_dose','not_applicable','other']);
  ensureNum(req.dose_reduction_pct, 'drp');
  ensureStr(req.reviewed_by, 'rb');
  ensureEnum(req.lfts_trend, 'lt', ['improving','stable','worsening','normal','lfts_spike','new_abnormality','fluctuating','not_applicable','other']);
  ensureNum(req.next_review, 'nr');
  return { drug: req.drug };
}
function warfarin_dosing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.inr_current, 'ic');
  ensureNum(req.target_inr, 'ti');
  ensureNum(req.weekly_dose_mg, 'wdm');
  ensureNum(req.dose_change_mg, 'dcm');
  ensureStr(req.next_inr_date, 'nid');
  ensureBool(req.drug_interactions_present, 'dip');
  ensureBool(req.vitamin_k_given, 'vkg');
  ensureStr(req.reviewed_by, 'rb');
  ensureNum(req.follow_up_days, 'fud');
  return { inr: req.inr_current };
}
function vancomycin_dosing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureNum(req.current_trough, 'ct');
  ensureNum(req.goal_trough, 'gt');
  ensureNum(req.weight_kg, 'wkg');
  ensureNum(req.egfr, 'egfr');
  ensureEnum(req.recommendation, 'rec', ['increase_dose','decrease_dose','hold','continue','extend_interval','concentration_repeat','level_repeat','add_aminoglycoside','switch','other']);
  ensureNum(req.new_dose_mg, 'ndm');
  ensureEnum(req.frequency, 'freq', ['q4h','q6h','q8h','q12h','q24h','q48h','q72h','daily','continuous','after_dialysis','scheduled','other']);
  ensureStr(req.next_level_date, 'nld');
  ensureStr(req.reviewed_by, 'rb');
  return { trough: req.current_trough };
}

function funcs() { return { pharmacokinetics_dosing, renal_dosing, hepatic_dosing, warfarin_dosing, vancomycin_dosing }; }
module.exports = { funcs, ValidationError };