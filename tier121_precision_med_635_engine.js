// filepath: tier121_precision_med_635_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function molecular_tumor_board(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.board_id, 'bid');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.mutations, 'mut');
  ensureNum(req.therapies_reviewed, 'tr');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  return { bid: req.board_id };
}
function targeted_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rx_id, 'rid');
  ensureStr(req.target, 'tgt');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.line_of_therapy, 'lot', ['1st','2nd','3rd','4th+','maintenance','other','unknown']);
  ensureEnum(req.response, 'res', ['complete','partial','stable','progression','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.rx_id };
}
function companion_dx(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dx_id, 'did');
  ensureStr(req.drug, 'drug');
  ensureStr(req.biomarker, 'bm');
  ensureBool(req.required, 'req');
  ensureStr(req.provider, 'pr');
  return { did: req.dx_id };
}
function liquid_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bx_id, 'bid');
  ensureEnum(req.sample_type, 'st', ['blood','csf','pleural','ascites','urine','other','unknown']);
  ensureBool(req.ctdna_detected, 'cd');
  ensureNum(req.variant_allele_freq, 'vaf');
  ensureStr(req.provider, 'pr');
  return { bid: req.bx_id };
}
function minimal_residual(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.mrd_id, 'mid');
  ensureEnum(req.sample_type, 'st', ['bone_marrow','blood','csf','other','unknown']);
  ensureNum(req.sensitivity, 'sens');
  ensureBool(req.positive, 'pos');
  ensureStr(req.provider, 'pr');
  return { mid: req.mrd_id };
}

function funcs() { return { molecular_tumor_board, targeted_therapy, companion_dx, liquid_biopsy, minimal_residual }; }
module.exports = { funcs, ValidationError };