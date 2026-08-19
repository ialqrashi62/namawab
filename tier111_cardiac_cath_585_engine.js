// filepath: tier111_cardiac_cath_585_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function diagnostic_cath(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['chest_pain','stemi','nstemi','valve','cardiomyopathy','other','unknown']);
  ensureEnum(req.approach, 'app', ['radial','femoral','brachial','other','unknown']);
  ensureNum(req.contrast_volume, 'cv');
  ensureNum(req.fluoroscopy_min, 'fm');
  ensureNum(req.left_main_pct, 'lmp');
  ensureNum(req.lad_pct, 'lad');
  ensureNum(req.rca_pct, 'rca');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function intervention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.intervention_id, 'iid');
  ensureStr(req.vessel, 'vs');
  ensureNum(req.stenosis_pct, 'sp');
  ensureEnum(req.device, 'dev', ['drug_eluting_stent','bare_metal_stent','balloon','cutting_balloon','rotablation','other','unknown','none']);
  ensureNum(req.stents, 'sts');
  ensureNum(req.complications, 'comp');
  ensureEnum(req.outcome, 'out', ['successful','failed','complicated','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { iid: req.intervention_id };
}
function pci(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.target, 'tgt');
  ensureEnum(req.approach, 'app', ['radial','femoral','other','unknown']);
  ensureEnum(req.stent_type, 'stt', ['des','bms','bioabsorbable','other','unknown','none']);
  ensureNum(req.stent_size_mm, 'ssm');
  ensureNum(req.duration_min, 'dur');
  ensureBool(req.success, 'succ');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function thrombectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.vessel, 'vs');
  ensureBool(req.thrombus, 'thr');
  ensureBool(req.aspiration, 'asp');
  ensureBool(req.stent_deployed, 'sd');
  ensureEnum(req.outcome, 'out', ['successful','partial','failed','complicated','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function structural(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.type, 'tp', ['tavr','mitraclip','tmvr','watchman','pfo_closure','other','unknown']);
  ensureEnum(req.approach, 'app', ['transfemoral','transapical','transseptal','other','unknown']);
  ensureNum(req.valve_size_mm, 'vsm');
  ensureNum(req.complications, 'comp');
  ensureEnum(req.outcome, 'out', ['implanted','deployed','failed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { diagnostic_cath, intervention, pci, thrombectomy, structural }; }
module.exports = { funcs, ValidationError };