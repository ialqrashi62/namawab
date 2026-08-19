// filepath: tier148_onc_701_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function staging(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.cancer_type, 'ct', ['breast','lung','colon','rectal','prostate','ovarian','cervical','endometrial','pancreatic','gastric','esophageal','hepatocellular','cholangiocarcinoma','renal','bladder','melanoma','thyroid','lymphoma','leukemia','myeloma','glioma','sarcoma','head_neck','other']);
  ensureEnum(req.tnm_t, 'tt', ['T0','Tis','T1','T1a','T1b','T1c','T2','T2a','T2b','T3','T3a','T3b','T4','T4a','T4b','TX','unknown']);
  ensureEnum(req.tnm_n, 'tn', ['N0','N1','N2','N3','N3a','N3b','NX','unknown']);
  ensureEnum(req.tnm_m, 'tm', ['M0','M1','M1a','M1b','M1c','MX','unknown']);
  ensureEnum(req.stage_group, 'sg', ['0','I','IA','IA1','IA2','IB','IB1','IB2','II','IIA','IIB','IIIA','IIIB','IIIC','IV','IVA','IVB','IVC','unknown']);
  ensureNum(req.tumor_size_cm, 'ts');
  ensureBool(req.metastasis, 'mt');
  ensureStr(req.provider, 'pr');
  return { st_id: `stg_${Date.now()}`, patient_id: req.patient_id, stage: req.stage_group, tumor: req.cancer_type };
}
function tnm(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.tumor_size_cm, 'ts');
  ensureNum(req.nodes_examined, 'ne');
  ensureNum(req.nodes_positive, 'np');
  ensureNum(req.depth_invasion_mm, 'di');
  ensureEnum(req.lvi, 'lv', ['present','absent','indeterminate','unknown']);
  ensureEnum(req.pni, 'pn', ['present','absent','indeterminate','unknown']);
  ensureEnum(req.grade, 'gr', ['GX','G1','G2','G3','G4','NA']);
  ensureEnum(req.margin, 'mg', ['negative','close','positive','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { tn_id: `tnm_${Date.now()}`, case_id: req.case_id, nodes: req.nodes_positive };
}
function targeted(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.drug, 'dr', ['trastuzumab','pertuzumab','T-DM1','osimertinib','erlotinib','gefitinib','cetuximab','panitumumab','bevacizumab','ramucirumab','pembrolizumab','nivolumab','atezolizumab','durvalumab','ipilimumab','olaparib','talazoparib','rucaparib','niraparib','abiraterone','enzalutamide','apalutamide','imatinib','dasatinib','nilotinib','venetoclax','ibrutinib','idelalisib','other']);
  ensureEnum(req.target, 'tg', ['HER2','EGFR','ALK','ROS1','BRAF','KRAS','NRAS','BRAF_V600E','PDL1','NTRK','BRCA1','BRCA2','HRD','MSI_H','TMB_high','CD20','CD30','BCR_ABL','JAK2','FLT3','IDH1','IDH2','MET','FGFR','RET','other','NA']);
  ensureEnum(req.line, 'ln', ['neoadjuvant','adjuvant','first','second','third','fourth_plus','maintenance','salvage','palliative','other']);
  ensureNum(req.cycle, 'cy');
  ensureEnum(req.response, 'rs', ['CR','PR','SD','PD','NE','unknown']);
  ensureNum(req.pfs_months, 'pf');
  ensureStr(req.provider, 'pr');
  return { tg_id: `trg_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, target: req.target };
}
function rad_onc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.modality, 'mo', ['EBRT','IMRT','VMAT','SRS','SBRT','SRT','HDR_brachy','LDR_brachy','seeds','proton','cyberknife','tomotherapy','whole_brain','TBI','other']);
  ensureNum(req.total_dose_gy, 'td');
  ensureNum(req.fractions, 'fr');
  ensureNum(req.dose_per_fraction_gy, 'df');
  ensureStr(req.site, 'si');
  ensureBool(req.completed, 'cm');
  ensureEnum(req.toxicity, 'tx', ['none','acute_skin','acute_mucositis','acute_esophagitis','acute_pneumonitis','late_fibrosis','late_xerostomia','late_organ_damage','myelosuppression','other']);
  ensureStr(req.provider, 'pr');
  return { ro_id: `rad_${Date.now()}`, patient_id: req.patient_id, modality: req.modality, dose: req.total_dose_gy };
}
function follow_up(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.status, 'st', ['NED','AWD','recurrence','progression','palliative','hospice','death','unknown']);
  ensureNum(req.months_dx, 'md');
  ensureNum(req.months_followup, 'mf');
  ensureBool(req.recurrence, 'rc');
  ensureEnum(req.recurrence_site, 'rs', ['local','regional','distant','both','NA','unknown']);
  ensureEnum(req.next_imaging, 'ni', ['CT','MRI','PET','US','XRAY','bone_scan','none','other']);
  ensureNum(req.next_visit_days, 'nv');
  ensureStr(req.provider, 'pr');
  return { fu_id: `flu_${Date.now()}`, patient_id: req.patient_id, status: req.status };
}

function funcs() { return { staging, tnm, targeted, rad_onc, follow_up }; }
module.exports = { funcs, ValidationError };