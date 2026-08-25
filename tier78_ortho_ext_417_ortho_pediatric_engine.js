// filepath: tier78_ortho_ext_417_ortho_pediatric_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function developmental_dysplasia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.hip_side, 'hs', ['left','right','bilateral','unknown']);
  ensureEnum(req.graf_type, 'gt', ['ia','ib','iia','iib','iic','iiia','iiib','iv','normal','unknown','other']);
  ensureNum(req.alpha_angle, 'aa');
  ensureNum(req.beta_angle, 'ba');
  ensureEnum(req.treatment, 'tx', ['pavlik','closed_reduction','open_reduction','observation','other','spica_cast','surgery','none']);
  ensureNum(req.duration_weeks, 'dw');
  ensureStr(req.follow_up_imaging, 'fui');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function clubfoot(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.side, 'sd', ['left','right','bilateral','unknown']);
  ensureNum(req.pirani_score, 'ps');
  ensureBool(req.ponseti_started, 'pts');
  ensureNum(req.casts_to_date, 'ctd');
  ensureBool(req.tenotomy_done, 'td');
  ensureEnum(req.bracing_compliance, 'bc', ['good','partial','poor','unknown','n_a']);
  ensureBool(req.relapse, 'rel');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function scoliosis_juvenile(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.cobb_angle, 'ca');
  ensureNum(req.age_years, 'ay');
  ensureBool(req.bracing_prescribed, 'bp');
  ensureNum(req.brace_hours, 'bh');
  ensureBool(req.menarche_status, 'ms2');
  ensureBool(req.cobb_progression, 'cp');
  ensureNum(req.progression_per_year, 'ppy');
  ensureBool(req.surgical_referred, 'sr');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function slipped_capital_femoral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.side, 'sd', ['left','right','bilateral','unknown']);
  ensureEnum(req.southwick_angle, 'swa', ['mild','moderate','severe','unknown','normal']);
  ensureBool(req.southwick_angle_measured, 'swam');
  ensureEnum(req.stability, 'stab', ['stable','unstable','acute_unstable','unknown']);
  ensureBool(req.surgical_planned, 'splan');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pediatric_fracture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureStr(req.bone, 'bone');
  ensureEnum(req.fracture_pattern, 'fp', ['torus','greenstick','complete','plastic','epiphyseal_i','epiphyseal_ii','epiphyseal_iii','epiphyseal_iv','epiphyseal_v','other']);
  ensureNum(req.remodeling_potential, 'rmp');
  ensureBool(req.reduction_needed, 'rn');
  ensureEnum(req.treatment, 'tx', ['cast','splint','removable','surgical','observation','other']);
  ensureNum(req.cast_duration_weeks, 'cdw');
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { developmental_dysplasia, clubfoot, scoliosis_juvenile, slipped_capital_femoral, pediatric_fracture }; }
module.exports = { funcs, ValidationError };