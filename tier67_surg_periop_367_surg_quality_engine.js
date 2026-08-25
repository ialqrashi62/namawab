// filepath: tier67_surg_periop_367_surg_quality_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function or_efficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.or_room, 'or');
  ensureStr(req.scheduled_start, 'ss');
  ensureStr(req.actual_start, 'as');
  ensureNum(req.scheduled_duration_min, 'sdm');
  ensureNum(req.actual_duration_min, 'adm');
  ensureNum(req.turnover_min, 'tom');
  ensureEnum(req.delay_reason, 'dr', ['prep_delay','anesthesia_delay','equipment_issue','patient_late','surgeon_late','staffing','none','other','pre_op_consult','unknown']);
  ensureBool(req.first_case_start_on_time, 'fcsot');
  return { room: req.or_room };
}
function case_duration_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.case_type, 'ct');
  ensureNum(req.actual_min, 'am');
  ensureNum(req.bench_min, 'bm');
  ensureNum(req.delta_min, 'dm');
  ensureEnum(req.surgeon_experience, 'se', ['intern','resident','fellow','attending','chief','consultant','pa_first_assist','np_first_assist','staff_surgeon','visiting_consultant','other']);
  ensureEnum(req.difficulty, 'diff', ['low_routine','low_complex','moderate','complex','high_complex','twice_arbitrary']);
  ensureEnum(req.review_action, 'ra', ['documentation_complete','none','p2p_review','m_and_m','quality_review','teaching_case','other']);
  return { case: req.case_type };
}
function instrument_count(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureNum(req.instrument_count_before, 'icb');
  ensureNum(req.instrument_count_after, 'ica');
  ensureBool(req.count_correct, 'cc');
  ensureBool(req.discrepancy_resolved, 'dr');
  ensureStr(req.verified_by, 'vb');
  ensureBool(req.surgeon_signoff, 'ss');
  return { count_before: req.instrument_count_before };
}
function sponge_count(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureNum(req.sponges_in, 'si');
  ensureNum(req.sponges_out, 'so');
  ensureBool(req.count_correct, 'cc');
  ensureBool(req.discrepancy_resolved, 'dr');
  ensureStr(req.verified_by, 'vb');
  ensureBool(req.surgeon_signoff, 'ss');
  return { counted: req.sponges_in };
}
function sharps_count(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureNum(req.sharps_in, 'si');
  ensureNum(req.sharps_out, 'so');
  ensureBool(req.needles_accounted, 'na');
  ensureBool(req.blades_accounted, 'ba');
  ensureBool(req.count_correct, 'cc');
  ensureStr(req.verified_by, 'vb');
  ensureBool(req.surgeon_signoff, 'ss');
  return { counted: req.sharps_in };
}

function funcs() { return { or_efficiency, case_duration_review, instrument_count, sponge_count, sharps_count }; }
module.exports = { funcs, ValidationError };