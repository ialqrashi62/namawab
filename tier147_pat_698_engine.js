// filepath: tier147_pat_698_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function gross(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.specimen_type, 'st', ['biopsy','resection','excision','core','FNA','cell_block','fluid','tissue','bone_marrow','organs','lymph_nodes','other']);
  ensureNum(req.size_cm, 'sz');
  ensureNum(req.weight_g, 'wt');
  ensureNum(req.num_blocks, 'nb');
  ensureNum(req.num_slides, 'ns');
  ensureEnum(req.margins, 'mg', ['negative','close','positive','cannot_be_assessed','NA','pending','unknown']);
  ensureStr(req.clinical_history, 'ch');
  ensureStr(req.provider, 'pr');
  return { gr_id: `grs_${Date.now()}`, patient_id: req.patient_id, specimen: req.specimen_type, size: req.size_cm };
}
function micro(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.diagnosis, 'dx', ['benign','malignant','atypical','in_situ','invasive','premalignant','reactive','inflammatory','infectious','other']);
  ensureNum(req.mitotic_rate, 'mr');
  ensureNum(req.ki67_pct, 'ki');
  ensureBool(req.lvi, 'lv');
  ensureBool(req.pni, 'pn');
  ensureEnum(req.tumor_grade, 'tg', ['GX','G1','G2','G3','G4','NA','unknown']);
  ensureEnum(req.lymph_nodes_positive, 'ln', ['0','1-3','4+','NA','unknown']);
  ensureStr(req.ihc, 'ih');
  ensureStr(req.provider, 'pr');
  return { mc_id: `mic_${Date.now()}`, patient_id: req.patient_id, diagnosis: req.diagnosis, grade: req.tumor_grade };
}
function frozen(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.frozen_to_permanent_time_min, 'ft');
  ensureEnum(req.diagnosis, 'dx', ['benign','malignant','defer_to_permanent','inadequate','atypical','other']);
  ensureBool(req.margin_status, 'ms');
  ensureEnum(req.specimen_type, 'st', ['lumpectomy','core','biopsy','node','thyroid','lung','brain','other']);
  ensureBool(req.discrepancy, 'ds');
  ensureStr(req.provider, 'pr');
  return { fr_id: `frz_${Date.now()}`, case_id: req.case_id, diagnosis: req.diagnosis };
}
function cyto(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.specimen, 'sp', ['FNA_thyroid','FNA_lymph_node','FNA_breast','FNA_pancreas','FNA_salivary','FNA_other','effusion','urine','CSF','sputum','BAL','Pap','anal_Pap','other']);
  ensureEnum(req.bethesda, 'be', ['I_non_diagnostic','II_benign','III_atypical','IV_follicular','V_suspicious','VI_malignant','NA','unknown']);
  ensureEnum(req.thyroid_category, 'tc', ['I','II','III','IV','V','VI','NA','unknown']);
  ensureEnum(req.paris, 'tp', ['unsatisfactory','negative','ASCUS','LSIL','HSIL','AGC','AIS','cancer','other']);
  ensureNum(req.cell_count, 'cc');
  ensureStr(req.adequacy, 'ad');
  ensureStr(req.provider, 'pr');
  return { cy_id: `cyt_${Date.now()}`, patient_id: req.patient_id, specimen: req.specimen };
}
function molecular(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.panel, 'pn', ['lung','breast','colon','thyroid','melanoma','GIST','sarcoma','lymphoma','leukemia','pancreatic','glioma','comprehensive','liquid_biopsy','other']);
  ensureNum(req.num_mutations, 'nm');
  ensureBool(req.tmb_high, 'tm');
  ensureEnum(req.msi, 'ms', ['stable','low','high','indeterminate','unknown']);
  ensureEnum(req.pdl1_tps, 'pd', ['0','1-49','50+','negative','positive','unknown','NA']);
  ensureBool(req.actionable, 'ac');
  ensureStr(req.driver_mutation, 'dm');
  ensureStr(req.provider, 'pr');
  return { mo_id: `mol_${Date.now()}`, patient_id: req.patient_id, panel: req.panel };
}

function funcs() { return { gross, micro, frozen, cyto, molecular }; }
module.exports = { funcs, ValidationError };