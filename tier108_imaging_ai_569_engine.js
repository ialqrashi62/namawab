// filepath: tier108_imaging_ai_569_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ai_detection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.finding_id, 'fid');
  ensureEnum(req.modality, 'mod', ['ct','mri','xray','ultrasound','pet','mammography','other','unknown']);
  ensureEnum(req.ai_model, 'aim', ['lung_nodule','breast_cancer','fracture','hemorrhage','stroke','pneumonia','other','unknown']);
  ensureNum(req.detection_count, 'dc');
  ensureNum(req.confidence, 'conf');
  ensureNum(req.true_positives, 'tp');
  ensureNum(req.false_positives, 'fp');
  ensureStr(req.provider, 'pr');
  return { fid: req.finding_id };
}
function image_segmentation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.segment_id, 'sid');
  ensureEnum(req.modality, 'mod', ['ct','mri','xray','ultrasound','pet','other','unknown']);
  ensureStr(req.anatomy, 'ant');
  ensureNum(req.target_volume_ml, 'tvm');
  ensureNum(req.dice_score, 'ds');
  ensureNum(req.hausdorff_mm, 'hd');
  ensureNum(req.reviewer_corrections, 'rc');
  ensureStr(req.provider, 'pr');
  return { sid: req.segment_id };
}
function classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.class_id, 'cid');
  ensureEnum(req.task, 'tsk', ['benign_vs_malignant','normal_vs_abnormal','risk_stratification','severity_grading','other','unknown']);
  ensureEnum(req.classifier, 'cls', ['random_forest','xgboost','neural_net','svm','logistic','other','unknown']);
  ensureNum(req.accuracy, 'acc');
  ensureNum(req.sensitivity, 'sens');
  ensureNum(req.specificity, 'spec');
  ensureNum(req.auc, 'auc');
  ensureStr(req.provider, 'pr');
  return { cid: req.class_id };
}
function computer_aided_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.diagnosis_id, 'did');
  ensureEnum(req.modality, 'mod', ['ct','mri','xray','ultrasound','pet','other','unknown']);
  ensureEnum(req.type, 'tp', ['nodule_classification','lesion_detection','characterization','staging','other','unknown']);
  ensureNum(req.likelihood_cancer, 'lc');
  ensureBool(req.biopsy_recommended, 'br');
  ensureNum(req.follow_up_months, 'fum');
  ensureStr(req.provider, 'pr');
  return { did: req.diagnosis_id };
}
function radiomics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureStr(req.lesion_id, 'lid');
  ensureNum(req.features_extracted, 'fe');
  ensureNum(req.imaging_features_pyradiomics, 'ifp');
  ensureNum(req.model_performance, 'mp');
  ensureEnum(req.validation_dataset, 'vd', ['internal','external','temporal','multi_center','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}

function funcs() { return { ai_detection, image_segmentation, classification, computer_aided_diagnosis, radiomics }; }
module.exports = { funcs, ValidationError };