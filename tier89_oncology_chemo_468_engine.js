// filepath: tier89_oncology_chemo_468_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chemotherapy_regimen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureEnum(req.regimen, 'reg', ['folfox','folfiri','ac','chop','rchop','abvd','r_abvd','bevacizumab','paclitaxel','capecitabine','cisplatin','other','unknown']);
  ensureNum(req.cycle_number, 'cn');
  ensureNum(req.dose_mg_m2, 'dm');
  ensureNum(req.height_cm, 'h');
  ensureNum(req.weight_kg, 'w');
  ensureNum(req.bsa, 'bsa');
  ensureEnum(req.dose_intensity, 'di', ['full','reduced','escalated','held','other']);
  ensureNum(req.premedications, 'pre');
  ensureEnum(req.toxicity_grade, 'tg', ['0','1','2','3','4','unknown']);
  ensureEnum(req.efficacy_response, 'er', ['complete_response','partial_response','stable','progression','mixed','unknown','other']);
  ensureNum(req.next_cycle_days, 'nc');
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}
function cycle_count(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.record_id, 'rid');
  ensureNum(req.total_cycles_planned, 'tcp');
  ensureNum(req.cycles_completed, 'cc');
  ensureNum(req.cycles_delayed, 'cd');
  ensureNum(req.cycles_reduced, 'crm');
  ensureBool(req.completed, 'done');
  ensureEnum(req.termination_reason, 'tr', ['completed','progression','toxicity','patient_choice','death','other','unknown']);
  ensureNum(req.cumulative_dose_mg_m2, 'cdd');
  ensureNum(req.time_on_therapy_weeks, 'tot');
  ensureBool(req.response_evaluation, 're');
  ensureStr(req.imaging_modality, 'im');
  ensureStr(req.provider, 'pr');
  return { rid: req.record_id };
}
function dose_intensity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.planned_dose_mg, 'pd');
  ensureNum(req.actual_dose_mg, 'ad');
  ensureNum(req.planned_interval_days, 'pi');
  ensureNum(req.actual_interval_days, 'ai');
  ensureNum(req.relative_dose_intensity, 'rdi');
  ensureBool(req.g_csf_used, 'gcsf');
  ensureEnum(req.reduction_reason, 'rr', ['neutropenia','thrombocytopenia','anemia','mucositis','diarrhea','neuropathy','renal','hepatic','patient_choice','other','none','unknown']);
  ensureNum(req.wbc_nadir, 'wn');
  ensureNum(req.anc_nadir, 'an');
  ensureNum(req.platelet_nadir, 'pn');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function toxicity_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.toxicity_type, 'tt', ['hematologic','gi','neuropathy','renal','cardiac','pulmonary','hepatic','dermatologic','fatigue','other','unknown']);
  ensureEnum(req.ctcae_grade, 'cg', ['0','1','2','3','4','5','unknown']);
  ensureBool(req.dose_modified, 'dm');
  ensureNum(req.symptom_score, 'ss');
  ensureBool(req.hospitalization, 'hosp');
  ensureNum(req.hospital_days, 'hd');
  ensureBool(req.iv_support, 'ivs');
  ensureNum(req.g_csf_days, 'gcsf');
  ensureNum(req.antibiotic_days, 'ab');
  ensureBool(req.recovery_complete, 'rec');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function efficacy_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.scan_id, 'sid');
  ensureEnum(req.recist_response, 'rr', ['cr','pr','sd','pd','ne','unknown']);
  ensureNum(req.target_lesions_sum_mm, 'tls');
  ensureNum(req.percent_change, 'pc');
  ensureBool(req.new_lesions, 'nl');
  ensureEnum(req.imaging_modality, 'im', ['ct','mri','pet_ct','pet_mri','ultrasound','xray','other','unknown']);
  ensureNum(req.scan_interval_weeks, 'si');
  ensureNum(req.tumor_marker_change, 'tmc');
  ensureEnum(req.mark_response, 'mr', ['responding','stable','progressing','mixed','unknown','other']);
  ensureBool(req.clinical_progression, 'cp');
  ensureStr(req.provider, 'pr');
  return { sid: req.scan_id };
}

function funcs() { return { chemotherapy_regimen, cycle_count, dose_intensity, toxicity_assessment, efficacy_imaging }; }
module.exports = { funcs, ValidationError };
