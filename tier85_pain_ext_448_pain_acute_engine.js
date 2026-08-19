// filepath: tier85_pain_ext_448_pain_acute_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function acute_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.duration_hours, 'dur');
  ensureStr(req.location, 'loc');
  ensureStr(req.associated, 'asso');
  ensureBool(req.imaging_done, 'id');
  ensureStr(req.imaging_findings, 'imf');
  ensureEnum(req.pain_management, 'pm', ['oral','iv','regional','combination','pca','other','unknown']);
  ensureBool(req.ketorolac_given, 'kg');
  ensureNum(req.opioid_mme_24h, 'mme');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function ed_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.location, 'loc');
  ensureNum(req.duration_hours, 'dur');
  ensureStr(req.etiology, 'et');
  ensureEnum(req.imaging_done, 'id', ['none','xray','ct','mri','us','other']);
  ensureEnum(req.pain_management, 'pm', ['oral','iv_opioids_android','iv_opioids','iv_nsaid','combination','other','unknown']);
  ensureNum(req.opioid_mme_24h, 'mme');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','unknown','other']);
  ensureEnum(req.complications, 'comp', ['none','overdose','respiratory_depression','hypotension','allergic','other','unknown']);
  ensureEnum(req.disposition, 'disp', ['discharge','admission','transfer','observation','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function trauma_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.injury_type, 'it');
  ensureStr(req.severity_score, 'ss');
  ensureNum(req.iss_score, 'is');
  ensureStr(req.location, 'loc');
  ensureNum(req.opioid_consumed_mg, 'oc');
  ensureBool(req.nerve_block_done, 'nbd');
  ensureStr(req.block_type, 'bt');
  ensureStr(req.discharge_plan, 'dp');
  ensureEnum(req.complications, 'comp', ['none','chronic_pain','dependency','overdose','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cancer_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.cancer_stage, 'cs');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.pain_mechanism, 'pm', ['nociceptive','neuropathic','bone_metastasis','visceral','mixed','unknown']);
  ensureStr(req.location, 'loc');
  ensureNum(req.opioid_daily_mg, 'odm');
  ensureEnum(req.adjuvant, 'adj', ['gabapentin','pregabalin','duloxetine','amitriptyline','dexamethasone','none','other','unknown']);
  ensureBool(req.radiation_consulted, 'rc');
  ensureEnum(req.complications, 'comp', ['none','constipation','nausea','somnolence','confusion','other']);
  ensureEnum(req.recommendation, 'rec', ['increase_opioid','rotate','decrease','adjunct_add','palliative_referral','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function post_op_pain_titrated(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.postop_day, 'pod');
  ensureStr(req.surgery_type, 'st');
  ensureEnum(req.pain_management, 'pm', ['oral','iv','regional','combination','pca','other','unknown']);
  ensureNum(req.opioid_consumed_mg, 'oc');
  ensureEnum(req.side_effects_score, 'ses', ['none','mild','moderate','severe','unknown']);
  ensureEnum(req.bowel_function, 'bf', ['normal','constipated','ileus','none','not_applicable','unknown']);
  ensureBool(req.mobilization, 'mob');
  ensureNum(req.pain_at_activity, 'paa');
  ensureEnum(req.adjuvant, 'adj', ['acetaminophen','nsaid','gabapentin','ketamine','lidocaine','none','combination','other']);
  ensureStr(req.plan, 'plan');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { acute_pain, ed_pain, trauma_pain, cancer_pain, post_op_pain_titrated }; }
module.exports = { funcs, ValidationError };