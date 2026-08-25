// filepath: tier48_laboratory_ext_277_lab_mol_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pcr_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.target, 'tgt');
  ensureNum(req.ct_value, 'ct');
  ensureEnum(req.result, 'res', ['positive','negative','inconclusive','invalid']);
  ensureStr(req.sample_type, 'st');
  ensureStr(req.platform, 'plat');
  return { target: req.target, result: req.result };
}
function next_gen_sequencing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.panel, 'pan');
  ensureNum(req.mutations_found.length, 'mf_len');
  ensureNum(req.vus_count, 'vus');
  ensureNum(req.tmb, 'tmb');
  ensureEnum(req.msi, 'msi', ['stable','low','high','unknown']);
  return { panel: req.panel, msi: req.msi };
}
function fish_analysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.probe, 'probe');
  ensureNum(req.signals_ratio, 'sr');
  ensureEnum(req.interpretation, 'intp', ['positive_amplified','negative','equivocal','failed']);
  ensureStr(req.sample, 'samp');
  return { probe: req.probe, ratio: req.signals_ratio };
}
function karyotyping(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.karyotype, 'kt');
  ensureStr(req.interpretation, 'intp');
  ensureEnum(req.resolution, 'res', ['300_band','400_band','550_band','800_band']);
  return { karyotype: req.karyotype, resolution: req.resolution };
}
function methylation_assay(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.gene, 'gene');
  ensureEnum(req.methylation_status, 'ms', ['methylated','unmethylated','partially_methylated','indeterminate']);
  ensureStr(req.interpretation, 'intp');
  ensureStr(req.sample, 'samp');
  return { gene: req.gene, status: req.methylation_status };
}

function funcs() { return { pcr_panel, next_gen_sequencing, fish_analysis, karyotyping, methylation_assay }; }
module.exports = { funcs, ValidationError };