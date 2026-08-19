// filepath: tier156_txp_737_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function evaluation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.organ, 'or', ['kidney','liver','heart','lung','pancreas','kidney_pancreas','heart_lung','intestine','multi_organ','other','NA']);
  ensureNum(req.age, 'ag');
  ensureNum(req.bmi, 'bm');
  ensureEnum(req.status, 'st', ['referral','workup','listed','active','suspended','deferred','rejected','transplanted','NA']);
  ensureNum(req.egfr, 'eg');
  ensureNum(req.meld, 'me');
  ensureNum(req.lvef, 'le');
  ensureNum(req.fev1, 'fe');
  ensureNum(req.bilirubin, 'bi');
  ensureNum(req.hba1c, 'hb');
  ensureBool(req.comorbidities_clear, 'cc');
  ensureBool(req.psychiatric_clear, 'pc');
  ensureBool(req.psychosocial_clear, 'ps');
  ensureBool(req.financial_clear, 'fc');
  ensureStr(req.provider, 'pr');
  return { ev_id: `txv_${Date.now()}`, patient_id: req.patient_id, organ: req.organ };
}
function donor_proc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.donor_id, 'di');
  ensureEnum(req.type, 'tp', ['DBD','DCD','ECD','DBCD','living_related','living_unrelated','paired','good_samaritan','NA']);
  ensureNum(req.age, 'ag');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.height_cm, 'hc');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.bilirubin, 'bi');
  ensureNum(req.ast, 'as');
  ensureNum(req.alt, 'al');
  ensureNum(req.lvef, 'le');
  ensureNum(req.fev1, 'fe');
  ensureEnum(req.cause_of_death, 'cd', ['trauma','stroke','anoxia','cardiac','other','NA','living']);
  ensureNum(req.cold_ischemia, 'ci');
  ensureNum(req.warm_ischemia, 'wi');
  ensureBool(req.machine_perfusion, 'mp');
  ensureStr(req.provider, 'pr');
  return { dp_id: `dpr_${Date.now()}`, donor_id: req.donor_id, type: req.type };
}
function recipient_op(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureEnum(req.organ, 'or', ['kidney','liver','heart','lung','pancreas','kidney_pancreas','heart_lung','other','NA']);
  ensureNum(req.cit_hr, 'ci');
  ensureNum(req.wit_min, 'wi');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.uf_ml, 'uf');
  ensureNum(req.diuresis_ml, 'di');
  ensureNum(req.urine_output_ml, 'uo');
  ensureBool(req.dialysis_required, 'dr');
  ensureNum(req.operative_time_hr, 'ot');
  ensureBool(req.reperfusion_quality, 'rq');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { ro_id: `rop_${Date.now()}`, case_id: req.case_id, organ: req.organ };
}
function immunosuppressant(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.drug, 'dr', ['tacrolimus','cyclosporine','sirolimus','everolimus','mycophenolate','azathioprine','steroid','basiliximab','antithymocyte','rituximab','belatacept','none','combination','NA']);
  ensureNum(req.dose_mg, 'ds');
  ensureNum(req.drug_level_ng_ml, 'dl');
  ensureNum(req.days_post_tx, 'dp');
  ensureBool(req.trough_level, 'tl');
  ensureNum(req.tac_level, 'tac');
  ensureEnum(req.adjustment, 'ad', ['none','increase','decrease','hold','restart','other','NA']);
  ensureEnum(req.toxicity, 'tx', ['none','nephrotoxicity','neurotoxicity','hyperglycemia','hyperlipidemia','HTN','tremor','hirsutism','gingival_hyperplasia','infection','other','NA']);
  ensureNum(req.lab_stable_days, 'ls');
  ensureStr(req.provider, 'pr');
  return { is_id: `imm_${Date.now()}`, patient_id: req.patient_id, drug: req.drug };
}
function post_op(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.days_post_tx, 'dp');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.egfr, 'eg');
  ensureNum(req.albumin, 'al');
  ensureNum(req.bilirubin, 'bi');
  ensureNum(req.ast, 'as');
  ensureNum(req.alt, 'al');
  ensureNum(req.lvef, 'le');
  ensureNum(req.fev1, 'fe');
  ensureEnum(req.drain_status, 'ds', ['none','present_dry','present_draining','removed','NA']);
  ensureEnum(req.discharge_disposition, 'dd', ['home','rehab','ward','SNF','expired','NA']);
  ensureNum(req.los_days, 'lo');
  ensureNum(req.icu_days, 'icu');
  ensureStr(req.provider, 'pr');
  return { po_id: `ptx_${Date.now()}`, patient_id: req.patient_id };
}

function funcs() { return { evaluation, donor_proc, recipient_op, immunosuppressant, post_op }; }
module.exports = { funcs, ValidationError };