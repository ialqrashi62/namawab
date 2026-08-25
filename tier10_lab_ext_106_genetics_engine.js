// filepath: tier10_lab_ext_106_genetics_engine.js
// TIER10_LAB_EXT-106: Molecular genetics & cytogenetics (karyotype, FISH, panels, NIPT, PGx)
'use strict';

const CITATIONS = ['ACMG_2024','CAP_MOL_2024','ESHG_2024','FDA_NGS_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function gen_karyotype(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureEnum(req.specimen_type, 'specimen_type', ['peripheral_blood','bone_marrow','amniotic_fluid','chorionic_villi','skin_fibroblast','product_of_conception','tumor','other']);
  ensureNumber(req.metaphases_analyzed, 'metaphases_analyzed');
  ensureNumber(req.bands_per_haploid_set, 'bands_per_haploid_set');
  ensureEnum(req.iso_band_resolution, 'iso_band_resolution', ['less_than_300','300','400','550','700','850','higher_than_850','insufficient']);
  ensureEnum(req.result, 'result', ['normal_46xy','normal_46xx','abnormal','culture_failure','pending','inconclusive','maternal_contamination']);

  let k_status;
  if (req.result === 'culture_failure') k_status = 'culture_failed_re_collect_specimen';
  else if (req.result === 'maternal_contamination' && req.specimen_type === 'chorionic_villi') k_status = 'maternal_contamination_use_microdissect';
  else if (req.iso_band_resolution === 'less_than_300' && req.result === 'normal') k_status = 'low_resolution_normal_review_clinical';
  else if (req.iso_band_resolution === 'insufficient') k_status = 'banding_too_low_uninterpretable';
  else if (req.result === 'abnormal') k_status = 'abnormal_review_with_cytogeneticist';
  else k_status = 'karyotype_complete_normal';
  return { k_status, result: req.result, bands: req.iso_band_resolution };
}

function gen_fish(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureEnum(req.panel, 'panel', ['bcma_lymphoma','aml_recurrent','mds_panel','cml_bcr_abl','eosinophil_panel','her2_breast','alk_lung','myc_bcl2_bcl6','urovysion_bladder','microdeletion','subtelomere','pml_rara','singleton_custom','other'],
  );
  ensureNumber(req.probes_tested, 'probes_tested');
  ensureNumber(req.cells_analyzed, 'cells_analyzed');
  ensureEnum(req.result, 'result', ['normal','abnormal','failed','insufficient','pending']);
  ensureBool(req.dual_color, 'dual_color');

  let fish_status;
  if (req.result === 'failed' || req.result === 'insufficient') fish_status = 're_collect_or_more_cells';
  else if (req.result === 'abnormal') fish_status = 'abnormal_review_with_oncologist';
  else if (req.cells_analyzed < 200) fish_status = 'borderline_cells_count_review';
  else fish_status = 'fish_normal_no_abnormality';
  return { fish_status, panel: req.panel, result: req.result };
}

function gen_panel_ngs(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.panel_name, 'panel_name', ['cancer_hotspot','cancer_full','hereditary_cancer','hereditary_cardio','hereditary_neuro','pharmacogenomics','mitochondrial','carrier_screen','prenatal_cell_free_dna','whole_exome','whole_genome','single_gene','custom_panel']);
  ensureNumber(req.gene_count, 'gene_count');
  ensureNumber(req.variant_count, 'variant_count');
  ensureEnum(req.variant_classes, 'variant_classes', ['snv','indel','cnv','structural_variant','repeat_expansion','mt_dna','none','multiple']);
  ensureBool(req.acmg_classification_done, 'acmg_classification_done');
  ensureNumber(req.pathogenic_count, 'pathogenic_count');

  let panel_status;
  if (!req.acmg_classification_done && req.variant_count >= 1) panel_status = 'classification_required_for_all_variants';
  else if (req.pathogenic_count >= 3) panel_status = 'multiple_pathogenic_review_genetic_counseling';
  else if (req.pathogenic_count === 1) panel_status = 'single_pathogenic_review_clinical';
  else if (req.variant_count === 0) panel_status = 'no_pathogenic_no_action';
  else panel_status = 'variants_of_uncertain_significance_monitor';
  return { panel_status, panel: req.panel_name, pathogenic: req.pathogenic_count };
}

function gen_nipt(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureNumber(req.ffs_pct, 'ffs_pct');
  ensureEnum(req.trisomy_result, 'trisomy_result', ['low_risk_all','high_risk_t21','high_risk_t18','high_risk_t13','high_risk_multiple','low_risk_partial','no_call','pending']);
  ensureEnum(req.sex_chromosome_result, 'sex_chromosome_result', ['xx','xy','xx_xy_abnormal','xxy','xyy','xxx','x_monosomy','not_reported','pending']);
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');

  let nipt_status;
  if (req.ffs_pct < 4) nipt_status = 'low_ffs_no_call_redraw_or_additional_testing';
  else if (req.gestational_age_weeks < 10) nipt_status = 'too_early_repeat_later';
  else if (req.trisomy_result.includes('high_risk')) nipt_status = 'high_risk_confirm_with_diagnostic_test';
  else if (req.trisomy_result === 'no_call') nipt_status = 'no_call_redraw_recommend';
  else nipt_status = 'low_risk_no_action';
  return { nipt_status, ffs: req.ffs_pct, trisomy: req.trisomy_result };
}

function gen_pgx(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.gene, 'gene', ['cyp2d6','cyp2c19','cyp2c9','cyp3a5','cyp3a4','dpyd','tpmt','nudt15','slco1b1','ugt1a1','hla_b','ryr1','cacna1s','other']);
  ensureEnum(req.phenotype, 'phenotype', ['poor_metabolizer','intermediate_metabolizer','normal_metabolizer','rapid_metabolizer','ultrarapid_metabolizer','indeterminate','not_assessed']);
  ensureNumber(req.drugs_in_profile, 'drugs_in_profile');
  ensureNumber(req.drugs_flagged_significant, 'drugs_flagged_significant');
  ensureBool(req.consulted_pharmacist, 'consulted_pharmacist');

  let pgx_status;
  if (req.phenotype === 'poor_metabolizer' && !req.consulted_pharmacist) pgx_status = 'poor_metabolizer_pharmacist_review_essential';
  else if (req.drugs_flagged_significant >= 3) pgx_status = 'multiple_significant_drugs_review_with_provider';
  else if (req.drugs_flagged_significant >= 1) pgx_status = 'one_significant_drug_review_clinical';
  else if (req.phenotype === 'normal_metabolizer') pgx_status = 'normal_metabolizer_no_action_required';
  else pgx_status = 'review_with_pharmacist_recommended';
  return { pgx_status, gene: req.gene, phenotype: req.phenotype };
}

function funcs() { return { gen_karyotype, gen_fish, gen_panel_ngs, gen_nipt, gen_pgx }; }
module.exports = { funcs, CITATIONS, ValidationError };