// Bariatric & Metabolic Center engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function bariatric_metabolic__main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for bariatric_metabolic__main
  return { id: `bariatric_metabolic__main_${Date.now()}`, ok: true, echo: req };
}

function bariatric_metabolic__list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for bariatric_metabolic__list
  return { id: `bariatric_metabolic__list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { bariatric_metabolic__main, bariatric_metabolic__list }; }
module.exports = { funcs, ValidationError };
