// filepath: tier10_lab_ext_103_micro_engine.js
// TIER10_LAB_EXT-103: Microbiology (culture, gram stain, sensitivity, AFB, blood culture)
'use strict';

const CITATIONS = ['CLSI_M100_2024','CLSI_M02_2024','WHO_AMR_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function micro_culture_setup(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureEnum(req.specimen_type, 'specimen_type', ['blood','urine','sputum','csf','wound','stool','throat','eye','ear','genital','tissue','body_fluid','catheter_tip','bone_marrow','environmental','other']);
  ensureNumber(req.hours_to_inoculation, 'hours_to_inoculation');
  ensureNumber(req.temperature_celsius, 'temperature_celsius');
  ensureBool(req.gram_stain_performed, 'gram_stain_performed');
  ensureEnum(req.transport_medium, 'transport_medium', ['sterile_container','swab_amies','swab_cary_blair','blood_broth','anaerobic_transport','urine_boric_acid','viral_transport','none_required','other']);

  let setup_status;
  if (req.temperature_celsius > 30 || req.temperature_celsius < 2) setup_status = 'temperature_excursion_reject_specimen';
  else if (req.hours_to_inoculation > 24 && req.specimen_type === 'blood') setup_status = 'over_24h_blood_reject';
  else if (req.hours_to_inoculation > 48) setup_status = 'over_48h_specimen_deteriorated';
  else if (!req.gram_stain_performed) setup_status = 'gram_stain_required_for_initial_assessment';
  else setup_status = 'cultured_adequately';
  return { setup_status, specimen: req.specimen_type, temp: req.temperature_celsius };
}

function micro_gram_stain(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureEnum(req.organism_observed, 'organism_observed', ['none_seen','gram_positive_cocci','gram_positive_rods','gram_negative_cocci','gram_negative_rods','gram_variable','yeast','mixed','contaminated','insufficient_sample']);
  ensureNumber(req.wbc_per_lpf, 'wbc_per_lpf');
  ensureNumber(req.epithelial_cells_per_lpf, 'epithelial_cells_per_lpf');
  ensureEnum(req.quality, 'quality', ['excellent','acceptable','poor_contaminated','unsatisfactory','rejected']);

  let interpretation;
  if (req.quality === 'rejected' || req.quality === 'unsatisfactory') interpretation = 'rejected_request_new_specimen';
  else if (req.organism_observed === 'contaminated' || req.epithelial_cells_per_lpf >= 25) interpretation = 'contaminated_respiratory_sample_quality_issue';
  else if (req.organism_observed === 'none_seen' && req.wbc_per_lpf >= 10) interpretation = 'wbc_present_no_organism_atypical_pathogen';
  else if (req.organism_observed === 'insufficient_sample') interpretation = 'insufficient_recollect';
  else interpretation = 'organism_identified_review_culture';
  return { interpretation, organism: req.organism_observed, wbc: req.wbc_per_lpf };
}

function micro_sensitivity(req) {
  ensureStr(req.isolate_id, 'isolate_id');
  ensureEnum(req.method, 'method', ['kirby_bauer_disk','mic_broth','etest','automated_panel','maldi_tof','maldi_tof_with_ast']);
  ensureNumber(req.drug_count, 'drug_count');
  ensureEnum(req.mrs_phenotype, 'mrs_phenotype', ['mrsa','mssa','mrse','vsa','vre','cre','esbl','ampc','carbapenem_resistant','mbl','klebsiella_pneumoniae_carba','susceptible','unknown','not_applicable']);
  ensureNumber(req.resistant_drugs, 'resistant_drugs');

  let ast_status;
  if (req.mrs_phenotype === 'mrsa' || req.mrs_phenotype === 'cre' || req.mrs_phenotype === 'vre') ast_status = 'mdr_organism_isolate_contact_precautions';
  else if (req.mrs_phenotype === 'esbl' || req.mrs_phenotype === 'ampc') ast_status = 'esbl_ampc_infection_control_alert';
  else if (req.resistant_drugs >= 3) ast_status = 'multidrug_resistant_review_antibiotic_stewardship';
  else if (req.drug_count < 5) ast_status = 'limited_drug_panel_request_full';
  else ast_status = 'sensitivity_complete';
  return { ast_status, phenotype: req.mrs_phenotype, resistant: req.resistant_drugs };
}

function micro_blood_culture(req) {
  ensureStr(req.bottle_id, 'bottle_id');
  ensureNumber(req.hours_to_positive, 'hours_to_positive');
  ensureNumber(req.bottles_drawn, 'bottles_drawn');
  ensureNumber(req.bottles_positive, 'bottles_positive');
  ensureEnum(req.pathogen, 'pathogen', ['none_yet','gram_pos_cocci','gram_neg_rods','yeast','polymicrobial','contaminant','coag_neg_staph','propionibacterium','bacillus','corynebacterium','other']);
  ensureBool(req.id_by_maldi, 'id_by_maldi');

  let bc_status;
  if (req.bottles_positive === 0 && req.hours_to_positive > 120) bc_status = 'final_negative_at_5_days';
  else if (req.bottles_positive >= 2 && req.pathogen === 'coag_neg_staph') bc_status = 'likely_contaminant_review_clinical';
  else if (req.bottles_positive === 1 && req.pathogen === 'coag_neg_staph') bc_status = 'possible_contaminant_recommend_repeat';
  else if (req.bottles_positive >= 1 && req.pathogen !== 'contaminant') bc_status = 'true_bacteremia_initiate_therapy';
  else if (req.hours_to_positive < 24) bc_status = 'early_positive_alert_clinician';
  else bc_status = 'in_progress';
  return { bc_status, hours: req.hours_to_positive, pathogen: req.pathogen };
}

function micro_afb_smear(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureNumber(req.smears_examined, 'smears_examined');
  ensureEnum(req.result, 'result', ['negative','scanty','1_plus','2_plus','3_plus','positive_unspecified','unsatisfactory']);
  ensureBool(req.tb_pcr_ordered, 'tb_pcr_ordered');
  ensureNumber(req.days_in_smear, 'days_in_smear');

  let afb_status;
  if (req.result === 'unsatisfactory') afb_status = 'recollect_specimen';
  else if (req.result.startsWith('negative') && req.smears_examined < 3) afb_status = 'continue_smears_to_3_negative';
  else if (req.result !== 'negative' && !req.tb_pcr_ordered) afb_status = 'positive_smear_pcr_required';
  else if (req.result !== 'negative') afb_status = 'positive_isolate_contact_precautions_n_airborne';
  else afb_status = 'three_negative_smears_tb_likely_excluded';
  return { afb_status, result: req.result, smears: req.smears_examined };
}

function funcs() { return { micro_culture_setup, micro_gram_stain, micro_sensitivity, micro_blood_culture, micro_afb_smear }; }
module.exports = { funcs, CITATIONS, ValidationError };