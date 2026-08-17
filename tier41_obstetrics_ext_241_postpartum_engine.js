// filepath: tier41_obstetrics_ext_241_postpartum_engine.js
// TIER41_OB-241: Postpartum
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function postpartum_hemorrhage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.estimated_blood_loss, 'ebl');
  ensureBool(req.uterine_atony, 'atony');
  ensureEnum(req.treatment, 'rx', ['uterotonics','uterotonics_bakri_balloon','uterotonics_brace_suture','hysterectomy','observation','other']);
  ensureNumber(req.transfusion, 'tx');
  ensureEnum(req.response, 'resp', ['controlled','ongoing','massive','resolved','worsening','unknown','other']);
  let status;
  if (req.response === 'massive' && req.treatment !== 'hysterectomy') status = 'massive_pph_hysterectomy_peri';
  else if (req.uterine_atony && req.transfusion >= 4) status = 'massive_transfusion_protocol';
  else if (req.estimated_blood_loss >= 1500 && req.treatment === 'observation') status = 'pph_active_manage_uterotonics';
  else if (req.response === 'controlled') status = 'pph_controlled_monitor';
  else status = 'pph_review';
  return { status, e: req.estimated_blood_loss };
}

function postpartum_depression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.phq9_score, 'phq');
  ensureNumber(req.epds_score, 'epds');
  ensureBool(req.sleep_disturbance, 'sleep');
  ensureBool(req.bonding_issues, 'bonding');
  ensureBool(req.suicidal_ideation, 'si');
  ensureEnum(req.referral, 'ref', ['none','psychiatry','social_work','support_group','counseling','combination','other']);
  let status;
  if (req.suicidal_ideation) status = 'ppd_with_si_emergency_psych_consult';
  else if (req.phq9_score >= 15) status = 'severe_ppd_active_treatment';
  else if (req.phq9_score >= 10 && req.referral === 'none') status = 'moderate_ppd_referral_initiate';
  else if (req.bonding_issues && req.epds_score >= 13) status = 'bonding_issues_active_monitoring';
  else status = 'ppd_review';
  return { status, p: req.phq9_score };
}

function puerperal_sepsis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.temperature, 'temp');
  ensureEnum(req.source, 'src', ['endometritis','wound','mastitis','urinary','pneumonia','unknown','other']);
  ensureNumber(req.wbc, 'wbc');
  ensureEnum(req.blood_culture, 'cx', ['negative','positive_staph','positive_strep','positive_e_coli','positive_other','pending','other']);
  ensureEnum(req.antibiotics, 'abx', ['narrow_spectrum','broad_spectrum','targeted','combination','observation','none','other']);
  ensureEnum(req.response, 'resp', ['excellent','improving','stable','worsening','unknown','other']);
  let status;
  if (req.response === 'worsening') status = 'sepsis_worsening_icu_escalation';
  else if (req.temperature >= 39 && req.blood_culture === 'pending') status = 'high_fever_emp_broad_spectrum';
  else if (req.source === 'endometritis' && req.antibiotics === 'narrow_spectrum') status = 'endometritis_broad_review';
  else if (req.response === 'improving') status = 'puerperal_sepsis_improving_continue';
  else status = 'puerperal_sepsis_review';
  return { status, t: req.temperature };
}

function wound_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.day_postpartum, 'day');
  ensureEnum(req.site, 'site', ['cs_incision','perineal_laceration','episiotomy','vaginal_tear','multiple','other']);
  ensureEnum(req.healing, 'heal', ['normal','delayed','dehiscing','infected','unknown','other']);
  ensureBool(req.seroma, 'sero');
  ensureBool(req.infection_signs, 'inf');
  ensureBool(req.staples_removal, 'stap');
  let status;
  if (req.infection_signs || req.healing === 'dehiscing') status = 'post_op_infection_review';
  else if (req.day_postpartum >= 7 && req.site === 'cs_incision' && req.staples_removal === false) status = 'cs_day_7_staples_removal';
  else if (req.seroma) status = 'seroma_aspiration_review';
  else if (req.healing === 'normal' && req.day_postpartum >= 6) status = 'normal_healing_continue';
  else status = 'wound_review';
  return { status, d: req.day_postpartum };
}

function contraception_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.breastfeeding, 'bf');
  ensureEnum(req.preferred, 'pref', ['iud','implant','pill','depo','condom','permanent_tubal','permanent_vasectomy','natural','none','other']);
  ensureBool(req.medical_eligible, 'eligible');
  ensureEnum(req.initiated, 'init', ['at_discharge','planned_2_weeks','planned_6_weeks','planned_3_months','deferred','other']);
  let status;
  if (req.preferred === 'pill' && req.breastfeeding && req.initiated === 'at_discharge') status = 'pill_breastfeeding_change_to_ppop';
  else if (req.preferred === 'iud' && req.initiated === 'planned_6_weeks') status = 'iud_placed_6_weeks_review';
  else if (req.medical_eligible === false) status = 'not_eligible_review_alternative';
  else if (req.preferred === 'permanent_tubal' && req.initiated === 'at_discharge') status = 'tubal_counseling_required_30_days';
  else status = 'contraception_review';
  return { status, p: req.preferred };
}

function funcs() { return { postpartum_hemorrhage, postpartum_depression, puerperal_sepsis, wound_check, contraception_counseling }; }
module.exports = { funcs, ValidationError };