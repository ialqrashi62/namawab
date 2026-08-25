// filepath: tier5_derm2_ext_101_mohs_engine.js
// TIER5_DERM2_EXT-101: Mohs surgery, dermatopathology staging, defect reconstruction
'use strict';

const CITATIONS = [
  'Mohs_College_MSA_RCS_2014',
  'AAPM_Mohs_Standards_2019',
  'NCCN_BCC_2023',
  'NCCN_Melanoma_2023',
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

function mohs_candidate(req) {
  ensureStr(req.lesion_type, 'lesion_type');
  ensureEnum(req.lesion_type, 'lesion_type', ['bcc','scc','melanoma_in_situ','lentigo_maligna','desmoplastic','dermatofibrosarcoma_p']);
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['h_zone','mid','low_face_or_chest','trunk_extremity']);
  ensureNumber(req.diameter_mm, 'diameter_mm');
  ensureBool(req.recurrent, 'recurrent');
  ensureBool(req.immunosuppressed, 'immunosuppressed');

  if (req.diameter_mm <= 0) throw new ValidationError('diameter_mm >0', 'diameter_mm');

  let tier;
  let reason;
  if (req.lesion_type === 'bcc' && (req.location === 'h_zone' || req.recurrent)) { tier = 'mohs_firstline_high_recurrence'; reason = 'high_recurrence_zone_or_recurrent_tumor'; }
  else if (req.lesion_type === 'scc' && req.diameter_mm >= 10 && req.location === 'h_zone') { tier = 'mohs_firstline_high_risk_scc'; reason = 'high_risk_scc_size_2cm_or_high_risk_zone'; }
  else if (req.lesion_type === 'scc' && req.immunosuppressed) { tier = 'mohs_firstline_immunosuppressed_scc'; reason = 'immunosuppression_increases_recurrence'; }
  else if (req.lesion_type === 'dermatofibrosarcoma_p' || req.lesion_type === 'lentigo_maligna') { tier = 'mohs_firstline_unusual_subtypes'; reason = 'subtle_subclinical_extension_requires_mohs'; }
  else if (req.lesion_type === 'melanoma_in_situ') { tier = 'wide_local_excision_or_mohs'; reason = 'consider_mohs_with_immunostaining'; }
  else { tier = 'standard_excision_recommended'; reason = 'low_risk_lesion_in_low_risk_zone'; }

  return { lesion_type: req.lesion_type, location: req.location, diameter_mm: req.diameter_mm, tier, reason, citations: CITATIONS };
}

function stage_count(req) {
  ensureNumber(req.lesion_size_mm, 'lesion_size_mm');
  ensureNumber(req.histologic_subtype, 'histologic_subtype'); // 0=low risk, 1=infiltrative, 2=moderately differentiated
  ensureBool(req.perineural_involvement, 'perineural_involvement');

  let base_stage = 1;
  if (req.lesion_size_mm >= 20) base_stage += 1;
  if (req.histologic_subtype >= 1) base_stage += 1;
  if (req.perineural_involvement) base_stage += 1;
  return {
    estimated_stages: base_stage,
    expected_mohs_layers_in_path_blocks: base_stage * 4,
    citation: CITATIONS[1],
  };
}

function breslow(req) {
  ensureNumber(req.thickness_mm, 'thickness_mm');
  ensureNumber(req.ulceration, 'ulceration'); // 0 or 1
  ensureNumber(req.mitotic_rate_mm2, 'mitotic_rate_mm2');
  if (req.thickness_mm < 0 || req.thickness_mm > 30) throw new ValidationError('breslow 0..30', 'thickness_mm');

  let t_stage;
  if (req.thickness_mm <= 0.8) t_stage = 'T1';
  else if (req.thickness_mm <= 1.0) t_stage = 'T1b';
  else if (req.thickness_mm <= 2.0) t_stage = 'T2';
  else if (req.thickness_mm <= 4.0) t_stage = 'T3';
  else t_stage = 'T4';

  return {
    thickness_mm: req.thickness_mm,
    ulceration_present: !!req.ulceration,
    mitotic_rate: req.mitotic_rate_mm2,
    t_stage_ajcc_8: t_stage,
    sentinel_node_consideration: req.thickness_mm >= 0.8 || req.ulceration ? 'discuss_sln_biopsy' : 'not_required_low_risk',
    citation: CITATIONS[3],
  };
}

function bcc_subtype(req) {
  ensureStr(req.subtype, 'subtype');
  ensureEnum(req.subtype, 'subtype', ['nodular','superficial','micronodular','infiltrative','morpheaform','sclerosing']);
  ensureNumber(req.diameter_mm, 'diameter_mm');

  let recurrence_rate;
  let mohs_indicated;
  switch (req.subtype) {
    case 'nodular': recurrence_rate = 5; mohs_indicated = req.diameter_mm >= 10 ? 'consider' : 'no'; break;
    case 'superficial': recurrence_rate = 7; mohs_indicated = 'no'; break;
    case 'micronodular': recurrence_rate = 22; mohs_indicated = 'yes'; break;
    case 'infiltrative': recurrence_rate = 25; mohs_indicated = 'yes'; break;
    case 'morpheaform': recurrence_rate = 28; mohs_indicated = 'yes'; break;
    case 'sclerosing': recurrence_rate = 22; mohs_indicated = 'yes'; break;
  }
  return { subtype: req.subtype, expected_5y_recurrence_pct: recurrence_rate, mohs_indicated, citation: CITATIONS[2] };
}

function defect_closure(req) {
  ensureNumber(req.defect_size_cm2, 'defect_size_cm2');
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['nose','lip','eyelid','cheek','forehead','scalp','hand','foot','ear','trunk']);
  ensureNumber(req.depth_mm, 'depth_mm');
  ensureBool(req.perichondrium_or_periosteum_exposed, 'perichondrium_or_periosteum_exposed');

  let approach;
  if (req.defect_size_cm2 < 1) approach = 'primary_closure_side_to_side';
  else if (req.defect_size_cm2 < 4 && ['cheek','forehead','scalp'].includes(req.location)) approach = 'local_flap_advancement';
  else if (['nose','lip','eyelid','ear'].includes(req.location)) approach = 'two_stage_flap_or_full_thickness_skin_graft';
  else if (req.defect_size_cm2 >= 10 && req.perichondrium_or_periosteum_exposed) approach = 'interpolation_flap_or_pedicled_fasciocutaneous_flap';
  else if (req.depth_mm >= 5 && ['hand','foot'].includes(req.location)) approach = 'specialty_reconstruction_referral';
  else approach = 'primary_closure_or_FTSG';

  return { defect_size_cm2: req.defect_size_cm2, location: req.location, approach, citations: CITATIONS };
}

function funcs() {
  return { mohs_candidate, stage_count, breslow, bcc_subtype, defect_closure };
}

module.exports = { funcs, CITATIONS, ValidationError };
