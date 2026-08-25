// Eye Institute engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function eye_institute_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for eye_institute_main
  return { id: `eye_institute_main_${Date.now()}`, ok: true, echo: req };
}

function eye_institute_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for eye_institute_list
  return { id: `eye_institute_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { eye_institute_main, eye_institute_list }; }
module.exports = { funcs, ValidationError };
