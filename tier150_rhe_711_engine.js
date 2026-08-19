// filepath: tier150_rhe_711_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ra(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.tender_joint_28, 'tj');
  ensureNum(req.swollen_joint_28, 'sj');
  ensureNum(req.das28_crp, 'dc');
  ensureNum(req.das28_esr, 'de');
  ensureNum(req.crp, 'cr');
  ensureNum(req.esr, 'es');
  ensureNum(req.rf, 'rf');
  ensureEnum(req.ccp, 'cc', ['negative','low_positive','high_positive','NA','unknown']);
  ensureBool(req.erosions_on_xray, 'ex');
  ensureEnum(req.bdmard, 'bd', ['none','methotrexate','leflunomide','sulfasalazine','hydroxychloroquine','biologic','JAK_inhibitor','combo','other']);
  ensureBool(req.remission, 'rm');
  ensureStr(req.provider, 'pr');
  return { ra_id: `rar_${Date.now()}`, patient_id: req.patient_id, das28: req.das28_crp };
}
function sle(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.sledai, 'sl');
  ensureNum(req.dsna, 'ds');
  ensureEnum(req.ana, 'an', ['negative','low_titer','mid_titer','high_titer','NA','unknown']);
  ensureEnum(req.anti_smith, 'sm', ['negative','positive','NA','unknown']);
  ensureEnum(req.anti_rnp, 'rn', ['negative','positive','NA','unknown']);
  ensureEnum(req.anti_ssa, 'ss', ['negative','positive','NA','unknown']);
  ensureEnum(req.anti_ssb, 'sb', ['negative','positive','NA','unknown']);
  ensureNum(req.c3, 'c3');
  ensureNum(req.c4, 'c4');
  ensureEnum(req.organ_involvement, 'oi', ['none','renal','neuro','heme','cardiac','pulm','GI','skin','joints','other','NA']);
  ensureStr(req.provider, 'pr');
  return { sl_id: `sle_${Date.now()}`, patient_id: req.patient_id, sledai: req.sledai };
}
function vasculitis(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['GCA','Takayasu','PAN','ANCA_GPA','ANCA_MPA','ANCA_EGPA','IgA_vasculitis','cryoglobulinemia','Behcet','Cogan','other','unknown','NA']);
  ensureEnum(req.anca_pr3, 'pr', ['negative','low','high','NA','unknown']);
  ensureEnum(req.anca_mpo, 'mp', ['negative','low','high','NA','unknown']);
  ensureNum(req.crp, 'cr');
  ensureNum(req.esr, 'es');
  ensureBool(req.renal_involvement, 'ri');
  ensureBool(req.pulmonary_involvement, 'pi');
  ensureEnum(req.treatment, 'tr', ['none','steroid','cyclophosphamide','rituximab','MMF','azathioprine','methotrexate','tocilizumab','avacopan','other']);
  ensureStr(req.provider, 'pr');
  return { vs_id: `vsc_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function spondylo(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['ankylosing_spondylitis','psoriatic_arthritis','reactive_arthritis','IBD_associated','undifferentiated','juvenile','other','NA']);
  ensureNum(req.basdai, 'bs');
  ensureNum(req.basfi, 'bf');
  ensureNum(req.dactylitis_count, 'dc');
  ensureNum(req.enthesitis_count, 'ec');
  ensureEnum(req.hla_b27, 'hb', ['positive','negative','NA','unknown']);
  ensureNum(req.crp, 'cr');
  ensureBool(req.sacroiliitis_on_mri, 'sm');
  ensureBool(req.uveitis_history, 'uh');
  ensureEnum(req.treatment, 'tr', ['none','NSAID','DMARD','anti_TNF','anti_IL17','anti_IL12_23','JAK_inhibitor','combination','other']);
  ensureStr(req.provider, 'pr');
  return { sp_id: `spo_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function gout(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.sua, 'su');
  ensureNum(req.crp, 'cr');
  ensureNum(req.tophi_count, 'tc');
  ensureNum(req.attacks_per_year, 'ay');
  ensureNum(req.joints_involved, 'ji');
  ensureBool(req.dactylitis, 'da');
  ensureBool(req.renal_stones, 'rs');
  ensureEnum(req.treatment, 'tr', ['none','allopurinol','febuxostat','probenecid','pegloticase','colchicine_prophylaxis','NSAID','steroid','IL1_inhibitor','other']);
  ensureNum(req.allopurinol_dose, 'ad');
  ensureStr(req.provider, 'pr');
  return { gt_id: `gou_${Date.now()}`, patient_id: req.patient_id, ua: req.sua };
}

function funcs() { return { ra, sle, vasculitis, spondylo, gout }; }
module.exports = { funcs, ValidationError };