// Radiation Oncology & Clinical Pharmacy engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function rt_plan_fraction(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for rt_plan_fraction
  return { id: `rt_plan_fraction_${Date.now()}`, ok: true, echo: req };
}

function chemo_verification(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for chemo_verification
  return { id: `chemo_verification_${Date.now()}`, ok: true, echo: req };
}

function tdm_interpret(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for tdm_interpret
  return { id: `tdm_interpret_${Date.now()}`, ok: true, echo: req };
}

function adr_report(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for adr_report
  return { id: `adr_report_${Date.now()}`, ok: true, echo: req };
}

function pharm_intervention(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for pharm_intervention
  return { id: `pharm_intervention_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { rt_plan_fraction, chemo_verification, tdm_interpret, adr_report, pharm_intervention }; }
module.exports = { funcs, ValidationError };
