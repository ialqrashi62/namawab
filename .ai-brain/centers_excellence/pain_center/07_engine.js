// Chronic Pain Center engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function pain_center_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for pain_center_main
  return { id: `pain_center_main_${Date.now()}`, ok: true, echo: req };
}

function pain_center_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for pain_center_list
  return { id: `pain_center_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { pain_center_main, pain_center_list }; }
module.exports = { funcs, ValidationError };
