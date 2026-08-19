// filepath: tier134_txp_686_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function donor_eval(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.donor_id, 'did');
  ensureEnum(req.organ, 'og', ['kidney','liver','heart','lung','pancreas','intestine','multivisceral']);
  ensureEnum(req.donor_type, 'dt', ['living_related','living_unrelated','deceased_dbd','deceased_dcd']);
  ensureEnum(req.blood_type, 'bt', ['A','B','AB','O']);
  ensureStr(req.compatibility, 'cm');
  return { eval_id: `dev_${Date.now()}`, donor_id: req.donor_id, organ: req.organ, donor_type: req.donor_type, blood_type: req.blood_type };
}
function recipient_list(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.organ_needed, 'og', ['kidney','liver','heart','lung','pancreas','intestine','multivisceral']);
  ensureNum(req.meld_score, 'ms');
  ensureEnum(req.status, 'st', ['inactive','active_1','active_2','active_3','urgent','exception']);
  ensureStr(req.center, 'cn');
  return { listing_id: `rtl_${Date.now()}`, patient_id: req.patient_id, organ: req.organ_needed, meld: req.meld_score, status: req.status };
}
function immunosuppression(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.medication, 'md');
  ensureNum(req.dose_mg, 'ds');
  ensureNum(req.trough_level, 'tl');
  ensureEnum(req.adherence, 'ad', ['excellent','good','fair','poor','nonadherent']);
  ensureStr(req.provider, 'pr');
  return { regimen_id: `imm_${Date.now()}`, patient_id: req.patient_id, medication: req.medication, dose: req.dose_mg, adherence: req.adherence };
}
function rejection_event(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.organ, 'og');
  ensureEnum(req.type, 'tp', ['hyperacute','acute_cellular','acute_antibody','chronic','borderline']);
  ensureEnum(req.grade, 'gd', ['none','mild','moderate','severe']);
  ensureStr(req.treatment, 'tr');
  return { event_id: `rej_${Date.now()}`, patient_id: req.patient_id, organ: req.organ, type: req.type, grade: req.grade };
}
function post_tx_followup(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.days_post_tx, 'dp');
  ensureNum(req.creatinine, 'cr');
  ensureBool(req.complications, 'cmp');
  ensureStr(req.graft_function, 'gf');
  ensureStr(req.next_visit, 'nv');
  return { followup_id: `ptf_${Date.now()}`, patient_id: req.patient_id, days_post: req.days_post_tx, graft: req.graft_function };
}

function funcs() { return { donor_eval, recipient_list, immunosuppression, rejection_event, post_tx_followup }; }
module.exports = { funcs, ValidationError };
