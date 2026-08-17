// filepath: tier42_psychiatry_ext_245_trauma_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ptsd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pcl5_score, 'pcl5');
  ensureStr(req.trauma_type, 'trauma');
  ensureNum(req.duration_months, 'dur');
  ensureBool(req.nightmares, 'nightmares');
  ensureBool(req.avoidance, 'avoidance');
  ensureBool(req.hyperarousal, 'hyper');
  ensureEnum(req.treatment, 'tx', ['none','ssri','snri','emdr','cbt','emdr_ssri','tf_cbt']);
  const sev = req.pcl5_score >= 50 ? 'severe' : req.pcl5_score >= 33 ? 'moderate' : 'mild';
  return { severity: sev, treatment: req.treatment };
}
function acute_stress(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.event, 'ev');
  ensureNum(req.days_since, 'days');
  ensureStr(req.symptoms, 'sx');
  ensureBool(req.dissociation, 'diss');
  ensureEnum(req.disruption, 'dis', ['minimal','mild','moderate','severe']);
  ensureEnum(req.follow_up, 'fu', ['none','weekly_4_weeks','weekly_8_weeks','monthly']);
  return { disruption: req.disruption, follow_up: req.follow_up };
}
function adjustment_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stressor, 'stress');
  ensureNum(req.onset_days, 'onset');
  ensureStr(req.symptoms, 'sx');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe']);
  ensureEnum(req.intervention, 'int', ['none','supportive_counseling','cbt','psychotherapy','medication']);
  return { severity: req.severity, intervention: req.intervention };
}
function complex_trauma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trauma_history, 'hx');
  ensureNum(req.duration_years, 'dur');
  ensureStr(req.symptoms, 'sx');
  ensureBool(req.dissociation, 'diss');
  ensureEnum(req.treatment, 'tx', ['none','phase_oriented_trauma_therapy','emdr','cbt','tf_cbt','inpatient_stabilization']);
  return { treatment: req.treatment, duration_years: req.duration_years };
}
function dissociative_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['did','osdd','dnd','depersonalization','dissociative_amnesia']);
  ensureBool(req.amnesia_episodes, 'amnesia');
  ensureBool(req.identity_alterations, 'id_alt');
  ensureEnum(req.functioning, 'func', ['mild_impairment','moderate_impairment','severe_impairment']);
  ensureEnum(req.treatment, 'tx', ['none','phase_oriented_trauma_therapy','emdr','tf_cbt','inpatient_stabilization']);
  return { type: req.type, functioning: req.functioning };
}

function funcs() { return { ptsd, acute_stress, adjustment_disorder, complex_trauma, dissociative_disorder }; }
module.exports = { funcs, ValidationError };