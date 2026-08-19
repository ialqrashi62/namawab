// filepath: tier149_gi_707_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function endoscopy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['EGD','colonoscopy_screening','colonoscopy_surveillance','colonoscopy_diagnostic','flex_sigmoidoscopy','ERCP','EUS','capsule_endoscopy','double_balloon','enteroscopy','push_enteroscopy','upper_EUS','rectal_EUS','other']);
  ensureNum(req.indication_count, 'ic');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.depth_insertion_cm, 'di');
  ensureEnum(req.findings, 'fi', ['normal','polyps','mass','ulcer','stricture','diverticula','angiodysplasia','bleeding','IBD','celiac','Barretts','varices','other']);
  ensureNum(req.num_polyps, 'np');
  ensureNum(req.num_biopsies, 'nb');
  ensureEnum(req.asa_score, 'as', ['I','II','III','IV','V','E','unknown']);
  ensureBool(req.complications, 'cp');
  ensureStr(req.provider, 'pr');
  return { en_id: `end_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function liver(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.alb, 'ab');
  ensureNum(req.bili, 'bi');
  ensureNum(req.inr, 'in');
  ensureNum(req.creatinine, 'cr');
  ensureEnum(req.child_pugh, 'cp', ['A','B','C','unknown']);
  ensureNum(req.meld_na, 'mn');
  ensureNum(req.meld_original, 'mo');
  ensureNum(req.albi_grade, 'ag');
  ensureNum(req.fibroscan_kpa, 'fk');
  ensureEnum(req.cap_score, 'cs', ['S0','S1','S2','S3','unknown']);
  ensureEnum(req.etiology, 'et', ['HBV','HCV','alcohol','NAFLD','NASH','AIH','PBC','PSC','drug','hemochromatosis','Wilson','alpha1_AT','cryptogenic','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { lv_id: `lvr_${Date.now()}`, patient_id: req.patient_id, meld: req.meld_na };
}
function ibd(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['Crohns','UC','IBDU','indeterminate','microscopic_colitis','other','NA']);
  ensureEnum(req.location, 'lc', ['ileal','colonic','ileocolonic','upper_GI','perianal','extensive','left_sided','proctitis','NA','unknown']);
  ensureNum(req.mayo_score, 'my');
  ensureNum(req.crai_score, 'cr');
  ensureNum(req.sccai, 'sc');
  ensureNum(req.fecal_calprotectin, 'fc');
  ensureEnum(req.behavior, 'bh', ['B1_inflammatory','B2_stricturing','B3_penetrating','perianal','NA','unknown']);
  ensureEnum(req.montreal_age, 'ma', ['A1','A2','A3','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { ib_id: `ibd_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function gerd(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.endoscopy_findings, 'ef', ['normal','LA_grade_A','LA_grade_B','LA_grade_C','LA_grade_D','Barretts','esophagitis_other','stricture','mass','other']);
  ensureNum(req.deMeester_score, 'dm');
  ensureNum(req.pH_less_4_pct, 'ph');
  ensureBool(req.biased_reflux, 'br');
  ensureBool(req.symptom_correlation, 'sc');
  ensureNum(req.les_length_cm, 'le');
  ensureEnum(req.ingers, 'in', ['true','false','NA','unknown']);
  ensureBool(req.h_pylori, 'hp');
  ensureStr(req.provider, 'pr');
  return { gd_id: `grd_${Date.now()}`, patient_id: req.patient_id };
}
function biliary(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['ERCP_diagnostic','ERCP_therapeutic','EUS_diagnostic','EUS_therapeutic','PTC','stone_extraction','stent_placement','sphincterotomy','biopsy','FNA','other']);
  ensureNum(req.bili, 'bi');
  ensureNum(req.alp, 'ap');
  ensureNum(req.ggt, 'gg');
  ensureNum(req.duration_min, 'du');
  ensureEnum(req.findings, 'fi', ['normal','stones','stricture','mass','leak','sludge','primary_sclerosing_cholangitis','other']);
  ensureBool(req.sphincterotomy_done, 'sd');
  ensureBool(req.stent_placed, 'sp');
  ensureStr(req.provider, 'pr');
  return { bi_id: `bil_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}

function funcs() { return { endoscopy, liver, ibd, gerd, biliary }; }
module.exports = { funcs, ValidationError };