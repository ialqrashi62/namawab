// filepath: tier125_microbiology_650_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function culture_growth(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture_id, 'cid');
  ensureEnum(req.specimen, 'spec', ['blood','urine','sputum','wound','csf','other','unknown']);
  ensureStr(req.organism, 'org');
  ensureNum(req.day_to_positive, 'dtp');
  ensureStr(req.provider, 'pr');
  return { cid: req.culture_id };
}
function gram_stain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.gram_id, 'gid');
  ensureStr(req.specimen, 'spec');
  ensureEnum(req.organism_type, 'ot', ['gram_pos_cocci','gram_pos_rods','gram_neg_cocci','gram_neg_rods','yeast','mixed','none_seen','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { gid: req.gram_id };
}
function sensitivity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sens_id, 'sid');
  ensureStr(req.antibiotic, 'ab');
  ensureBool(req.sensitive, 'sens');
  ensureNum(req.mic, 'mic');
  ensureStr(req.provider, 'pr');
  return { sid: req.sens_id };
}
function parasitology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.para_id, 'pid');
  ensureEnum(req.specimen, 'spec', ['stool','blood','csf','tissue','other','unknown']);
  ensureStr(req.parasite, 'par');
  ensureStr(req.provider, 'pr');
  return { pid: req.para_id };
}
function mycology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.myc_id, 'mid');
  ensureEnum(req.specimen, 'spec', ['skin','nail','hair','blood','csf','sputum','other','unknown']);
  ensureStr(req.fungus, 'fung');
  ensureStr(req.provider, 'pr');
  return { mid: req.myc_id };
}

function funcs() { return { culture_growth, gram_stain, sensitivity, parasitology, mycology }; }
module.exports = { funcs, ValidationError };