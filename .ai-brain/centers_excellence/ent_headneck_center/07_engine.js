// ENT & Head-Neck Center engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function ent_headneck_center_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for ent_headneck_center_main
  return { id: `ent_headneck_center_main_${Date.now()}`, ok: true, echo: req };
}

function ent_headneck_center_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for ent_headneck_center_list
  return { id: `ent_headneck_center_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { ent_headneck_center_main, ent_headneck_center_list }; }
module.exports = { funcs, ValidationError };
