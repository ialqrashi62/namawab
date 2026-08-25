// filepath: tier143_ent_682_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function audiogram(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.db_500, '5h');
  ensureNum(req.db_1000, '1k');
  ensureNum(req.db_2000, '2k');
  ensureNum(req.db_4000, '4k');
  ensureNum(req.db_8000, '8k');
  ensureEnum(req.type, 'tp', ['air','bone','speech','tympanometry','OAE','ABR','aided','unaided']);
  ensureEnum(req.loss_grade, 'lg', ['normal','mild','moderate','moderately_severe','severe','profound','total']);
  ensureStr(req.provider, 'pr');
  return { ad_id: `ad_${Date.now()}`, patient_id: req.patient_id, loss_grade: req.loss_grade };
}
function endoscopy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['nasopharyngoscopy','laryngoscopy','direct_laryngoscopy','flexible_laryngoscopy','rigid_laryngoscopy','bronchoscopy','esophagoscopy','sinusoscopy','otoscopy','rhinoscopy']);
  ensureStr(req.findings, 'fi');
  ensureNum(req.biopsy_count, 'bc');
  ensureBool(req.pathology, 'pa');
  ensureStr(req.complications, 'cmp');
  ensureStr(req.provider, 'pr');
  return { en_id: `en_${Date.now()}`, patient_id: req.patient_id, type: req.type, findings: req.findings };
}
function tinnitus(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['subjective','objective','pulsatile','non_pulsatile','sensorineural','conductive','central','unknown']);
  ensureNum(req.thi_score, 'th');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','catastrophic']);
  ensureEnum(req.laterality, 'lt', ['left','right','bilateral','unknown']);
  ensureStr(req.pitch, 'pi');
  ensureStr(req.provider, 'pr');
  return { tn_id: `tn_${Date.now()}`, patient_id: req.patient_id, thi: req.thi_score, severity: req.severity };
}
function sinus_ct(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.lund_mackay, 'lm', ['0','1-6','7-12','13-18','19-24','unknown']);
  ensureNum(req.lund_mackay_score, 'ls');
  ensureNum(req.snout_pneumatization, 'sp');
  ensureStr(req.findings, 'fi');
  ensureStr(req.provider, 'pr');
  return { ct_id: `ct_${Date.now()}`, patient_id: req.patient_id, lund_mackay: req.lund_mackay_score };
}
function voice(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.vhi_score, 'vs');
  ensureEnum(req.grade, 'gd', ['0','1','2','3','unknown']);
  ensureEnum(req.hoarseness, 'hr', ['none','mild','moderate','severe','aphonia']);
  ensureNum(req.max_phonation_time, 'mp');
  ensureNum(req.f0_hz, 'f0');
  ensureBool(req.stroboscopy, 'st');
  ensureStr(req.provider, 'pr');
  return { vc_id: `vc_${Date.now()}`, patient_id: req.patient_id, vhi: req.vhi_score, grade: req.grade };
}

function funcs() { return { audiogram, endoscopy, tinnitus, sinus_ct, voice }; }
module.exports = { funcs, ValidationError };
