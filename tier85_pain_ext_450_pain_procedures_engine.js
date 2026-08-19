// filepath: tier85_pain_ext_450_pain_procedures_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function epidural(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureNum(req.levels, 'lev');
  ensureBool(req.imaging_guidance, 'ig');
  ensureStr(req.steroid, 'st');
  ensureStr(req.local_anesthetic, 'la');
  ensureNum(req.steroid_dose_mg, 'sdm');
  ensureNum(req.response_pct, 'rp');
  ensureNum(req.duration_weeks, 'dw');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','nerve_injury','dural_puncture','headache','other','unknown']);
  ensureEnum(req.recommendation, 'rec', ['repeat_4wks','repeat_8wks','continue','discharge','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function rfa(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.modality, 'mod', ['radiofrequency','cryo','pulsed','other']);
  ensureStr(req.target, 'tar');
  ensureNum(req.lesion_count, 'lc');
  ensureNum(req.temperature_c, 'tc');
  ensureNum(req.duration_sec, 'ds');
  ensureNum(req.procedure_time_min, 'ptm');
  ensureNum(req.response_pct, 'rp');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','nerve_injury','burn','other','unknown']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function surgical_implant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.device_type, 'dt', ['spinal_cord_stim','peripheral_nerve_stim','intrathecal_pump','intrathecal_pump_replace','stim_replacement','pump_replacement','other','unknown']);
  ensureStr(req.brand, 'brand');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.stage, 'stage', ['trial','implant','replacement','revision','explant','unknown']);
  ensureBool(req.trial_success, 'ts');
  ensureEnum(req.complications, 'comp', ['none','infection','lead_migration','fracture','csf_leak','other']);
  ensureNum(req.trial_duration_weeks, 'tdw');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureEnum(req.recommendation, 'rec', ['permanent_implant','generator_replacement','continue','reposition','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function joint_injection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.joint, 'j', ['knee','shoulder','hip','ankle','wrist','elbow','other','unknown']);
  ensureEnum(req.medication, 'med', ['triamcinolone','methylpred','betamethasone','hyaluronic_acid','combination','other']);
  ensureNum(req.dose_mg, 'dose');
  ensureBool(req.imaging_guidance, 'ig');
  ensureStr(req.approach, 'ap');
  ensureEnum(req.complications, 'comp', ['none','infection','bleeding','allergic','flaring','other']);
  ensureNum(req.response_pct, 'rp');
  ensureNum(req.duration_weeks, 'dw');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureEnum(req.recommendation, 'rec', ['repeat_3mo','repeat_6mo','continue','discharge','refer','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function trigger_point(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.region, 'reg');
  ensureNum(req.trigger_point_count, 'tpc');
  ensureStr(req.medication, 'med');
  ensureNum(req.volume_ml, 'vol');
  ensureNum(req.response_pct, 'rp');
  ensureEnum(req.complications, 'comp', ['none','bleeding','pneumothorax','infection','allergic','other']);
  ensureNum(req.duration_weeks, 'dw');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureNum(req.sessions_completed, 'sc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}

function funcs() { return { epidural, rfa, surgical_implant, joint_injection, trigger_point }; }
module.exports = { funcs, ValidationError };