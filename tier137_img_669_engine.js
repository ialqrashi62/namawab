// filepath: tier137_img_669_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cnn_inference(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.image_id, 'iid');
  ensureEnum(req.modality, 'md', ['XRAY','CT','MRI','US','OCT','pathology','derm','retinal','mammo','endo']);
  ensureStr(req.model, 'mo');
  ensureNum(req.confidence, 'cf');
  ensureStr(req.prediction, 'pr');
  ensureStr(req.heatmap_id, 'hm');
  return { inf_id: `cnn_${Date.now()}`, image_id: req.image_id, modality: req.modality, prediction: req.prediction, confidence: req.confidence };
}
function lesion_detect(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.image_id, 'iid');
  ensureEnum(req.lesion_type, 'lt', ['mass','nodule','calcification','hemorrhage','infarct','fracture','effusion','consolidation','edema','atelectasis','cardiomegaly','pneumothorax']);
  ensureNum(req.size_mm, 'sz');
  ensureNum(req.confidence, 'cf');
  ensureBool(req.malignant, 'mg');
  ensureStr(req.location, 'lc');
  return { les_id: `lds_${Date.now()}`, image_id: req.image_id, lesion: req.lesion_type, size: req.size_mm };
}
function segmentation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.image_id, 'iid');
  ensureEnum(req.target, 'tg', ['organ','tumor','vessel','bone','tissue','tumor_core','edema','lumen','lesion']);
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.confidence, 'cf');
  ensureBool(req.completed, 'cp');
  ensureStr(req.model, 'md');
  return { seg_id: `seg_${Date.now()}`, image_id: req.image_id, target: req.target, volume: req.volume_ml };
}
function registration(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.image_id, 'iid');
  ensureStr(req.reference_id, 'rf');
  ensureNum(req.dice_score, 'ds');
  ensureNum(req.hausdorff_mm, 'hd');
  ensureEnum(req.method, 'mt', ['rigid','affine','deformable','B_spline','demons','LDDMM','SyN','NiftyReg']);
  ensureNum(req.duration_sec, 'du');
  return { reg_id: `reg_${Date.now()}`, image_id: req.image_id, reference: req.reference_id, dice: req.dice_score };
}
function triage(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.image_id, 'iid');
  ensureEnum(req.priority, 'pr', ['STAT','urgent','routine','low']);
  ensureNum(req.confidence, 'cf');
  ensureStr(req.finding, 'fi');
  ensureEnum(req.worklist, 'wl', ['critical','oncology','neurology','cardiology','trauma','body','msk','other']);
  ensureStr(req.assigned_to, 'at');
  return { trg_id: `trg_${Date.now()}`, image_id: req.image_id, priority: req.priority, worklist: req.worklist };
}

function funcs() { return { cnn_inference, lesion_detect, segmentation, registration, triage }; }
module.exports = { funcs, ValidationError };
