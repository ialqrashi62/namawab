// filepath: tier5_derm2_ext_105_pigmented_lesion_engine.js
// TIER5_DERM2_EXT-105: Pigmented lesion (ABCDE, dermatoscopy, excision margin, cryo, pathology)
'use strict';

const CITATIONS = [
  'AAD_ABCDE_Melanoma_2019',
  'ISIC_Dermatoscopy_2022',
  'NCCN_Melanoma_2023',
  'AAD_Cryo_2016',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function abcde_score(req) {
  ensureBool(req.asymmetry, 'asymmetry');
  ensureBool(req.border_irregular, 'border_irregular');
  ensureBool(req.color_variegation, 'color_variegation');
  ensureBool(req.diameter_gt_6mm, 'diameter_gt_6mm');
  ensureBool(req.evolution_change, 'evolution_change');
  ensureNumber(req.jury_score_optional, 'jury_score_optional');

  const flags = [req.asymmetry, req.border_irregular, req.color_variegation, req.diameter_gt_6mm, req.evolution_change].filter(Boolean).length;
  let triage;
  if (flags === 0) triage = 'benign_no_workup';
  else if (flags <= 1) triage = 'low_suspicion_documented_photo_during_followup';
  else if (flags <= 2) triage = 'moderate_pursue_dermatoscopy';
  else triage = 'high_pursue_biopsy_path';

  return { flags, triage, citations: CITATIONS };
}

function dermatoscopy(req) {
  ensureStr(req.pattern_type, 'pattern_type');
  ensureEnum(req.pattern_type, 'pattern_type', ['typical_pigmented_network','atypical_pigmented_network','blue_white_veil','regression_structures','atypical_vascular','homogenous_blue','irregular_streaks','irregular_pigmented_globules','polygonal_structures']);
  ensureBool(req.foci_blue_white, 'foci_blue_white');
  ensureBool(req.seven_point_checklist_present, 'seven_point_checklist_present');
  ensureNumber(req.total_score, 'total_score');

  let classification;
  if (req.pattern_type === 'typical_pigmented_network' && !req.foci_blue_white && req.total_score < 3) classification = 'benign_nevus';
  else if (req.pattern_type === 'regression_structures') classification = 'regression_consider_pursue_4mm_punch_then_wide_excision';
  else if (req.seven_point_checklist_present && req.total_score >= 3) classification = 'high_risk_refer_to_dermoscopy_specialist_then_biopsy';
  else classification = 'indeterminate_photo_followup_in_3_months';

  return { pattern_type: req.pattern_type, total_score: req.total_score, classification };
}

function excision_margin(req) {
  ensureNumber(req.lesion_mm, 'lesion_mm');
  ensureStr(req.pathology_diagnosis, 'pathology_diagnosis');
  ensureEnum(req.pathology_diagnosis, 'pathology_diagnosis', ['in_situ','thin_melanoma','intermediate_melanoma','thick_melanoma','bcc_low_risk','bcc_high_risk','scc_low_risk','scc_high_risk']);
  ensureBool(req.in_situ_margin, 'in_situ_margin');

  let margin_cm;
  let followup_intervals;
  switch (req.pathology_diagnosis) {
    case 'in_situ': margin_cm = 0.5; followup_intervals = 'every_6_months'; break;
    case 'thin_melanoma': margin_cm = 1.0; followup_intervals = 'every_6_to_12_months'; break;
    case 'intermediate_melanoma': margin_cm = 1.0; followup_intervals = 'every_4_months'; break;
    case 'thick_melanoma': margin_cm = 2.0; followup_intervals = 'every_3_months'; break;
    case 'bcc_low_risk': margin_cm = 0.4; followup_intervals = 'yearly'; break;
    case 'bcc_high_risk': margin_cm = 0.5; followup_intervals = 'every_3_to_6_months_2y_then_yearly'; break;
    case 'scc_low_risk': margin_cm = 0.4; followup_intervals = 'yearly'; break;
    case 'scc_high_risk': margin_cm = 1.0; followup_intervals = 'every_3_months_2y_then_yearly'; break;
  }
  return { lesion_mm: req.lesion_mm, pathology_diagnosis: req.pathology_diagnosis, margin_cm, followup_intervals, citation: CITATIONS[2] };
}

function cryo_setup(req) {
  ensureStr(req.lesion_type, 'lesion_type');
  ensureEnum(req.lesion_type, 'lesion_type', ['actinic_keratosis','wart','pyogenic_granuloma','lentigo_simple','keratoacanthoma','superficial_bcc','seborrheic_keratosis']);
  ensureNumber(req.diameter_mm, 'diameter_mm');
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['face','nose_finger_tongue','trunk_extremity','hand_foot']);

  let freeze_sec;
  let thaw_sec;
  if (req.lesion_type === 'actinic_keratosis') { freeze_sec = 5; thaw_sec = 15; }
  else if (req.lesion_type === 'wart') { freeze_sec = 12; thaw_sec = 30; }
  else if (req.lesion_type === 'seborrheic_keratosis') return { lesion_type: req.lesion_type, recommendation: 'do_not_use_cryotherapy_consider_curettage_or_laser' };
  else if (req.lesion_type === 'superficial_bcc') { freeze_sec = 30; thaw_sec = 45; }
  else { freeze_sec = 15; thaw_sec = 30; }

  if (['nose_finger_tongue','hand_foot'].includes(req.location) && req.lesion_type === 'wart') return { recommendation: 'no_cryotherapy_avoid_permanent_onychodystrophy_use_other', freeze_sec, thaw_sec };
  return { lesion_type: req.lesion_type, freeze_sec, thaw_sec, cycles: req.diameter_mm > 5 ? 2 : 1, citation: CITATIONS[3] };
}

function pathology_reporting(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureStr(req.tumor_type, 'tumor_type');
  ensureEnum(req.tumor_type, 'tumor_type', ['melanoma','bcc','scc','nevi','dermatofibroma','merkel_cell_carcinoma','other']);
  ensureBool(req.lymph_nodes_present, 'lymph_nodes_present');
  ensureBool(req.margin_assessment_done, 'margin_assessment_done');
  ensureStr(req.margin_status, 'margin_status');
  ensureEnum(req.margin_status, 'margin_status', ['positive','close_greater_2mm','negative','unknown']);

  const completeness = req.margin_assessment_done && req.margin_status !== 'unknown';

  return {
    specimen_id: req.specimen_id,
    tumor_type: req.tumor_type,
    margin_assessment_done: req.margin_assessment_done,
    margin_status: req.margin_status,
    lymph_nodes_present: req.lymph_nodes_present,
    report_completeness_pct: completeness ? 100 : 50,
    notes: !completeness ? 'request_deeper_sections_or_re_excision_if_close_or_positive' : 'complete_report',
    citation: CITATIONS[2],
  };
}

function funcs() {
  return { abcde_score, dermatoscopy, excision_margin, cryo_setup, pathology_reporting };
}

module.exports = { funcs, CITATIONS, ValidationError };
