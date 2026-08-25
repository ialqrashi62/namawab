// PM&R Rehabilitation engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function barthel_index(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for barthel_index
  return { id: `barthel_index_${Date.now()}`, ok: true, echo: req };
}

function therapy_plan_set(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for therapy_plan_set
  return { id: `therapy_plan_set_${Date.now()}`, ok: true, echo: req };
}

function swallow_screen(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for swallow_screen
  return { id: `swallow_screen_${Date.now()}`, ok: true, echo: req };
}

function prosthetic_fit(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for prosthetic_fit
  return { id: `prosthetic_fit_${Date.now()}`, ok: true, echo: req };
}

function progress_note(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for progress_note
  return { id: `progress_note_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { barthel_index, therapy_plan_set, swallow_screen, prosthetic_fit, progress_note }; }
module.exports = { funcs, ValidationError };
