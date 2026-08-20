// filepath: tier166_den_777_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function dental_exam(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.teeth_present, 'tp');
  ensureNum(req.teeth_missing, 'tm'); ensureNum(req.teeth_decay, 'td');
  ensureNum(req.teeth_filled, 'tf'); ensureEnum(req.periodontal, 'pn', ['healthy','gingivitis','mild_periodontitis','moderate','severe','NA']);
  ensureNum(req.plaque_index, 'pi'); ensureEnum(req.oral_hygiene, 'oh', ['excellent','good','fair','poor','NA']);
  ensureNum(req.last_cleaning_months, 'lc'); ensureStr(req.provider, 'pr');
  return { de_id: `de_${Date.now()}`, patient_id: req.patient_id, dmft: req.teeth_decay + req.teeth_missing + req.teeth_filled };
}

function dental_procedure(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.procedure_type, 'pt', ['filling','extraction','crown','root_canal','implant','cleaning','NA']);
  ensureNum(req.tooth_number, 'tn'); ensureNum(req.duration_min, 'du');
  ensureNum(req.lidocaine_mg, 'lm'); ensureEnum(req.complication, 'co', ['none','bleeding','infection','nerve','other','NA']);
  ensureEnum(req.disposition, 'di', ['discharged','follow_up','referral','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { dp_id: `dp_${Date.now()}`, patient_id: req.patient_id, type: req.procedure_type, tooth: req.tooth_number };
}

function orthodontic(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.treatment_type, 'tt', ['braces','aligner','retainer','expansion','headgear','NA']);
  ensureNum(req.duration_months, 'du'); ensureNum(req.appointments_30d, 'a3');
  ensureEnum(req.progress, 'pr', ['planned','early','mid','late','complete','NA']);
  ensureNum(req.ovj_mm, 'oj'); ensureNum(req.ovb_mm, 'ob');
  ensureEnum(req.compliance, 'co', ['excellent','good','moderate','poor','NA']);
  ensureNum(req.next_visit_days, 'nv'); ensureStr(req.provider, 'pr');
  return { or_id: `or_${Date.now()}`, patient_id: req.patient_id, type: req.treatment_type, prog: req.progress };
}

function endodontic(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.tooth, 'to');
  ensureEnum(req.diagnosis, 'dx', ['pulpitis','necrosis','apical_abscess','cracked','other','NA']);
  ensureNum(req.canal_count, 'cc'); ensureNum(req.duration_min, 'du');
  ensureEnum(req.material, 'mt', ['gutta_percha','resin','other','NA']);
  ensureNum(req.success_pct, 'sp'); ensureNum(req.followup_days, 'fd');
  ensureStr(req.provider, 'pr');
  return { en_id: `en_${Date.now()}`, patient_id: req.patient_id, tooth: req.tooth, canals: req.canal_count };
}

function maxillofacial_surg(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.surgery_type, 'st', ['impacted_tooth','cyst','tumor','fracture','reconstruction','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.ebl_ml, 'eb');
  ensureBool(req.biopsy_sent, 'bs'); ensureEnum(req.pathology, 'pa', ['benign','malignant','no_result','pending','NA']);
  ensureNum(req.hospital_days, 'hd'); ensureEnum(req.complication, 'co', ['none','infection','bleeding','nerve','other','NA']);
  ensureStr(req.provider, 'pr');
  return { ms_id: `ms_${Date.now()}`, patient_id: req.patient_id, type: req.surgery_type, path: req.pathology };
}

function funcs() { return { dental_exam, dental_procedure, orthodontic, endodontic, maxillofacial_surg }; }
module.exports = { funcs, ValidationError };