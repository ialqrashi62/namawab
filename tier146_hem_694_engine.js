// filepath: tier146_hem_694_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cbc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.wbc, 'wb');
  ensureNum(req.hgb, 'hg');
  ensureNum(req.hct, 'hc');
  ensureNum(req.platelet, 'pl');
  ensureNum(req.mcv, 'mc');
  ensureNum(req.rbc, 'rb');
  ensureNum(req.retic, 'rt');
  ensureEnum(req.suspicious, 'su', ['none','infection','leukemia','lymphoma','myeloma','anemia','thrombocytopenia','polycythemia','other']);
  ensureStr(req.provider, 'pr');
  return { cb_id: `cbc_${Date.now()}`, patient_id: req.patient_id, hgb: req.hgb, wbc: req.wbc };
}
function coagulation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.pt, 'pt');
  ensureNum(req.inr, 'in');
  ensureNum(req.ptt, 'ptt');
  ensureNum(req.fibrinogen, 'fi');
  ensureNum(req.d_dimer, 'dd');
  ensureEnum(req.anticoag, 'ac', ['none','warfarin','heparin','LMWH','DOAC','DAPT','aspirin','clopidogrel','ticagrelor','rivaroxaban','apixaban','dabigatran','other']);
  ensureNum(req.anti_xa, 'ax');
  ensureStr(req.provider, 'pr');
  return { co_id: `coa_${Date.now()}`, patient_id: req.patient_id, inr: req.inr, pt: req.pt };
}
function transfusion(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.product, 'pd', ['PRBC','platelets','FFP','cryo','whole_blood','albumin','IVIG','factor_concentrate','prothrombin_complex','other']);
  ensureNum(req.units, 'un');
  ensureEnum(req.indication, 'in', ['acute_bleed','Hgb_less_7','Hgb_less_8_cardiac','platelets_less_10','platelets_less_50_procedure','INR_over_2','coagulopathy','TTP','DIC','HUS','massive_transfusion','exchange','other']);
  ensureNum(req.pre_hgb, 'ph');
  ensureNum(req.post_hgb, 'poh');
  ensureBool(req.reaction, 'rx');
  ensureEnum(req.reaction_type, 'rt', ['none','febrile','allergic','hemolytic','TRALI','TACO','other']);
  ensureStr(req.provider, 'pr');
  return { tr_id: `txn_${Date.now()}`, patient_id: req.patient_id, product: req.product, units: req.units };
}
function chemo(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.regimen, 're', ['CHOP','R-CHOP','ABVD','R-ABVD','BEACOPP','MOPP','CVP','FCR','R-CVP','Hyper-CVAD','DA-EPOCH','bendamustine','fludarabine','other']);
  ensureNum(req.cycle, 'cy');
  ensureNum(req.day, 'dy');
  ensureNum(req.anc, 'an');
  ensureNum(req.platelet, 'pl');
  ensureBool(req.given_full_dose, 'gf');
  ensureEnum(req.toxicity, 'tx', ['none','neutropenia','thrombocytopenia','anemia','mucositis','neuropathy','nausea','renal','cardiac','tumor_lysis','other']);
  ensureStr(req.provider, 'pr');
  return { ch_id: `chm_${Date.now()}`, patient_id: req.patient_id, regimen: req.regimen, cycle: req.cycle };
}
function marrow(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.site, 'st', ['iliac_crest','sternum','tibia','other']);
  ensureNum(req.cellularity_pct, 'ce');
  ensureNum(req.m_e_ratio, 'mr');
  ensureNum(req.blasts_pct, 'bp');
  ensureEnum(req.diagnosis, 'dx', ['normal','AML','ALL','MDS','CML','CLL','lymphoma','myeloma','aplastic','ITP','megaloblastic','other']);
  ensureEnum(req.cytogenetics, 'cg', ['normal','favorable','intermediate','adverse','pending','unknown']);
  ensureEnum(req.flow, 'fl', ['negative','minimal_residual','positive','pending','unknown']);
  ensureStr(req.provider, 'pr');
  return { bm_id: `bmr_${Date.now()}`, patient_id: req.patient_id, diagnosis: req.diagnosis, blasts: req.blasts_pct };
}

function funcs() { return { cbc, coagulation, transfusion, chemo, marrow }; }
module.exports = { funcs, ValidationError };