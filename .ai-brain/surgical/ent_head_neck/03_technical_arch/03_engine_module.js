// ENT & Head-Neck engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function audiogram_read(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for audiogram_read
  return { id: `audiogram_read_${Date.now()}`, ok: true, echo: req };
}

function sinus_ct_lund(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for sinus_ct_lund
  return { id: `sinus_ct_lund_${Date.now()}`, ok: true, echo: req };
}

function cochlear candidacy(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for cochlear candidacy
  return { id: `cochlear candidacy_${Date.now()}`, ok: true, echo: req };
}

function voice_vhi_score(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for voice_vhi_score
  return { id: `voice_vhi_score_${Date.now()}`, ok: true, echo: req };
}

function tonsillectomy_indication(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for tonsillectomy_indication
  return { id: `tonsillectomy_indication_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { audiogram_read, sinus_ct_lund, cochlear candidacy, voice_vhi_score, tonsillectomy_indication }; }
module.exports = { funcs, ValidationError };
