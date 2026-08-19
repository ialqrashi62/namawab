// filepath: tier93_vasculitis_492_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function gca(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.gca_symptoms, 'sym');
  ensureNum(req.esr, 'esr');
  ensureNum(req.crp, 'crp');
  ensureEnum(req.temporal_artery_biopsy, 'tab', ['positive','negative','non_diagnostic','pending','not_done','other','unknown']);
  ensureNum(req.prednisone_dose, 'pdn');
  ensureBool(req.toci_use, 'toci');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function takayasu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type_v, 'tv', ['takayasu','other','unknown']);
  ensureBool(req.arterial_stenosis, 'as');
  ensureNum(req.blood_pressure_difference, 'bpd');
  ensureEnum(req.angiography_pattern, 'ap', ['stenotic','dilated','aneurysmal','mixed','other','unknown']);
  ensureEnum(req.imaging, 'img', ['mra','cta','doppler','conventional','other','unknown']);
  ensureNum(req.activity_score, 'acts');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function anca_vasculitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type_v, 'tv', ['anca_associated','other','unknown']);
  ensureEnum(req.anca_type, 'at', ['pr3','mpo','negative','other','unknown']);
  ensureNum(req.bv_as_score, 'bvas');
  ensureBool(req.renal_involvement, 'ri');
  ensureBool(req.pulmonay_involvement, 'pi');
  ensureEnum(req.induction, 'ind', ['rituximab','cyclophosphamide','combination','other','unknown','none']);
  ensureEnum(req.maintenance, 'mnt', ['azathioprine','methotrexate','mycophenolate','rituximab','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function polyarteritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type_v, 'tv', ['polyarteritis','other','unknown']);
  ensureNum(req.aneurysm_count, 'ac');
  ensureBool(req.microaneurysms, 'micro');
  ensureBool(req.associated_hep_b, 'ahb');
  ensureBool(req.skin_ulcers, 'sku');
  ensureEnum(req.treatment, 'tx', ['steroids','cyclophosphamide','azathioprine','combination','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function secondary_vasculitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.associated_condition, 'ac', ['ra','sle','sjogren','ibd','cancer','infection','drug','other','unknown','none']);
  ensureBool(req.secondary_vasculitis, 'sv');
  ensureBool(req.peripheral_neuropathy, 'pn');
  ensureBool(req.skin_lesions, 'sl');
  ensureBool(req.cryoglobulins, 'cry');
  ensureEnum(req.treatment, 'tx', ['dmards','steroids','immunosuppression','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { gca, takayasu, anca_vasculitis, polyarteritis, secondary_vasculitis }; }
module.exports = { funcs, ValidationError };
