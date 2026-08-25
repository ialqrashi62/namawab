// filepath: tier81_uro_ext_430_uro_onco_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bladder_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.tumor_type, 'tt', ['urothelial','squamous','adenocarcinoma','small_cell','other','unknown']);
  ensureEnum(req.stage, 'stage', ['ta','t1','t2','t3','t4','cis','n_plus','m_plus','unknown']);
  ensureEnum(req.grade, 'gr', ['low','high','unknown','other']);
  ensureEnum(req.treatment, 'tx', ['turbt','intravesical_bcg','intravesical_chemo','cystectomy','chemo','radiation','combination','other','unknown']);
  ensureNum(req.tumor_size_cm, 'ts');
  ensureNum(req.focal_count, 'fc');
  ensureBool(req.cis_present, 'cis');
  ensureBool(req.re_cystoscopy, 'rc');
  ensureBool(req.surgery_planned, 'splan');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function prostate_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.psa, 'psa');
  ensureNum(req.prostate_volume, 'pv');
  ensureEnum(req.gleason_score, 'gs', ['6','3_plus_4','4_plus_3','8','9','10','unknown','other']);
  ensureEnum(req.stage, 'stage', ['t1','t2','t3','t4','n_plus','m_plus','unknown','other']);
  ensureEnum(req.risk_group, 'rg', ['low','favorable_intermediate','unfavorable_intermediate','high','very_high','metastatic','unknown','other']);
  ensureStr(req.treatment, 'tx');
  ensureBool(req.active_surveillance, 'as');
  ensureBool(req.surgical_candidate, 'sc');
  ensureBool(req.referred_radiation_onc, 'rro');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function renal_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.histology, 'hist', ['clear_cell','papillary','chromophobe','translocation','sarcomatoid','collecting_duct','other','unknown']);
  ensureEnum(req.stage, 'stage', ['t1a','t1b','t2a','t2b','t3a','t3b','t3c','t4','n_plus','m_plus','unknown']);
  ensureEnum(req.treatment, 'tx', ['surveillance','ablation','partial','radical','immunotherapy','tki','combination','other','unknown']);
  ensureNum(req.tumor_size_cm, 'ts');
  ensureBool(req.metastases_present, 'mp');
  ensureEnum(req.performance_status, 'ps', ['kps_90_plus','kps_80','kps_70','kps_60','kps_50','kps_lt_50','unknown','other']);
  ensureBool(req.surgical_candidate, 'sc');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function testicular_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureEnum(req.histology, 'hist', ['seminoma','embryonal','yolk_sac','teratoma','choriocarcinoma','mixed','other','unknown']);
  ensureNum(req.pre_op_ldh, 'ldh');
  ensureNum(req.pre_op_afp, 'afp');
  ensureNum(req.pre_op_bhcg, 'bhcg');
  ensureStr(req.stage, 'stage');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.fertility_preserved, 'fp');
  ensureEnum(req.prosthesis, 'pros', ['none','saline','silicone','deferred','unknown']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function uro_chemo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cancer_type, 'ct', ['bladder','urothelial','renal','prostate','testicular','upper_tract','other']);
  ensureEnum(req.regimen, 'reg', ['gemcitabine_cisplatin','dose_dense_mvac','dd_mvac','gem_carbo','paclitaxel','docetaxel','cabozantinib','pazopanib','sunitinib','temsirolimus','other','unknown']);
  ensureNum(req.cycle_number, 'cn');
  ensureNum(req.dose_reduction, 'dr');
  ensureBool(req.toxicity, 'tox');
  ensureEnum(req.toxicity_grade, 'tg', ['g1','g2','g3','g4','g5','unknown','none']);
  ensureNum(req.neutrophil_count, 'nc');
  ensureNum(req.creatinine, 'cr');
  ensureStr(req.treatment_response, 'tr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { bladder_cancer, prostate_cancer, renal_cancer, testicular_cancer, uro_chemo }; }
module.exports = { funcs, ValidationError };