// filepath: tier36_infectious_disease_ext_213_hiv_engine.js
// TIER36_INFX-213: HIV
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hiv_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.test_type, 'type', ['fourth_gen_ag_ab','third_gen_antibody','rapid_test','rna_pcr','western_blot','other']);
  ensureEnum(req.result, 'res', ['reactive','non_reactive','indeterminate','positive','negative','other']);
  ensureEnum(req.confirmation, 'conf', ['positive','negative','pending','inconclusive','other']);
  ensureNumber(req.cd4, 'cd4');
  ensureNumber(req.viral_load, 'vl');
  ensureEnum(req.stage, 'stage', ['acute','chronic','advanced','aids','unknown','other']);
  let status;
  if (req.confirmation === 'positive' && req.cd4 < 200) status = 'aids_defining_oi_prophylaxis';
  else if (req.confirmation === 'positive' && req.cd4 >= 200) status = 'hiv_confirmed_art_eligible';
  else if (req.test_type === 'rna_pcr' && req.result === 'reactive') status = 'acute_hiv_confirmed_urgent_art';
  else if (req.confirmation === 'pending') status = 'confirmation_pending_follow_up';
  else if (req.confirmation === 'inconclusive') status = 'inconclusive_retest_2_weeks';
  else status = 'hiv_diagnosis_review';
  return { status, stage: req.stage };
}

function art_initiation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.cd4, 'cd4');
  ensureEnum(req.regimen, 'reg', ['bictegravir_tenofovir_lamivudine','dolutegravir_abacavir_lamivudine','dolutegravir_tenofovir_lamivudine','efavirenz_tenofovir_emtricitabine','other']);
  ensureEnum(req.baseline_resistance, 'res', ['none','nnrti','nrti','pi','integrase','multi','pending','other']);
  ensureEnum(req.side_effects, 'se', ['none','gi','rash','cns','renal','bone','hepatic','other']);
  ensureEnum(req.adherence_plan, 'adh', ['pillbox','family_support','case_manager','observed','self','other']);
  let status;
  if (req.side_effects !== 'none') status = 'art_side_effect_review_management';
  else if (req.cd4 < 200) status = 'art_initiated_oi_prophylaxis_add';
  else if (req.regimen.includes('bictegravir') || req.regimen.includes('dolutegravir')) status = 'art_first_line_initiated';
  else if (req.baseline_resistance !== 'none') status = 'resistance_review_regimen_choice';
  else status = 'art_review_appropriate';
  return { status, reg: req.regimen };
}

function viral_load_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.viral_load, 'vl');
  ensureNumber(req.cd4, 'cd4');
  ensureBool(req.suppressed, 'sup');
  ensureEnum(req.monitoring_interval, 'int', ['3_month','6_month','12_month','monthly','other']);
  ensureBool(req.resistance_concern, 'res');
  let status;
  if (!req.suppressed && req.viral_load >= 200) status = 'viral_failure_adherence_resistance_test';
  else if (!req.suppressed && req.viral_load < 200) status = 'low_level_viremia_monitor';
  else if (req.resistance_concern) status = 'resistance_concern_genotype_test';
  else if (req.suppressed && req.cd4 >= 350) status = 'suppressed_continue_6_month';
  else status = 'vl_monitoring_review';
  return { status, vl: req.viral_load };
}

function opportunistic_infection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.oi_type, 'oi', ['pjp','toxoplasmosis','crypto','mac','cmv','histoplasma','tb','other']);
  ensureNumber(req.cd4, 'cd4');
  ensureEnum(req.prophylaxis, 'pro', ['tmp_smx','pentamidine','azithromycin','valganciclovir','fluconazole','none','other']);
  ensureEnum(req.treatment_active, 'rx', ['iv_tmp_smx','oral_tmp_smx','pentamidine','atovaquone','ganciclovir','fluconazole','none','other']);
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','unknown']);
  let status;
  if (req.cd4 < 200 && req.prophylaxis === 'none' && req.oi_type === 'pjp') status = 'pjp_no_prophylaxis_initiate';
  else if (req.oi_type === 'cmv' && req.treatment_active === 'none') status = 'cmv_active_urgent_treatment';
  else if (req.response === 'worsening') status = 'oi_worsening_review_alternative';
  else if (req.response === 'improving') status = 'oi_improving_continue_treatment';
  else status = 'oi_review_appropriate';
  return { status, oi: req.oi_type };
}

function hiv_prep(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.risk_assessment, 'risk', ['low','moderate','high','very_high']);
  ensureEnum(req.prep_regimen, 'reg', ['tenofovir_emtricitabine','tenofovir_emtricitabine_descovy','injectable_cabotegravir','none','other']);
  ensureBool(req.baseline_hiv_negative, 'baseline');
  ensureBool(req.follow_up_3_months, 'fup');
  let status;
  if (!req.baseline_hiv_negative) status = 'prep_baseline_hiv_positive_do_not_start';
  else if (req.risk_assessment === 'high' && req.prep_regimen === 'none') status = 'high_risk_initiate_prep';
  else if (!req.follow_up_3_months) status = 'prep_follow_up_required_quarterly';
  else if (req.prep_regimen.includes('cabotegravir')) status = 'long_acting_prep_initiated';
  else status = 'prep_review_appropriate';
  return { status, reg: req.prep_regimen };
}

function funcs() { return { hiv_diagnosis, art_initiation, viral_load_monitoring, opportunistic_infection, hiv_prep }; }
module.exports = { funcs, ValidationError };