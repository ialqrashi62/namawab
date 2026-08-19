// filepath: tier156_crs_735_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function colonoscopy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['screening','surveillance','diagnostic','therapeutic','positive_FIT','anemia','rectal_bleeding','diarrhea','IBD_surveillance','family_history','NA']);
  ensureEnum(req.bowel_prep, 'bp', ['excellent','good','fair','poor','inadequate','NA']);
  ensureNum(req.cec_intubation, 'ci');
  ensureNum(req.withdrawal_time_min, 'wt');
  ensureNum(req.num_polyps, 'np');
  ensureNum(req.num_polyps_resected, 'nr');
  ensureNum(req.num_polyps_cancer, 'nc');
  ensureNum(req.num_biopsies, 'nb');
  ensureEnum(req.adenoma_detected, 'ad', ['yes','no','NA','unknown']);
  ensureEnum(req.findings, 'fi', ['normal','polyps','mass','IBD','diverticula','angiodysplasia','bleeding','stricture','hemorrhoids','fissure','other','NA']);
  ensureEnum(req.complication, 'cp', ['none','bleeding','perforation','post_polypectomy_syndrome','death','other','NA']);
  ensureStr(req.provider, 'pr');
  return { co_id: `col_${Date.now()}`, patient_id: req.patient_id, polyps: req.num_polyps };
}
function colorectal_ca(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.location, 'lc', ['cecum','ascending','hepatic_flexure','transverse','splenic_flexure','descending','sigmoid','rectosigmoid','rectum','anal_canal','NA']);
  ensureEnum(req.tnm_t, 'tt', ['T0','Tis','T1','T1a','T1b','T2','T3','T3a','T3b','T3c','T3d','T4','T4a','T4b','TX','NA']);
  ensureEnum(req.tnm_n, 'tn', ['N0','N1','N1a','N1b','N1c','N2','N2a','N2b','NX','NA']);
  ensureEnum(req.tnm_m, 'tm', ['M0','M1','M1a','M1b','M1c','MX','NA']);
  ensureEnum(req.mmr_status, 'ms', ['MMR_proficient','MMR_deficient','dMMR','MSI_H','MSI_L','MSS','unknown','NA','pending']);
  ensureEnum(req.ras_status, 'rs', ['wild_type','mutant_KRAS','mutant_NRAS','mutant_BRAF','pending','unknown','NA']);
  ensureBool(req.her2_positive, 'hp');
  ensureEnum(req.sidedness, 'si', ['left','right','rectal','NA','unknown']);
  ensureNum(req.lvi, 'lv');
  ensureNum(req.lymph_nodes_examined, 'lne');
  ensureNum(req.lymph_nodes_positive, 'lnp');
  ensureEnum(req.grade, 'gr', ['GX','G1','G2','G3','G4','low','high','NA']);
  ensureStr(req.provider, 'pr');
  return { cc_id: `crc_${Date.now()}`, patient_id: req.patient_id, location: req.location };
}
function resect(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['right_hemicolectomy','left_hemicolectomy','extended_right','extended_left','sigmoidectomy','low_anterior_resection','APR','abdominoperineal','total_proctocolectomy','subtotal_colectomy','TME','local_excision','TAMIS','taTME','robotic','laparoscopic','open','NA']);
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.duration_hr, 'dh');
  ensureBool(req.diverting_stoma, 'ds');
  ensureEnum(req.complication, 'cp', ['none','anastomotic_leak','bleeding','ileus','SSI','UTI','cardiac','pulmonary','DVT','PE','death','other','NA']);
  ensureNum(req.los_days, 'lo');
  ensureNum(req.time_to_diet, 'td');
  ensureNum(req.days_to_discharge, 'dd');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { rc_id: `res_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function pouch(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['J_pouch','W_pouch','S_pouch','K_pouch','ileostomy','other','NA']);
  ensureNum(req.pouch_length_cm, 'pl');
  ensureNum(req.stoma_output_ml_day, 'so');
  ensureNum(req.bowel_freq_day, 'bd');
  ensureNum(req.bowel_freq_night, 'bn');
  ensureBool(req.pouchitis, 'po');
  ensureNum(req.oda_score, 'od');
  ensureEnum(req.treatment, 'tr', ['none','antibiotic','anti_inflammatory','steroid','biologics','resection','revision','NA']);
  ensureBool(req.continence_good, 'cg');
  ensureNum(req.quality_of_life, 'qol');
  ensureStr(req.provider, 'pr');
  return { pc_id: `pch_${Date.now()}`, patient_id: req.patient_id };
}
function followup_crc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.months_post_op, 'mp');
  ensureEnum(req.stage, 'st', ['I','II','IIA','IIB','IIC','IIIA','IIIB','IIIC','IVA','IVB','NA','unknown']);
  ensureEnum(req.cea_level, 'cl', ['normal','elevated','rising','pending','NA']);
  ensureBool(req.ct_chest_abdomen, 'ct');
  ensureBool(req.colonoscopy_done, 'co');
  ensureBool(req.recurrence, 'rc');
  ensureNum(req.dfs_months, 'df');
  ensureNum(req.os_months, 'os');
  ensureBool(req.ostomy, 'os2');
  ensureEnum(req.karnofsky, 'ka', ['100','90','80','70','60','50','40','30','20','10','0','NA']);
  ensureStr(req.provider, 'pr');
  return { fu_id: `fuc_${Date.now()}`, patient_id: req.patient_id };
}

function funcs() { return { colonoscopy, colorectal_ca, resect, pouch, followup_crc }; }
module.exports = { funcs, ValidationError };