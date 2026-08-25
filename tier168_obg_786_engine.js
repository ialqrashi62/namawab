// filepath: tier168_obg_786_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function prenatal_visit(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.gestational_age_weeks, 'gw');
  ensureNum(req.weight_kg, 'wk'); ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.uterine_height_cm, 'uh'); ensureNum(req.fhr_bpm, 'fh');
  ensureNum(req.fundal_placenta, 'fp'); ensureEnum(req.complaint, 'co', ['none','nausea','back_pain','edema','movement','multiple','NA']);
  ensureNum(req.next_visit_days, 'nv'); ensureStr(req.provider, 'pr');
  return { pv_id: `pv_${Date.now()}`, patient_id: req.patient_id, ga: req.gestational_age_weeks, fhr: req.fhr_bpm };
}

function lab_test(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.gestational_age_weeks, 'gw'); ensureEnum(req.test, 'te', ['CBC','BloodType','HIV','HepB','Rubella','GBS','Glucose','NA']);
  ensureEnum(req.result, 're', ['normal','abnormal','inconclusive','pending','NA']);
  ensureBool(req.action_taken, 'at'); ensureEnum(req.disposition, 'di', ['continue','follow_up','treat','refer','NA']);
  ensureNum(req.days_since_test, 'dt'); ensureStr(req.provider, 'pr');
  return { lt_id: `lt_${Date.now()}`, patient_id: req.patient_id, test: req.test, result: req.result };
}

function ultrasound(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.gestational_age_weeks, 'gw'); ensureEnum(req.type, 'ty', ['dating','anatomy','growth','Doppler','NST','BPP','NA']);
  ensureNum(req.efw_grams, 'ef'); ensureNum(req.crl_mm, 'cr');
  ensureNum(req.amniotic_fluid, 'af'); ensureNum(req.placental_location, 'pl');
  ensureEnum(req.findings, 'fi', ['normal','abnormal','concerning','NA']);
  ensureEnum(req.disposition, 'di', ['continue','follow_up','refer','urgent','NA']);
  ensureStr(req.provider, 'pr');
  return { us_id: `us_${Date.now()}`, patient_id: req.patient_id, type: req.type, efw: req.efw_grams };
}

function delivery(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.gestational_age_weeks, 'gw'); ensureEnum(req.type, 'ty', ['vaginal','vacuum','forceps','C_section','VBAC','NA']);
  ensureNum(req.duration_hours, 'du'); ensureNum(req.ebl_ml, 'eb');
  ensureEnum(req.complication, 'co', ['none','hemorrhage','tear','cord_prolapse','preeclampsia','other','NA']);
  ensureNum(req.apgar_1, 'a1'); ensureNum(req.apgar_5, 'a5');
  ensureEnum(req.outcome, 'ot', ['alive','NICU','fetal_demise','NA']);
  ensureStr(req.provider, 'pr');
  return { dl_id: `dl_${Date.now()}`, patient_id: req.patient_id, type: req.type, out: req.outcome };
}

function postpartum(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.days_postpartum, 'dp'); ensureNum(req.bp_systolic, 'bs');
  ensureEnum(req.recovery_status, 'rs', ['normal','delayed','complicated','NA']);
  ensureEnum(req.complication, 'co', ['none','hemorrhage','infection','depression','mastitis','other','NA']);
  ensureNum(req.edinburgh_score, 'es'); ensureBool(req.breastfeeding_ok, 'bo');
  ensureEnum(req.disposition, 'di', ['normal','follow_up','referral','NA']);
  ensureStr(req.provider, 'pr');
  return { pp_id: `pp_${Date.now()}`, patient_id: req.patient_id, days: req.days_postpartum, edin: req.edinburgh_score };
}

function funcs() { return { prenatal_visit, lab_test, ultrasound, delivery, postpartum }; }
module.exports = { funcs, ValidationError };