// filepath: tier175_mus_819_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function lupus_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.selena_sledai, 'ss');
  ensureNum(req.dsDNA, 'dn'); ensureNum(req.complement, 'co');
  ensureNum(req.urine_protein, 'up'); ensureNum(req.steroid_dose, 'sd');
  ensureEnum(req.immunosuppression, 'is', ['none','MMF','cyclophosphamide','azathioprine','methotrexate','NA']);
  ensureNum(req.flares_30d, 'fl'); ensureEnum(req.disposition, 'di', ['continue','step_down','step_up','NA']);
  ensureStr(req.provider, 'pr');
  return { lf_id: `lf_${Date.now()}`, patient_id: req.patient_id, sledai: req.selena_sledai };
}

function ra_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.das28, 'da');
  ensureNum(req.crp, 'cr'); ensureNum(req.joints_swollen, 'js');
  ensureNum(req.joints_tender, 'jt'); ensureEnum(req.biologic, 'bi', ['none','etanercept','adalimumab','infliximab','tocilizumab','rituximab','other','NA']);
  ensureBool(req.methotrexate, 'mt'); ensureEnum(req.response, 're', ['remission','low','moderate','high','NA']);
  ensureStr(req.provider, 'pr');
  return { rf_id: `rf_${Date.now()}`, patient_id: req.patient_id, das: req.das28, re: req.response };
}

function vasculitis_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['GPA','MPA','EGPA','PAN','Behcet','other','NA']);
  ensureNum(req.bv_score, 'bv'); ensureNum(req.pr3, 'pr');
  ensureNum(req.mpo, 'mp'); ensureNum(req.steroid_dose, 'sd');
  ensureEnum(req.immunosuppression, 'is', ['none','cyclophosphamide','rituximab','azathioprine','MMF','NA']);
  ensureNum(req.flares_30d, 'fl'); ensureStr(req.provider, 'pr');
  return { vf_id: `vf_${Date.now()}`, patient_id: req.patient_id, type: req.type, bv: req.bv_score };
}

function myositis_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['DM','PM','IBM','JDM','NA']);
  ensureNum(req.ck, 'ck'); ensureNum(req.aldolase, 'al');
  ensureEnum(req.mda5, 'md', ['positive','negative','NA']);
  ensureNum(req.steroid_dose, 'sd'); ensureEnum(req.immunosuppression, 'is', ['none','IVIG','MMF','cyclophosphamide','methotrexate','NA']);
  ensureEnum(req.response, 're', ['complete','partial','poor','NA']);
  ensureStr(req.provider, 'pr');
  return { mf_id: `mf_${Date.now()}`, patient_id: req.patient_id, type: req.type, ck: req.ck };
}

function scleroderma_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['limited','diffuse','sine','NA']);
  ensureNum(req.skin_score, 'ss'); ensureNum(req.raynauds_severity, 'rs');
  ensureNum(req.pah_mmhg, 'pm'); ensureEnum(req.il6_therapy, 'il', ['none','tocilizumab','sarilumab','siltuximab','NA']);
  ensureEnum(req.response, 're', ['stable','improved','worsened','NA']);
  ensureStr(req.provider, 'pr');
  return { sf_id: `sf_${Date.now()}`, patient_id: req.patient_id, type: req.type, ss: req.skin_score };
}

function funcs() { return { lupus_follow, ra_follow, vasculitis_follow, myositis_follow, scleroderma_follow }; }
module.exports = { funcs, ValidationError };