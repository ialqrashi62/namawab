// filepath: tier168_gyn_785_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pelvic_exam(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.exam_type, 'et', ['annual','problem','follow_up','NA']);
  ensureBool(req.pap_done, 'pd'); ensureBool(req.hpv_test, 'ht');
  ensureNum(req.pap_result, 'pr'); ensureEnum(req.bimanual, 'bi', ['normal','mass','tenderness','NA']);
  ensureEnum(req.discharge, 'di', ['normal','abnormal','bloody','none','NA']);
  ensureEnum(req.disposition, 'dp', ['normal','follow_up','biopsy','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { pe_id: `pe_${Date.now()}`, patient_id: req.patient_id, pap: req.pap_result, biman: req.bimanual };
}

function contraception(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.method, 'mt', ['OC','IUD','implant','injection','condom','sterilization','NA']);
  ensureNum(req.duration_months, 'du'); ensureNum(req.pearl_index, 'pi');
  ensureEnum(req.side_effect, 'se', ['none','spotting','weight','mood','headache','multiple','NA']);
  ensureBool(req.compliance, 'co'); ensureEnum(req.disposition, 'di', ['continue','switch','discontinue','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { cn_id: `cn_${Date.now()}`, patient_id: req.patient_id, method: req.method, pi: req.pearl_index };
}

function iud_placement(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['copper','hormonal','NA']);
  ensureBool(req.successful, 'su'); ensureBool(req.complication, 'co');
  ensureEnum(req.complication_type, 'ct', ['none','perforation','expulsion','infection','NA']);
  ensureNum(req.days_post_insert, 'dp'); ensureEnum(req.position, 'po', ['in_place','expelled','displaced','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { iu_id: `iu_${Date.now()}`, patient_id: req.patient_id, type: req.type, success: req.successful };
}

function fertility_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.infertility_months, 'im');
  ensureNum(req.cycle_length_days, 'cl'); ensureNum(req.ovulation_confirmed, 'oc');
  ensureNum(req.amh, 'am'); ensureNum(req.fsh, 'fs');
  ensureEnum(req.diagnosis, 'dx', ['anovulation','tubal','male_factor','unexplained','age_related','NA']);
  ensureEnum(req.disposition, 'di', ['natural','IUI','IVF','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { fe_id: `fe_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, disp: req.disposition };
}

function menopause_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.fsh, 'fs');
  ensureNum(req.amh, 'am'); ensureNum(req.menopause_rating_scale, 'mr');
  ensureEnum(req.stage, 'st', ['pre','peri','post','NA']);
  ensureEnum(req.symptoms, 'sy', ['hot_flash','mood','vaginal_dry','sleep','none','multiple','NA']);
  ensureEnum(req.treatment, 'tr', ['none','HRT','SSRI','lifestyle','combination','NA']);
  ensureStr(req.provider, 'pr');
  return { me_id: `me_${Date.now()}`, patient_id: req.patient_id, stage: req.stage, mrs: req.menopause_rating_scale };
}

function funcs() { return { pelvic_exam, contraception, iud_placement, fertility_eval, menopause_eval }; }
module.exports = { funcs, ValidationError };