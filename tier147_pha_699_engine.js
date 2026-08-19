// filepath: tier147_pha_699_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pharmacokinetics(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.drug, 'dg');
  ensureNum(req.dose_mg, 'ds');
  ensureNum(req.dose_interval_hr, 'di');
  ensureNum(req.cmax, 'cx');
  ensureNum(req.tmax_hr, 'tm');
  ensureNum(req.auc, 'au');
  ensureNum(req.half_life_hr, 'hl');
  ensureNum(req.clearance, 'cl');
  ensureNum(req.vd, 'vd');
  ensureStr(req.route, 'rt');
  ensureStr(req.provider, 'pr');
  return { pk_id: `pkc_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, cmax: req.cmax };
}
function pharmacogenomics(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.gene, 'ge', ['CYP2D6','CYP2C9','CYP2C19','CYP3A4','CYP3A5','TPMT','NUDT15','DPYD','UGT1A1','SLCO1B1','VKORC1','HLA-B','HLA-A','other']);
  ensureEnum(req.phenotype, 'ph', ['poor','intermediate','extensive','ultra_rapid','normal','unknown']);
  ensureEnum(req.activity_score, 'as', ['0','0.5','1','1.5','2','2.5','3','unknown']);
  ensureStr(req.drug, 'dg');
  ensureEnum(req.recommendation, 'rc', ['standard_dose','reduced_dose','increased_dose','alternative','avoid','caution','other']);
  ensureNum(req.dose_adjust_pct, 'da');
  ensureStr(req.provider, 'pr');
  return { pg_id: `phg_${Date.now()}`, patient_id: req.patient_id, gene: req.gene, phenotype: req.phenotype };
}
function stewardship(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.antibiotic, 'ab', ['vancomycin','linezolid','daptomycin','meropenem','piperacillin_tazobactam','cefepime','ceftriaxone','ceftazidime_avibactam','colistin','amikacin','gentamicin','tobramycin','levofloxacin','ciprofloxacin','azithromycin','doxycycline','other']);
  ensureNum(req.days_of_therapy, 'do');
  ensureNum(req.ddd, 'dd');
  ensureBool(req.appropriate, 'ap');
  ensureBool(req.de_escalated, 'de');
  ensureEnum(req.iv_to_po, 'ip', ['yes','no','NA','pending','switched','planned']);
  ensureNum(req.cost_usd, 'ct');
  ensureStr(req.provider, 'pr');
  return { st_id: `stw_${Date.now()}`, patient_id: req.patient_id, antibiotic: req.antibiotic, dot: req.days_of_therapy };
}
function compounding(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['sterile','non_sterile','hazardous','TPN','IV_admixture','ophthalmic','otologic','inhalation','topical','capsule','suspension','solution','other']);
  ensureEnum(req.iso_class, 'ic', ['ISO_5','ISO_7','ISO_8','non_sterile','NA']);
  ensureNum(req.bud_days, 'bd');
  ensureBool(req.sterility_test, 'st');
  ensureBool(req.stability_test, 'sb');
  ensureStr(req.ingredients, 'in');
  ensureStr(req.provider, 'pr');
  return { cp_id: `cmp_${Date.now()}`, patient_id: req.patient_id, type: req.type, iso: req.iso_class };
}
function clinical_pharm(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.activity, 'ac', ['med_rec','reconciliation','discharge_counseling','renal_adjust','hepatic_adjust','drug_interaction','adverse_drug_event','vanco_dosing','anticoag_dosing','aminoglycoside_dosing','TPN_monitoring','warfarin_clinic','PCN_allergy','other']);
  ensureNum(req.num_drugs_reviewed, 'nr');
  ensureNum(req.num_interventions, 'ni');
  ensureNum(req.num_problems, 'np');
  ensureEnum(req.severity, 'sv', ['minor','moderate','major','severe','life_threatening','NA']);
  ensureStr(req.recommendation, 'rc');
  ensureStr(req.provider, 'pr');
  return { cl_id: `clp_${Date.now()}`, patient_id: req.patient_id, activity: req.activity, ni: req.num_interventions };
}

function funcs() { return { pharmacokinetics, pharmacogenomics, stewardship, compounding, clinical_pharm }; }
module.exports = { funcs, ValidationError };