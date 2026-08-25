// Integrative Medicine engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function session_consent(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for session_consent
  return { id: `session_consent_${Date.now()}`, ok: true, echo: req };
}

function cupping_plan(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for cupping_plan
  return { id: `cupping_plan_${Date.now()}`, ok: true, echo: req };
}

function herbal_interaction_check(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for herbal_interaction_check
  return { id: `herbal_interaction_check_${Date.now()}`, ok: true, echo: req };
}

function outcome_scale(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for outcome_scale
  return { id: `outcome_scale_${Date.now()}`, ok: true, echo: req };
}

function practitioner_assign(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for practitioner_assign
  return { id: `practitioner_assign_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { session_consent, cupping_plan, herbal_interaction_check, outcome_scale, practitioner_assign }; }
module.exports = { funcs, ValidationError };
