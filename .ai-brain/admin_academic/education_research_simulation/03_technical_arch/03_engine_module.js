// Education, Research & Simulation engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function enroll_subject(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for enroll_subject
  return { id: `enroll_subject_${Date.now()}`, ok: true, echo: req };
}

function sae_report(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for sae_report
  return { id: `sae_report_${Date.now()}`, ok: true, echo: req };
}

function cme_credit_award(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for cme_credit_award
  return { id: `cme_credit_award_${Date.now()}`, ok: true, echo: req };
}

function sim_scenario_run(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for sim_scenario_run
  return { id: `sim_scenario_run_${Date.now()}`, ok: true, echo: req };
}

function publication_track(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for publication_track
  return { id: `publication_track_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { enroll_subject, sae_report, cme_credit_award, sim_scenario_run, publication_track }; }
module.exports = { funcs, ValidationError };
