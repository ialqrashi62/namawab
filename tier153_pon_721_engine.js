// filepath: tier153_pon_721_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function leukemia(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.wbc_dx, 'wd');
  ensureNum(req.hgb_dx, 'hd');
  ensureNum(req.plt_dx, 'pd');
  ensureNum(req.blasts_pct, 'bp');
  ensureEnum(req.diagnosis, 'dx', ['B_ALL','T_ALL','AML','APL','CML_in_childhood','CML_juvenile','B_ALL_down_syndrome','infant_ALL','mixed_phenotype_AL','other','NA']);
  ensureEnum(req.risk, 'rk', ['standard','high','very_high','infant','NA']);
  ensureEnum(req.cytogenetics, 'cg', ['favorable','unfavorable','intermediate','hyperdiploid','hypodiploid','t_9_22','t_4_11','t_12_21','t_1_19','t_8_21','inv_16','normal','NA','unknown']);
  ensureNum(req.mrd_day33, 'mr');
  ensureEnum(req.consolidation, 'co', ['COG_AALL0932','COG_AALL1131','COG_AALL1231','BFM_95','BFM_2009','EsPhALL','treatment_escalation','other','NA']);
  ensureStr(req.provider, 'pr');
  return { le_id: `lkm_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis };
}
function brain_tumor(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.location, 'lc', ['cerebellum','cerebrum','brainstem','thalamus','optic_pathway','hypothalamus','pineal','spinal_cord','posterior_fossa','midline','supratentorial','infratentorial','leptomeningeal','other','NA']);
  ensureEnum(req.diagnosis, 'dx', ['medulloblastoma','pilocytic_astrocytoma','ependymoma','diffuse_intrinsic_pontine_glioma','DIPG','anaplastic_astrocytoma','glioblastoma','ATRT','choroid_plexus','germinoma','teratoma','pineoblastoma','craniopharyngioma','other','NA']);
  ensureEnum(req.molecular, 'mo', ['SHH','WNT','group_3','group_4','BRAF_V600E','BRAF_KIAA1549','H3K27M','MGMT_methylated','IDH1_mutant','NA','unknown','other']);
  ensureNum(req.resection_pct, 'rp');
  ensureEnum(req.study, 'st', ['COG_ACNS','SIOP','HIT','ACNS0334','ACNS1123','ACNS0831','treatment_protocol','other','NA']);
  ensureBool(req.craniospinal_radiation, 'cr');
  ensureNum(req.radiation_dose_gy, 'rd');
  ensureEnum(req.outcome, 'ot', ['CR','PR','SD','PD','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { bt_id: `btn_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis };
}
function solid_peds(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.tumor_type, 'lt', ['neuroblastoma','Wilms','nephroblastoma','rhabdomyosarcoma','osteosarcoma','Ewings','PNET','retinoblastoma','hepatoblastoma','germinoma','lymphoma_Burkitt','lymphoma_LBL','lymphoma_ALCL','lymphoma_DLBCL','desmoplastic_round_cell','other','NA']);
  ensureEnum(req.stage, 'st', ['I','II','III','IV','special','NA']);
  ensureNum(req.tumor_size_cm, 'ts');
  ensureEnum(req.resection_status, 'rs', ['RO','R1','R2','NA','unknown']);
  ensureEnum(req.molecular, 'mo', ['MYCN_amp','1p36_loss','ALK','BRAF_V600E','PAX_FOXO1','EWSR1','WT1','WT2','WTX','RB1','other','NA','unknown']);
  ensureEnum(req.risk, 'rk', ['very_low','low','intermediate','high','very_high','NA']);
  ensureEnum(req.chemo_regimen, 'ch', ['COG_ANBL','COG_ARST','COG_AEWS','COG_AOST','COG_AREN','COG_ABMT','COG_ACNS','other','NA']);
  ensureStr(req.provider, 'pr');
  return { sp_id: `sol_${Date.now()}`, patient_id: req.patient_id, tumor: req.tumor_type };
}
function chemo_peds(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.protocol, 'pr', ['COG_AALL','COG_ANBL','COG_ARST','COG_AEWS','COG_AOST','COG_ABMT','COG_ACNS','SIOP','BFM','treatment_intensification','other','NA']);
  ensureNum(req.cycle, 'cy');
  ensureNum(req.day, 'dy');
  ensureNum(req.dose_mg_m2, 'ds');
  ensureNum(req.anc_pre, 'ap');
  ensureNum(req.plt_pre, 'pp');
  ensureNum(req.creatinine_pre, 'cr');
  ensureBool(req.full_dose_given, 'fg');
  ensureEnum(req.toxicity_grade, 'tg', ['none','G1','G2','G3','G4','G5','NA']);
  ensureEnum(req.supportive, 'su', ['none','growth_factor','antibiotic_prophylaxis','antifungal_prophylaxis','transfusion','TPN','other','combination','NA']);
  ensureStr(req.provider, 'pr');
  return { cm_id: `chp_${Date.now()}`, patient_id: req.patient_id, cycle: req.cycle };
}
function late_effects(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.years_since_dx, 'ys');
  ensureNum(req.age_current, 'ac');
  ensureEnum(req.dx_history, 'dh', ['survivor_ALL','survivor_AML','survivor_brain','survivor_solid','survivor_BMT','survivor_other','NA','unknown']);
  ensureBool(req.cardiotoxicity, 'ct');
  ensureBool(req.neurocognitive, 'nc');
  ensureBool(req.growth_failure, 'gf');
  ensureBool(req.secondary_malignancy, 'sm');
  ensureBool(req.fertility_affected, 'fe');
  ensureNum(req.lv_ef_pct, 'le');
  ensureNum(req.cumulative_doxorubicin_mg_m2, 'cd');
  ensureEnum(req.passport, 'ps', ['complete','partial','planning','NA']);
  ensureStr(req.provider, 'pr');
  return { le_id: `lef_${Date.now()}`, patient_id: req.patient_id };
}

function funcs() { return { leukemia, brain_tumor, solid_peds, chemo_peds, late_effects }; }
module.exports = { funcs, ValidationError };