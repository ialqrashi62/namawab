// Oncology & Hematology engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function chemo_regimen(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for chemo_regimen
  return { id: `chemo_regimen_${Date.now()}`, ok: true, echo: req };
}

function neutropenia_risk(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for neutropenia_risk
  return { id: `neutropenia_risk_${Date.now()}`, ok: true, echo: req };
}

function bmt_conditioning(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for bmt_conditioning
  return { id: `bmt_conditioning_${Date.now()}`, ok: true, echo: req };
}

function transfusion_order(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for transfusion_order
  return { id: `transfusion_order_${Date.now()}`, ok: true, echo: req };
}

function response_assess(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for response_assess
  return { id: `response_assess_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { chemo_regimen, neutropenia_risk, bmt_conditioning, transfusion_order, response_assess }; }
module.exports = { funcs, ValidationError };
