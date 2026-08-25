// Confocal Laser Endomicroscopy engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function confocal_endomicrosc_main(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for confocal_endomicrosc_main
  return { id: `confocal_endomicrosc_main_${Date.now()}`, ok: true, echo: req };
}

function confocal_endomicrosc_list(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for confocal_endomicrosc_list
  return { id: `confocal_endomicrosc_list_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { confocal_endomicrosc_main, confocal_endomicrosc_list }; }
module.exports = { funcs, ValidationError };
