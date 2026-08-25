// filepath: tier90_genetics_adult_475_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function family_history(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pedigree_id, 'pid');
  ensureNum(req.generations, 'gen');
  ensureNum(req.total_affected, 'ta');
  ensureStr(req.parents_consanguinity, 'pc');
  ensureNum(req.early_onset_cancers, 'eoc');
  ensureNum(req.multiple_primary_cancers, 'mpc');
  ensureBool(req.unknown_ancestry, 'ua');
  ensureEnum(req.ethnicity, 'eth', ['arab','south_asian','east_asian','jewish','african','hispanic','european','mixed','other','unknown','decline','prefer_not_to_say']);
  ensureBool(req.adopted, 'ad');
  ensureStr(req.provider, 'pr');
  return { pid: req.pedigree_id };
}
function predictive_testing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureStr(req.gene, 'gene');
  ensureStr(req.variant, 'var');
  ensureBool(req.affected_relative, 'ar');
  ensureEnum(req.test_result, 'tres', ['positive','negative','vus','inconclusive','pending','declined','other','unknown']);
  ensureNum(req.psychological_counseling, 'pc');
  ensureNum(req.screening_recommendations, 'sr');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function cardiovascular_genetics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.condition, 'cond', ['hypertrophic_cardiomyopathy','dilated_cardiomyopathy','arrhythmogenic','long_qt','brugada','marfan','ehlers_danlos','sickle_cell','thalassemia','other','unknown']);
  ensureBool(req.family_history_sudden_death, 'fhsd');
  ensureNum(req.age_at_diagnosis, 'aad');
  ensureBool(req.genetic_testing, 'gt');
  ensureEnum(req.genetic_panel, 'gp', ['cardio_panel','comprehensive','none','pending','other','unknown']);
  ensureNum(req.cascade_screening, 'cs');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function neurogenetics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.condition, 'cond');
  ensureBool(req.family_history, 'fh');
  ensureNum(req.age_onset, 'ao');
  ensureNum(req.developmental_regression, 'dr');
  ensureNum(req.seizures, 'sz');
  ensureNum(req.movement_disorder, 'mv');
  ensureEnum(req.genetic_test, 'gt', ['wgs','wes','panel','mitochondrial','fra_x','meCP2','dmd','none','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function genetic_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.diagnosis, 'dx');
  ensureNum(req.months_since_diagnosis, 'msd');
  ensureNum(req.screening_compliance, 'sc');
  ensureNum(req.relatives_tested, 'rt');
  ensureBool(req.family_communication, 'fc');
  ensureNum(req.reproductive_options, 'ro');
  ensureEnum(req.support_group, 'sg', ['enrolled','interested','declined','pending','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}

function funcs() { return { family_history, predictive_testing, cardiovascular_genetics, neurogenetics, genetic_followup }; }
module.exports = { funcs, ValidationError };
