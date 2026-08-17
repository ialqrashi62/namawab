// filepath: tier35_rheumatology_ext_211_myositis_engine.js
// TIER35_RHEUMATOLOGY-211: Myositis
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function dermatomyositis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.heliotrope_rash, 'helio');
  ensureBool(req.gottron_papules, 'gottron');
  ensureBool(req.proximal_weakness, 'weak');
  ensureNumber(req.ck, 'ck');
  ensureBool(req.anti_jo1, 'jo1');
  ensureBool(req.ild_present, 'ild');
  let status;
  if (req.anti_jo1 && req.ild_present) status = 'antisynthetase_syndrome_screen';
  else if (req.heliotrope_rash && req.gottron_papules && req.proximal_weakness) status = 'dermatomyositis_classic_treat';
  else if (req.ck >= 5000 && req.proximal_weakness) status = 'severe_myositis_aggressive_treatment';
  else if (req.ild_present && req.anti_jo1) status = 'amyopathic_dermatomyositis_ild_review';
  else status = 'dermatomyositis_review';
  return { status, ck: req.ck };
}

function antisynthetase(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.anti_jo1, 'jo1', ['positive','negative','not_done']);
  ensureBool(req.ild, 'ild');
  ensureBool(req.mechanics_hands, 'mh');
  ensureBool(req.raynauds, 'ray');
  ensureBool(req.fevers, 'fev');
  ensureEnum(req.treatment, 'rx', ['prednisone','prednisone_ivig','prednisone_mtx','rituximab','combination','other','none']);
  let status;
  if (req.anti_jo1 === 'positive' && req.ild && req.mechanics_hands) status = 'complete_antisynthetase_syndrome';
  else if (req.ild && req.treatment === 'none') status = 'antisynthetase_ild_initiate_treatment';
  else if (req.treatment === 'prednisone' && req.ild) status = 'prednisone_alone_insufficient_for_ild';
  else status = 'antisynthetase_review_appropriate';
  return { status, jo1: req.anti_jo1 };
}

function inclusion_body_myopathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureNumber(req.progression_years, 'prog');
  ensureBool(req.distal_weakness, 'distal');
  ensureBool(req.ck_normal, 'ck_normal');
  ensureBool(req.biopsy_done, 'bx');
  ensureEnum(req.treatment, 'rx', ['observation','ivig','prednisone','physical_therapy','combination','none','other']);
  let status;
  if (req.biopsy_done && req.ck_normal) status = 'ibm_diagnosed_low_ck_distal_weakness';
  else if (req.distal_weakness && req.progression_years >= 5 && req.age >= 60) status = 'sporadic_ibm_review_biopsy';
  else if (req.treatment === 'ivig') status = 'ivig_limited_evidence_continue_pt';
  else status = 'ibm_review_appropriate';
  return { status, age: req.age };
}

function polymyalgia_rheumatica(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureBool(req.shoulder_pain, 'sh');
  ensureBool(req.hip_girdle_pain, 'hip');
  ensureNumber(req.esr, 'esr');
  ensureEnum(req.prednisone_response, 'resp', ['dramatic','good','partial','none','unknown']);
  ensureNumber(req.dose_mg, 'dose');
  let status;
  if (req.prednisone_response === 'dramatic' && req.dose_mg <= 15) status = 'pmr_dramatic_response_low_dose_continue';
  else if (!req.shoulder_pain && !req.hip_girdle_pain) status = 'pmr_diagnosis_review';
  else if (req.prednisone_response === 'none') status = 'pmr_no_response_alternative_dx_gca';
  else if (req.age < 50) status = 'pmr_age_inconclusive_review';
  else status = 'pmr_review_appropriate';
  return { status, age: req.age };
}

function myositis_ild(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.pattern, 'pat', ['nsip','uip','organizing_pneumonia','diffuse_alveolar_damage','unknown','other']);
  ensureNumber(req.fvc_pct, 'fvc');
  ensureNumber(req.dlco_pct, 'dlco');
  ensureEnum(req.treatment, 'rx', ['mycophenolate','azathioprine','rituximab','cyclophosphamide','nintedanib','pirfenidone','combination','none','other']);
  ensureEnum(req.response, 'resp', ['stable','improving','declining','unknown']);
  ensureBool(req.oxygen_needed, 'o2');
  let status;
  if (req.response === 'declining' && req.treatment === 'mycophenolate') status = 'declining_ild_escalate_review_transplant';
  else if (req.fvc_pct < 50 && req.oxygen_needed) status = 'severe_ild_lung_transplant_eval';
  else if (req.pattern === 'uip' && req.treatment === 'mycophenolate') status = 'uip_pattern_consider_antifibrotic';
  else if (req.response === 'stable' && req.treatment !== 'none') status = 'myositis_ild_stable_continue';
  else status = 'myositis_ild_review';
  return { status, p: req.pattern };
}

function funcs() { return { dermatomyositis, antisynthetase, inclusion_body_myopathy, polymyalgia_rheumatica, myositis_ild }; }
module.exports = { funcs, ValidationError };