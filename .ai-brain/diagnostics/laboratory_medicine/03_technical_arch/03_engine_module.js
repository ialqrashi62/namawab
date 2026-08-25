// Laboratory Medicine & Blood Bank engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function order_panel(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for order_panel
  return { id: `order_panel_${Date.now()}`, ok: true, echo: req };
}

function validate_result_delta(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for validate_result_delta
  return { id: `validate_result_delta_${Date.now()}`, ok: true, echo: req };
}

function critical_value_alert(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for critical_value_alert
  return { id: `critical_value_alert_${Date.now()}`, ok: true, echo: req };
}

function crossmatch_request(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for crossmatch_request
  return { id: `crossmatch_request_${Date.now()}`, ok: true, echo: req };
}

function culture_sensitivity(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for culture_sensitivity
  return { id: `culture_sensitivity_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { order_panel, validate_result_delta, critical_value_alert, crossmatch_request, culture_sensitivity }; }
module.exports = { funcs, ValidationError };
