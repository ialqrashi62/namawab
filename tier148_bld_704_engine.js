// filepath: tier148_bld_704_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function donor_screen(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.donor_id, 'di');
  ensureEnum(req.donor_type, 'dt', ['volunteer','directed','autologous','apheresis_platelet','apheresis_plasma','apheresis_granulocyte','other']);
  ensureNum(req.age, 'ag');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.hgb, 'hg');
  ensureNum(req.bp_systolic, 'bp');
  ensureNum(req.pulse, 'pl');
  ensureEnum(req.travel_history, 'th', ['none','malaria','zika','ebola','chikungunya','other','unknown']);
  ensureBool(req.hiv_test, 'hi');
  ensureBool(req.hep_b_test, 'hb');
  ensureBool(req.hep_c_test, 'hc');
  ensureBool(req.syphilis_test, 'sy');
  ensureStr(req.provider, 'pr');
  return { ds_id: `dsn_${Date.now()}`, donor_id: req.donor_id, type: req.donor_type };
}
function unit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.donor_id, 'di');
  ensureEnum(req.product, 'pd', ['whole_blood','PRBC','apheresis_platelet','whole_blood_platelet','FFP','cryo','apheresis_plasma','apheresis_granulocyte','washed_RBC','frozen_RBC','deglycerolized_RBC','pathogen_reduced','other']);
  ensureEnum(req.abo, 'ab', ['A','B','AB','O','unknown']);
  ensureEnum(req.rh, 'rh', ['positive','negative','unknown','weak_D']);
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.collection_date, 'cd');
  ensureNum(req.expiration_date, 'ed');
  ensureBool(req.irradiated, 'ir');
  ensureBool(req.cmv_negative, 'cn');
  ensureStr(req.storage_temp_c, 'st');
  ensureStr(req.provider, 'pr');
  return { un_id: `unt_${Date.now()}`, donor_id: req.donor_id, product: req.product };
}
function crossmatch(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.donor_id, 'di');
  ensureStr(req.unit_id, 'ui');
  ensureEnum(req.method, 'me', ['immediate_spin','AHG','gel','solid_phase','electronic','other']);
  ensureEnum(req.abo_compatible, 'ac', ['compatible','incompatible','major_incompatible','minor_incompatible','NA','unknown']);
  ensureBool(req.antibody_screen, 'as');
  ensureBool(req.antibody_id, 'ai');
  ensureBool(req.dat_positive, 'dp');
  ensureNum(req.titer, 'tt');
  ensureEnum(req.result, 're', ['compatible','incompatible','inconclusive','pending','other']);
  ensureStr(req.provider, 'pr');
  return { cm_id: `crm_${Date.now()}`, patient_id: req.patient_id, result: req.result };
}
function transfusion_event(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.unit_id, 'ui');
  ensureNum(req.start_time, 'st');
  ensureNum(req.end_time, 'et');
  ensureNum(req.volume_infused_ml, 'vi');
  ensureEnum(req.vital_signs_stable, 'vs', ['stable','stable_with_intervention','unstable','critical','other']);
  ensureBool(req.reaction_suspected, 'rs');
  ensureEnum(req.reaction_type, 'rt', ['none','febrile_non_hemolytic','allergic','anaphylactic','hemolytic_acute','hemolytic_delayed','TRALI','TACO','bacterial_sepsis','other']);
  ensureBool(req.workup_performed, 'wp');
  ensureStr(req.provider, 'pr');
  return { te_id: `tfe_${Date.now()}`, patient_id: req.patient_id, volume: req.volume_infused_ml };
}
function inventory(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureEnum(req.product, 'pd', ['whole_blood','PRBC','apheresis_platelet','FFP','cryo','other']);
  ensureEnum(req.abo, 'ab', ['A','B','AB','O','all']);
  ensureNum(req.units_available, 'ua');
  ensureNum(req.units_in_use, 'uu');
  ensureNum(req.units_expired_30d, 'ex');
  ensureNum(req.units_out_30d, 'ou');
  ensureNum(req.days_supply, 'ds');
  ensureEnum(req.alert_level, 'al', ['green','yellow','orange','red','critical','unknown']);
  ensureStr(req.action, 'ac');
  ensureStr(req.provider, 'pr');
  return { iv_id: `inv_${Date.now()}`, product: req.product, available: req.units_available };
}

function funcs() { return { donor_screen, unit, crossmatch, transfusion_event, inventory }; }
module.exports = { funcs, ValidationError };