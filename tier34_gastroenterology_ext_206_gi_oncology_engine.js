// filepath: tier34_gastroenterology_ext_206_gi_oncology_engine.js
// TIER34_GASTROENTEROLOGY-206: GI oncology
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function colon_cancer_staging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.tnm_stage, 'tnm', ['t1n0m0','t2n0m0','t3n0m0','t4n0m0','t1n1m0','t2n1m0','t3n1m0','t4n1m0','t1n2m0','t2n2m0','t3n2m0','t4n2m0','any_t_any_n_m1','other']);
  ensureNumber(req.cea, 'cea');
  ensureNumber(req.lymph_nodes_positive, 'ln');
  ensureBool(req.surgery_done, 'sx');
  ensureEnum(req.chemotherapy_regimen, 'chemo', ['folfox','capox','folfiri','folfoxiri','none','capecitabine','other']);
  ensureEnum(req.msi_status, 'msi', ['mss','msi_h','msi_l','unknown']);
  let status;
  if (req.msi_status === 'msi_h' && req.chemotherapy_regimen !== 'none') status = 'msi_h_consider_immunotherapy';
  else if (req.tnm_stage === 't3n1m0' && !req.surgery_done) status = 'stage_iii_surgery_chemo_indicated';
  else if (req.tnm_stage.includes('m1')) status = 'metastatic_colon_cancer_systemic';
  else if (req.cea > 5 && req.surgery_done) status = 'cea_elevated_surveillance_imaging';
  else status = 'colon_cancer_review';
  return { status, tnm: req.tnm_stage };
}

function gi_lymphoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.lymphoma_type, 'type', ['malt','dlbcl','follicular','mantle_cell','burkitt','t_cell','other']);
  ensureEnum(req.location, 'loc', ['stomach','small_bowel','colon','esophagus','rectum','liver','pancreas','other']);
  ensureBool(req.h_pylori_positive, 'hp');
  ensureEnum(req.stage, 'stage', ['ie','ii1','ii2','ii_e','iii','iv','other']);
  ensureEnum(req.treatment, 'rx', ['triple_therapy','chemo','chemo_immuno','surgery','radiation','observation','rituximab','other']);
  let status;
  if (req.lymphoma_type === 'malt' && req.h_pylori_positive && req.stage === 'ie') status = 'malt_hp_eradication_first';
  else if (req.lymphoma_type === 'dlbcl' && req.treatment !== 'chemo_immuno') status = 'dlbcl_rchop_indicated';
  else if (req.lymphoma_type === 'malt' && !req.h_pylori_positive && req.treatment === 'observation') status = 'hp_neg_malt_non_eradication';
  else status = 'gi_lymphoma_review';
  return { status, t: req.lymphoma_type };
}

function gist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.location, 'loc', ['stomach','duodenum','jejunum','ileum','colon','rectum','esophagus','omentum','mesentery','other']);
  ensureNumber(req.size_cm, 'size');
  ensureEnum(req.mitotic_index, 'mi', ['very_low','low','intermediate','high','unknown']);
  ensureBool(req['c-kit_positive'], 'kit');
  ensureBool(req.imatinib_started, 'ima');
  ensureEnum(req.response, 'resp', ['complete_response','partial','stable','progression','unknown']);
  let status;
  if (req.mitotic_index === 'high' && req.size_cm >= 10) status = 'high_risk_gist_3_year_imatinib';
  else if (req.mitotic_index === 'high' && req.size_cm >= 5 && req.size_cm < 10) status = 'intermediate_risk_imatinib_review';
  else if (req.mitotic_index === 'low' && req.size_cm < 5 && req.imatinib_started) status = 'low_risk_imatinib_not_indicated';
  else if (req.response === 'progression' && req.imatinib_started) status = 'imatinib_progression_switch_sunitinib';
  else status = 'gist_review';
  return { status, mi: req.mitotic_index };
}

function pancreatic_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stage, 'stage', ['resectable','borderline_resectable','locally_advanced','metastatic','recurrent','other']);
  ensureNumber(req.ca_19_9, 'ca');
  ensureBool(req.whipple_planned, 'whipple');
  ensureEnum(req.neoadjuvant_chemo, 'neo', ['gemcitabine_nab_paclitaxel','folfirinox','gemcitabine_capecitabine','none','other']);
  ensureEnum(req.response, 'resp', ['complete_response','partial','stable','progression','not_assessed','other']);
  let status;
  if (req.stage === 'metastatic') status = 'metastatic_pancreatic_palliative';
  else if (req.stage === 'resectable' && req.whipple_planned && req.neoadjuvant_chemo === 'none') status = 'resectable_consider_neoadjuvant';
  else if (req.stage === 'borderline_resectable' && req.response === 'partial') status = 'borderline_resectable_partial_proceed_surgery';
  else if (req.ca_19_9 >= 500) status = 'ca_19_9_high_aggressive_review';
  else status = 'pancreatic_cancer_review';
  return { status, stage: req.stage };
}

function neuroendocrine_tumor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.primary_site, 'site', ['small_bowel','appendix','rectum','stomach','pancreas','colon','liver_metastasis','unknown','other']);
  ensureEnum(req.grade, 'grade', ['g1','g2','g3','unknown']);
  ensureBool(req.octreotide_scan_positive, 'octreotide');
  ensureNumber(req.ki67, 'ki67');
  ensureBool(req.functional, 'functional');
  ensureEnum(req.treatment, 'rx', ['observation','octreotide','lanreotide','surgery','prrt','everolimus','capecitabine_temozolomide','combination','other']);
  let status;
  if (req.grade === 'g3') status = 'g3_net_aggressive_chemotherapy';
  else if (req.ki67 >= 20) status = 'high_ki67_consider_chemotherapy';
  else if (req.functional && req.treatment === 'observation') status = 'functional_net_somatostatin_analogue';
  else if (req.grade === 'g1' && req.ki67 < 3 && req.treatment === 'observation') status = 'g1_ki67_low_observation';
  else status = 'net_review';
  return { status, g: req.grade };
}

function funcs() { return { colon_cancer_staging, gi_lymphoma, gist, pancreatic_cancer, neuroendocrine_tumor }; }
module.exports = { funcs, ValidationError };