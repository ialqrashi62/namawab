// filepath: tier78_ortho_ext_416_ortho_sports_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function acl_reconstruction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.graft_type, 'gt', ['bptb','hamstring','quad_tendon','allograft','hybrid','other']);
  ensureEnum(req.technique, 'tech', ['anatomic_single_bundle','anatomic_double_bundle','transportal','outside_in','all_inside','other']);
  ensureStr(req.fixation_equipment, 'fe');
  ensureNum(req.operative_time_min, 'otm');
  ensureBool(req.menisci_repaired, 'mr');
  ensureBool(req.chondroplasty_done, 'cd');
  ensureEnum(req.complications, 'comp', ['none','infection','stiffness','graft_failure','hemarthrosis','dvt','other']);
  ensureNum(req.brace_duration_weeks, 'bdw');
  ensureStr(req.rehab_protocol, 'rp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function rotator_cuff_repair(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.technique, 'tech', ['arthroscopic','mini_open','open','other']);
  ensureStr(req.cuff_tear_size, 'cts');
  ensureStr(req.repair_configuration, 'rc');
  ensureStr(req.anchors_used, 'au');
  ensureBool(req.biceps_tenodesis, 'bt');
  ensureBool(req.acromioplasty, 'acr');
  ensureNum(req.rehab_phase_weeks, 'rpw');
  ensureEnum(req.complications, 'comp', ['none','stiffness','retear','infection','nerve_injury','other']);
  ensureBool(req.sling_required, 'sl');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function meniscus_repair(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.tear_pattern, 'tp', ['longitudinal','radial','horizontal','bucket_handle','flap','complex','root','other']);
  ensureEnum(req.zone, 'zone', ['white_white','red_white','red_red','unknown']);
  ensureStr(req.repair_technique, 'rt');
  ensureNum(req.rehab_protocol_weeks, 'rpw');
  ensureEnum(req.complications, 'comp', ['none','stiffness','retear','infection','dvt','other']);
  ensureBool(req.partial_meniscectomy, 'pm');
  ensureNum(req.expected_healing_weeks, 'ehw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function shoulder_impingement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.pain_score, 'ps');
  ensureBool(req.neer_test_positive, 'ntp');
  ensureBool(req.hawkins_test_positive, 'htp');
  ensureStr(req.mri_findings, 'mf');
  ensureBool(req.injections_tried, 'it');
  ensureBool(req.physical_therapy_done, 'ptd');
  ensureBool(req.surgical_referred, 'sr');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function sports_clearance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.sport, 'sp');
  ensureEnum(req.cardiac_clearance, 'cc', ['cleared','not_cleared','pending','referred','unknown']);
  ensureBool(req.musculoskeletal_clear, 'mc');
  ensureBool(req.concussion_baseline_done, 'cbd');
  ensureBool(req.cleared, 'cl');
  ensureStr(req.conditions, 'cond');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { acl_reconstruction, rotator_cuff_repair, meniscus_repair, shoulder_impingement, sports_clearance }; }
module.exports = { funcs, ValidationError };