// filepath: tier160_lab_754_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function lab_order(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.panel, 'pn', ['CBC','BMP','CMP','LFT','lipid','TSH','A1c','UA','coag','ABG','blood_culture','urine_culture','stool_culture','PSA','pregnancy','troponin','BNP','CRP','ESR','vitamin_D','B12','folate','iron','ferritin','other','NA']);
  ensureEnum(req.priority, 'pr', ['stat','urgent','routine','standing','NA']);
  ensureNum(req.ordered_time, 'ot');
  ensureNum(req.collected_time, 'ct');
  ensureNum(req.resulted_time, 'rt');
  ensureEnum(req.specimen_type, 'st', ['serum','plasma','whole_blood','EDTA','citrate','heparin','urine','csf','stool','sputum','BAL','tissue','swab','other','NA']);
  ensureBool(req.fasting, 'fa');
  ensureBool(req.home_draw, 'hd');
  ensureNum(req.turnaround_hr, 'ta');
  ensureBool(req.critical_value, 'cv');
  ensureStr(req.provider, 'pr');
  return { lo_id: `lab_${Date.now()}`, patient_id: req.patient_id, panel: req.panel };
}
function lab_result(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.order_id, 'oi');
  ensureStr(req.analyte, 'an');
  ensureNum(req.value, 'vl');
  ensureStr(req.unit, 'un');
  ensureNum(req.ref_low, 'rl');
  ensureNum(req.ref_high, 'rh');
  ensureEnum(req.abnormal_flag, 'af', ['normal','low','high','critical_low','critical_high','abnormal','inconclusive','NA']);
  ensureNum(req.delta_check, 'dc');
  ensureNum(req.delta_pct, 'dp');
  ensureNum(req.previous_value, 'pv');
  ensureNum(req.verified_time, 'vt');
  ensureStr(req.verifier, 've');
  ensureStr(req.method, 'me');
  ensureStr(req.provider, 'pr');
  return { lr_id: `lar_${Date.now()}`, order_id: req.order_id, value: req.value };
}
function micro(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.specimen_id, 'si');
  ensureEnum(req.specimen, 'sp', ['blood','urine','sputum','BAL','CSF','wound','tissue','abscess','stool','eye','ear','nasal','vaginal','cervical','throat','sputum','other','NA']);
  ensureEnum(req.gram_stain, 'gs', ['pending','no_orgs','GPC','GNDC','GPB','GNB','yeast','mixed','other','NA']);
  ensureEnum(req.culture_result, 'cr', ['pending','no_growth','growth','contaminated','NA']);
  ensureStr(req.organism, 'og');
  ensureNum(req.colony_count, 'cc');
  ensureEnum(req.sensitivity, 'se', ['sensitive','intermediate','resistant','NA','pending','unknown']);
  ensureNum(req.mic, 'mi');
  ensureNum(req.days_to_positive, 'dp');
  ensureNum(req.days_to_final, 'df');
  ensureStr(req.provider, 'pr');
  return { mc_id: `mic_${Date.now()}`, organism: req.organism };
}
function blood_bank(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.donor_id, 'di');
  ensureStr(req.unit_id, 'ui');
  ensureEnum(req.product, 'pd', ['PRBC','platelets','FFP','cryo','whole_blood','washed_RBC','frozen_RBC','other','NA']);
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.transfusion_start, 'ts');
  ensureNum(req.transfusion_end, 'te');
  ensureNum(req.pre_hgb, 'ph');
  ensureNum(req.post_hgb, 'po');
  ensureBool(req.reaction, 'rx');
  ensureEnum(req.reaction_type, 'rt', ['none','febrile','allergic','hemolytic','TACO','TRALI','other','NA']);
  ensureStr(req.provider, 'pr');
  return { bb_id: `blb_${Date.now()}`, patient_id: req.patient_id, product: req.product };
}
function molecular_lab(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.order_id, 'oi');
  ensureEnum(req.test, 'ts', ['PCR','NGS','FISH','karyotype','microarray','CMA','liquid_biopsy','MRD','chimerism','viral_load','HCV_RNA','HIV_RNA','HBV_DNA','other','NA']);
  ensureStr(req.gene, 'ge');
  ensureStr(req.variant, 'va');
  ensureNum(req.allele_freq_pct, 'af');
  ensureBool(req.clinvar_pathogenic, 'cp');
  ensureBool(req.actionable, 'ac');
  ensureNum(req.tat_days, 'td');
  ensureEnum(req.specimen, 'sp', ['blood','FFPE','tissue','CSF','BAL','other','NA']);
  ensureBool(req.fda_approved, 'fa');
  ensureStr(req.provider, 'pr');
  return { ml_id: `mol_${Date.now()}`, patient_id: req.patient_id, gene: req.gene };
}

function funcs() { return { lab_order, lab_result, micro, blood_bank, molecular_lab }; }
module.exports = { funcs, ValidationError };