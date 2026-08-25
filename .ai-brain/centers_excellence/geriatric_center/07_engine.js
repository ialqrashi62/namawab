// Geriatric Center engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function geriatric_center_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for geriatric_center_main
  return { id: `geriatric_center_main_${Date.now()}`, ok: true, echo: req };
}

function geriatric_center_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for geriatric_center_list
  return { id: `geriatric_center_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { geriatric_center_main, geriatric_center_list }; }
module.exports = { funcs, ValidationError };
