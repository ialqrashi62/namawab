// Burn Center engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function burn_center_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for burn_center_main
  return { id: `burn_center_main_${Date.now()}`, ok: true, echo: req };
}

function burn_center_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for burn_center_list
  return { id: `burn_center_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { burn_center_main, burn_center_list }; }
module.exports = { funcs, ValidationError };
