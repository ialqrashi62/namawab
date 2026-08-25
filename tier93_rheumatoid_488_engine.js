// filepath: tier93_rheumatoid_488_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ra_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.tender_joints, 'tj');
  ensureNum(req.swollen_joints, 'sj');
  ensureNum(req.das28_esr, 'd28e');
  ensureNum(req.das28_crp, 'd28c');
  ensureNum(req.sdai, 'sdai');
  ensureNum(req.cdai, 'cdai');
  ensureEnum(req.disease_activity, 'da', ['remission','low','moderate','high','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function ra_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureEnum(req.csdmard, 'csm', ['methotrexate','leflunomide','sulfasalazine','hydroxychloroquine','none','other','unknown']);
  ensureNum(req.mtx_dose, 'md');
  ensureEnum(req.bdmard, 'bdm', ['tnf_inhibitor','ilt_inhibitor','abatacept','rituximab','jak_inhibitor','none','other','unknown']);
  ensureNum(req.treat_to_target, 'ttt');
  ensureNum(req.time_to_remission, 'ttr');
  ensureEnum(req.response, 'res', ['remission','low','moderate','no_response','primary_failure','secondary_failure','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function ra_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.crp, 'crp');
  ensureNum(req.esr, 'esr');
  ensureNum(req.cbc_wbc, 'wbc');
  ensureNum(req.cbc_plt, 'plt');
  ensureNum(req.alt, 'alt');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.tb_screening, 'tb');
  ensureNum(req.hep_b_screening, 'hbv');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function ra_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.imaging_id, 'iid');
  ensureEnum(req.modality, 'mod', ['xray','mri','ultrasound','ct','other','unknown']);
  ensureNum(req.erosion_score, 'es');
  ensureNum(req.joint_space_narrowing, 'jsn');
  ensureNum(req.synovitis_grade, 'sg');
  ensureNum(req.tenosynovitis, 'ts');
  ensureNum(req.bone_marrow_edema, 'bme');
  ensureNum(req.power_doppler_signal, 'pds');
  ensureStr(req.provider, 'pr');
  return { iid: req.imaging_id };
}
function ra_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'prid');
  ensureEnum(req.procedure_type, 'pt', ['synovectomy','arthroplasty','arthrodesis','tendon_repair','other','unknown']);
  ensureStr(req.joint, 'joint');
  ensureNum(req.pre_op_das28, 'pdas');
  ensureNum(req.post_op_oasri, 'pos');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { prid: req.procedure_id };
}

function funcs() { return { ra_assessment, ra_treatment, ra_monitoring, ra_imaging, ra_surgery }; }
module.exports = { funcs, ValidationError };
