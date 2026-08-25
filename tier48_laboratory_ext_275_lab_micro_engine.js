// filepath: tier48_laboratory_ext_275_lab_micro_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function blood_culture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.bottle_count, 'bc');
  ensureNum(req.days_to_positive, 'dtp');
  ensureStr(req.organism, 'org');
  ensureBool(req.contaminant, 'ct');
  ensureStr(req.susceptibility, 'susc');
  ensureStr(req.antibiotic_therapy, 'at');
  return { organism: req.organism, contaminant: req.contaminant };
}
function urine_culture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.cfu_per_ml, 'cfu');
  ensureStr(req.organism, 'org');
  ensureStr(req.susceptibility, 'susc');
  ensureEnum(req.contamination, 'ct', ['clean_catch','cath','bag','inout','suprapubic']);
  ensureStr(req.interpretation, 'intp');
  return { cfu: req.cfu_per_ml, organism: req.organism };
}
function sputum_culture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.quality, 'qual');
  ensureStr(req.organism, 'org');
  ensureStr(req.susceptibility, 'susc');
  ensureStr(req.interpretation, 'intp');
  return { quality: req.quality, organism: req.organism };
}
function stool_culture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.organism, 'org');
  ensureStr(req.susceptibility, 'susc');
  ensureBool(req.toxin_positive, 'tp');
  ensureStr(req.interpretation, 'intp');
  return { organism: req.organism };
}
function wound_culture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.organism, 'org');
  ensureStr(req.susceptibility, 'susc');
  ensureBool(req.polymicrobial, 'pm');
  ensureStr(req.interpretation, 'intp');
  return { organism: req.organism, polymicrobial: req.polymicrobial };
}

function funcs() { return { blood_culture, urine_culture, sputum_culture, stool_culture, wound_culture }; }
module.exports = { funcs, ValidationError };