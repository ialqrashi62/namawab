// filepath: tier46_pharmacy_ext_267_pharm_special_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function biologic_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.class, 'cls', ['tnf_inhibitor','il6_inhibitor','b_cell_depletion','t_cell_costim','jak_inhibitor','complement_inhibitor']);
  ensureStr(req.drug, 'drug');
  ensureStr(req.indication, 'ind');
  ensureStr(req.screening_tb, 'tb');
  ensureStr(req.monitoring, 'mon');
  return { drug: req.drug, class: req.class };
}
function controlled_substance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drug, 'drug');
  ensureNum(req.schedule, 'sch');
  ensureNum(req.quantity, 'qty');
  ensureNum(req.refills, 'rf');
  ensureBool(req.pdmp_checked, 'pdmp');
  ensureEnum(req.diversion_risk, 'dr', ['low','moderate','high']);
  return { drug: req.drug, schedule: req.schedule };
}
function compounding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.preparation, 'prep');
  ensureStr(req.active, 'act');
  ensureStr(req.beyond_use_date, 'bud');
  ensureEnum(req.sterility, 'ster', ['sterile','non_sterile','usp_797','usp_795']);
  ensureEnum(req.stability, 'stab', ['assigned','extrapolated','unknown','short']);
  return { preparation: req.preparation, active: req.active };
}
function investigational_drug(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.trial, 'trial', ['phase_1','phase_2','phase_3','phase_4','expanded_access','compassionate_use']);
  ensureStr(req.indication, 'ind');
  ensureBool(req.consent_obtained, 'consent');
  ensureStr(req.ind_number, 'ind_num');
  ensureEnum(req.adverse_event_tracking, 'ae', ['in_place','pending','not_required','completed']);
  return { trial: req.trial, ind: req.ind_number };
}
function drug_shortage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drug, 'drug');
  ensureStr(req.alternative, 'alt');
  ensureStr(req.affected_doses, 'doses');
  ensureEnum(req.action, 'act', ['rationed_critical_only','substituted','delayed_elective','none_required']);
  ensureStr(req.communication, 'comm');
  return { drug: req.drug, alternative: req.alternative };
}

function funcs() { return { biologic_therapy, controlled_substance, compounding, investigational_drug, drug_shortage }; }
module.exports = { funcs, ValidationError };