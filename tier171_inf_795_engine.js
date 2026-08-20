// filepath: tier171_inf_795_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sepsis_bundle(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.lactate, 'la'); ensureNum(req.blood_culture, 'bc');
  ensureNum(req.abx_admin, 'aa'); ensureNum(req.fluid_bolus, 'fb');
  ensureNum(req.vasopressor, 'va'); ensureEnum(req.severity, 'sv', ['mild','moderate','severe','shock','NA']);
  ensureNum(req.door_to_abx, 'da'); ensureNum(req.mortality_score, 'ms');
  ensureStr(req.provider, 'pr');
  return { sb_id: `sb_${Date.now()}`, patient_id: req.patient_id, lact: req.lactate, abx: req.door_to_abx };
}

function abx_stewardship(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.drug, 'dr'); ensureNum(req.dose_mg, 'ds');
  ensureEnum(req.class, 'cl', ['penicillin','cephalosporin','carbapenem','fluoroquinolone','macrolide','aminoglycoside','glycopeptide','other','NA']);
  ensureNum(req.duration_days, 'du'); ensureBool(req.culture_directed, 'cd');
  ensureEnum(req.indication, 'in', ['empirical','targeted','prophylaxis','NA']);
  ensureNum(req.deescalation_count, 'de'); ensureBool(req.reviewed, 'rv');
  ensureStr(req.provider, 'pr');
  return { as_id: `as_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, dur: req.duration_days };
}

function mdr_organism(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.organism, 'og'); ensureEnum(req.resistance, 'rs', ['MRSA','VRE','CRE','ESBL','MDR_TB','XDR','other','NA']);
  ensureEnum(req.specimen, 'sp', ['blood','urine','wound','sputum','other','NA']);
  ensureNum(req.days_colonized, 'dc'); ensureBool(req.isolation, 'ip');
  ensureNum(req.contact_count, 'cc'); ensureEnum(req.disposition, 'di', ['isolated','discharged','deceased','NA']);
  ensureStr(req.provider, 'pr');
  return { mo_id: `mo_${Date.now()}`, patient_id: req.patient_id, org: req.organism, res: req.resistance };
}

function iv_to_po(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.drug, 'dr'); ensureNum(req.days_iv, 'di');
  ensureEnum(req.feasible, 'fe', ['yes','no','monitor','NA']);
  ensureBool(req.po_tolerating, 'pt'); ensureNum(req.cost_savings, 'cs');
  ensureEnum(req.outcome, 'ot', ['converted','failed','deferred','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { ip_id: `ip_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, ot: req.outcome };
}

function out_management(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.outcome_type, 'ot', ['clinical','microbiological','NA']);
  ensureNum(req.fever_days, 'fd'); ensureNum(req.wbc_count, 'wc');
  ensureNum(req.antibiotic_days, 'ad'); ensureBool(req.organism_cleared, 'oc');
  ensureEnum(req.disposition, 'di', ['continue','convert_PO','stop','escalate','NA']);
  ensureNum(req.followup_days, 'fu'); ensureStr(req.provider, 'pr');
  return { om_id: `om_${Date.now()}`, patient_id: req.patient_id, conv: req.disposition };
}

function funcs() { return { sepsis_bundle, abx_stewardship, mdr_organism, iv_to_po, out_management }; }
module.exports = { funcs, ValidationError };