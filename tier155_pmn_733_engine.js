// filepath: tier155_pmn_733_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pain_assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.nrs_score, 'ns');
  ensureNum(req.vas_score, 'vs');
  ensureEnum(req.body_part, 'bp', ['head','neck','back','chest','abdomen','hip','knee','shoulder','arm','hand','leg','foot','face','widespread','other','NA']);
  ensureEnum(req.type, 'tp', ['nociceptive_somatic','nociceptive_visceral','neuropathic','mixed','functional','idiopathic','cancer','post_surgical','phantom','other','NA']);
  ensureNum(req.duration_months, 'du');
  ensureNum(req.bpi_severity, 'bs');
  ensureNum(req.bpi_interference, 'bi');
  ensureNum(req.dn4_score, 'dn');
  ensureNum(req.pdq_score, 'pq');
  ensureBool(req.depression_screening, 'ds');
  ensureBool(req.anxiety_screening, 'as');
  ensureBool(req.substance_use, 'su');
  ensureStr(req.provider, 'pr');
  return { pa_id: `pai_${Date.now()}`, patient_id: req.patient_id, nrs: req.nrs_score };
}
function injection(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['epidural','facet','sacroiliac','trigger_point','intraarticular','bursa','piriformis','occipital','spinal_cord_stim','intrathecal_pump','radiofrequency','RFA_cervical','RFA_lumbar','RFA_knee','PRP','botox','viscosupplement','other','NA']);
  ensureEnum(req.guidance, 'gd', ['fluoroscopic','ultrasound','CT','blind_landmark','NA']);
  ensureStr(req.level, 'lv');
  ensureEnum(req.medication, 'md', ['local_anesthetic','steroid','saline','botox','PRP','HA','combination','NA']);
  ensureNum(req.dose_mg, 'ds');
  ensureNum(req.needle_gauge, 'ng');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.pre_pain, 'pp');
  ensureNum(req.post_pain, 'po');
  ensureNum(req.duration_relief_days, 'dr');
  ensureEnum(req.complications, 'cp', ['none','bleeding','infection','nerve_injury','dural_puncture','other']);
  ensureStr(req.provider, 'pr');
  return { ij_id: `inj_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function scs(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.manufacturer, 'mf', ['Medtronic','Boston_Scientific','Abbott_St_Jude','Nevro','Stimwave','Nuvectra','other','NA']);
  ensureEnum(req.lead_type, 'lt', ['percutaneous','paddle','cylinder','combination','NA']);
  ensureNum(req.leads_count, 'lc');
  ensureEnum(req.target, 'tg', ['cervical','thoracic','lumbar','sacral','DRG','NA']);
  ensureNum(req.frequency_hz, 'fr');
  ensureNum(req.pulse_width_us, 'pw');
  ensureNum(req.amplitude_ma, 'am');
  ensureBool(req.trial_performed, 'tp');
  ensureNum(req.trial_days, 'td');
  ensureNum(req.pain_reduction_pct, 'pr');
  ensureNum(req.oswestry_improvement, 'oi');
  ensureBool(req.battery_replacement, 'br');
  ensureNum(req.battery_longevity_years, 'bl');
  ensureStr(req.provider, 'pr');
  return { sc_id: `scs_${Date.now()}`, patient_id: req.patient_id };
}
function opioid(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.drug, 'dg');
  ensureNum(req.daily_mme, 'mm');
  ensureNum(req.duration_days, 'du');
  ensureBool(req.long_acting, 'la');
  ensureBool(req.short_acting, 'sa');
  ensureBool(req.buprenorphine, 'bp');
  ensureBool(req.methadone, 'mt');
  ensureEnum(req.uop_status, 'uo', ['current','previous','never','NA']);
  ensureBool(req.pmp_check, 'pc');
  ensureBool(req.urinary_screen, 'us');
  ensureBool(req.naloxone_prescribed, 'np');
  ensureNum(req.cessation_plan, 'cp');
  ensureStr(req.provider, 'pr');
  return { op_id: `opd_${Date.now()}`, patient_id: req.patient_id, drug: req.drug };
}
function outcomes(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.months_followup, 'mf');
  ensureNum(req.nrs_now, 'nn');
  ensureNum(req.nrs_baseline, 'nb');
  ensureNum(req.mme_reduction_pct, 'mr');
  ensureNum(req.function_improvement_pct, 'fi');
  ensureNum(req.satisfaction, 'sa');
  ensureEnum(req.work_status, 'ws', ['employed','disabled','retired','student','unemployed','NA']);
  ensureBool(req.re_intervention, 'ri');
  ensureEnum(req.complications, 'cp', ['none','chronic_opioid_use','dependence','addiction','overdose','device_related','death','other','NA']);
  ensureNum(req.quality_of_life, 'ql');
  ensureBool(req.cost_savings, 'cs');
  ensureStr(req.provider, 'pr');
  return { ot_id: `otc_${Date.now()}`, patient_id: req.patient_id };
}

function funcs() { return { pain_assess, injection, scs, opioid, outcomes }; }
module.exports = { funcs, ValidationError };