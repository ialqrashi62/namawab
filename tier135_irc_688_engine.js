// filepath: tier135_irc_688_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function angio(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.vessel, 'vs', ['coronary','cerebral','carotid','renal','mesenteric','peripheral','aortic','pulmonary']);
  ensureEnum(req.access, 'ac', ['femoral','radial','brachial','jugular','subclavian']);
  ensureNum(req.contrast_ml, 'cm');
  ensureStr(req.provider, 'pr');
  return { angio_id: `ang_${Date.now()}`, patient_id: req.patient_id, vessel: req.vessel, access: req.access, contrast: req.contrast_ml };
}
function stenting(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.vessel, 'vs');
  ensureNum(req.stent_size_mm, 'ss');
  ensureNum(req.stent_length_mm, 'sl');
  ensureEnum(req.stent_type, 'st', ['DES','BMS','BVS','drug_coated','covered','flow_diverter']);
  ensureStr(req.provider, 'pr');
  return { stent_id: `stn_${Date.now()}`, patient_id: req.patient_id, vessel: req.vessel, size: req.stent_size_mm, type: req.stent_type };
}
function embolization(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.target, 'tg', ['aneurysm','tumor','vascular_malformation','bleeding','varicocele','fibroid']);
  ensureEnum(req.agent, 'ag', ['coils','particles','glue','onyx','beads','liquid_embolic']);
  ensureNum(req.dose_mg, 'ds');
  ensureStr(req.provider, 'pr');
  return { emb_id: `emb_${Date.now()}`, patient_id: req.patient_id, target: req.target, agent: req.agent, dose: req.dose };
}
function thrombectomy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.location, 'lc', ['stroke','DVT','PE','coronary','peripheral','dialysis_access']);
  ensureEnum(req.technique, 'tc', ['suction','stent_retriever','rheolytic','rotational','aspiration']);
  ensureNum(req.tici_score, 'ti');
  ensureStr(req.provider, 'pr');
  return { thromb_id: `thr_${Date.now()}`, patient_id: req.patient_id, location: req.location, technique: req.technique, tici: req.tici_score };
}
function ablation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.target, 'tg', ['liver','lung','kidney','bone','prostate','breast','thyroid','cardiac','pancreas']);
  ensureEnum(req.modality, 'md', ['RFA','MWA','cryo','IRE','HIFU','laser','alcohol']);
  ensureNum(req.session_duration_min, 'sd');
  ensureStr(req.provider, 'pr');
  return { ab_id: `abl_${Date.now()}`, patient_id: req.patient_id, target: req.target, modality: req.modality, duration: req.session_duration_min };
}

function funcs() { return { angio, stenting, embolization, thrombectomy, ablation }; }
module.exports = { funcs, ValidationError };
