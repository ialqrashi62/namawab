// filepath: tier86_card_ext_454_card_intervention_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cath_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.cath_date, 'cd');
  ensureEnum(req.access_site, 'as', ['radial','femoral','brachial','other','unknown']);
  ensureEnum(req.procedure_type, 'pt', ['diagnostic','diagnostic_with_pci','pci_only','ivus','oct','other','unknown']);
  ensureNum(req.contrast_volume_ml, 'cvm');
  ensureNum(req.fluoroscopy_min, 'fmin');
  ensureEnum(req.complications, 'comp', ['none','bleeding','hematoma','vascular','contrast_nephropathy','dissection','other','unknown']);
  ensureNum(req.post_procedure_creatinine, 'ppcr');
  ensureEnum(req.discharge_dose, 'dd', ['same_day','second_day','observation','admission','transfer','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function pci_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.procedure_type, 'pt', ['des_1v','des_2v','des_3v','bms','bioresorbable','other','unknown']);
  ensureNum(req.vessels_treated, 'vt');
  ensureNum(req.stent_count, 'sc');
  ensureBool(req.dapt_continued, 'dapt');
  ensureNum(req.duration_weeks, 'dur');
  ensureEnum(req.complications, 'comp', ['none','stent_thrombosis','restenosis','dissection','perforation','contrast_nephropathy','bleeding','other','unknown']);
  ensureNum(req.ejection_fraction_post, 'efp');
  ensureEnum(req.functional_status, 'fs', ['asymptomatic','mild_symptoms','stable_angina','unstable_angina','worsening','other','unknown']);
  ensureBool(req.rehab_referral, 'rr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cabg_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.cabiag_date, 'cd');
  ensureNum(req.graft_count, 'gc');
  ensureEnum(req.wound_healing, 'wh', ['complete','partial_complete','delayed','infected','unknown','other']);
  ensureEnum(req.sternum_status, 'ss', ['wired_intact','wired_partial','non_union','dehisced','unknown','other']);
  ensureBool(req.mediastinitis_present, 'mp');
  ensureNum(req.ejection_fraction, 'ef');
  ensureBool(req.aspirin, 'asp');
  ensureBool(req.statin_started, 'ss2');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function structural_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.procedure_type, 'pt', ['tavr','tavi','mitraclip','watchman','mitral_repair','tricuspid_repair','appender','pfo','asd','other','unknown']);
  ensureNum(req.valve_size_mm, 'vsm');
  ensureEnum(req.access, 'acc', ['transfemoral','transapical','transaortic','subclavian','transcaval','other','unknown']);
  ensureEnum(req.complications, 'comp', ['none','paravalvular_leak','heart_block','vascular','pericardial','stroke','other','unknown']);
  ensureNum(req.paravalvular_leak, 'pvl');
  ensureNum(req.grad_mean_mm_hg, 'gmh');
  ensureNum(req.ejection_fraction_post, 'efp');
  ensureEnum(req.functional_status, 'fs', ['improved','stable','worsening','deceased','other','unknown']);
  ensureNum(req.anticoag_duration_weeks, 'adw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function tavr_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureBool(req.procedure_completed, 'pc');
  ensureEnum(req.valve_type, 'vt', ['sapien','corevalve','evolut','portico','navitor','native_neo','surgical_valve','other','unknown']);
  ensureEnum(req.approach, 'app', ['transfemoral','transapical','transaortic','subclavian','other','unknown']);
  ensureEnum(req.residual_aortic_regurgitation, 'rar', ['none','mild','moderate','severe','unknown','other']);
  ensureBool(req.conduction_defect, 'cd');
  ensureBool(req.pacemaker_placed, 'pp');
  ensureBool(req.anticoag_continued, 'ac');
  ensureNum(req.follow_up_echo, 'fue');
  ensureEnum(req.functional_capacity, 'fc', ['excellent','good','fair','poor','deceased','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { cath_followup, pci_followup, cabg_followup, structural_followup, tavr_followup }; }
module.exports = { funcs, ValidationError };