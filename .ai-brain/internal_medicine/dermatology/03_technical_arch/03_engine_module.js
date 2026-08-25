// Dermatology engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function lesion_triage_abcde(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for lesion_triage_abcde
  return { id: `lesion_triage_abcde_${Date.now()}`, ok: true, echo: req };
}

function biopsy_type(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for biopsy_type
  return { id: `biopsy_type_${Date.now()}`, ok: true, echo: req };
}

function phototherapy_dose(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for phototherapy_dose
  return { id: `phototherapy_dose_${Date.now()}`, ok: true, echo: req };
}

function acne_grade(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for acne_grade
  return { id: `acne_grade_${Date.now()}`, ok: true, echo: req };
}

function cosmetic_consult(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for cosmetic_consult
  return { id: `cosmetic_consult_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { lesion_triage_abcde, biopsy_type, phototherapy_dose, acne_grade, cosmetic_consult }; }
module.exports = { funcs, ValidationError };
