// filepath: tier95_hepatology_viral_498_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hcv_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.hcv_genotype, 'gt', ['1','1a','1b','2','3','4','5','6','mixed','unknown','other']);
  ensureNum(req.hcv_rna, 'rna');
  ensureNum(req.alt, 'alt');
  ensureNum(req.ast, 'ast');
  ensureNum(req.bilirubin, 'bil');
  ensureNum(req.albumin, 'alb');
  ensureNum(req.fibroscan_kpa, 'fk');
  ensureBool(req.hiv_coinfection, 'hiv');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hcv_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureEnum(req.regimen, 'reg', ['sof_led','sof_vel','gle_cap','elb_graz','par_rit_omb','other','unknown','none']);
  ensureNum(req.duration_weeks, 'dur');
  ensureEnum(req.week_4_rna, 'w4', ['undetectable','detectable','quantifiable','pending','other','unknown','none']);
  ensureBool(req.sustained_virologic_response, 'svr');
  ensureBool(req.treatment_completed, 'tc');
  ensureNum(req.adherence_pct, 'adh');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function hbv_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.hbsag, 'hbs', ['positive','negative','pending','other','unknown']);
  ensureEnum(req.hbeag, 'hbe', ['positive','negative','pending','other','unknown']);
  ensureEnum(req.anti_hbe, 'ahbe', ['positive','negative','pending','other','unknown']);
  ensureEnum(req.hbcab_igm, 'hbi', ['positive','negative','pending','other','unknown']);
  ensureNum(req.hbv_dna, 'dna');
  ensureNum(req.alt, 'alt');
  ensureNum(req.fibroscan_kpa, 'fk');
  ensureBool(req.family_history, 'fh');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hbv_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureEnum(req.nucleoside, 'nuc', ['tenofovir','entecavir','lamivudine','adefovir','telbivudine','other','unknown','none']);
  ensureNum(req.treatment_duration_months, 'tdm');
  ensureBool(req.hbeag_seroconversion, 'hsc');
  ensureBool(req.hbv_dna_undetectable, 'hdu');
  ensureBool(req.alt_normalization, 'an');
  ensureEnum(req.renal_function, 'rf', ['stable','declining','impaired','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function hepatitis_vaccination(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vaccination_id, 'vid');
  ensureEnum(req.vaccine, 'vac', ['hepatitis_a','hepatitis_b','combined_ab','other','unknown']);
  ensureNum(req.doses_completed, 'dc');
  ensureNum(req.anti_hbs_titer, 'ttr');
  ensureBool(req.booster_needed, 'bn');
  ensureBool(req.non_responder, 'nr');
  ensureNum(req.vaccine_age, 'va');
  ensureStr(req.provider, 'pr');
  return { vid: req.vaccination_id };
}

function funcs() { return { hcv_assessment, hcv_treatment, hbv_assessment, hbv_treatment, hepatitis_vaccination }; }
module.exports = { funcs, ValidationError };
