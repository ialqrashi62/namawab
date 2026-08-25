// filepath: tier28_obstetrics_ext_174_labor_engine.js
// TIER28_OBSTETRICS-174: Labor & delivery, partogram, induction
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function partogram(req) {
  ensureStr(req.labor_id, 'labor_id');
  ensureNumber(req.cervical_dilation_cm, 'cx');
  ensureNumber(req.station, 'station');
  ensureNumber(req.contractions_per_10min, 'cx_per_10');
  ensureEnum(req.fetal_descent, 'descent', ['progressing','arrested','protracted','unknown','other']);
  ensureNumber(req.hours_in_labor, 'hours');
  ensureNumber(req.fetal_heart_rate, 'fhr');
  ensureBool(req.category_2_fhr, 'cat2');
  let status;
  if (req.fetal_heart_rate < 110 || req.fetal_heart_rate > 160) status = 'fhr_abnormal_category_review';
  else if (req.cat2_fhr) status = 'cat2_fhr_intervene_reassess';
  else if (req.descent === 'arrested' && req.hours_in_labor > 4) status = 'arrested_labor_arom_or_cesarean';
  else if (req.contractions_per_10min < 3) status = 'inadequate_contractions_augment';
  else status = 'partogram_progressing';
  return { status, cx: req.cervical_dilation_cm };
}

function induction(req) {
  ensureStr(req.induction_id, 'induction_id');
  ensureEnum(req.method, 'method', ['foley_catheter','cook_catheter','cytotec','dinoprostone','mechanical','oxytocin','amniotomy','none','other']);
  ensureNumber(req.bishop_score, 'bishop');
  ensureNumber(req.gestational_age_weeks, 'gw');
  ensureEnum(req.indication, 'indication', ['post_dates','preeclampsia','diabetes','iufgr','oligohydramnios','maternal_request','elective','other']);
  ensureNumber(req.hours_since_start, 'hours');
  let status;
  if (req.bishop_score < 6) status = 'unfavorable_cervix_consider_cervical_ripening';
  else if (req.hours_since_start > 24 && req.method !== 'none') status = 'long_induction_review_failed';
  else status = 'induction_progressing';
  return { status, bishop: req.bishop_score };
}

function fetal_monitoring(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.fetal_heart_rate, 'fhr');
  ensureNumber(req.variability, 'variability');
  ensureNumber(req.accelerations, 'accel');
  ensureNumber(req.decelerations, 'decel');
  ensureEnum(req.category, 'category', ['category_1','category_2','category_3','unknown','other']);
  ensureBool(req.interventions, 'interventions');
  let status;
  if (req.category === 'category_3') status = 'cat3_immediate_intervention_deliver';
  else if (req.category === 'category_2' && !req.interventions) status = 'cat2_intervention_required';
  else if (req.variability < 5) status = 'low_variability_review_category';
  else status = 'fetal_monitoring_reassuring';
  return { status, cat: req.category };
}

function delivery(req) {
  ensureStr(req.delivery_id, 'delivery_id');
  ensureEnum(req.mode, 'mode', ['spontaneous_vaginal','operative_vaginal_vacuum','operative_vaginal_forceps','cesarean_elective','cesarean_emergency','cesarean_urgent','vbac','other']);
  ensureNumber(req.blood_loss_ml, 'loss');
  ensureNumber(req.apgar_1min, 'apgar1');
  ensureNumber(req.apgar_5min, 'apgar5');
  ensureBool(req.complications, 'comp');
  let status;
  if (req.apgar_5min < 7) status = 'low_apgar_5min_neonatal_resus';
  else if (req.blood_loss_ml > 1000) status = 'postpartum_hemorrhage_mtp';
  else if (req.complications) status = 'delivery_complication_reviewed';
  else status = 'delivery_normal';
  return { status, mode: req.mode };
}

function postpartum(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.hours_post_delivery, 'hours');
  ensureNumber(req.bp_systolic, 'bp_s');
  ensureNumber(req.bp_diastolic, 'bp_d');
  ensureNumber(req.fundal_height, 'fh');
  ensureNumber(req.lochia, 'lochia');
  ensureBool(req.postpartum_bleed, 'bleed');
  ensureBool(req.depression_screening, 'edinburgh');
  let status;
  if (req.postpartum_bleed) status = 'postpartum_bleed_evaluate_uterus';
  else if (req.bp_systolic >= 160) status = 'postpartum_preeclampsia_review';
  else if (!req.depression_screening) status = 'edinburgh_depression_screen_required';
  else status = 'postpartum_appropriate';
  return { status, h: req.hours_post_delivery };
}

const CITATIONS = { ACOG_LABOR_2024: 'ACOG Labor 2024', NICE_INTRAPARTUM_2024: 'NICE Intrapartum 2024' };

function funcs() { return { partogram, induction, fetal_monitoring, delivery, postpartum }; }
module.exports = { funcs, CITATIONS, ValidationError };