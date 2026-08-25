// Radiology & Imaging engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function order_study(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for order_study
  return { id: `order_study_${Date.now()}`, ok: true, echo: req };
}

function contrast_safety_check(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for contrast_safety_check
  return { id: `contrast_safety_check_${Date.now()}`, ok: true, echo: req };
}

function report_structured(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for report_structured
  return { id: `report_structured_${Date.now()}`, ok: true, echo: req };
}

function radiation_dose_log(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for radiation_dose_log
  return { id: `radiation_dose_log_${Date.now()}`, ok: true, echo: req };
}

function critical_result_notify(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for critical_result_notify
  return { id: `critical_result_notify_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { order_study, contrast_safety_check, report_structured, radiation_dose_log, critical_result_notify }; }
module.exports = { funcs, ValidationError };
