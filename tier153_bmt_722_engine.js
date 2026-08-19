// filepath: tier153_bmt_722_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function donor_match(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.donor_type, 'dt', ['matched_sibling','matched_unrelated','mismatched_related','haploidentical','cord_blood','double_cord','syngeneic','autologous','other','NA']);
  ensureNum(req.age_donor, 'ad');
  ensureNum(req.age_recipient, 'ar');
  ensureNum(req.hla_match_a, 'ha');
  ensureNum(req.hla_match_b, 'hb');
  ensureNum(req.hla_match_dr, 'hd');
  ensureNum(req.hla_match_total, 'ht');
  ensureNum(req.cpra_pct, 'cp');
  ensureNum(req.donor_weight_kg, 'dw');
  ensureBool(req.cmv_compatible, 'cc');
  ensureEnum(req.ab_o, 'ao', ['compatible','minor_incompatible','major_incompatible','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { dm_id: `dmt_${Date.now()}`, patient_id: req.patient_id, donor: req.donor_type };
}
function harvest(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.donor_id, 'di');
  ensureEnum(req.method, 'me', ['BM_aspirate','PBSC_apheresis','BM_peripheral','cord_blood_collection','other','NA']);
  ensureNum(req.cdbl_cell_dose, 'cd');
  ensureNum(req.tnc_dose, 'tn');
  ensureNum(req.cd34_dose, 'c34');
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.duration_hr, 'du');
  ensureBool(req.adequate_collection, 'ac');
  ensureEnum(req.complications, 'cp', ['none','hypotension','hypocalcemia','bleeding','pain','apheresis_reaction','cardiac_arrhythmia','death','other','NA']);
  ensureEnum(req.manipulation, 'mn', ['none','CD34_selection','T_cell_depletion','plasma_depletion','red_cell_reduction','graft_manipulation','other','NA']);
  ensureStr(req.provider, 'pr');
  return { hr_id: `hvs_${Date.now()}`, donor_id: req.donor_id, method: req.method };
}
function conditioning(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureEnum(req.regimen, 'rg', ['BU_CY','BU_FLU','BEAM','CBV','TBI_myeloablative','TBI_reduced_intensity','non_myeloablative','reduced_toxicity','post_transplant_CY','other','NA']);
  ensureNum(req.day_minus, 'dm');
  ensureNum(req.dose_mg, 'ds');
  ensureNum(req.tbi_dose_cgy, 'tb');
  ensureBool(req.gvhd_prophylaxis, 'gp');
  ensureEnum(req.prophylaxis, 'pp', ['CNI_MTX','CNI_MMF','CNI_sirolimus','CNI_MTX_MMF','PT_CY','TCD','other','NA']);
  ensureNum(req.cni_target_ng_ml, 'ct');
  ensureEnum(req.antimicrobial, 'am', ['standard','enhanced','antifungal_prophylaxis','PCP_prophylaxis','antiviral','combination','NA']);
  ensureStr(req.provider, 'pr');
  return { cn_id: `cnd_${Date.now()}`, case_id: req.case_id, regimen: req.regimen };
}
function engraftment(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.day_neutrophil, 'dn');
  ensureNum(req.day_platelet, 'dp');
  ensureNum(req.donor_chimerism_pct_d30, 'c30');
  ensureNum(req.donor_chimerism_pct_d100, 'c100');
  ensureNum(req.donor_chimerism_pct_d365, 'c365');
  ensureBool(req.primary_graft_failure, 'pg');
  ensureBool(req.secondary_graft_failure, 'sg');
  ensureEnum(req.failure_workup, 'fw', ['pending','BM_done','chimerism_done','plan','other','NA','complete']);
  ensureEnum(req.rescue_plan, 'rp', ['none','CD34_boost','second_transplant','DSA_reduction','other','NA']);
  ensureStr(req.provider, 'pr');
  return { eg_id: `eng_${Date.now()}`, case_id: req.case_id };
}
function gvhd(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.day_post, 'dp');
  ensureEnum(req.type, 'tp', ['none','acute_skin','acute_liver','acute_GI','acute_overlap','chronic_limited','chronic_extensive','late_acute','overlap','NA']);
  ensureNum(req.skin_grade, 'sg');
  ensureEnum(req.skin_stage, 'ss', ['0','1','2','3','4','NA']);
  ensureNum(req.liver_bili, 'lb');
  ensureEnum(req.liver_stage, 'ls', ['0','1','2','3','4','NA']);
  ensureEnum(req.gi_stage, 'gs', ['0','1','2','3','4','NA']);
  ensureEnum(req.glucksberg_grade, 'gg', ['I','II','III','IV','NA']);
  ensureEnum(req.treatment_line, 'tl', ['none','steroid_topical','steroid_systemic','second_line','third_line','NA','other']);
  ensureStr(req.provider, 'pr');
  return { gv_id: `gvd_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}

function funcs() { return { donor_match, harvest, conditioning, engraftment, gvhd }; }
module.exports = { funcs, ValidationError };