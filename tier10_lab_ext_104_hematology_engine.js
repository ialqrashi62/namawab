// filepath: tier10_lab_ext_104_hematology_engine.js
// TIER10_LAB_EXT-104: Hematology (CBC, smear, coag, bone marrow, flow cytometry)
'use strict';

const CITATIONS = ['CLSI_H26_2024','CAP_HEMATOLOGY_2024','ISH_BONE_MARROW_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hem_cbc_interpret(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.wbc, 'wbc');
  ensureNumber(req.platelet, 'platelet');
  ensureNumber(req.mcv, 'mcv');
  ensureNumber(req.anc, 'anc');
  ensureEnum(req.age_group, 'age_group', ['neonate','pediatric','adult','geriatric','pregnant']);

  const abnormalities = [];
  if (req.hgb < 7) abnormalities.push('severe_anemia');
  else if (req.hgb < 10) abnormalities.push('moderate_anemia');
  if (req.wbc < 1) abnormalities.push('severe_leukopenia');
  else if (req.wbc < 4) abnormalities.push('leukopenia');
  else if (req.wbc > 30) abnormalities.push('leukocytosis_severe');
  if (req.platelet < 20) abnormalities.push('severe_thrombocytopenia');
  else if (req.platelet < 50) abnormalities.push('thrombocytopenia');
  if (req.anc < 0.5) abnormalities.push('neutropenic_sepsis_risk');

  let band;
  if (abnormalities.length >= 3) band = 'pancytopenia_review_bone_marrow';
  else if (abnormalities.length >= 1) band = 'multiple_abnormalities_review';
  else band = 'within_normal_limits';
  return { band, abnormalities };
}

function hem_smear_review(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureEnum(req.cell_morphology, 'cell_morphology', ['normal','rouleaux','spur_cells','schistocytes','sickle_cells','target_cells','blasts','promyelocytes','atypical_lymphocytes','smudge_cells','hypersegmented_neutrophils','toxic_granulation']);
  ensureNumber(req.platelet_estimate_per_lpf, 'platelet_estimate_per_lpf');
  ensureBool(req.atypical_cells_present, 'atypical_cells_present');
  ensureEnum(req.differential_complete, 'differential_complete', ['yes','partial','insufficient','rejected','recollected']);

  let smear_status;
  if (req.differential_complete === 'rejected' || req.differential_complete === 'insufficient') smear_status = 'recollect_specimen';
  else if (req.cell_morphology === 'blasts' || req.cell_morphology === 'promyelocytes') smear_status = 'blasts_present_review_for_leukemia';
  else if (req.atypical_cells_present && req.cell_morphology === 'atypical_lymphocytes') smear_status = 'atypical_lymphs_review_for_clonal';
  else if (req.cell_morphology === 'schistocytes') smear_status = 'schistocytes_review_microangiopathic';
  else if (req.platelet_estimate_per_lpf < 5) smear_status = 'severe_thrombocytopenia_confirmed';
  else smear_status = 'smear_reviewed_no_critical_findings';
  return { smear_status, cell_morphology: req.cell_morphology, plt_est: req.platelet_estimate_per_lpf };
}

function hem_coag(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.pt_seconds, 'pt_seconds');
  ensureNumber(req.inr, 'inr');
  ensureNumber(req.ptt_seconds, 'ptt_seconds');
  ensureNumber(req.fibrinogen, 'fibrinogen');
  ensureNumber(req.platelet_count, 'platelet_count');
  ensureBool(req.bleeding_active, 'bleeding_active');

  let coag_status;
  if (req.inr >= 5 && req.bleeding_active) coag_status = 'critical_bleeding_reversal_required';
  else if (req.inr >= 5) coag_status = 'high_inr_review_anticoagulation';
  else if (req.ptt_seconds >= 50 && req.bleeding_active) coag_status = 'critical_ptt_evaluate_factor_deficiency';
  else if (req.fibrinogen < 100) coag_status = 'low_fibrinogen_dic_or_liver_failure';
  else if (req.platelet_count < 50 && req.bleeding_active) coag_status = 'thrombocytopenic_bleeding_transfusion';
  else if (req.inr >= 1.5 || req.ptt_seconds >= 40) coag_status = 'mild_coagulopathy_monitor';
  else coag_status = 'normal_coagulation';
  return { coag_status, inr: req.inr, ptt: req.ptt_seconds };
}

function hem_bone_marrow(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureEnum(req.specimen_type, 'specimen_type', ['aspirate','biopsy','both']);
  ensureEnum(req.cellularity, 'cellularity', ['hypocellular_markedly','hypocellular_mildly','normocellular','hypercellular_mildly','hypercellular_markedly','dry_tap','insufficient']);
  ensureEnum(req.megakaryocytes, 'megakaryocytes', ['adequate','increased','decreased','absent']);
  ensureEnum(req.blast_pct_band, 'blast_pct_band', ['less_than_5','5_to_10','10_to_20','20_or_more','insufficient']);
  ensureBool(req.flow_cytometry_ordered, 'flow_cytometry_ordered');
  ensureBool(req.cytogenetics_ordered, 'cytogenetics_ordered');

  let bm_status;
  if (req.specimen_type === 'dry_tap' || req.cellularity === 'dry_tap') bm_status = 'dry_tap_re_biopsy_or_alternative_site';
  else if (req.blast_pct_band === '20_or_more') bm_status = 'blasts_20plus_review_for_aml_or_all';
  else if (req.blast_pct_band === '10_to_20') bm_status = 'blasts_10_20_review_for_mds_or_aml';
  else if (req.megakaryocytes === 'absent') bm_status = 'absent_megakaryocytes_review_immune';
  else if (!req.flow_cytometry_ordered || !req.cytogenetics_ordered) bm_status = 'flow_and_cytogenetics_required_for_workup';
  else bm_status = 'bm_evaluated_no_acute_findings';
  return { bm_status, cellularity: req.cellularity, blasts: req.blast_pct_band };
}

function hem_flow(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureEnum(req.panel_type, 'panel_type', ['leukemia_lymphoma','immune_deficiency','pnh','minimal_residual_disease','cd34_stem_cell','tbnk','hiv_cd4','platelet_glyp','other'],
  );
  ensureNumber(req.markers_tested, 'markers_tested');
  ensureNumber(req.abnormal_population_pct, 'abnormal_population_pct');
  ensureEnum(req.clonality, 'clonality', ['polyclonal','monoclonal_b','monoclonal_t','abnormal_kappa_lambda','no_clonality_detected','inconclusive','pending']);

  let flow_status;
  if (req.clonality === 'inconclusive') flow_status = 'inconclusive_consider_additional_studies';
  else if (req.abnormal_population_pct >= 5 && (req.clonality === 'monoclonal_b' || req.clonality === 'monoclonal_t')) flow_status = 'monoclonal_population_significant_clinical';
  else if (req.abnormal_population_pct >= 1 && req.clonality.includes('monoclonal')) flow_status = 'small_monoclonal_population_clinical_correlate';
  else if (req.clonality === 'no_clonality_detected') flow_status = 'no_clonality_no_lymphoid_malignancy_support';
  else flow_status = 'within_expected_polyclonal';
  return { flow_status, clonality: req.clonality, abnormal: req.abnormal_population_pct };
}

function funcs() { return { hem_cbc_interpret, hem_smear_review, hem_coag, hem_bone_marrow, hem_flow }; }
module.exports = { funcs, CITATIONS, ValidationError };