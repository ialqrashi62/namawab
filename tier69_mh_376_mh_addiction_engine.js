// filepath: tier69_mh_376_mh_addiction_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function subuse_intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.primary_substance, 'ps', ['heroin','fentanyl','oxycodone','methadone_suboxone','benzodiazepine','alcohol','cocaine','methamphetamine','cannabis','thc','thc_concentrate','kratom','ketamine','hallucinogen','inhalant','pcp','prescription_stimulant','tobacco','nicotine','vaping','other']);
  ensureEnum(req.route, 'route', ['oral','iv','subcutaneous','snorted','smoked','inhaled','sublingual','patch','rectal','intramuscular','transdermal','sublingual','other']);
  ensureNum(req.duration_years, 'dy');
  ensureStr(req.co_use_subs, 'cus');
  ensureNum(req.last_use_days, 'lu');
  ensureNum(req.previous_treatment, 'pt');
  ensureEnum(req.treatment_goals, 'tg', ['abstinence','reduce_use','controlled_use','maintenance','harm_reduction','medication_assisted','outpatient','inpatient','methadone','suboxone','naltrexone','referral','other']);
  ensureNum(req.motivation_score, 'ms');
  ensureBool(req.consent_to_treat, 'ctt');
  return { sub: req.primary_substance };
}
function relapse_prevention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.relapse_warnings, 'rw');
  ensureStr(req.coping_plan, 'cp');
  ensureStr(req.step_work, 'sw');
  ensureNum(req.relapse_count_last_year, 'rcly');
  ensureStr(req.support_attendance, 'sa');
  ensureNum(req.sobriety_days, 'sd');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','imminent','recent_use','active_use','remission','early_remission','sustained_remission']);
  ensureBool(req.plan_documented, 'pd');
  return { sobriety: req.sobriety_days };
}
function methadone_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.methadone_dose_mg, 'mdm');
  ensureNum(req.clinic_visits_per_week, 'cvpw');
  ensureNum(req.take_homes, 'th');
  ensureStr(req.urine_drug_screen, 'uds');
  ensureNum(req.counseling_sessions, 'cs');
  ensureEnum(req.phase, 'ph', ['wait_list','intake','induction','stabilization','maintenance','taper','discharge','transfer','detox','induction_phase','maintenance_phase','stable','upgrade','other']);
  ensureNum(req.adherence_pct, 'ap');
  ensureNum(req.next_review, 'nr');
  ensureStr(req.provider, 'pr');
  return { dose: req.methadone_dose_mg };
}
function naloxone_kits(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.kit_id, 'kid');
  ensureEnum(req.recipient, 'rec', ['patient','family_member','friend','peer','community','overdose_responder','first_responder','pharmacy','other']);
  ensureBool(req.training_provided, 'tp');
  ensureBool(req.refill_requested, 'rr');
  ensureStr(req.home_circumstances, 'hc');
  ensureBool(req.risk_factors_present, 'rfp');
  ensureStr(req.kit_expiration, 'ke');
  ensureBool(req.follow_up_required, 'fur');
  ensureBool(req.documentation_complete, 'dc');
  return { kit: req.kit_id };
}
function sbar_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.screening, 'sc', ['audit_c','audit','dast','dast_10','ftnd','pss','audit_full','other']);
  ensureNum(req.score, 'score');
  ensureEnum(req.severity, 'sev', ['low','moderate','harmful','dependent','safe','hazardous','risky','severe','other']);
  ensureBool(req.brief_intervention_provided, 'bip');
  ensureBool(req.referral_to_treatment, 'rtt');
  ensureEnum(req.patient_engagement, 'pe', ['high','moderate','low','declined','non_engaged','active','passive','minimal','engaged']);
  ensureNum(req.follow_up_call, 'fuc');
  ensureStr(req.provider, 'pr');
  ensureBool(req.documentation_complete, 'dc');
  return { score: req.score };
}

function funcs() { return { subuse_intake, relapse_prevention, methadone_clinic, naloxone_kits, sbar_counseling }; }
module.exports = { funcs, ValidationError };