// Ophthalmology Institute engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function va_snellen(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for va_snellen
  return { id: `va_snellen_${Date.now()}`, ok: true, echo: req };
}

function cataract_biometry(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for cataract_biometry
  return { id: `cataract_biometry_${Date.now()}`, ok: true, echo: req };
}

function iop_tonometry(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for iop_tonometry
  return { id: `iop_tonometry_${Date.now()}`, ok: true, echo: req };
}

function retina_oct_scan(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for retina_oct_scan
  return { id: `retina_oct_scan_${Date.now()}`, ok: true, echo: req };
}

function lasik_candidate(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for lasik_candidate
  return { id: `lasik_candidate_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { va_snellen, cataract_biometry, iop_tonometry, retina_oct_scan, lasik_candidate }; }
module.exports = { funcs, ValidationError };
