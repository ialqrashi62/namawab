// Cryotherapy Unit engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function cryosurgery_unit_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for cryosurgery_unit_main
  return { id: `cryosurgery_unit_main_${Date.now()}`, ok: true, echo: req };
}

function cryosurgery_unit_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for cryosurgery_unit_list
  return { id: `cryosurgery_unit_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { cryosurgery_unit_main, cryosurgery_unit_list }; }
module.exports = { funcs, ValidationError };
