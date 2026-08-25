// filepath: tier67_surg_periop_364_surg_intraop_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function operative_note(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.procedure_cpt, 'pcpt');
  ensureStr(req.diagnosis_pre, 'dp');
  ensureStr(req.findings, 'find');
  ensureStr(req.technique, 'tech');
  ensureNum(req.ebl_ml, 'ebl');
  ensureStr(req.specimens, 'spec');
  ensureStr(req.surgeon, 'surg');
  ensureNum(req.duration_min, 'dur');
  return { cpt: req.procedure_cpt };
}
function timed_out(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureBool(req.time_out_completed, 'toc');
  ensureBool(req.patient_id_verified, 'piv');
  ensureBool(req.site_marked, 'sm');
  ensureBool(req.procedure_confirmed, 'pc');
  ensureBool(req.allergy_reviewed, 'ar');
  ensureBool(req.antibiotic_given, 'ag');
  ensureBool(req.team_intro, 'ti');
  ensureEnum(req.final_check, 'fc', ['go','stop','hold_until_resolved','pending_decision','escalate','no_go']);
  return { check: req.final_check };
}
function time_out(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureBool(req.patient_id_verified, 'piv');
  ensureBool(req.site_verified, 'sv');
  ensureEnum(req.laterality_correct, 'lc', ['right','left','bilateral','midline','not_applicable','unable_to_assess','n_a','n_a_localized']);
  ensureBool(req.procedure_correct, 'pc');
  ensureBool(req.implants_available, 'ia');
  ensureBool(req.specimen_labeled, 'sl');
  ensureStr(req.documented_by, 'db');
  ensureStr(req.timestamp, 'ts');
  return { side: req.laterality_correct };
}
function positioning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.position, 'pos', ['supine','prone','lateral_right','lateral_left','lithotomy','beach_chair','sitting','trendelenburg','reverse_trendelenburg','park_bench','other']);
  ensureStr(req.padding_used, 'pu');
  ensureBool(req.pressure_points_checked, 'ppc');
  ensureNum(req.time_in_position_min, 'tipm');
  ensureEnum(req.complications, 'comp', ['none','position_injury','brachial_plexus','ulnar_neuropathy','skin_breakdown','pressure_ulcer','eye_injury','dislodged_iv','other']);
  ensureBool(req.repositioned, 'rep');
  ensureStr(req.documented_by, 'db');
  return { position: req.position };
}
function anesthesia_record(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.anesthesia_type, 'at', ['general','regional','local','monitored_anesthesia_care','epidural','spinal','combined','awake','sedation','other']);
  ensureStr(req.induction, 'ind');
  ensureEnum(req.airway, 'aw', ['ett','lma','native','tracheostomy','spontaneous','jet','mask','nasal','oral','other']);
  ensureStr(req.maintenance, 'mnt');
  ensureEnum(req.vital_signs_summary, 'vss', ['stable','mild_fluctuation','hemodynamic_instability','arrhythmia','hypotension','hypertension','hypothermia','hyperthermia','other']);
  ensureStr(req.fluid_io, 'fio');
  ensureNum(req.ebl_ml, 'ebl');
  ensureEnum(req.reversal, 'rev', ['neostigmine_glycopyrrolate','sugammadex','flumazenil','naloxone','spontaneous','none','other']);
  ensureNum(req.duration_min, 'dur');
  return { type: req.anesthesia_type };
}

function funcs() { return { operative_note, timed_out, time_out, positioning, anesthesia_record }; }
module.exports = { funcs, ValidationError };