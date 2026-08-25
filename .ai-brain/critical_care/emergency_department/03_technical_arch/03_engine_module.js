// Emergency Department engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function esi_triage(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for esi_triage
  return { id: `esi_triage_${Date.now()}`, ok: true, echo: req };
}

function door_to_doctor_timer(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for door_to_doctor_timer
  return { id: `door_to_doctor_timer_${Date.now()}`, ok: true, echo: req };
}

function code_activation(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for code_activation
  return { id: `code_activation_${Date.now()}`, ok: true, echo: req };
}

function tox_ingest_assess(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for tox_ingest_assess
  return { id: `tox_ingest_assess_${Date.now()}`, ok: true, echo: req };
}

function obs_reassess(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for obs_reassess
  return { id: `obs_reassess_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { esi_triage, door_to_doctor_timer, code_activation, tox_ingest_assess, obs_reassess }; }
module.exports = { funcs, ValidationError };
