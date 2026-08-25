// filepath: tier78_ortho_ext_413_ortho_trauma_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function trauma_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.mechanism, 'm', ['fall','mvc','ped_vs_auto','sports','work','assault','penetrating','crush','other','unknown']);
  ensureStr(req.injuries, 'inj');
  ensureNum(req.iss_score, 'is');
  ensureBool(req.hemodynamically_stable, 'hs');
  ensureStr(req.atls_classification, 'ac');
  ensureBool(req.fractures_present, 'fp');
  ensureStr(req.fracture_locations, 'fl');
  ensureNum(req.time_since_injury_min, 'tsi');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function fracture_reduction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.fracture_type, 'ft', ['closed','open_i','open_ii','open_iiia','open_iiib','open_iiic','pathologic','greenstick','comminuted','spiral','oblique','transverse','other']);
  ensureStr(req.bone, 'bone');
  ensureEnum(req.reduction_method, 'rm', ['closed','open','percutaneous','external_fixation','internal_fixation','cast','traction','other']);
  ensureEnum(req.anesthesia, 'an', ['general','regional','local','sedation','none','other']);
  ensureBool(req.successful, 'suc');
  ensureEnum(req.complications, 'comp', ['none','neurovascular_injury','compartment_syndrome','malreduction','other','loss_of_reduction','infection']);
  ensureStr(req.imaging_post, 'ip');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function fracture_orif(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureStr(req.bone, 'bone');
  ensureEnum(req.fracture_pattern, 'fp', ['simple','wedge','complex','segmental','comminuted','other']);
  ensureStr(req.hardware_used, 'hw');
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.ebl_ml, 'ebl');
  ensureEnum(req.complications, 'comp', ['none','blood_loss','nerve_injury','infection','hardware_failure','nonunion','other','dvt']);
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureStr(req.weight_bearing_status, 'wbs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function soft_tissue_injury(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.structure, 'struct');
  ensureEnum(req.grade, 'gr', ['i','ii','iii','iv','i_iii','partial','complete','other']);
  ensureStr(req.imaging_findings, 'if');
  ensureStr(req.treatment, 'tx');
  ensureNum(req.expected_recovery_weeks, 'erw');
  ensureBool(req.surgical_referral, 'sr');
  ensureStr(req.rehab_plan, 'rp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function polytrauma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.iss_total, 'is');
  ensureNum(req.revised_trauma_score, 'rts');
  ensureStr(req.injuries, 'inj');
  ensureBool(req.massive_transfusion, 'mt');
  ensureBool(req.ex_fix_placed, 'efp');
  ensureBool(req.damage_control_done, 'dcd');
  ensureBool(req.icu_admission, 'icu');
  ensureStr(req.consult_specialty, 'cs');
  ensureStr(req.family_update, 'fu');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { trauma_initial, fracture_reduction, fracture_orif, soft_tissue_injury, polytrauma }; }
module.exports = { funcs, ValidationError };