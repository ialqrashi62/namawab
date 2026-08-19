// filepath: tier123_skin_642_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function skin_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.biopsy_id, 'bid');
  ensureStr(req.lesion_id, 'lid');
  ensureEnum(req.method, 'meth', ['punch','shave','excisional','incisional','other','unknown']);
  ensureNum(req.specimen_size_mm, 'ssm');
  ensureStr(req.provider, 'pr');
  return { bid: req.biopsy_id };
}
function dermoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.derm_id, 'did');
  ensureStr(req.lesion_id, 'lid');
  ensureNum(req.score, 'sc');
  ensureEnum(req.abcd_criteria, 'abcd', ['asymmetric','border','color','differential','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.derm_id };
}
function lesion_excision(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.excise_id, 'eid');
  ensureStr(req.lesion_id, 'lid');
  ensureEnum(req.method, 'meth', ['elliptical','circular','mohs','shave','other','unknown']);
  ensureNum(req.margin_cm, 'mc');
  ensureStr(req.provider, 'pr');
  return { eid: req.excise_id };
}
function patch_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patch_id, 'pid');
  ensureNum(req.allergens_count, 'ac');
  ensureNum(req.reactions, 'rx');
  ensureStr(req.provider, 'pr');
  return { pid: req.patch_id };
}
function cryotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cryo_id, 'cid');
  ensureStr(req.lesion_id, 'lid');
  ensureNum(req.freeze_time_sec, 'fts');
  ensureNum(req.cycles, 'cyc');
  ensureStr(req.provider, 'pr');
  return { cid: req.cryo_id };
}

function funcs() { return { skin_biopsy, dermoscopy, lesion_excision, patch_test, cryotherapy }; }
module.exports = { funcs, ValidationError };