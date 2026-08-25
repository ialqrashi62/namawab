// Nuclear Medicine Therapy engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function nuclear_therapy_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for nuclear_therapy_main
  return { id: `nuclear_therapy_main_${Date.now()}`, ok: true, echo: req };
}

function nuclear_therapy_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for nuclear_therapy_list
  return { id: `nuclear_therapy_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { nuclear_therapy_main, nuclear_therapy_list }; }
module.exports = { funcs, ValidationError };
