// filepath: tier77_neuro_ext_410_neuro_movement_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function movement_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.movement_score, 'ms', ['mild','moderate','severe','very_severe','early','advanced','unknown','other']);
  ensureNum(req.tremor_rating, 'tr');
  ensureNum(req.rigidity_score, 'rs');
  ensureNum(req.bradykinesia_score, 'bs');
  ensureBool(req.dyskinesia_present, 'dp');
  ensureStr(req.symptoms, 'sym');
  ensureStr(req.medications, 'meds');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function parkinson_meds(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'mid');
  ensureEnum(req.medication, 'med', ['levodopa_carbidopa','dopamine_agonist','mao_b_inhibitor','comt_inhibitor','anticholinergic','amantadine','combination','apomorphine','other','unknown']);
  ensureNum(req.dose, 'dose');
  ensureEnum(req.frequency, 'freq', ['daily','twice_daily','three_times_daily','four_times_daily','prn','continuous','other']);
  ensureEnum(req.on_off_status, 'oos', ['on','off','on_with_dyskinesia','partial_on','unknown','other']);
  ensureNum(req.motor_score, 'mots');
  ensureBool(req.hallucinations, 'hal');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { mid: req.medication_id };
}
function dystonia_botox(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['cervical_dystonia','blepharospasm','hemifacial_spasm','spasticity','limb_dystonia','other']);
  ensureNum(req.botox_units, 'bu');
  ensureNum(req.botox_sites, 'bs');
  ensureNum(req.effect_duration_weeks, 'edw');
  ensureBool(req.dysphagia_post, 'dyp');
  ensureEnum(req.response, 'res', ['excellent','good','moderate','poor','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function tremor_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.tremor_location, 'tl', ['right_hand','left_hand','both_hands','head','voice','leg','jaw','face','other']);
  ensureEnum(req.tremor_type, 'tt', ['resting','postural','kinetic','intention','mixed','unknown','other']);
  ensureNum(req.tremor_rating, 'tr');
  ensureBool(req.family_history, 'fh');
  ensureBool(req.mri_ordered, 'mro');
  ensureBool(req.dat_scan_done, 'dsd');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureStr(req.recommendation, 'rec');
  return { aid: req.assessment_id };
}
function deep_brain_stimulation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.dbs_target, 'dt', ['stn','gpi','vim','other']);
  ensureBool(req.dbs_evaluated, 'de');
  ensureBool(req.psychiatric_clearance, 'pc');
  ensureBool(req.mri_clearance, 'mc');
  ensureNum(req.medication_reduction_pct, 'mrp');
  ensureBool(req.motor_improvement, 'mi');
  ensureNum(req.battery_years_remaining, 'byr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { movement_initial, parkinson_meds, dystonia_botox, tremor_workup, deep_brain_stimulation }; }
module.exports = { funcs, ValidationError };