// filepath: tier52_rehabilitation_ext_297_rehab_pain_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chronic_pain_program(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pain_duration_months, 'dur');
  ensureEnum(req.program_type, 'pt', ['interdisciplinary','multidisciplinary','transdisciplinary','cognitive_behavioral','functional_restoration','self_management']);
  ensureNum(req.weeks_completed, 'wc');
  ensureStr(req.outcome_measures_improvement, 'omi');
  ensureStr(req.discharge_plan, 'dp');
  return { weeks_completed: req.weeks_completed };
}
function low_back_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.classification, 'cls', ['acute','subacute','chronic_nonspecific','chronic_specific_radicular','spinal_stenosis','failed_back_surgery']);
  ensureNum(req.oswestry, 'os');
  ensureBool(req.psychosocial_yellow_flags, 'yf');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['partial_improvement','full_improvement','no_change','worsening']);
  return { oswestry: req.oswestry };
}
function fibromyalgia_program(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.fiq_score, 'fiq');
  ensureNum(req.tender_points, 'tp');
  ensureStr(req.program, 'prog');
  ensureNum(req.weeks, 'wk');
  ensureStr(req.response, 'resp');
  return { fiq: req.fiq_score };
}
function lymphedema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.stage, 'st');
  ensureStr(req.limb, 'limb');
  ensureStr(req.cause, 'cause');
  ensureStr(req.treatment, 'tx');
  ensureNum(req.volume_reduction_pct, 'vr');
  return { stage: req.stage, limb: req.limb };
}
function headache_migraine(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['episodic_migraine','chronic_migraine','tension_type','cluster','medication_overuse','menstrual_related']);
  ensureNum(req.frequency_per_month, 'freq');
  ensureNum(req.headache_days, 'hd');
  ensureStr(req.trigger, 'trig');
  ensureStr(req.prevention, 'prev');
  ensureEnum(req.response, 'resp', ['reduced_50_percent','reduced_75_percent','stable','worsening','inadequate_response']);
  return { type: req.type };
}

function funcs() { return { chronic_pain_program, low_back_pain, fibromyalgia_program, lymphedema, headache_migraine }; }
module.exports = { funcs, ValidationError };