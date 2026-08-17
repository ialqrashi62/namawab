// filepath: tier42_psychiatry_ext_243_mood_anx_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function depression_mdd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.phq9_score, 'phq9');
  ensureNum(req.duration_weeks, 'dur');
  ensureBool(req.anhedonia, 'anh');
  ensureBool(req.suicidal_ideation, 'si');
  ensureEnum(req.treatment, 'tx', ['none','ssri_started','ssri_continued','snri','augmentation','tms','ect']);
  const sev = req.phq9_score >= 20 ? 'severe' : req.phq9_score >= 15 ? 'moderately_severe' : req.phq9_score >= 10 ? 'moderate' : req.phq9_score >= 5 ? 'mild' : 'minimal';
  const status = req.suicidal_ideation ? 'urgent_safety_assessment_required' : 'continue_treatment';
  return { severity: sev, status, phq9: req.phq9_score, treatment: req.treatment };
}
function generalized_anxiety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gad7_score, 'gad7');
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.treatment, 'tx', ['none','ssri','snri','benzodiazepine_short_term','cbt','referral']);
  const sev = req.gad7_score >= 15 ? 'severe' : req.gad7_score >= 10 ? 'moderate' : req.gad7_score >= 5 ? 'mild' : 'minimal';
  return { severity: sev, gad7: req.gad7_score, treatment: req.treatment };
}
function panic_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.panic_attacks_month, 'freq');
  ensureStr(req.symptoms, 'sx');
  ensureBool(req.agoraphobia, 'ago');
  ensureEnum(req.medication, 'med', ['none','ssri','benzo_prn','ssri_benzodiazepine_prn','cbt_only']);
  return { status: req.agoraphobia ? 'agoraphobia_present' : 'no_agoraphobia', med: req.medication };
}
function bipolar_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.current_episode, 'ep', ['manic','depressive','mixed','euthymic']);
  ensureNum(req.ymrs_score, 'ymrs');
  ensureNum(req.phq9_score, 'phq9');
  ensureEnum(req.medication, 'med', ['lithium','valproate','lamotrigine','lithium_valproate','atypical_only','none']);
  const sev = req.ymrs_score >= 20 ? 'severe_mania' : req.ymrs_score >= 12 ? 'moderate_mania' : 'mild_mania';
  return { current_episode: req.current_episode, severity: sev, medication: req.medication };
}
function social_anxiety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.lsas_score, 'lsas');
  ensureEnum(req.treatment, 'tx', ['none','ssri','snri','cbt','ssri_cognitive_behavioral_therapy','beta_blocker_prn']);
  const sev = req.lsas_score >= 80 ? 'severe' : req.lsas_score >= 60 ? 'moderate' : req.lsas_score >= 30 ? 'mild' : 'minimal';
  return { severity: sev, lsas: req.lsas_score, treatment: req.treatment };
}

function funcs() { return { depression_mdd, generalized_anxiety, panic_disorder, bipolar_disorder, social_anxiety }; }
module.exports = { funcs, ValidationError };