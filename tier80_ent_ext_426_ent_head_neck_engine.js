// filepath: tier80_ent_ext_426_ent_head_neck_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function thyroid_nodule(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.nodule_size_mm, 'ns');
  ensureEnum(req.location, 'loc', ['right','left','isthmus','bilateral','unknown','other']);
  ensureEnum(req.tirads, 'tir', ['tr1','tr2','tr3','tr4','tr5','unknown']);
  ensureBool(req.fna_done, 'fna');
  ensureEnum(req.bethesda, 'bth', ['i','ii','iii','iv','v','vi','nondiagnostic','unknown','other']);
  ensureBool(req.molecular_test, 'mt');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function thyroidectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.scope, 'scope', ['hemithyroidectomy','total','completion','subtotal','isthmusectomy','other','unknown']);
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.ebl_ml, 'ebl');
  ensureEnum(req.complications, 'comp', ['none','rln_injury','hypoparathyroidism','hematoma','infection','seroma','other']);
  ensureBool(req.rln_intact, 'rln');
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureNum(req.calcium_post, 'cap');
  ensureStr(req.finding, 'finding');
  ensureStr(req.pathology, 'path');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function neck_mass(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.mass_size_cm, 'ms');
  ensureEnum(req.location, 'loc', ['level_i','level_ii','level_iii','level_iv','level_v','submental','submandibular','parotid','thyroid','other','unknown']);
  ensureBool(req.tenderness, 'tend');
  ensureBool(req.fixed, 'fixed');
  ensureBool(req.matted_nodes, 'mn');
  ensureEnum(req.imaging, 'img', ['none','us','ct','mri','pet','other']);
  ensureBool(req.fna_done, 'fna');
  ensureStr(req.diagnosis, 'dx');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function salivary_gland(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.gland, 'gl', ['parotid','submandibular','sublingual','minor','unknown']);
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureNum(req.mass_size_cm, 'ms');
  ensureStr(req.symptoms, 'sym');
  ensureEnum(req.diagnosis, 'dx', ['pleomorphic_adenoma','warthin_tumor','mucoepidermoid','adenoid_cystic','sialadenitis','sialolithiasis','sjogren','other','unknown']);
  ensureBool(req.surgery_planned, 'splan');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function head_neck_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cancer_type, 'ct', ['oral','oropharyngeal','nasopharyngeal','hypopharyngeal','laryngeal','sinonasal','salivary','thyroid','unknown','other']);
  ensureStr(req.stage, 'stage');
  ensureStr(req.hpv_status, 'hpv');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.surgery_planned, 'splan');
  ensureBool(req.radiation_planned, 'rtp');
  ensureBool(req.chemo_planned, 'chem');
  ensureStr(req.mdt_referral, 'mdt');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { thyroid_nodule, thyroidectomy, neck_mass, salivary_gland, head_neck_cancer }; }
module.exports = { funcs, ValidationError };