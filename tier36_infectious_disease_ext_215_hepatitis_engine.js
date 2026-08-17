// filepath: tier36_infectious_disease_ext_215_hepatitis_engine.js
// TIER36_INFX-215: Hepatitis A/D/E + chronic B/C management
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hepatitis_a(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.igm_anti_hav, 'igm', ['positive','negative','inconclusive','pending','other']);
  ensureNumber(req.alt, 'alt');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','fulminant','other']);
  ensureEnum(req.vaccination_history, 'vac', ['unvaccinated','partial','complete','unknown','other']);
  ensureEnum(req.treatment, 'rx', ['supportive','hospitalization','none','other']);
  let status;
  if (req.severity === 'fulminant') status = 'fulminant_hep_a_liver_transplant_eval';
  else if (req.severity === 'severe' && req.treatment === 'supportive') status = 'severe_hep_a_hospitalize';
  else if (req.vaccination_history === 'unvaccinated' && req.alt >= 1000) status = 'acute_hep_a_no_vaccination_supportive';
  else status = 'hep_a_review_appropriate';
  return { status, sev: req.severity };
}

function hepatitis_d(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.hbsag, 'hbs', ['positive','negative','not_done']);
  ensureEnum(req.anti_hdv_igm, 'hdv', ['positive','negative','inconclusive','not_done']);
  ensureEnum(req.coinfection, 'coin', ['acute_superinfection','chronic_coinfection','chronic_superinfection','resolved','other']);
  ensureNumber(req.hbv_dna, 'dna');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','fulminant','other']);
  let status;
  if (req.severity === 'fulminant') status = 'hdv_fulminant_liver_transplant_urgent';
  else if (req.coinfection === 'chronic_superinfection' && req.hbv_dna >= 2000) status = 'hdv_superinfection_treat_hbv';
  else if (req.anti_hdv_igm === 'positive' && req.hbsag === 'positive') status = 'hdv_confirmed_monitor_liver';
  else if (req.anti_hdv_igm === 'negative' && req.hbsag === 'positive') status = 'hbsag_positive_hdv_negative_monitor';
  else status = 'hdv_review';
  return { status, c: req.coinfection };
}

function hepatitis_e(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.igm_anti_hev, 'igm', ['positive','negative','inconclusive','pending','other']);
  ensureNumber(req.alt, 'alt');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','chronic','fulminant','other']);
  ensureEnum(req.travel_history, 'travel', ['endemic_area','sporadic','unknown','none','other']);
  ensureEnum(req.treatment, 'rx', ['supportive','ribavirin','hospitalization','none','other']);
  let status;
  if (req.severity === 'chronic' && req.treatment === 'supportive') status = 'chronic_hev_review_ribavirin';
  else if (req.severity === 'fulminant') status = 'fulminant_hev_liver_transplant_eval';
  else if (req.travel_history === 'endemic_area' && req.igm === 'positive') status = 'acute_hev_endemic_exposure_supportive';
  else status = 'hev_review';
  return { status, sev: req.severity };
}

function chronic_hepb_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.hbsag_duration_years, 'yrs');
  ensureNumber(req.hbv_dna, 'dna');
  ensureNumber(req.alt, 'alt');
  ensureEnum(req.liver_biopsy_fibrosis, 'fib', ['f0','f1','f2','f3','f4','unknown','other']);
  ensureEnum(req.treatment_initiated, 'tx', ['tenofovir','entecavir','taf','lamivudine','adefovir','none','other']);
  ensureBool(req.monitoring_6_month, 'mon');
  let status;
  if (req.treatment_initiated === 'none' && req.fibrosis === 'f2' && req.hbv_dna >= 2000) status = 'hbv_f2_dna_active_treat_indicated';
  else if (req.treatment_initiated === 'lamivudine') status = 'lamivudine_obsolete_switch_nucleoside';
  else if (!req.monitoring_6_month) status = 'monitoring_6_month_required';
  else if (req.treatment_initiated === 'tenofovir' && req.monitoring_6_month) status = 'hbv_tenofovir_monitor_continue';
  else status = 'chronic_hepb_review';
  return { status, tx: req.treatment_initiated };
}

function chronic_hepc_daa(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.genotype, 'gen');
  ensureNumber(req.viral_load, 'vl');
  ensureBool(req.cirrhosis, 'cirr');
  ensureEnum(req.regimen, 'reg', ['sofosbuvir_velpatasvir','glecaprevir_pibrentasvir','sofosbuvir_ledipasvir','elbasvir_grazoprevir','sofosbuvir_velpatasvir_voxilaprevir','other','none']);
  ensureNumber(req.duration_weeks, 'dur');
  ensureNumber(req.sustained_virologic_response, 'svr');
  let status;
  if (req.svr >= 12 && req.viral_load >= 0) status = 'svr12_cured';
  else if (req.regimen === 'none') status = 'hcv_no_treatment_active_daa_indicated';
  else if (req.duration_weeks === 12 && req.regimen === 'sofosbuvir_velpatasvir') status = 'hcv_daa_standard_12_week';
  else if (req.cirrhosis && req.duration_weeks === 12) status = 'cirrhosis_consider_24_weeks';
  else status = 'hcv_review';
  return { status, reg: req.regimen };
}

function funcs() { return { hepatitis_a, hepatitis_d, hepatitis_e, chronic_hepb_management, chronic_hepc_daa }; }
module.exports = { funcs, ValidationError };