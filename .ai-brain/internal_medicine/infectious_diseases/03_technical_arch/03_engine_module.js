// Infectious Diseases engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function sepsis_bundle(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for sepsis_bundle
  return { id: `sepsis_bundle_${Date.now()}`, ok: true, echo: req };
}

function antibiogram_review(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for antibiogram_review
  return { id: `antibiogram_review_${Date.now()}`, ok: true, echo: req };
}

function travel_advice(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for travel_advice
  return { id: `travel_advice_${Date.now()}`, ok: true, echo: req };
}

function vaccine_schedule(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for vaccine_schedule
  return { id: `vaccine_schedule_${Date.now()}`, ok: true, echo: req };
}

function isolation_level(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for isolation_level
  return { id: `isolation_level_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { sepsis_bundle, antibiogram_review, travel_advice, vaccine_schedule, isolation_level }; }
module.exports = { funcs, ValidationError };
