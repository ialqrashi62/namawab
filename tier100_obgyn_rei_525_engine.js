// filepath: tier100_obgyn_rei_525_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function infertility_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.duration_infertility, 'di', ['less_than_1_year','1_to_2_years','over_2_years','other','unknown']);
  ensureNum(req.amh_level, 'amh');
  ensureNum(req.fsh_day3, 'fsh');
  ensureNum(req.antral_follicle_count, 'afc');
  ensureNum(req.semen_analysis, 'sa');
  ensureNum(req.tubal_patency, 'tp');
  ensureNum(req.ovulatory_cycles, 'oc');
  ensureEnum(req.diagnosis, 'dx', ['anovulation','tubal_factor','male_factor','endometriosis','unexplained','uterine_factor','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function ovulation_induction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureEnum(req.medication, 'med', ['clomiphene','letrozole','gonadotropins','metformin','other','unknown','none']);
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.follicles_developed, 'fd');
  ensureNum(req.endometrial_thickness, 'et');
  ensureEnum(req.timed_intercourse, 'tic', ['yes','no','cancelled','other','unknown']);
  ensureNum(req.cancellation_reason, 'canc');
  ensureNum(req.pregnancy_test, 'pt');
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}
function ivf_cycle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureNum(req.retrieved_oocytes, 'ro');
  ensureNum(req.mature_oocytes, 'mo');
  ensureNum(req.fertilized, 'fert');
  ensureNum(req.embryos_day3, 'ed3');
  ensureNum(req.blastocysts_day5, 'bd5');
  ensureNum(req.embryos_transferred, 'et');
  ensureNum(req.embryos_frozen, 'ef');
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}
function icsi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureNum(req.motile_sperm_count, 'msc');
  ensureNum(req.morphology, 'morph');
  ensureNum(req.oocytes_injected, 'oi');
  ensureNum(req.fertilization_rate, 'fr');
  ensureNum(req.embryos_formed, 'em');
  ensureNum(req.pregnancy_test, 'pt');
  ensureEnum(req.indications, 'ind', ['male_factor','previous_failed_ivf','unexplained','sperm_retrieval','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}
function recurrent_pregnancy_loss(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.losses_count, 'lc');
  ensureNum(req.gestational_age_lost, 'gal');
  ensureBool(req.uterine_anomaly, 'ua');
  ensureBool(req.karyotype_abnormal, 'ka');
  ensureBool(req.thrombophilia, 'th');
  ensureBool(req.immunologic, 'im');
  ensureEnum(req.treatment, 'tx', ['aspirin','heparin','ivig','progesterone','surgical','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { infertility_workup, ovulation_induction, ivf_cycle, icsi, recurrent_pregnancy_loss }; }
module.exports = { funcs, ValidationError };
