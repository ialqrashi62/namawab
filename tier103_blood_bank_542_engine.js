// filepath: tier103_blood_bank_542_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function type_and_cross(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.order_id, 'oid');
  ensureEnum(req.abo, 'abo', ['a_pos','a_neg','b_pos','b_neg','ab_pos','ab_neg','o_pos','o_neg','other','unknown']);
  ensureEnum(req.rh, 'rh', ['positive','negative','other','unknown']);
  ensureEnum(req.antibody_screen, 'as', ['positive','negative','pending','other','unknown']);
  ensureBool(req.crossmatch_compatible, 'cc');
  ensureNum(req.units_ordered, 'uo');
  ensureEnum(req.component, 'comp', ['prbc','platelet','plasma','cryo','whole_blood','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { oid: req.order_id };
}
function transfusion_reaction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureEnum(req.product, 'prod', ['prbc','platelet','plasma','cryo','whole_blood','other','unknown']);
  ensureEnum(req.reaction_type, 'rt', ['febrile','allergic','hemolytic','transfusion_related_aki','trali','gvhd','bacterial','other','unknown']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','fatal','unknown','none']);
  ensureNum(req.time_to_reaction, 'ttr');
  ensureEnum(req.treatment, 'tx', ['observation','antipyretic','antihistamine','steroid','epinephrine','cpr','other','unknown','none']);
  ensureEnum(req.hemolysis_check, 'hc', ['yes','no','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function plasma_exchange(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.exchange_volume_l, 'evl');
  ensureEnum(req.replacement_fluid, 'rf', ['albumin','plasma','combination','other','unknown']);
  ensureEnum(req.frequency, 'fr', ['daily','every_other_day','twice_weekly','weekly','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureNum(req.response, 'resp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function platelet_transfusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.transfusion_id, 'tid');
  ensureEnum(req.product, 'prod', ['plt','single_donor','apheresis','pooled','other','unknown']);
  ensureNum(req.dose_per_apheresis, 'dpa');
  ensureNum(req.platelet_count_pre, 'pcp');
  ensureNum(req.platelet_count_post, 'pcpost');
  ensureNum(req.ccr, 'ccr');
  ensureStr(req.provider, 'pr');
  return { tid: req.transfusion_id };
}
function autologous_donation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.donation_id, 'did');
  ensureStr(req.donor_id, 'donor');
  ensureNum(req.hemoglobin, 'hgb');
  ensureEnum(req.donation_type, 'dt', ['preop','standard','other','unknown']);
  ensureNum(req.autologous_units, 'au');
  ensureBool(req.iron_supplementation, 'is');
  ensureNum(req.reaction, 'rxn');
  ensureStr(req.provider, 'pr');
  return { did: req.donation_id };
}

function funcs() { return { type_and_cross, transfusion_reaction, plasma_exchange, platelet_transfusion, autologous_donation }; }
module.exports = { funcs, ValidationError };
