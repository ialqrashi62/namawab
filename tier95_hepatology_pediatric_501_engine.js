// filepath: tier95_hepatology_pediatric_501_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function neonatal_hepatitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_days, 'ad');
  ensureBool(req.jaundice_present, 'jp');
  ensureNum(req.direct_bilirubin, 'db');
  ensureNum(req.alt, 'alt');
  ensureNum(req.ast, 'ast');
  ensureEnum(req.cause, 'cau', ['idiopathic','viral','metabolic','biliary_atresia','galactosemia','other','unknown']);
  ensureBool(req.workup_complete, 'wc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function biliary_atresia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_weeks, 'aw');
  ensureEnum(req.stool_color, 'sc', ['acholic','yellow','brown','other','unknown']);
  ensureEnum(req.ultrasound_findings, 'us', ['triangular_cord','gallbladder_abnormal','normal','other','unknown']);
  ensureBool(req.kasai_done, 'kd');
  ensureNum(req.age_at_kasai_days, 'akd');
  ensureEnum(req.outcome, 'out', ['improved','stable','worsened','transplant_required','died','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pediatric_liver_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.evaluation_id, 'eid');
  ensureNum(req.age_years, 'ay');
  ensureBool(req.pediatric_end_stage_liver, 'pesl');
  ensureBool(req.kasai_failure, 'kf');
  ensureNum(req.meld_peld_score, 'mps');
  ensureEnum(req.donor_type, 'dt', ['living_related','deceased','domino','other','unknown']);
  ensureEnum(req.outcome, 'out', ['successful','failed','rejection','died','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.evaluation_id };
}
function pediatric_pf_icp(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.icp_score, 'is');
  ensureNum(req.behavior_score, 'bs');
  ensureBool(req.abdominal_pain, 'ap');
  ensureBool(req.hepatomegaly, 'hmp');
  ensureEnum(req.treatment, 'tx', ['ursodeoxycholic_acid','steroid','ocaliva','supportive','other','unknown','none']);
  ensureEnum(req.response, 'res', ['resolution','partial','stable','progression','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function alpha_1_antitrypsin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.a1at_level, 'a1l');
  ensureEnum(req.phenotype, 'ph', ['piZZ','piSZ','piMZ','piSS','piMM','other','unknown','none']);
  ensureBool(req.liver_involvement, 'li');
  ensureBool(req.lung_involvement, 'lui');
  ensureEnum(req.treatment, 'tx', ['supportive','augmentation','transplant','other','unknown','none']);
  ensureBool(req.vaccination_pneumococcus, 'vp');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { neonatal_hepatitis, biliary_atresia, pediatric_liver_transplant, pediatric_pf_icp, alpha_1_antitrypsin }; }
module.exports = { funcs, ValidationError };
