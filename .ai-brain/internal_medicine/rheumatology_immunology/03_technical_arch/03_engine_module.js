// Rheumatology & Immunology engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function das28_score(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for das28_score
  return { id: `das28_score_${Date.now()}`, ok: true, echo: req };
}

function biologic_eligibility(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for biologic_eligibility
  return { id: `biologic_eligibility_${Date.now()}`, ok: true, echo: req };
}

function autoimmune_panel(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for autoimmune_panel
  return { id: `autoimmune_panel_${Date.now()}`, ok: true, echo: req };
}

function allergy_test(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for allergy_test
  return { id: `allergy_test_${Date.now()}`, ok: true, echo: req };
}

function steroid_taper(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for steroid_taper
  return { id: `steroid_taper_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { das28_score, biologic_eligibility, autoimmune_panel, allergy_test, steroid_taper }; }
module.exports = { funcs, ValidationError };
