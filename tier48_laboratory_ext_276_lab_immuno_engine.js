// filepath: tier48_laboratory_ext_276_lab_immuno_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function autoimmune_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ana, 'ana');
  ensureStr(req.ds_dna, 'dsdna');
  ensureStr(req.smith_antibody, 'sm');
  ensureStr(req.complement_c3, 'c3');
  ensureStr(req.complement_c4, 'c4');
  ensureStr(req.interpretation, 'intp');
  return { ana: req.ana, interpretation: req.interpretation };
}
function immunoglobulins(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.igg, 'igg');
  ensureNum(req.iga, 'iga');
  ensureNum(req.igm, 'igm');
  ensureNum(req.ige, 'ige');
  ensureStr(req.interpretation, 'intp');
  return { igg: req.igg, iga: req.iga };
}
function complement_levels(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.c3, 'c3');
  ensureNum(req.c4, 'c4');
  ensureNum(req.ch50, 'ch');
  ensureStr(req.interpretation, 'intp');
  ensureStr(req.clinical_context, 'cc');
  return { c3: req.c3, c4: req.c4 };
}
function cytokines(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.il6, 'il6');
  ensureNum(req.tnf_alpha, 'tnf');
  ensureNum(req.il1_beta, 'il1');
  ensureNum(req.crp, 'crp');
  ensureStr(req.interpretation, 'intp');
  return { il6: req.il6, crp: req.crp };
}
function allergy_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ige_total, 'ige');
  ensureNum(req.specific_peanut, 'pn');
  ensureNum(req.specific_shellfish, 'sh');
  ensureStr(req.interpretation, 'intp');
  return { ige_total: req.ige_total };
}

function funcs() { return { autoimmune_panel, immunoglobulins, complement_levels, cytokines, allergy_panel }; }
module.exports = { funcs, ValidationError };