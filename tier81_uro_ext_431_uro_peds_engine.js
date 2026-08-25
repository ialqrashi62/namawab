// filepath: tier81_uro_ext_431_uro_peds_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pediatric_enuresis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.type, 't', ['daytime','nighttime','combined','primary','secondary','unknown','other']);
  ensureNum(req.episodes_per_week, 'epw');
  ensureNum(req.fluid_intake_ml, 'fi');
  ensureBool(req.bowel_history, 'bh');
  ensureEnum(req.management, 'mg', ['behavioral','bed_wet_alarm','desmopressin','oxybutynin','combination','observation','other','unknown']);
  ensureBool(req.psychological_referral, 'pr2');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.treatment_response, 'tr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cryptorchidism(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureEnum(req.location, 'loc', ['inguinal','abdominal','ectopic','retractile','absent','unknown','other']);
  ensureEnum(req.management, 'mg', ['observation','hcg_therapy','orchiopexy','laparoscopy','exploration','other','unknown']);
  ensureNum(req.operative_age_months, 'oam');
  ensureBool(req.surgical_planned, 'splan');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.fertility_counseling, 'fc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function hypospadias(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.location, 'loc', ['glanular','subcoronal','distal','mid','proximal','perineal','unknown','other']);
  ensureNum(req.chordee_severity, 'cs');
  ensureStr(req.surgical_technique, 'st');
  ensureNum(req.stages_planned, 'sp');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.complications, 'comp_str');
  ensureStr(req.cosmetic_result, 'cr');
  ensureBool(req.additional_surgeries_needed, 'asn');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function circumcision(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.technique, 'tech', ['gomco','plastibell','mogen','shen','other']);
  ensureEnum(req.anesthesia, 'an', ['local','mask','general','other']);
  ensureNum(req.operative_time_min, 'otm');
  ensureBool(req.complications, 'comp_bool');
  ensureEnum(req.complication_type, 'ct', ['none','bleeding','infection','glans_injury','inadequate_cosmesis','other','unknown']);
  ensureNum(req.post_op_care, 'poc');
  ensureStr(req.satisfaction, 'sat');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function pediatric_vesicoureteral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.grade, 'gr', ['i','ii','iii','iv','v','unknown','other']);
  ensureBool(req.recurrent_uti, 'rut');
  ensureNum(req.episode_count_6mo, 'ec6');
  ensureBool(req.prophylaxis_started, 'prs');
  ensureStr(req.prophylaxis_agent, 'pa');
  ensureBool(req.surgical_referral, 'sr');
  ensureEnum(req.deflux_injection_planned, 'dip', ['planned','done','not_planned','unknown','other']);
  ensureNum(req.last_imaging_finding, 'lif');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { pediatric_enuresis, cryptorchidism, hypospadias, circumcision, pediatric_vesicoureteral }; }
module.exports = { funcs, ValidationError };