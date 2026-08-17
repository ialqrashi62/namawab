// filepath: tier38_dermatology_ext_225_skin_cancer_engine.js
// TIER38_DERMATOLOGY-225: Skin cancer
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function melanoma_staging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.breslow_mm, 'breslow');
  ensureBool(req.ulceration, 'ulc');
  ensureNumber(req.mitotic_rate, 'mit');
  ensureEnum(req.sentinel_node, 'sn', ['positive','negative','pending','not_done','other']);
  ensureEnum(req.stage, 'stage', ['t1a_n0_m0','t1b_n0_m0','t2a_n0_m0','t2b_n0_m0','t3a_n0_m0','t3b_n0_m0','t4a_n0_m0','t4b_n0_m0','t_any_n1_m0','t_any_n2_m0','t_any_n3_m0','t_any_n_any_m1','other']);
  let status;
  if (req.stage.includes('m1')) status = 'metastatic_melanoma_systemic_immunotherapy';
  else if (req.sentinel_node === 'positive' && !req.stage.includes('n1')) status = 'sentinel_node_positive_re_review_stage';
  else if (req.breslow_mm >= 4 || req.ulceration) status = 'high_risk_melanoma_adjuvant_refer';
  else if (req.stage === 't1a_n0_m0') status = 't1a_low_risk_observation';
  else status = 'melanoma_staged';
  return { status, breslow: req.breslow_mm };
}

function basal_cell(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['nodular','superficial','micronodular','infiltrative','morpheaform','basosquamous','other']);
  ensureEnum(req.location, 'loc', ['face','scalp','neck','trunk','limb','hand','foot','multiple','other']);
  ensureNumber(req.size_mm, 'size');
  ensureEnum(req.depth, 'depth', ['superficial','dermal','subcutaneous','cartilage_invasion','bone_invasion','other']);
  ensureBool(req.recurrent, 'rec');
  ensureEnum(req.subtype, 'risk', ['low_risk','high_risk','unknown','other']);
  let status;
  if (req.subtype === 'high_risk' || req.recurrent) status = 'high_risk_bcc_mohs_refer';
  else if (req.location === 'face' && req.size_mm >= 20) status = 'face_large_bcc_mohs';
  else if (req.type === 'morpheaform' || req.type === 'infiltrative') status = 'aggressive_bcc_mohs_recommended';
  else status = 'bcc_low_risk_excision_review';
  return { status, t: req.type };
}

function squamous_cell(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.differentiation, 'diff', ['well','moderate','poor','undifferentiated','unknown','other']);
  ensureEnum(req.location, 'loc', ['face','scalp','ear','lip','forearm','hand','genital','other']);
  ensureNumber(req.size_mm, 'size');
  ensureNumber(req.depth, 'depth');
  ensureBool(req.perineural_invasion, 'pni');
  ensureBool(req.immunosuppressed, 'imm');
  let status;
  if (req.perineural_invasion) status = 'pni_scc_mohs_adjuvant_radiation';
  else if (req.immunosuppressed && req.differentiation !== 'well') status = 'immunosuppressed_scc_mohs';
  else if (req.differentiation === 'poor' || req.depth >= 6) status = 'high_risk_scc_mohs';
  else if (req.location === 'lip' || req.location === 'ear') status = 'high_risk_site_scc_mohs';
  else status = 'scc_low_risk_excision';
  return { status, d: req.differentiation };
}

function actinic_keratosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.lesion_count, 'cnt');
  ensureEnum(req.site, 'site', ['face','scalp','forearms','hands','trunk','multiple','other']);
  ensureBool(req.treatment_cryo, 'cryo');
  ensureEnum(req.field_treatment, 'field', ['none','imiquimod','5_fu','ingenol','diclofenac','photodynamic','other']);
  ensureBool(req.sun_protection, 'sp');
  let status;
  if (req.lesion_count >= 10 && req.field_treatment === 'none') status = 'high_count_field_treatment_indicated';
  else if (req.sun_protection === false) status = 'sun_protection_counsel_required';
  else if (req.lesion_count <= 3 && req.treatment_cryo) status = 'isolated_ak_cryo_appropriate';
  else if (req.field_treatment !== 'none') status = 'field_treatment_initiated';
  else status = 'ak_review_appropriate';
  return { status, cnt: req.lesion_count };
}

function mohs_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.indication, 'ind', ['high_risk_scc','bcc_h_zone','high_risk_bcc','recurrent_bcc','melanoma_in_situ','other']);
  ensureEnum(req.location, 'loc', ['face','nose','ear','eyelid','lip','scalp','hand','foot','genital','other']);
  ensureNumber(req.pre_op_size_cm, 'pre');
  ensureNumber(req.stages_required, 'stages');
  ensureEnum(req.clearance, 'clear', ['achieved','not_achieved','pending','unknown','other']);
  ensureEnum(req.reconstruction, 'recon', ['primary','flap','graft','secondary_intention','refer_plastic','other']);
  let status;
  if (req.clearance === 'not_achieved') status = 'mohs_incomplete_re_excision';
  else if (req.stages_required >= 3) status = 'extensive_mohs_complex_reconstruction_refer';
  else if (req.clearance === 'achieved' && req.location === 'nose' && req.reconstruction === 'flap') status = 'mohs_nose_flap_appropriate';
  else if (req.indication === 'high_risk_scc') status = 'mohs_high_risk_scc_complete';
  else status = 'mohs_review';
  return { status, ind: req.indication };
}

function funcs() { return { melanoma_staging, basal_cell, squamous_cell, actinic_keratosis, mohs_surgery }; }
module.exports = { funcs, ValidationError };