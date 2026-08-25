// Space & Dive Medicine engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function space_dive_medicine_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for space_dive_medicine_main
  return { id: `space_dive_medicine_main_${Date.now()}`, ok: true, echo: req };
}

function space_dive_medicine_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for space_dive_medicine_list
  return { id: `space_dive_medicine_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { space_dive_medicine_main, space_dive_medicine_list }; }
module.exports = { funcs, ValidationError };
