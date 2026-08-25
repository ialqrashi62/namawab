// filepath: tier41_obstetrics_ext_238_high_risk_engine.js
// TIER41_OB-238: High-risk pregnancy
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function preeclampsia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureNumber(req.bp_systolic, 'sbp');
  ensureNumber(req.bp_diastolic, 'dbp');
  ensureEnum(req.proteinuria, 'prot', ['positive','negative','trace','pending','not_done','other']);
  ensureNumber(req.lfts, 'lft');
  ensureNumber(req.platelets, 'plt');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','eclampsia','hellp','other']);
  let status;
  if (req.severity === 'eclampsia') status = 'eclampsia_mgso4_delivery_icu';
  else if (req.severity === 'hellp') status = 'hellp_syndrome_urgent_delivery';
  else if (req.severity === 'severe' && req.gestational_age_weeks >= 34) status = 'severe_preeclampsia_34wks_delivery';
  else if (req.severity === 'severe' && req.gestational_age_weeks < 34) status = 'severe_preeclampsia_34wks_corticosteroids_mgso4';
  else if (req.bp_systolic >= 160 && req.bp_diastolic >= 110) status = 'severe_range_bp_mgso4';
  else if (req.severity === 'mild') status = 'mild_preeclampsia_monitoring';
  else status = 'preeclampsia_review';
  return { status, sev: req.severity };
}

function gestational_diabetes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureNumber(req.gtt_1hr, 'gtt1');
  ensureNumber(req.gtt_2hr, 'gtt2');
  ensureNumber(req.gtt_3hr, 'gtt3');
  ensureNumber(req.fasting_glucose, 'fg');
  ensureEnum(req.treatment, 'rx', ['diet_exercise','metformin','insulin','metformin_insulin','glibenclamide','none','other']);
  let status;
  if (req.gtt_2hr >= 200 && req.treatment === 'diet_exercise') status = 'gdm_two_abnormal_metformin_indicated';
  else if (req.fasting_glucose >= 105 && req.treatment === 'diet_exercise') status = 'fasting_glucose_diagnostic_insulin';
  else if (req.gtt_1hr >= 200 && req.gtt_2hr < 200 && req.gtt_3hr < 200) status = 'gdm_one_abnormal_lifestyle_only';
  else if (req.treatment === 'metformin' && req.fasting_glucose < 95) status = 'gdm_metformin_well_controlled';
  else status = 'gdm_review';
  return { status, t: req.treatment };
}

function placenta_previa(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['marginal','partial','complete','low_lying','other']);
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureBool(req.bleeding, 'bleed');
  ensureNumber(req.previous_cs, 'pcs');
  ensureEnum(req.delivery_planned, 'delivery', ['vaginal_36','vaginal_37','cs_36_weeks','cs_37_weeks','cs_38_weeks','observation','other']);
  let status;
  if (req.type === 'complete' && req.bleeding && req.gestational_age_weeks >= 36) status = 'complete_previa_bleeding_delivery';
  else if (req.type === 'complete' && req.delivery_planned !== 'cs_36_weeks' && req.delivery_planned !== 'cs_37_weeks' && req.delivery_planned !== 'cs_38_weeks') status = 'complete_previa_requires_cs';
  else if (req.bleeding && req.gestational_age_weeks >= 34) status = 'bleeding_previa_corticosteroids';
  else if (req.type === 'marginal' && req.bleeding === false && req.delivery_planned === 'observation') status = 'marginal_previa_observation_appropriate';
  else status = 'previa_review';
  return { status, t: req.type };
}

function preterm_labor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureEnum(req.contractions, 'cx', ['none','irregular','regular','frequent','unknown']);
  ensureNumber(req.cervical_dilation, 'dil');
  ensureEnum(req.ffn_test, 'ffn', ['positive','negative','inconclusive','pending','not_done','other']);
  ensureBool(req.tocolysis_indicated, 'toco');
  let status;
  if (req.gestational_age_weeks >= 37 && req.contractions === 'regular') status = 'term_labor_no_tocolysis';
  else if (req.gestational_age_weeks < 34 && req.contractions === 'regular' && req.cervical_dilation >= 2) status = 'preterm_34wks_corticosteroids_tocolysis';
  else if (req.gestational_age_weeks < 24 && req.contractions === 'regular') status = 'previable_preterm_counsel';
  else if (req.ffn_test === 'positive' && req.tocolysis_indicated === false) status = 'ffn_positive_tocolysis_refer';
  else status = 'preterm_review';
  return { status, ga: req.gestational_age_weeks };
}

function intrauterine_growth_restriction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.estimated_fetal_weight, 'efw');
  ensureNumber(req.percentile, 'pct');
  ensureEnum(req.umbilical_doppler, 'dop', ['normal','increased_resistance','absent_end_diastolic','reversed_end_diastolic','abnormal','other']);
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureEnum(req.surveillance, 'surv', ['weekly','biweekly','twice_weekly','daily','delivery','other']);
  let status;
  if (req.umbilical_doppler === 'reversed_end_diastolic') status = 'reversed_ed_urgent_delivery';
  else if (req.umbilical_doppler === 'absent_end_diastolic') status = 'absent_ed_hospitalize_consider_delivery';
  else if (req.percentile < 3) status = 'severe_iugr_intensive_monitoring';
  else if (req.percentile < 10 && req.umbilical_doppler === 'increased_resistance') status = 'iugr_weekly_surveillance';
  else status = 'iugr_review';
  return { status, pct: req.percentile };
}

function funcs() { return { preeclampsia, gestational_diabetes, placenta_previa, preterm_labor, intrauterine_growth_restriction }; }
module.exports = { funcs, ValidationError };