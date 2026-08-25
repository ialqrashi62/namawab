// Cardiothoracic & Vascular Surgery engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function euroscore_calc(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for euroscore_calc
  return { id: `euroscore_calc_${Date.now()}`, ok: true, echo: req };
}

function cabg_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for cabg_list
  return { id: `cabg_list_${Date.now()}`, ok: true, echo: req };
}

function aneurysm_size_plan(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for aneurysm_size_plan
  return { id: `aneurysm_size_plan_${Date.now()}`, ok: true, echo: req };
}

function vein_mapping(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for vein_mapping
  return { id: `vein_mapping_${Date.now()}`, ok: true, echo: req };
}

function postop_drain_check(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for postop_drain_check
  return { id: `postop_drain_check_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { euroscore_calc, cabg_list, aneurysm_size_plan, vein_mapping, postop_drain_check }; }
module.exports = { funcs, ValidationError };
