// filepath: tier145_nep_690_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ckd_stage(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.egfr, 'eg');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.bun, 'bu');
  ensureEnum(req.stage, 'st', ['1','2','3a','3b','4','5','on_dialysis','transplant','unknown']);
  ensureEnum(req.cause, 'ca', ['DM','HTN','glomerular','PKD','autoimmune','obstructive','drug','other','unknown']);
  ensureNum(req.urine_acr, 'ar');
  ensureStr(req.provider, 'pr');
  return { ck_id: `ckd_${Date.now()}`, patient_id: req.patient_id, egfr: req.egfr, stage: req.stage };
}
function dialysis(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['HD','HDF','HFD','PD','CVVH','CVVHD','CVVHDF','SCUF','apheresis','planned','emergent']);
  ensureNum(req.dialyzer, 'dy');
  ensureNum(req.duration_hr, 'dh');
  ensureEnum(req.access, 'ac', ['AVF','AVG','tunneled_cath','non_tunneled_cath','PD_catheter','temporary','PD','unknown']);
  ensureNum(req.uf_volume, 'uv');
  ensureNum(req.URR, 'ur');
  ensureNum(req.Kt_V, 'kt');
  ensureStr(req.provider, 'pr');
  return { dl_id: `dia_${Date.now()}`, patient_id: req.patient_id, type: req.type, duration: req.duration_hr };
}
function transplant(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.organ, 'or', ['living_related','living_unrelated','deceased_dbd','deceased_dcd','paired_exchange','ABO_incompatible','positive_crossmatch','other']);
  ensureNum(req.csa_level, 'cs');
  ensureNum(req.tac_level, 'tcl');
  ensureNum(req.siro_level, 'si');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.bk_virus, 'bk');
  ensureBool(req.rejection, 'rj');
  ensureStr(req.provider, 'pr');
  return { tr_id: `txn_${Date.now()}`, patient_id: req.patient_id, organ: req.organ, creatinine: req.creatinine };
}
function biopsy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.cores, 'co');
  ensureEnum(req.approach, 'ap', ['percutaneous','transjugular','open','laparoscopic','native','transplant','other']);
  ensureEnum(req.banff, 'bn', ['normal','borderline','AMR','ABMR','TCMR','chronic','mixed','atrophy','other','pending']);
  ensureNum(req.g_score, 'gs');
  ensureNum(req.i_score, 'is');
  ensureNum(req.t_score, 'ts');
  ensureNum(req.v_score, 'vs');
  ensureStr(req.provider, 'pr');
  return { bx_id: `bxn_${Date.now()}`, patient_id: req.patient_id, cores: req.cores, banff: req.banff };
}
function electrolyte(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.na, 'na');
  ensureNum(req.k, 'k');
  ensureNum(req.cl, 'cl');
  ensureNum(req.co2, 'co');
  ensureNum(req.bun, 'bu');
  ensureNum(req.creatinine_e, 'cr');
  ensureNum(req.glucose, 'gl');
  ensureNum(req.ca, 'ca');
  ensureNum(req.mg, 'mg');
  ensureNum(req.ph, 'ph');
  ensureStr(req.provider, 'pr');
  return { bi_id: `lyt_${Date.now()}`, patient_id: req.patient_id, na: req.na, k: req.k, cr: req.cr };
}

function funcs() { return { ckd_stage, dialysis, transplant, biopsy, electrolyte }; }
module.exports = { funcs, ValidationError };
