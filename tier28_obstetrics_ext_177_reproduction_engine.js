// filepath: tier28_obstetrics_ext_177_reproduction_engine.js
// TIER28_OBSTETRICS-177: Reproductive endocrinology, infertility, IVF
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function infertility(req) {
  ensureStr(req.couple_id, 'couple_id');
  ensureNumber(req.months_trying, 'months');
  ensureEnum(req.factor, 'factor', ['female_anovulation','female_tubal','female_endometriosis','female_age','male_factor','unexplained','combination','unknown','other']);
  ensureBool(req.workup_started, 'workup');
  ensureBool(req.partner_evaluated, 'partner');
  ensureEnum(req.referral, 'referral', ['none','re','ob_gyn','urology','genetics','other']);
  let status;
  if (req.months_trying < 12 && req.factor === 'unexplained') status = 'unexplained_less_12m_wait_review';
  else if (!req.partner_evaluated) status = 'partner_evaluation_required';
  else if (!req.workup_started) status = 'workup_required';
  else if (req.factor === 'female_age' && req.referral === 'none') status = 'age_related_re_referral_urgent';
  else status = 'infertility_reviewed';
  return { status, f: req.factor };
}

function ivf_cycle(req) {
  ensureStr(req.cycle_id, 'cycle_id');
  ensureEnum(req.protocol, 'protocol', ['long_gnrh','short_gnrh','antagonist','mild','natural','mini_ivf','frozen','other']);
  ensureNumber(req.days_stimulation, 'days');
  ensureNumber(req.peak_e2, 'e2');
  ensureNumber(req.eggs_retrieved, 'eggs');
  ensureNumber(req.eggs_fertilized, 'fertilized');
  ensureNumber(req.blastocysts, 'blast');
  let status;
  if (req.eggs_retrieved > 25) status = 'ohss_risk_freeze_all';
  else if (req.peak_e2 > 5000) status = 'peak_e2_high_ohss_risk_cabergoline';
  else if (req.eggs_fertilized < 4) status = 'low_fertilization_review';
  else status = 'ivf_progressing';
  return { status, eggs: req.eggs_retrieved };
}

function transfer(req) {
  ensureStr(req.transfer_id, 'transfer_id');
  ensureEnum(req.day, 'day', ['day_3','day_5','day_6','day_7','other']);
  ensureNumber(req.endometrial_thickness_mm, 'em');
  ensureNumber(req.embryos_transferred, 'transferred');
  ensureBool(req.single_embryo_transfer, 'set');
  ensureEnum(req.quality, 'quality', ['euploid_high','euploid_good','mosaic','aneuploid','unknown','other']);
  ensureNumber(req.beta_hcg_12d, 'beta');
  let status;
  if (req.transferred > 1 && !req.set) status = 'multiple_embryos_set_recommended';
  else if (req.endometrial_thickness_mm < 7) status = 'em_too_thin_receptivity_review';
  else if (req.beta_hcg_12d > 100) status = 'positive_pregnancy_test_followup';
  else if (req.quality === 'aneuploid') status = 'aneuploid_transfer_low_success_review';
  else status = 'transfer_appropriate';
  return { status, d: req.day };
}

function ovulation(req) {
  ensureStr(req.cycle_id, 'cycle_id');
  ensureEnum(req.method, 'method', ['natural','timed_intercourse','letrozole','clomiphene','gonadotropins','trigger','iui','other']);
  ensureNumber(req.cycle_day, 'cd');
  ensureNumber(req.dominant_follicle_mm, 'follicle');
  ensureNumber(req.endometrial_thickness_mm, 'em');
  ensureEnum(req.response, 'response', ['adequate','suboptimal','hyper_response','poor_response','unknown','other']);
  let status;
  if (req.response === 'hyper_response' && req.follicle > 24) status = 'hyper_response_ohss_risk_review';
  else if (req.response === 'poor_response' && req.follicle < 14) status = 'poor_response_cycle_review';
  else if (req.follicle >= 18 && req.endometrial_thickness_mm >= 7) status = 'ovulation_induction_adequate_trigger';
  else status = 'ovulation_reviewed';
  return { status, m: req.method };
}

function miscarriage(req) {
  ensureStr(req.event_id, 'event_id');
  ensureEnum(req.type, 'type', ['threatened','inevitable','incomplete','complete','missed','recurrent','chemical','other']);
  ensureNumber(req.gestational_age_weeks, 'gw');
  ensureBool(req.rh_status, 'rh');
  ensureBool(req.rhogam_given, 'rhogam');
  ensureBool(req.workup_started, 'workup');
  let status;
  if (req.type === 'incomplete' || req.type === 'missed') status = 'incomplete_or_missed_d_and_c_or_expectant';
  else if (req.rh === false && !req.rhogam_given) status = 'rh_negative_rhogam_required';
  else if (req.type === 'recurrent' && !req.workup_started) status = 'recurrent_loss_workup_required';
  else status = 'miscarriage_reviewed';
  return { status, t: req.type };
}

const CITATIONS = { ASRM_2024: 'ASRM 2024', ESHRE_2024: 'ESHRE 2024' };

function funcs() { return { infertility, ivf_cycle, transfer, ovulation, miscarriage }; }
module.exports = { funcs, CITATIONS, ValidationError };