// filepath: tier83_derm_ext_439_derm_onc_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function melanoma_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.lesion_location, 'll');
  ensureNum(req.breslow_depth_mm, 'bd');
  ensureNum(req.clark_level, 'cl');
  ensureBool(req.ulceration, 'ul');
  ensureNum(req.mitotic_rate, 'mr');
  ensureEnum(req.t_stage, 'ts', ['t1','t2','t3','t4','in_situ','unknown']);
  ensureEnum(req.breslow_grade, 'bg', ['lt1mm','1to2mm','2to4mm','gt4mm','in_situ','unknown']);
  ensureEnum(req.braf_status, 'bs', ['v600e','v600k','wild_type','unknown','pending']);
  ensureStr(req.treatment, 'tx');
  ensureStr(req.surgical_margin, 'sm');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function bcc_scc(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cancer_type, 'ct', ['bcc','scc','other','unknown']);
  ensureEnum(req.subtype, 'sub', ['nodular','superficial','morpheaform','infiltrative','micronodular','keratoacanthomatous','verrucous','adenosquamous','desmoplastic','unknown']);
  ensureNum(req.tumor_size_cm, 'ts');
  ensureEnum(req.location, 'loc', ['head_neck','trunk','extremity','genital','hand','foot','other','unknown']);
  ensureBool(req.recurrent, 'rec');
  ensureEnum(req.treatment, 'tx', ['mohs','excision','electrodesiccation','cryo','radiation','vismodegib','sonidegib','cemiplimab','observation','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.pathology, 'path');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function lymphoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type, 't', ['mycosis_fungoides','sezary_syndrome','primary_cutaneous_bcell','primary_cutaneous_cd30','cd8_cytotoxic','other','unknown']);
  ensureEnum(req.stage, 'stage', ['ia','ib','iia','iib','iiia','iiib','iva','ivb','unknown']);
  ensureStr(req.skin_findings, 'sf');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.radiation_consult, 'rc');
  ensureBool(req.systemic_therapy, 'st');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function keratinocyte(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.skin_type, 'st');
  ensureNum(req.actinic_keratoses_count, 'akc');
  ensureNum(req.non_melanoma_history, 'nmh');
  ensureBool(req.sunscreen_use, 'su');
  ensureBool(req.field_treatment_done, 'ftd');
  ensureStr(req.field_treatment_type, 'ftt');
  ensureBool(req.chemo_prevention, 'cp');
  ensureStr(req.surveillance_plan, 'sp');
  ensureBool(req.solid_organ_transplant, 'sot');
  ensureStr(req.immunosuppression, 'ims');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function derm_chemo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cancer_type, 'ct', ['melanoma','bcc','scc','lymphoma','other','unknown']);
  ensureEnum(req.regimen, 'reg', ['pembrolizumab','nivolumab','dabrafenib_trametinib','vemurafenib_cobimetinib','ipilimumab_nivolumab','cemiplimab','vismodegib','sonidegib','talimogene','other']);
  ensureNum(req.cycle_number, 'cn');
  ensureEnum(req.complications, 'comp', ['none','colitis','hepatitis','thyroid','dermatitis','pneumonitis','other','unknown']);
  ensureNum(req.neutrophil_count, 'nc');
  ensureBool(req.admission_required, 'ar');
  ensureStr(req.treatment_response, 'tr');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { melanoma_eval, bcc_scc, lymphoma, keratinocyte, derm_chemo }; }
module.exports = { funcs, ValidationError };