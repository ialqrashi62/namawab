// filepath: tier90_genetics_cancer_473_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cancer_genetic_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.cancer_history, 'ch');
  ensureNum(req.affected_relatives, 'ar');
  ensureNum(req.age_at_diagnosis, 'aad');
  ensureBool(req.counseling_done, 'cd');
  ensureEnum(req.genetic_test_ordered, 'gto', ['brca1_brca2','lynch_panel','multiple','none','pending','declined','other','unknown']);
  ensureBool(req.family_pedigree, 'fp');
  ensureEnum(req.risk_category, 'rc', ['average','moderate','high','very_high','unknown','other']);
  ensureNum(req.risk_percentage, 'rp');
  ensureEnum(req.screening_plan, 'sp', ['standard','intensified','preventive_surgery','none','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function brca_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.counseling_id, 'cid');
  ensureBool(req.family_history_breast, 'fhb');
  ensureBool(req.family_history_ovarian, 'fho');
  ensureBool(req.personal_history_breast, 'phb');
  ensureNum(req.ashkenazi_jewish, 'aj');
  ensureBool(req.male_breast_cancer, 'mbc');
  ensureBool(req.bilateral_breast, 'bbc');
  ensureEnum(req.brca_result, 'br', ['positive','negative','vus','pending','declined','other','unknown','none']);
  ensureNum(req.prophylaxis_options, 'po');
  ensureStr(req.provider, 'pr');
  return { cid: req.counseling_id };
}
function lynch_syndrome(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.colorectal_cancer, 'crc');
  ensureBool(req.endometrial_cancer, 'ec');
  ensureBool(req.ovarian_cancer, 'oc');
  ensureBool(req.gastric_cancer, 'gc');
  ensureBool(req.small_bowel_cancer, 'sbc');
  ensureNum(req.amsterdam_criteria, 'ac');
  ensureNum(req.revised_bethesda, 'rb');
  ensureBool(req.mmr_testing, 'mmr');
  ensureEnum(req.mmr_result, 'mr', ['msi_high','msi_low','mss','pending','declined','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function prenatal_genetics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.screening_type, 'st', ['cf_dna','first_trimester','quad_screen','amniocentesis','cvs','nuchal_translucency','cell_free_dna','other','unknown']);
  ensureNum(req.maternal_age, 'ma');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureBool(req.high_risk_flag, 'hrf');
  ensureEnum(req.result, 'res', ['low_risk','high_risk','abnormal','normal','inconclusive','pending','other','unknown']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function carrier_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.panel_id, 'pid');
  ensureEnum(req.panel_type, 'pt', ['basic','expanded','ethnic_specific','jewish','punjabi','other','unknown']);
  ensureBool(req.cystic_fibrosis_carrier, 'cfc');
  ensureBool(req.sickle_cell_carrier, 'scc');
  ensureBool(req.tay_sachs_carrier, 'tsc');
  ensureNum(req.total_carriers_found, 'tcf');
  ensureEnum(req.counseling_offered, 'co', ['yes','no','declined','pending','other','unknown']);
  ensureNum(req.tested_conditions, 'tc');
  ensureStr(req.provider, 'pr');
  return { pid: req.panel_id };
}

function funcs() { return { cancer_genetic_counseling, brca_counseling, lynch_syndrome, prenatal_genetics, carrier_screening }; }
module.exports = { funcs, ValidationError };
