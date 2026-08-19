// filepath: tier82_obgyn_ext_435_obgyn_onc_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cervical_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureEnum(req.pap_smear_result, 'ps', ['negative','ascus','lsil','hsil','asc_h','agc','ais','squamous','glandular','unsatisfactory','unknown','other']);
  ensureEnum(req.hpv_test, 'ht', ['positive','negative','not_done','unknown','inconclusive']);
  ensureEnum(req.hpv_strain, 'hs', ['hpv16','hpv18','other_high_risk','low_risk','negative','not_typed','unknown']);
  ensureBool(req.colposcopy_done, 'cd');
  ensureStr(req.colposcopy_findings, 'cf');
  ensureBool(req.biopsy_done, 'bd');
  ensureEnum(req.biopsy_result, 'br', ['normal','cin1','cin2','cin3','cis','cancer','inadequate','unknown','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function ovarian_cyst(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureNum(req.cyst_size_cm, 'cs');
  ensureEnum(req.complexity, 'cx', ['simple','complex','hemorrhagic','endometrioma','dermoid','malignant_suspicious','unknown']);
  ensureNum(req.ca125, 'ca125');
  ensureNum(req.roma_score, 'roma');
  ensureBool(req.mri_done, 'mri');
  ensureEnum(req.management, 'mg', ['monitor','medical','surgical_urgent','surgical_elective','refer_onc','other','observation']);
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function endometrial_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.bmi, 'bmi');
  ensureNum(req.endometrial_thickness_mm, 'etm');
  ensureBool(req.postmenopausal_bleeding, 'pmb');
  ensureBool(req.diabetes, 'dm');
  ensureBool(req.lynch_syndrome, 'ls');
  ensureEnum(req.stage, 'stage', ['ia','ib','ii','iiia','iiib','iiic1','iiic2','iv','unknown','other']);
  ensureEnum(req.grade, 'gr', ['g1','g2','g3','g4','unknown']);
  ensureStr(req.treatment, 'tx');
  ensureBool(req.surgery_planned, 'splan');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function cervical_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.stage, 'stage', ['ia1','ia2','ib1','ib2','ib3','iia','iib','iii','iva','ivb','unknown','other']);
  ensureEnum(req.subtype, 'sub', ['squamous','adenocarcinoma','adenosquamous','neuroendocrine','small_cell','unknown']);
  ensureBool(req.hpv_related, 'hpv');
  ensureEnum(req.treatment, 'tx', ['surgery','chemo_radiation','radiation','chemo','combination','palliative','surveillance','other']);
  ensureBool(req.surgery_planned, 'splan');
  ensureBool(req.fertility_sparing, 'fs');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function brca_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureStr(req.family_history, 'fh');
  ensureNum(req.brca_test_status, 'bts');
  ensureEnum(req.gene_mutated, 'gm', ['brca1','brca2','unknown','negative','pending','other']);
  ensureNum(req.lifetime_cancer_risk, 'lcr');
  ensureEnum(req.management, 'mg', ['surveillance','chemoprevention','risk_reducing_surgery','combination','observation','other']);
  ensureBool(req.referred_genetic_counselor, 'rgc');
  ensureStr(req.counseling_complete, 'cc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { cervical_screening, ovarian_cyst, endometrial_cancer, cervical_cancer, brca_counseling }; }
module.exports = { funcs, ValidationError };