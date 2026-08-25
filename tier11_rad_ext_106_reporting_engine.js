// filepath: tier11_rad_ext_106_reporting_engine.js
// TIER11_RAD_EXT-106: Structured reporting & communication (BI-RADS, Lung-RADS, TI-RADS, critical results, follow-up)
'use strict';

const CITATIONS = ['ACR_BIRADS_2024','ACR_LUNGRADS_2024','ACR_TIRADS_2024','ACR_CR_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function rep_birads(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.birads, 'birads', ['0_incomplete','1_negative','2_benign','3_probably_benign','4a_low_suspicion','4b_moderate','4c_high','5_highly_suspicious','6_known_malignancy']);
  ensureNumber(req.lesion_count, 'lesion_count');
  ensureNumber(req.density, 'density');
  ensureEnum(req.density_category, 'density_category', ['a_almost_entirely_fat','b_scattered','c_heterogeneously','d_extremely']);
  ensureBool(req.prior_comparison, 'prior_comparison');
  ensureEnum(req.recommendation, 'recommendation', ['routine','short_followup_6mo','annual','tissue_diagnosis_optional','tissue_diagnosis_usually','tissue_diagnosis_required','surgical_consult','clinical_correlate','additional_imaging','none']);

  let birads_status;
  if (req.birads === '0_incomplete') birads_status = 'incomplete_additional_imaging';
  else if (req.birads === '4a_low_suspicion' || req.birads === '4b_moderate' || req.birads === '4c_high') birads_status = 'suspicious_biopsy_required';
  else if (req.birads === '5_highly_suspicion') birads_status = 'highly_suspicious_action_required';
  else if (req.birads === '6_known_malignancy') birads_status = 'known_malignancy_staging';
  else if (req.birads === '3_probably_benign') birads_status = 'probably_benign_followup_6mo';
  else birads_status = 'benign_routine_followup';
  return { birads_status, birads: req.birads, density: req.density_category };
}

function rep_lungrads(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.lungrads, 'lungrads', ['0_incomplete','1_negative','2_benign','3_probably_benign','4a','4b','4x','s_2a','s_2b','s_3','c_invasive']);
  ensureNumber(req.nodule_count, 'nodule_count');
  ensureNumber(req.dominant_nodule_mm, 'dominant_nodule_mm');
  ensureEnum(req.spiculation, 'spiculation', ['none','smooth','lobulated','spiculated','not_assessed']);
  ensureBool(req.prior_comparison, 'prior_comparison');
  ensureEnum(req.modality, 'modality', ['ct_lung_screening','ct_chest_other','pet_ct','other']);

  let lungrads_status;
  if (req.lungrads === '4x') lungrads_status = 'category_4x_high_suspicion_consider_pet_or_tissue';
  else if (req.lungrads === '4b' || req.lungrads === '4a') lungrads_status = 'suspicious_followup_protocol';
  else if (req.lungrads.startsWith('s_')) lungrads_status = 'screening_inconclusive_workup';
  else if (req.lungrads === '3_probably_benign') lungrads_status = 'probably_benign_ct_6mo';
  else if (req.lungrads === '2_benign' || req.lungrads === '1_negative') lungrads_status = 'benign_or_negative_continue_annual';
  else lungrads_status = 'review_required';
  return { lungrads_status, lungrads: req.lungrads, nodule_mm: req.dominant_nodule_mm };
}

function rep_tirads(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.tirads, 'tirads', ['tr1_benign','tr2_not_suspicious','tr3_mildly_suspicious','tr4_moderately_suspicious','tr5_highly_suspicious','tr6_known_malignant','not_assessed']);
  ensureNumber(req.max_dimension_mm, 'max_dimension_mm');
  ensureEnum(req.composition, 'composition', ['cystic','spongiform','mixed_cystic_solid','solid','not_assessed']);
  ensureEnum(req.echogenicity, 'echogenicity', ['anechoic','hyperechoic','isoechoic','hypoechoic','very_hypoechoic','not_assessed']);

  let tirads_status;
  if (req.tirads === 'tr5_highly_suspicious' || req.tirads === 'tr4_moderately_suspicious') tirads_status = 'suspicious_fna_or_active_surveillance';
  else if (req.tirads === 'tr3_mildly_suspicious') tirads_status = 'mildly_suspicious_followup';
  else if (req.tirads === 'tr2_not_suspicious') tirads_status = 'not_suspicious_routine_followup';
  else if (req.tirads === 'tr1_benign') tirads_status = 'benign_no_action';
  else tirads_status = 'review_required';
  return { tirads_status, tirads: req.tirads, size: req.max_dimension_mm };
}

function rep_critical_result(req) {
  ensureStr(req.finding_id, 'finding_id');
  ensureEnum(req.critical_category, 'critical_category', ['pulmonary_embolism','aortic_dissection','intracranial_hemorrhage','bowel_perforation','bowel_obstruction','acute_appendicitis','testicular_torsion','ovarian_torsion','ruptured_aaa','free_air','fracture_dislocation','foreign_body','misplaced_tube','other']);
  ensureNumber(req.minutes_to_communicate, 'minutes_to_communicate');
  ensureEnum(req.communicated_to, 'communicated_to', ['ordering_provider','covering_provider','nurse_rn','patient_direct','emerg_md','other']);
  ensureBool(req.read_back_documented, 'read_back_documented');
  ensureEnum(req.communication_method, 'communication_method', ['phone','in_person','video','paging','secure_message','other']);

  let cr_status;
  if (!req.read_back_documented) cr_status = 'read_back_required_blocking_documentation';
  else if (req.minutes_to_communicate > 60) cr_status = 'communication_exceeds_60min_target_review';
  else if (req.communication_method === 'secure_message' && req.critical_category.includes('embolism')) cr_status = 'message_only_for_critical_insufficient';
  else if (req.communicated_to === 'patient_direct') cr_status = 'patient_communicated_unusual_review';
  else cr_status = 'critical_result_communicated_correctly';
  return { cr_status, category: req.critical_category, minutes: req.minutes_to_communicate };
}

function rep_follow_up(req) {
  ensureStr(req.report_id, 'report_id');
  ensureEnum(req.recommendation, 'recommendation', ['no_followup','imaging_followup_3mo','imaging_followup_6mo','imaging_followup_12mo','clinical_followup','tissue_diagnosis','specialist_referral','additional_imaging','expedited_clinical']);
  ensureNumber(req.days_to_followup, 'days_to_followup');
  ensureBool(req.patient_notified, 'patient_notified');
  ensureBool(req.ordering_provider_acknowledged, 'ordering_provider_acknowledged');
  ensureBool(req.scheduling_complete, 'scheduling_complete');

  let fu_status;
  if (!req.ordering_provider_acknowledged) fu_status = 'ordering_provider_ack_pending';
  else if (!req.patient_notified) fu_status = 'patient_notified_pending';
  else if (!req.scheduling_complete) fu_status = 'patient_notified_awaiting_scheduling';
  else if (req.days_to_followup <= 0) fu_status = 'followup_overdue_alert';
  else if (req.days_to_followup <= 30) fu_status = 'followup_scheduled_within_30d';
  else fu_status = 'followup_scheduled_outpatient';
  return { fu_status, recommendation: req.recommendation, days: req.days_to_followup };
}

function funcs() { return { rep_birads, rep_lungrads, rep_tirads, rep_critical_result, rep_follow_up }; }
module.exports = { funcs, CITATIONS, ValidationError };